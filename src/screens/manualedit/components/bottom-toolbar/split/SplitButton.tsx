import React from 'react';
import { SplitSquareHorizontal } from 'lucide-react-native';
import { ToolbarButton } from '../common/ToolbarButton';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { Alert } from 'react-native';

export function SplitButton() {
  const { theme } = useTheme();

  const handlePress = () => {
    Alert.alert("Coming Soon", "Split feature coming soon");
  };

  return (
    <ToolbarButton 
      label="Split" 
      icon={<SplitSquareHorizontal color={theme.textPrimary} size={20} />}
      onPress={handlePress}
    />
  );
}