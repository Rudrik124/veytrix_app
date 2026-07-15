import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { radius, spacing, typography } from '../../../../theme/tokens';
import { Check, ChevronDown } from 'lucide-react-native';
import { useEditorState } from '../../hooks/useEditorState';

export function FeaturePanelWrapper({ title, children }: { title: string, children: React.ReactNode }) {
  const { theme } = useTheme();
  const setSelectedToolId = useEditorState(s => s.setSelectedToolId);

  return (
    <View 
      style={[styles.container, { backgroundColor: theme.surface }]}
    >
      <View style={styles.header}>
        <Pressable onPress={() => setSelectedToolId(null)} style={styles.backBtn}>
          <ChevronDown size={24} color={theme.textPrimary} />
          <Text style={[typography.bodyMedium, { color: theme.textPrimary, marginLeft: spacing.xs }]}>Close</Text>
        </Pressable>
        <Text style={[typography.bodyMedium, { color: theme.textPrimary, fontWeight: 'bold' }]}>{title}</Text>
        <Pressable onPress={() => setSelectedToolId(null)} style={styles.doneBtn}>
          <Check size={20} color="#38DDF8" />
        </Pressable>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 250,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doneBtn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  }
});
