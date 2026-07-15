import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Image,
  Dimensions,
  Animated as RNAnimated
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  MoreVertical,
  Clock,
  Star,
  Archive,
  Trash2,
  Copy,
  Edit3,
  Video,
  Play
} from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp, Layout } from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { spacing, typography, radius, palette } from '../../theme/tokens';
import { CommonActions } from '@react-navigation/native';
import type { CreateStackParamList } from '../../navigation/types';
import { useProjectStore } from '../../store/projectStore';
import { ProjectService } from '../../services/projectService';
import { Project, ProjectFilter } from '../../types/project';

type Props = any;

const FILTERS: { label: string; value: ProjectFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Drafts', value: 'drafts' },
  { label: 'Completed', value: 'completed' },
  { label: 'Favorites', value: 'favorites' },
  { label: 'Archived', value: 'archived' }
];

export function ProjectsScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  const {
    projects,
    searchQuery,
    activeFilter,
    setSearchQuery,
    setActiveFilter
  } = useProjectStore();

  const [bottomSheetProject, setBottomSheetProject] = useState<Project | null>(null);

  // Stats
  const stats = useMemo(() => {
    const active = projects.filter(p => !p.isArchived);
    return {
      total: active.length,
      drafts: active.filter(p => p.status === 'draft').length,
      completed: active.filter(p => p.status === 'completed').length,
    };
  }, [projects]);

  // Filtering & Search
  const filteredProjects = useMemo(() => {
    let result = projects;
    
    // Search
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerQ));
    }

    // Filter
    switch (activeFilter) {
      case 'drafts':
        result = result.filter(p => p.status === 'draft' && !p.isArchived);
        break;
      case 'completed':
        result = result.filter(p => p.status === 'completed' && !p.isArchived);
        break;
      case 'favorites':
        result = result.filter(p => p.isFavorite && !p.isArchived);
        break;
      case 'archived':
        result = result.filter(p => p.isArchived);
        break;
      case 'all':
      default:
        result = result.filter(p => !p.isArchived);
        break;
    }

    // Sort by recent
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [projects, searchQuery, activeFilter]);

  const handleCreate = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CreateTab',
        params: { screen: 'ManualEdit' },
      })
    );
  };

  const handleOpenProject = (project: Project) => {
    navigation.navigate('ProjectDetail', { projectId: project.id });
  };

  const closeSwipeable = (id: string) => {
    const ref = swipeableRefs.current.get(id);
    if (ref) ref.close();
  };

  const handleAction = async (action: string, project: Project) => {
    closeSwipeable(project.id);
    setBottomSheetProject(null);
    
    switch(action) {
      case 'delete':
        await ProjectService.deleteProject(project.id);
        break;
      case 'archive':
        await ProjectService.archiveProject(project.id, !project.isArchived);
        break;
      case 'favorite':
        await ProjectService.favoriteProject(project.id, !project.isFavorite);
        break;
      case 'duplicate':
        await ProjectService.duplicateProject(project.id);
        break;
      case 'continue':
        // For mock, just go to manual edit. In real app, we load draft state to aiManualEditStore
        navigation.dispatch(
          CommonActions.navigate({
            name: 'CreateTab',
            params: { screen: 'ManualEdit' },
          })
        );
        break;
      case 'rename':
        // Mock rename action (could show a modal in real app)
        await ProjectService.saveProject(project.id, { name: `${project.name} (Renamed)` });
        break;
    }
  };

  const renderRightActions = (progress: any, dragX: any, project: Project) => {
    return (
      <View style={styles.swipeActionsRight}>
        <Pressable onPress={() => handleAction('favorite', project)} style={[styles.swipeAction, { backgroundColor: '#8B5CF6' }]}>
          <Star size={24} color="#FFF" fill={project.isFavorite ? "#FFF" : "none"} />
        </Pressable>
        <Pressable onPress={() => handleAction('duplicate', project)} style={[styles.swipeAction, { backgroundColor: '#38DDF8' }]}>
          <Copy size={24} color="#FFF" />
        </Pressable>
      </View>
    );
  };

  const renderLeftActions = (progress: any, dragX: any, project: Project) => {
    return (
      <View style={styles.swipeActionsLeft}>
        <Pressable onPress={() => handleAction('archive', project)} style={[styles.swipeAction, { backgroundColor: '#F59E0B' }]}>
          <Archive size={24} color="#FFF" />
        </Pressable>
        <Pressable onPress={() => handleAction('delete', project)} style={[styles.swipeAction, { backgroundColor: '#EF4444' }]}>
          <Trash2 size={24} color="#FFF" />
        </Pressable>
      </View>
    );
  };

  const renderProjectCard = ({ item: project, index }: { item: Project; index: number }) => {
    return (
      <Animated.View layout={Layout.springify()} entering={FadeInUp.delay(index * 50)}>
        <Swipeable
          ref={(ref) => { if (ref) swipeableRefs.current.set(project.id, ref); }}
          renderRightActions={(p, d) => renderRightActions(p, d, project)}
          renderLeftActions={(p, d) => renderLeftActions(p, d, project)}
        >
          <Pressable 
            onPress={() => handleOpenProject(project)}
            onLongPress={() => setBottomSheetProject(project)}
            style={[styles.card, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}
          >
            <View style={styles.cardThumbContainer}>
              <View style={[styles.cardThumb, { backgroundColor: theme.surfaceAlt }]}>
                {project.thumbnail ? (
                  <Play size={24} color={theme.textMuted} /> // Mocking video thumbnail
                ) : (
                  <Video size={24} color={theme.textMuted} />
                )}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: project.status === 'completed' ? 'rgba(56, 221, 248, 0.2)' : 'rgba(139, 92, 246, 0.2)' }]}>
                <Text style={[typography.tiny, { color: project.status === 'completed' ? '#38DDF8' : '#8B5CF6', fontWeight: 'bold' }]}>
                  {project.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.cardInfo}>
              <View style={styles.cardHeaderRow}>
                <Text style={[typography.bodyMedium, { color: theme.textPrimary, flex: 1 }]} numberOfLines={1}>
                  {project.name}
                </Text>
                {project.isFavorite && <Star size={16} color="#8B5CF6" fill="#8B5CF6" />}
              </View>

              <View style={styles.cardMetaRow}>
                <Clock size={12} color={theme.textMuted} />
                <Text style={[typography.tiny, { color: theme.textMuted }]}>
                  Edited {new Date(project.updatedAt).toLocaleDateString()}
                </Text>
                <Text style={[typography.tiny, { color: theme.textMuted, marginHorizontal: 4 }]}>•</Text>
                <Text style={[typography.tiny, { color: theme.textMuted }]}>{project.duration}</Text>
              </View>

              <Text style={[typography.caption, { color: theme.textSecondary, marginTop: 4 }]} numberOfLines={1}>
                {project.aiPrompt || "No AI Prompt"}
              </Text>
            </View>

            <Pressable onPress={() => setBottomSheetProject(project)} style={styles.moreBtn}>
              <MoreVertical size={20} color={theme.textSecondary} />
            </Pressable>
          </Pressable>
        </Swipeable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[typography.h2, { color: theme.textPrimary }]}>My Projects</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.surfaceAlt }]}>
          <Text style={[typography.h2, { color: theme.textPrimary }]}>{stats.total}</Text>
          <Text style={[typography.tiny, { color: theme.textSecondary }]}>Total Projects</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
          <Text style={[typography.h2, { color: '#8B5CF6' }]}>{stats.drafts}</Text>
          <Text style={[typography.tiny, { color: theme.textSecondary }]}>Drafts</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: 'rgba(56, 221, 248, 0.1)' }]}>
          <Text style={[typography.h2, { color: '#38DDF8' }]}>{stats.completed}</Text>
          <Text style={[typography.tiny, { color: theme.textSecondary }]}>Completed</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
          <Search size={20} color={theme.textMuted} />
          <TextInput 
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search projects..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ paddingHorizontal: spacing.xl, gap: spacing.sm }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActiveFilter(item.value)}
              style={[
                styles.filterChip,
                { backgroundColor: activeFilter === item.value ? 'rgba(56, 221, 248, 0.15)' : theme.surfaceAlt,
                  borderColor: activeFilter === item.value ? '#38DDF8' : theme.border }
              ]}
            >
              <Text style={[
                typography.caption,
                { color: activeFilter === item.value ? '#38DDF8' : theme.textSecondary, fontWeight: activeFilter === item.value ? 'bold' : 'normal' }
              ]}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Project List */}
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={renderProjectCard}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Video size={48} color={theme.textMuted} />
            </View>
            <Text style={[typography.h2, { color: theme.textPrimary, marginTop: spacing.lg }]}>No projects yet.</Text>
            <Text style={[typography.body, { color: theme.textSecondary, textAlign: 'center', marginTop: spacing.sm }]}>
              {searchQuery ? "No projects match your search." : "Start by creating your first AI-powered edit."}
            </Text>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <Pressable onPress={handleCreate} style={[styles.fab, { bottom: insets.bottom + 80 }]}>
        <LinearGradient
          colors={['#8B5CF6', '#38DDF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Plus size={28} color="#FFF" />
        </LinearGradient>
      </Pressable>

      {/* Bottom Sheet Mock Overlay for Actions */}
      {bottomSheetProject && (
        <View style={styles.bottomSheetOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setBottomSheetProject(null)} />
          <Animated.View entering={FadeInUp} style={[styles.bottomSheet, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={[typography.h2, { color: theme.textPrimary, marginBottom: spacing.md, paddingHorizontal: spacing.lg }]}>
              {bottomSheetProject.name}
            </Text>
            
            <Pressable onPress={() => handleAction('continue', bottomSheetProject)} style={styles.sheetAction}>
              <Play size={20} color={theme.textPrimary} />
              <Text style={[typography.body, { color: theme.textPrimary, marginLeft: spacing.md }]}>Continue Editing</Text>
            </Pressable>
            <Pressable onPress={() => handleAction('rename', bottomSheetProject)} style={styles.sheetAction}>
              <Edit3 size={20} color={theme.textPrimary} />
              <Text style={[typography.body, { color: theme.textPrimary, marginLeft: spacing.md }]}>Rename</Text>
            </Pressable>
            <Pressable onPress={() => handleAction('duplicate', bottomSheetProject)} style={styles.sheetAction}>
              <Copy size={20} color={theme.textPrimary} />
              <Text style={[typography.body, { color: theme.textPrimary, marginLeft: spacing.md }]}>Duplicate</Text>
            </Pressable>
            <Pressable onPress={() => handleAction('favorite', bottomSheetProject)} style={styles.sheetAction}>
              <Star size={20} color={theme.textPrimary} />
              <Text style={[typography.body, { color: theme.textPrimary, marginLeft: spacing.md }]}>
                {bottomSheetProject.isFavorite ? 'Remove Favorite' : 'Favorite'}
              </Text>
            </Pressable>
            <Pressable onPress={() => handleAction('archive', bottomSheetProject)} style={styles.sheetAction}>
              <Archive size={20} color={theme.textPrimary} />
              <Text style={[typography.body, { color: theme.textPrimary, marginLeft: spacing.md }]}>
                {bottomSheetProject.isArchived ? 'Unarchive' : 'Archive'}
              </Text>
            </Pressable>
            <Pressable onPress={() => handleAction('delete', bottomSheetProject)} style={styles.sheetAction}>
              <Trash2 size={20} color={'#EF4444'} />
              <Text style={[typography.body, { color: '#EF4444', marginLeft: spacing.md }]}>Delete</Text>
            </Pressable>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  cardThumbContainer: {
    position: 'relative',
  },
  cardThumb: {
    width: 80,
    height: 60,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -6,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  moreBtn: {
    padding: spacing.sm,
  },
  swipeActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.sm,
  },
  swipeActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.sm,
  },
  swipeAction: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.lg,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  bottomSheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.xl,
    paddingBottom: 40, // Extra padding for safe area
  },
  sheetAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  }
});
