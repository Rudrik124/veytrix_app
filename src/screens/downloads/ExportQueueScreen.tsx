import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, Loader, CheckCircle2, AlertCircle, Clock } from 'lucide-react-native';
import Animated, { FadeInDown, useAnimatedStyle, withRepeat, withTiming, useSharedValue, Easing } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing, typography } from '../../theme/tokens';
import { useExportStore } from '../../store/exportStore';
import type { DownloadsStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { EmptyState } from '../../components/EmptyState';

type Props = NativeStackScreenProps<DownloadsStackParamList, 'ExportQueue'>;

export function ExportQueueScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const queue = useExportStore(s => s.queue);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} color={theme.success} />;
      case 'failed': return <AlertCircle size={16} color={theme.danger} />;
      case 'queued': return <Clock size={16} color={theme.textMuted} />;
      default: return <Loader size={16} color="#38DDF8" />; // preparing, rendering, compressing, saving
    }
  };

  const getStatusText = (status: string, progress?: number) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      case 'queued': return 'In Queue';
      case 'preparing': return 'Preparing...';
      case 'rendering': return `Rendering ${progress || 0}%`;
      case 'compressing': return `Compressing...`;
      case 'saving': return 'Saving...';
      default: return status;
    }
  };

  const PulseView = ({ children }: any) => {
    const pulse = useSharedValue(0.5);
    useEffect(() => {
      pulse.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true);
    }, []);
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: pulse.value,
    }));
    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
  };

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <ChevronLeft color={theme.textPrimary} size={28} />
        </Pressable>
        <Text style={[typography.h2, { color: theme.textPrimary }]}>Export Queue</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={queue}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.xl, paddingBottom: 100, gap: spacing.md }}
        ListEmptyComponent={
          <EmptyState
            icon={<CheckCircle2 size={32} color={theme.textMuted} />}
            title="All caught up"
            body="There are no videos currently rendering in the queue."
          />
        }
        renderItem={({ item, index }) => {
          const isActive = !['completed', 'failed', 'queued'].includes(item.status);
          return (
            <Animated.View entering={FadeInDown.delay(index * 100).duration(400)} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.thumb, { backgroundColor: theme.surfaceAlt }]} />
              
              <View style={styles.info}>
                <Text style={[typography.bodyMedium, { color: theme.textPrimary }]} numberOfLines={1}>{item.filename}</Text>
                
                <View style={styles.statusRow}>
                  {isActive ? (
                    <PulseView>{getStatusIcon(item.status)}</PulseView>
                  ) : (
                    getStatusIcon(item.status)
                  )}
                  <Text style={[typography.caption, { color: isActive ? '#38DDF8' : theme.textMuted, marginLeft: 6 }]}>
                    {getStatusText(item.status, item.progress)}
                  </Text>
                </View>

                {isActive && (
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${item.progress || 0}%` }]} />
                  </View>
                )}
              </View>
            </Animated.View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    alignItems: 'center',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  info: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38DDF8',
    borderRadius: 2,
  }
});
