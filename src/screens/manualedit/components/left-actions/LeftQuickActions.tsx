import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Music, Type, Smile, Image as ImageIcon, Volume2 } from 'lucide-react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { spacing, radius } from '../../../../theme/tokens';

export function LeftQuickActions() {
  const { theme } = useTheme();

  const ActionBtn = ({ icon: Icon }: any) => (
    <Pressable style={[styles.btn, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: theme.border }]}>
      <Icon color={theme.textPrimary} size={18} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ActionBtn icon={Music} />
      <ActionBtn icon={Type} />
      <ActionBtn icon={Smile} />
      <ActionBtn icon={ImageIcon} />
      <ActionBtn icon={Volume2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.md,
    gap: spacing.sm,
    zIndex: 10,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  }
});
