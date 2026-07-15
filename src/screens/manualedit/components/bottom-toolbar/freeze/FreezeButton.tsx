import React from 'react';
import { Snowflake } from 'lucide-react-native';
import { ToolbarButton } from '../common/ToolbarButton';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useToolbar } from '../hooks/useToolbar';

export function FreezeButton() {
  const { theme } = useTheme();
  const { selectedToolId, toggleTool } = useToolbar();
  const isSelected = selectedToolId === 'freeze';

  return (
    <ToolbarButton 
      label="Freeze" 
      icon={<Snowflake color={isSelected ? '#38DDF8' : theme.textPrimary} size={20} />}
      isSelected={isSelected}
      onPress={() => toggleTool('freeze')}
    />
  );
}