import React from 'react';
import { Sliders } from 'lucide-react-native';
import { ToolbarButton } from '../common/ToolbarButton';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useToolbar } from '../hooks/useToolbar';

export function AdjustButton() {
  const { theme } = useTheme();
  const { selectedToolId, toggleTool } = useToolbar();
  const isSelected = selectedToolId === 'adjust';

  return (
    <ToolbarButton 
      label="Adjust" 
      icon={<Sliders color={isSelected ? '#38DDF8' : theme.textPrimary} size={20} />}
      isSelected={isSelected}
      onPress={() => toggleTool('adjust')}
    />
  );
}