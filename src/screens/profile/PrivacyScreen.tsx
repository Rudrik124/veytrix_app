import React from 'react';
import { Text } from 'react-native';
import { Screen } from '../../components/Screen';
import { useTheme } from '../../theme/ThemeProvider';
import { typography } from '../../theme/tokens';

export function PrivacyScreen() {
  const { theme } = useTheme();
  return (
    <Screen>
      <Text style={[typography.h3, { color: theme.textPrimary }]}>Privacy & Security</Text>
      <Text style={[typography.bodyMedium, { color: theme.textMuted, marginTop: 16 }]}>
        Privacy and security settings placeholder.
      </Text>
    </Screen>
  );
}
