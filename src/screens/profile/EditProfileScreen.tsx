import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronDown, Calendar as CalendarIcon, X } from 'lucide-react-native';
import { Screen } from '../../components/Screen';
import { Header } from '../../components/Header';
import { useTheme } from '../../theme/ThemeProvider';
import { typography, spacing, radius } from '../../theme/tokens';
import { useAuthStore } from '../../store/authStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

const GENDERS = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];

export function EditProfileScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  
  const [name, setName] = useState(user?.displayName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [gender, setGender] = useState(user?.gender ?? '');
  
  // DOB State
  const [dob, setDob] = useState<Date | null>(user?.dob ? new Date(user.dob) : null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Gender Modal State
  const [showGenderModal, setShowGenderModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateProfile({
      displayName: name,
      email: email,
      phone: phone,
      bio: bio,
      location: location,
      gender: gender,
      dob: dob ? dob.toISOString().split('T')[0] : null,
    });
    setLoading(false);
    navigation.goBack();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  return (
    <Screen scroll={false}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { color: theme.textPrimary, marginBottom: spacing.lg, paddingHorizontal: spacing.md }]}>Edit Profile</Text>

        <View style={{ gap: spacing.md, paddingHorizontal: spacing.md, marginBottom: spacing.xl }}>
          
          {/* Name Field */}
          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>Display Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={theme.textMuted}
            />
          </View>

          {/* Email Field */}
          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor={theme.textMuted}
            />
          </View>

          {/* Phone Field */}
          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              placeholderTextColor={theme.textMuted}
            />
          </View>

          {/* Date of Birth Field */}
          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>Date of Birth</Text>
            <Pressable 
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: dob ? theme.textPrimary : theme.textMuted, fontSize: 16 }}>
                {dob ? dob.toLocaleDateString() : 'Select date'}
              </Text>
              <CalendarIcon size={18} color={theme.textMuted} />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={dob || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Gender Field */}
          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>Gender</Text>
            <Pressable 
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              onPress={() => setShowGenderModal(true)}
            >
              <Text style={{ color: gender ? theme.textPrimary : theme.textMuted, fontSize: 16 }}>
                {gender || 'Select gender'}
              </Text>
              <ChevronDown size={18} color={theme.textMuted} />
            </Pressable>
          </View>

          {/* Location Field */}
          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>Location</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
              value={location}
              onChangeText={setLocation}
              placeholder="City, Country"
              placeholderTextColor={theme.textMuted}
            />
          </View>

          {/* Bio Field */}
          <View style={{ gap: spacing.xs }}>
            <Text style={[typography.bodyMedium, { color: theme.textPrimary }]}>Bio / About Me</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary, minHeight: 100, textAlignVertical: 'top' }]}
              value={bio}
              onChangeText={setBio}
              multiline
              placeholder="Tell us about yourself..."
              placeholderTextColor={theme.textMuted}
            />
          </View>

        </View>

        <View style={{ paddingHorizontal: spacing.md }}>
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
        </View>
      </ScrollView>

      {/* Gender Selection Modal */}
      <Modal visible={showGenderModal} transparent animationType="fade" onRequestClose={() => setShowGenderModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[typography.h2, { color: theme.textPrimary }]}>Select Gender</Text>
              <Pressable onPress={() => setShowGenderModal(false)} style={{ padding: 4 }}>
                <X size={20} color={theme.textPrimary} />
              </Pressable>
            </View>
            {GENDERS.map((g, idx) => (
              <Pressable 
                key={g} 
                style={[
                  styles.modalItem, 
                  { borderBottomColor: theme.border, borderBottomWidth: idx === GENDERS.length - 1 ? 0 : 1 }
                ]}
                onPress={() => {
                  setGender(g);
                  setShowGenderModal(false);
                }}
              >
                <Text style={[typography.body, { color: gender === g ? theme.accent : theme.textPrimary }]}>{g}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  modalItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  }
});
