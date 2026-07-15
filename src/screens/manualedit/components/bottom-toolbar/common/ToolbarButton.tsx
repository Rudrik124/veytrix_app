import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { typography, spacing } from '../../../../../theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH / 6;

interface ToolbarButtonProps {
  label: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  onPress: () => void;
}

export function ToolbarButton({ label, icon, isSelected, onPress }: ToolbarButtonProps) {
  const { theme } = useTheme();
  return (
    <Pressable style={styles.toolBtn} onPress={onPress}>
      <View style={[styles.iconWrapper, isSelected && { backgroundColor: 'rgba(56, 221, 248, 0.2)' }]}>
        {icon}
      </View>
      <Text style={[typography.caption, { color: isSelected ? '#38DDF8' : theme.textPrimary, marginTop: 2, fontSize: 9 }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ITEM_WIDTH,
  },
  iconWrapper: {
    padding: spacing.xs || 4,
    borderRadius: 10,
  }
});
