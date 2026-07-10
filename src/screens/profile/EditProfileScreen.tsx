import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Screen } from '../../components/Screen';
import { useTheme } from '../../theme/ThemeProvider';
import { typography, spacing, radius } from '../../theme/tokens';
import { useAuthStore } from '../../store/authStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  
  const [name, setName] = useState(user?.displayName ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateProfile({ displayName: name });
    setLoading(false);
    navigation.goBack();
  };

  return (
    <Screen>
      <Text style={[typography.h3, { color: theme.textPrimary, marginBottom: spacing.lg }]}>Edit Profile</Text>

      <View style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
        <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>Display Name</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.textPrimary,
            },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={theme.textMuted}
        />
      </View>

      <Pressable
        onPress={handleSave}
        disabled={loading}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.accent, opacity: pressed || loading ? 0.7 : 1 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={theme.bg} />
        ) : (
          <Text style={[typography.bodyMedium, { color: theme.bg, fontWeight: '600' }]}>Save Changes</Text>
        )}
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
  },
  button: {
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
