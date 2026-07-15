import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Construction } from 'lucide-react-native';
import { FeaturePanelWrapper } from '../../components/common/FeaturePanelWrapper';
import { typography, spacing } from '../../../../theme/tokens';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useEditorState } from '../../hooks/useEditorState';

export function ComingSoonPanel() {
  const { theme } = useTheme();
  const selectedToolId = useEditorState(s => s.selectedToolId);

  const toolName = selectedToolId ? selectedToolId.charAt(0).toUpperCase() + selectedToolId.slice(1) : 'Feature';

  return (
    <FeaturePanelWrapper title={toolName}>
      <View style={styles.container}>
        <View style={[styles.badge, { backgroundColor: theme.accent + '20', borderColor: theme.accent }]}>
          <Construction color={theme.accent} size={20} />
          <Text style={[typography.bodyMedium, { color: theme.accent, marginLeft: spacing.sm }]}>Under Construction</Text>
        </View>
        <Text style={[typography.body, { color: theme.textMuted, textAlign: 'center', marginTop: spacing.md }]}>
          This {toolName} page is currently just a dummy placeholder. 
          We will integrate the full feature here soon!
        </Text>
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
  }
});
