import React, { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Bell, Film, ImageIcon, Sparkles, TrendingUp, Wallet, Wand2, Clock, AlertCircle, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing, typography } from '../../theme/tokens';
import { Screen } from '../../components/Screen';
import { CreditPill } from '../../components/CreditPill';
import { BigActionCard } from '../../components/BigActionCard';
import { ProjectCard } from '../../components/ProjectCard';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { useHomeStore } from '../../store/homeStore';
import type { HomeStackParamList, MainTabParamList, CreateStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeMain'>,
  BottomTabScreenProps<MainTabParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { 
    greeting, credits, walletSummary, recentProjects, 
    announcements, trendingTemplates, loading, refreshing, error,
    fetchDashboard, refreshDashboard 
  } = useHomeStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const goCreate = (screen: keyof CreateStackParamList) => {
    navigation.getParent()?.navigate('CreateTab', { screen } as never);
  };

  const goWallet = () => {
    navigation.getParent()?.navigate('ProfileTab', { screen: 'Wallet' } as never);
  };

  if (error) {
    return (
      <Screen>
        <View style={styles.centerAll}>
          <AlertCircle size={48} color={theme.danger} style={{ marginBottom: spacing.md }} />
          <Text style={[typography.h2, { color: theme.textPrimary, marginBottom: spacing.sm }]}>Oops!</Text>
          <Text style={[typography.body, { color: theme.textMuted, textAlign: 'center', marginBottom: spacing.xl }]}>{error}</Text>
          <Button label="Try Again" icon={<RefreshCw size={18} color={theme.bg} />} onPress={fetchDashboard} />
        </View>
      </Screen>
    );
  }

  if (loading && !walletSummary) {
    return (
      <Screen>
        <View style={styles.centerAll}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.md }]}>Loading dashboard...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshDashboard} tintColor={theme.primary} />}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[typography.caption, { color: theme.textMuted }]}>{greeting}</Text>
          <Text style={[typography.h1, { color: theme.textPrimary }]}>{user?.displayName ?? 'Creator'}</Text>
        </View>
        <View style={styles.headerActions}>
          <CreditPill credits={credits} onPress={goWallet} />
          <Pressable
            onPress={() => navigation.getParent()?.navigate('ProfileTab', { screen: 'Notifications' } as never)}
            style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <Bell size={16} color={theme.textPrimary} />
          </Pressable>
        </View>
      </View>

      {walletSummary && (
        <Pressable onPress={goWallet} style={[styles.walletCard, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
          <View style={styles.walletHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
              <Wallet size={16} color={theme.primary} />
              <Text style={[typography.bodyMedium, { color: theme.primary }]}>Wallet Balance</Text>
            </View>
            <Text style={[typography.h2, { color: theme.textPrimary }]}>{walletSummary.currentBalance} Cr</Text>
          </View>
          <View style={styles.walletFooter}>
            <Text style={[typography.caption, { color: theme.textMuted }]}>
              Used today: {walletSummary.creditsUsedToday} Cr
            </Text>
            <Text style={[typography.caption, { color: theme.textMuted }]}>
              {walletSummary.lastRecharge ? `Recharged: ${new Date(walletSummary.lastRecharge).toLocaleDateString()}` : 'No recent recharge'}
            </Text>
          </View>
        </Pressable>
      )}

      <View style={styles.actionsGrid}>
        <BigActionCard
          title="Generate Video"
          subtitle="Prompt to video"
          icon={<Sparkles size={20} color="#0b0c10" />}
          featured
          onPress={() => goCreate('AIVideoGeneration')}
        />
        <BigActionCard
          title="Image to Video"
          subtitle="Animate a photo"
          icon={<ImageIcon size={18} color={theme.accentAlt} />}
          onPress={() => goCreate('ImageToVideo')}
        />
        <BigActionCard
          title="Reference Video"
          subtitle="Restyle a clip"
          icon={<Film size={18} color={theme.accentAlt} />}
          onPress={() => goCreate('ReferenceVideo')}
        />
        <BigActionCard
          title="Manual Edit"
          subtitle="Trim, filter, export"
          icon={<Wand2 size={18} color={theme.accentAlt} />}
          onPress={() => goCreate('ManualEdit')}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[typography.h2, { color: theme.textPrimary }]}>Recent creations</Text>
        <Pressable onPress={() => navigation.getParent()?.navigate('ProjectsTab', { screen: 'ProjectsMain' } as never)}>
          <Text style={[typography.caption, { color: theme.accentAlt }]}>See all</Text>
        </Pressable>
      </View>
      {recentProjects.length === 0 ? (
        <EmptyState
          icon={<Sparkles size={32} color={theme.textMuted} />}
          title="Nothing yet"
          body="Your generated videos will show up here once you create your first one."
        />
      ) : (
        <View style={{ gap: spacing.sm }}>
          {recentProjects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: p.id })}
            />
          ))}
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={[typography.h2, { color: theme.textPrimary }]}>Trending templates</Text>
        <TrendingUp size={16} color={theme.accentAlt} />
      </View>
      {trendingTemplates.length > 0 && (
        <FlatList
          data={trendingTemplates}
          keyExtractor={(t) => t.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => goCreate(item.type === 'text_to_video' ? 'AIVideoGeneration' : item.type === 'image_to_video' ? 'ImageToVideo' : 'ReferenceVideo')}
              style={[styles.templateCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={[styles.templateThumb, { backgroundColor: theme.surfaceAlt }]} />
              <Text style={[typography.bodyMedium, { color: theme.textPrimary, marginTop: spacing.sm }]} numberOfLines={2}>
                {item.title}
              </Text>
            </Pressable>
          )}
        />
      )}

      {announcements.length > 0 && (
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          {announcements.map((a) => (
            <View key={a.id} style={[styles.announcement, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm }}>
                <Text style={[typography.bodyMedium, { color: theme.textPrimary, flex: 1 }]}>{a.title}</Text>
                <Text style={[typography.caption, { color: theme.textMuted, fontSize: 10 }]}>
                  {new Date(a.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[typography.caption, { color: theme.textMuted, marginTop: 4 }]}>
                {a.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerAll: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300, padding: spacing.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBtn: { width: 34, height: 34, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  walletCard: { padding: spacing.lg, borderRadius: radius.xl, borderWidth: 1, gap: spacing.md },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  walletFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between', alignItems: 'flex-start' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  templateCard: { width: 160, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md },
  templateThumb: { height: 80, borderRadius: radius.md },
  announcement: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg },
});
