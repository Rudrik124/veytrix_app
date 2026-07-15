import React from 'react';
import { Wand2 } from 'lucide-react-native';
import { ToolbarButton } from '../common/ToolbarButton';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useToolbar } from '../hooks/useToolbar';

export function FiltersButton() {
  const { theme } = useTheme();
  const { selectedToolId, toggleTool } = useToolbar();
  const isSelected = selectedToolId === 'filters';

  return (
    <ToolbarButton 
      label="Filters" 
      icon={<Wand2 color={isSelected ? '#38DDF8' : theme.textPrimary} size={20} />}
      isSelected={isSelected}
      onPress={() => toggleTool('filters')}
    />
  );
}