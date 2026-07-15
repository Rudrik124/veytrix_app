import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, Folder } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radius, spacing, typography } from '../../theme/tokens';
import { useExportStore } from '../../store/exportStore';
import type { DownloadsStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';

type Props = NativeStackScreenProps<DownloadsStackParamList, 'ExportSettings'>;

export function ExportSettingsScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const settings = useExportStore(s => s.settings);
  const updateSettings = useExportStore(s => s.updateSettings);

  const ResolutionOption = ({ res }: { res: '720p' | '1080p' | '4K' }) => {
    const isSelected = settings.defaultResolution === res;
    return (
      <Pressable
        onPress={() => updateSettings({ defaultResolution: res })}
        style={[styles.optionBtn, { 
          backgroundColor: isSelected ? 'rgba(56, 221, 248, 0.1)' : theme.surface,
          borderColor: isSelected ? '#38DDF8' : theme.border,
        }]}
      >
        <Text style={[typography.bodyMedium, { color: isSelected ? '#38DDF8' : theme.textPrimary }]}>{res}</Text>
      </Pressable>
    );
  };

  const FrameRateOption = ({ fps }: { fps: '30 FPS' | '60 FPS' }) => {
    const isSelected = settings.defaultFrameRate === fps;
    return (
      <Pressable
        onPress={() => updateSettings({ defaultFrameRate: fps })}
        style={[styles.optionBtn, { 
          backgroundColor: isSelected ? 'rgba(56, 221, 248, 0.1)' : theme.surface,
          borderColor: isSelected ? '#38DDF8' : theme.border,
        }]}
      >
        <Text style={[typography.bodyMedium, { color: isSelected ? '#38DDF8' : theme.textPrimary }]}>{fps}</Text>
      </Pressable>
    );
  };

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <ChevronLeft color={theme.textPrimary} size={28} />
        </Pressable>
        <Text style={[typography.h2, { color: theme.textPrimary }]}>Export Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.section}>
          <Text style={[typography.h2, { color: theme.textPrimary, marginBottom: spacing.md }]}>Default Resolution</Text>
          <View style={styles.row}>
            <ResolutionOption res="720p" />
            <ResolutionOption res="1080p" />
            <ResolutionOption res="4K" />
          </View>
          <Text style={[typography.caption, { color: theme.textMuted, marginTop: spacing.sm }]}>
            Higher resolutions provide better quality but result in larger file sizes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[typography.h2, { color: theme.textPrimary, marginBottom: spacing.md }]}>Default Frame Rate</Text>
          <View style={styles.row}>
            <FrameRateOption fps="30 FPS" />
            <FrameRateOption fps="60 FPS" />
          </View>
          <Text style={[typography.caption, { color: theme.textMuted, marginTop: spacing.sm }]}>
            60 FPS provides smoother playback, ideal for action and slow-motion.
          </Text>
        </View>

        <View style={[styles.section, styles.toggleSection]}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h2, { color: theme.textPrimary }]}>Auto-Save to Gallery</Text>
            <Text style={[typography.caption, { color: theme.textMuted, marginTop: 4 }]}>
              Automatically save exported videos to your device's photo library.
            </Text>
          </View>
          <Switch
            value={settings.autoSaveToGallery}
            onValueChange={v => updateSettings({ autoSaveToGallery: v })}
            trackColor={{ false: theme.surfaceAlt, true: 'rgba(56, 221, 248, 0.5)' }}
            thumbColor={settings.autoSaveToGallery ? '#38DDF8' : theme.textMuted}
          />
        </View>

        <View style={styles.section}>
          <Text style={[typography.h2, { color: theme.textPrimary, marginBottom: spacing.md }]}>Export Location</Text>
          <Pressable style={[styles.folderCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Folder color={theme.textPrimary} size={24} />
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>{settings.exportFolder}</Text>
              <Text style={[typography.caption, { color: theme.textMuted }]}>Tap to change directory</Text>
            </View>
          </Pressable>
        </View>

      </ScrollView>
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
  content: {
    padding: spacing.xl,
    paddingBottom: 100,
    gap: spacing.xxl,
  },
  section: {},
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  optionBtn: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  folderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  }
});
