import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import { FeaturePanelWrapper } from '../../components/common/FeaturePanelWrapper';
import { useEditorState } from '../../hooks/useEditorState';
import { useShallow } from 'zustand/react/shallow';
import { typography, spacing } from '../../../../theme/tokens';
import { useTheme } from '../../../../theme/ThemeProvider';

export function TransformPanel() {
  const { theme } = useTheme();
  const { rotation, setRotation } = useEditorState(useShallow(s => ({
    rotation: s.rotation,
    setRotation: s.setRotation
  })));

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  return (
    <FeaturePanelWrapper title="Transform">
      <View style={styles.container}>
        <View style={styles.grid}>
          <Pressable style={[styles.btn, { backgroundColor: theme.surface }]} onPress={handleRotate}>
            <RotateCcw color={theme.textPrimary} size={24} />
            <Text style={[typography.caption, { color: theme.textPrimary, marginTop: spacing.xs }]}>Rotate 90°</Text>
          </Pressable>
        </View>
      </View>
    </FeaturePanelWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  btn: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flex: 1,
  }
});
