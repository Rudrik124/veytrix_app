import React from 'react';
import { Sparkles } from 'lucide-react-native';
import { ToolbarButton } from '../common/ToolbarButton';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useToolbar } from '../hooks/useToolbar';

export function AiEditButton() {
  const { theme } = useTheme();
  const { selectedToolId, toggleTool } = useToolbar();
  const isSelected = selectedToolId === 'ai-edit';

  return (
    <ToolbarButton 
      label="AI Edit" 
      icon={<Sparkles color={isSelected ? '#38DDF8' : theme.textPrimary} size={20} />}
      isSelected={isSelected}
      onPress={() => toggleTool('ai-edit')}
    />
  );
}