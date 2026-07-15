import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FeaturePanelWrapper } from '../../components/common/FeaturePanelWrapper';
import { useTheme } from '../../../../theme/ThemeProvider';
import { typography, spacing } from '../../../../theme/tokens';

export function TrimPanel() {
  const { theme } = useTheme();
  return (
    <FeaturePanelWrapper title="Trim Video">
      <View style={styles.container}>
        <Text style={[typography.caption, { color: theme.textMuted }]}>
          Mock UI for Trim. (Drag handles on timeline to trim the video).
        </Text>
      </View>
    </FeaturePanelWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
