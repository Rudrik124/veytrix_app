import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { Volume2, VolumeX } from 'lucide-react-native';
import { FeaturePanelWrapper } from '../../components/common/FeaturePanelWrapper';
import { useEditorState } from '../../hooks/useEditorState';
import { useShallow } from 'zustand/react/shallow';
import { typography, spacing } from '../../../../theme/tokens';
import { useTheme } from '../../../../theme/ThemeProvider';

export function VolumePanel() {
  const { theme } = useTheme();
  const { volume, setVolume, isMuted, toggleMute } = useEditorState(useShallow(s => ({
    volume: s.volume,
    setVolume: s.setVolume,
    isMuted: s.isMuted,
    toggleMute: s.toggleMute
  })));

  return (
    <FeaturePanelWrapper title="Volume">
      <View style={styles.container}>
        <View style={styles.muteRow}>
          <Pressable style={[styles.muteBtn, { backgroundColor: isMuted ? theme.accent + '30' : theme.surface }]} onPress={toggleMute}>
            {isMuted ? <VolumeX color={theme.accent} size={24} /> : <Volume2 color={theme.textPrimary} size={24} />}
            <Text style={[typography.caption, { color: isMuted ? theme.accent : theme.textPrimary, marginTop: spacing.xs }]}>
              {isMuted ? 'Muted' : 'Mute'}
            </Text>
          </Pressable>
        </View>

        <Text style={[typography.body, { color: theme.textPrimary, marginBottom: spacing.md }]}>
          {Math.round(volume * 100)}%
        </Text>
        <Slider
          style={{ width: '100%', height: 40, opacity: isMuted ? 0.5 : 1 }}
          minimumValue={0}
          maximumValue={2}
          step={0.05}
          value={volume}
          onValueChange={setVolume}
          disabled={isMuted}
          minimumTrackTintColor={theme.accent}
          maximumTrackTintColor={theme.border}
          thumbTintColor="#FFF"
        />
        <View style={styles.labels}>
          <Text style={[typography.caption, { color: theme.textMuted }]}>0%</Text>
          <Text style={[typography.caption, { color: theme.textMuted }]}>100%</Text>
          <Text style={[typography.caption, { color: theme.textMuted }]}>200%</Text>
        </View>
      </View>
    </FeaturePanelWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  muteRow: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  muteBtn: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.sm,
    marginTop: spacing.xs,
  }
});
