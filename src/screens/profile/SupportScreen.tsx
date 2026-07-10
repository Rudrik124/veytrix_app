import React from 'react';
import { Text } from 'react-native';
import { Screen } from '../../components/Screen';
import { useTheme } from '../../theme/ThemeProvider';
import { typography } from '../../theme/tokens';

export function SupportScreen() {
  const { theme } = useTheme();
  return (
    <Screen>
      <Text style={[typography.h3, { color: theme.textPrimary }]}>Help & Support</Text>
      <Text style={[typography.bodyMedium, { color: theme.textMuted, marginTop: 16 }]}>
        Help & Support placeholder. Contact us at support@veytrix.app.
      </Text>
    </Screen>
  );
}
