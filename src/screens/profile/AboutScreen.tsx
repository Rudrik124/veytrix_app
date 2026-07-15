import React from 'react';
import { Text } from 'react-native';
import { Screen } from '../../components/Screen';
import { Header } from '../../components/Header';
import { useTheme } from '../../theme/ThemeProvider';
import { typography } from '../../theme/tokens';

export function AboutScreen() {
  const { theme } = useTheme();
  return (
    <Screen>
      <Header />
      <Text style={[typography.h2, { color: theme.textPrimary }]}>About VEYTRIX</Text>
      <Text style={[typography.bodyMedium, { color: theme.textMuted, marginTop: 16 }]}>
        Version 1.0.0{'\n\n'}
        Terms of Service{'\n'}
        Privacy Policy
      </Text>
    </Screen>
  );
}
