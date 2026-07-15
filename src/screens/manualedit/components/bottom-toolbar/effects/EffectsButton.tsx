import React from 'react';
import { Zap } from 'lucide-react-native';
import { ToolbarButton } from '../common/ToolbarButton';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useToolbar } from '../hooks/useToolbar';

export function EffectsButton() {
  const { theme } = useTheme();
  const { selectedToolId, toggleTool } = useToolbar();
  const isSelected = selectedToolId === 'effects';

  return (
    <ToolbarButton 
      label="Effects" 
      icon={<Zap color={isSelected ? '#38DDF8' : theme.textPrimary} size={20} />}
      isSelected={isSelected}
      onPress={() => toggleTool('effects')}
    />
  );
}