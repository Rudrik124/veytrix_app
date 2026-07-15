import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { spacing } from '../theme/tokens';

interface HeaderProps {
  onBack?: () => void;
}

export function Header({ onBack }: HeaderProps = {}) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {(onBack || navigation.canGoBack()) && (
        <Pressable onPress={handleBack} style={[styles.backButton, { backgroundColor: theme.surfaceAlt }]}>
          <ChevronLeft size={24} color={theme.textPrimary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
