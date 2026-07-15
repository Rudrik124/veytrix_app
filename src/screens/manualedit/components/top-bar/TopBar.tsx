import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronLeft, HelpCircle, ChevronDown, MoreHorizontal, Save, Upload } from 'lucide-react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { typography, spacing } from '../../../../theme/tokens';
import { useNavigation } from '@react-navigation/native';

const RatioIcon = ({ color }: { color: string }) => (
  <View style={{
    width: 16, height: 16,
    borderWidth: 1.5, borderColor: color, borderRadius: 3,
    justifyContent: 'center', alignItems: 'center'
  }}>
    <View style={{
      width: 8, height: 8,
      borderWidth: 1.5, borderColor: color, borderRadius: 1
    }} />
  </View>
);

export function TopBar() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.leftActions}>
        <Pressable onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft color={theme.textPrimary} size={24} />
        </Pressable>
        <Pressable style={styles.iconBtn}>
          <HelpCircle color={theme.textPrimary} size={20} />
        </Pressable>
      </View>
      
      <Pressable style={styles.titleBtn}>
        <RatioIcon color={theme.textPrimary} />
        <Text style={[typography.bodyMedium, { color: theme.textPrimary, marginHorizontal: 6 }]}>Original</Text>
        <ChevronDown color={theme.textPrimary} size={14} />
      </Pressable>
      
      <View style={styles.rightActions}>
        <Pressable style={styles.iconBtn}>
          <MoreHorizontal color={theme.textPrimary} size={20} />
        </Pressable>
        <Pressable style={[styles.actionBtn, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
          <Save color={theme.textPrimary} size={18} />
        </Pressable>
        <Pressable style={[styles.actionBtn, { backgroundColor: '#1870F4' }]}>
          <Upload color="#FFF" size={18} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    padding: spacing.sm,
  },
  titleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
