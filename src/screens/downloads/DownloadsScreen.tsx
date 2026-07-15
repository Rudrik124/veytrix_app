import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Dimensions, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search, Settings, Filter, FileVideo, HardDrive, DownloadCloud, Play } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing, typography } from '../../theme/tokens';
import { Screen } from '../../components/Screen';
import { EmptyState } from '../../components/EmptyState';
import { useExportStore } from '../../store/exportStore';
import type { DownloadsStackParamList } from '../../navigation/types';
import type { ExportFilter } from '../../types/export';

type Props = NativeStackScreenProps<DownloadsStackParamList, 'DownloadsMain'>;

const { width } = Dimensions.get('window');
const FILTERS: ExportFilter[] = ['All', 'Today', 'This Week', 'This Month', 'Favorites', '4K', '1080p', '720p'];

export function DownloadsScreen({ navigation }: Props) {
  const { theme } = useTheme();
  
  const exports = useExportStore(s => s.exports);
  const queue = useExportStore(s => s.queue);
  const loading = useExportStore(s => s.loading);
  const hydrate = useExportStore(s => s.hydrate);
  const storageInfo = useExportStore(s => s.storageInfo);
  const searchQuery = useExportStore(s => s.searchQuery);
  const activeFilter = useExportStore(s => s.activeFilter);
  const setSearchQuery = useExportStore(s => s.setSearchQuery);
  const setActiveFilter = useExportStore(s => s.setActiveFilter);
  
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    hydrate();
  }, []);

  const filteredExports = React.useMemo(() => {
    let result = exports.filter(e => !e.isDeleted);
    
    if (searchQuery) {
      result = result.filter(e => e.filename.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    const now = new Date();
    switch (activeFilter) {
      case 'Today':
        result = result.filter(e => new Date(e.createdAt).toDateString() === now.toDateString());
        break;
      case 'This Week':
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        result = result.filter(e => new Date(e.createdAt) >= oneWeekAgo);
        break;
      case 'This Month':
        result = result.filter(e => new Date(e.createdAt).getMonth() === now.getMonth() && new Date(e.createdAt).getFullYear() === now.getFullYear());
        break;
      case 'Favorites':
        result = result.filter(e => e.isFavorite);
        break;
      case '4K':
        result = result.filter(e => e.resolution === '4K');
        break;
      case '1080p':
        result = result.filter(e => e.resolution === '1080p');
        break;
      case '720p':
        result = result.filter(e => e.resolution === '720p');
        break;
    }

    return result;
  }, [exports, searchQuery, activeFilter]);

  const activeQueueCount = queue.filter(q => !['completed', 'failed'].includes(q.status)).length;

  return (
    <Screen scroll={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[typography.h1, { color: theme.textPrimary }]}>Exports</Text>
          <Text style={[typography.caption, { color: theme.textMuted }]}>Manage your exported videos.</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={() => setShowSearch(!showSearch)} style={styles.iconBtn}>
            <Search size={20} color={theme.textPrimary} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('ExportSettings')} style={styles.iconBtn}>
            <Settings size={20} color={theme.textPrimary} />
          </Pressable>
        </View>
      </View>

      {showSearch && (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Search size={16} color={theme.textMuted} style={{ marginRight: spacing.sm }} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search exports..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        </Animated.View>
      )}

      {/* Storage Summary */}
      {storageInfo && (
        <View style={[styles.storageCard, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
          <View style={styles.storageIconWrapper}>
            <HardDrive size={24} color="#38DDF8" />
          </View>
          <View style={styles.storageInfo}>
            <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>Local Storage</Text>
            <View style={styles.storageProgressBg}>
              <View 
                style={[styles.storageProgressFill, { width: `${Math.min(100, (storageInfo.storageUsedBytes / storageInfo.totalStorageBytes) * 100)}%` }]} 
              />
            </View>
            <Text style={[typography.caption, { color: theme.textMuted }]}>
              {`${(storageInfo.storageUsedBytes / (1024*1024*1024)).toFixed(2)} GB used of ${(storageInfo.totalStorageBytes / (1024*1024*1024)).toFixed(2)} GB`}
            </Text>
          </View>
        </View>
      )}

      {/* Filters */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {FILTERS.map(filter => (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterChip,
                { backgroundColor: theme.surface, borderColor: theme.border },
                activeFilter === filter && { backgroundColor: 'rgba(56, 221, 248, 0.1)', borderColor: '#38DDF8' }
              ]}
            >
              <Text style={[typography.caption, { color: activeFilter === filter ? '#38DDF8' : theme.textSecondary }]}>
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Queue Indicator (if active items) */}
      {activeQueueCount > 0 && (
        <Pressable onPress={() => navigation.navigate('ExportQueue')} style={styles.queueIndicator}>
          <LinearGradient
            colors={['rgba(56, 221, 248, 0.15)', 'rgba(139, 92, 246, 0.15)']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          />
          <BlurView intensity={20} tint="dark" style={[styles.queueIndicatorInner, { borderColor: 'rgba(255,255,255,0.1)' }]}>
            <DownloadCloud size={20} color="#38DDF8" />
            <Text style={[typography.bodyMedium, { color: '#FFF', flex: 1 }]}>
              {activeQueueCount} {activeQueueCount === 1 ? 'export' : 'exports'} in queue
            </Text>
            <Text style={[typography.caption, { color: '#38DDF8' }]}>View</Text>
          </BlurView>
        </Pressable>
      )}

      {/* Export List */}
      <FlatList
        data={filteredExports}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: 120, gap: spacing.lg }}
        ListEmptyComponent={
          <EmptyState
            icon={<FileVideo size={48} color={theme.textMuted} />}
            title={exports.length === 0 ? "No exported videos" : "No matches found"}
            body={exports.length === 0 ? "When you export a project, it will appear here in your premium library." : "Try adjusting your search or filters."}
          />
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={SlideInDown.delay(index * 50).duration(400)}>
            <Pressable 
              onPress={() => navigation.navigate('ExportPreview', { exportId: item.id })}
              style={[styles.exportCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={[styles.exportThumb, { backgroundColor: theme.surfaceAlt }]}>
                <Play size={20} color="rgba(255,255,255,0.5)" />
              </View>
              <View style={styles.exportInfo}>
                <Text style={[typography.bodyMedium, { color: theme.textPrimary }]} numberOfLines={1}>{item.filename}</Text>
                
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                    <Text style={[typography.caption, { color: '#FFF', fontSize: 10 }]}>{item.resolution}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                    <Text style={[typography.caption, { color: '#FFF', fontSize: 10 }]}>{item.duration}s</Text>
                  </View>
                </View>
                
                <Text style={[typography.caption, { color: theme.textMuted, marginTop: 4 }]}>
                  {new Date(item.createdAt).toLocaleDateString()} • {(item.fileSize / (1024*1024)).toFixed(1)} MB
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  storageCard: {
    marginHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  storageIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(56, 221, 248, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storageInfo: {
    flex: 1,
  },
  storageProgressBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginVertical: 8,
    overflow: 'hidden',
  },
  storageProgressFill: {
    height: '100%',
    backgroundColor: '#38DDF8',
    borderRadius: 2,
  },
  filtersWrapper: {
    marginBottom: spacing.md,
  },
  filtersScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  queueIndicator: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  queueIndicatorInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.md,
  },
  exportCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    alignItems: 'center',
  },
  exportThumb: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
});
