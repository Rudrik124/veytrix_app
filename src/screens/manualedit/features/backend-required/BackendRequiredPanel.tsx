import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ServerCog, AlertTriangle } from 'lucide-react-native';
import { FeaturePanelWrapper } from '../../components/common/FeaturePanelWrapper';
import { typography, spacing } from '../../../../theme/tokens';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useEditorState } from '../../hooks/useEditorState';

export function BackendRequiredPanel() {
  const { theme } = useTheme();
  const selectedToolId = useEditorState(s => s.selectedToolId);

  const toolName = selectedToolId ? selectedToolId.charAt(0).toUpperCase() + selectedToolId.slice(1) : 'Feature';

  return (
    <FeaturePanelWrapper title={toolName}>
      <View style={styles.container}>
        <View style={[styles.badge, { backgroundColor: theme.accent + '20', borderColor: theme.accent }]}>
          <ServerCog color={theme.accent} size={20} />
          <Text style={[typography.bodyMedium, { color: theme.accent, marginLeft: spacing.sm }]}>Backend Required</Text>
        </View>
        <Text style={[typography.body, { color: theme.textMuted, textAlign: 'center', marginTop: spacing.md }]}>
          This feature requires complex video processing (FFmpeg) or AI generation that cannot be previewed natively in the frontend editor. 
        </Text>
        <View style={styles.warningBox}>
          <AlertTriangle color={theme.danger} size={16} />
          <Text style={[typography.caption, { color: theme.danger, marginLeft: spacing.xs }]}>
            Will be applied during final export.
          </Text>
        </View>
      </View>
    </FeaturePanelWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    padding: spacing.sm,
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderRadius: 8,
  }
});
