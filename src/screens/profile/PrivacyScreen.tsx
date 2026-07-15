import React from 'react';
import { Text } from 'react-native';
import { Screen } from '../../components/Screen';
import { Header } from '../../components/Header';
import { useTheme } from '../../theme/ThemeProvider';
import { typography } from '../../theme/tokens';

export function PrivacyScreen() {
  const { theme } = useTheme();
  return (
    <Screen>
      <Header />
      <Text style={[typography.h2, { color: theme.textPrimary }]}>Privacy & Security</Text>
      <Text style={[typography.bodyMedium, { color: theme.textMuted, marginTop: 16 }]}>
        Privacy and security settings placeholder.
      </Text>
    </Screen>
  );
}
