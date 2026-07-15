import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { FeaturePanelWrapper } from '../../components/common/FeaturePanelWrapper';
import { useEditorState } from '../../hooks/useEditorState';
import { useShallow } from 'zustand/react/shallow';
import { typography, spacing, radius } from '../../../../theme/tokens';
import { useTheme } from '../../../../theme/ThemeProvider';

export function SpeedPanel() {
  const { theme } = useTheme();
  const { playbackRate, setPlaybackRate } = useEditorState(useShallow(s => ({
    playbackRate: s.playbackRate,
    setPlaybackRate: s.setPlaybackRate
  })));

  return (
    <FeaturePanelWrapper title="Speed">
      <View style={styles.container}>
        <Text style={[typography.body, { color: theme.textPrimary, marginBottom: spacing.md }]}>
          {playbackRate.toFixed(1)}x
        </Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0.1}
          maximumValue={4.0}
          step={0.1}
          value={playbackRate}
          onValueChange={setPlaybackRate}
          minimumTrackTintColor={theme.accent}
          maximumTrackTintColor={theme.border}
          thumbTintColor="#FFF"
        />
        <View style={styles.labels}>
          <Text style={[typography.caption, { color: theme.textMuted }]}>0.1x</Text>
          <Text style={[typography.caption, { color: theme.textMuted }]}>Normal</Text>
          <Text style={[typography.caption, { color: theme.textMuted }]}>4.0x</Text>
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
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.sm,
    marginTop: spacing.xs,
  }
});
