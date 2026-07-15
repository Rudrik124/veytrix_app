import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Wand2, Zap, LayoutTemplate, Play } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, typography, radius } from '../../theme/tokens';
import { Screen } from '../../components/Screen';
import type { CreateStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  withSpring
} from 'react-native-reanimated';

type Props = NativeStackScreenProps<CreateStackParamList, 'CreateHome'>;

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function CreateHomeScreen({ navigation }: Props) {
  const { theme } = useTheme();

  // Animations
  const glowOpacity = useSharedValue(0.4);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlow = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handleStart = () => {
    navigation.navigate('ManualEdit');
  };

  const features = [
    'AI Trim',
    'Smart Filters',
    'Auto Captions',
    'Color Grading',
    'Object Removal'
  ];

  const valueProps = [
    { icon: Wand2, title: 'AI understands your edits', desc: 'Intelligent contextual enhancements.' },
    { icon: LayoutTemplate, title: 'Professional export', desc: 'Studio quality rendering.' },
    { icon: Zap, title: 'Fast cloud processing', desc: 'Zero lag, lightning fast.' },
  ];

  return (
    <Screen style={{ paddingTop: spacing.xl }}>
      <View style={{ marginBottom: spacing.xl, paddingHorizontal: spacing.sm }}>
        <Text style={[typography.display, { color: theme.textPrimary, fontSize: 36, letterSpacing: -1 }]}>Create</Text>
        <Text style={[typography.body, { color: theme.textMuted, marginTop: 4 }]}>Transform your vision with AI.</Text>
      </View>

      {/* Hero Card Container */}
      <View style={styles.heroContainer}>
        {/* Animated Glow Background */}
        <AnimatedLinearGradient
          colors={theme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.glowBackground, animatedGlow]}
        />

        {/* Glassmorphism Card */}
        <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          
          <View style={styles.heroHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
              <Wand2 size={32} color={theme.accentAlt} />
            </View>
            <View style={styles.badgesRow}>
              <View style={[styles.badge, { backgroundColor: theme.accent + '20', borderColor: theme.accent + '40' }]}>
                <Zap size={12} color={theme.accent} />
                <Text style={[typography.caption, { color: theme.accent, fontWeight: '700' }]}>Lightning Fast</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                <Text style={[typography.caption, { color: theme.textMuted, fontWeight: '600' }]}>Powered by AI</Text>
              </View>
            </View>
          </View>

          <View style={styles.heroContent}>
            <Text style={[typography.h1, { color: theme.textPrimary, marginBottom: spacing.xs }]}>AI Manual Edit</Text>
            <Text style={[typography.body, { color: theme.textMuted, lineHeight: 22 }]}>
              Professional AI-powered video editing with intelligent enhancements. Elevate your footage in seconds.
            </Text>
          </View>

          <View style={styles.chipsContainer}>
            {features.map((f, i) => (
              <View key={i} style={[styles.chip, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
                <Text style={[typography.caption, { color: theme.textPrimary }]}>{f}</Text>
              </View>
            ))}
          </View>

          <Animated.View style={[animatedButton, { marginTop: spacing.lg }]}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleStart}
            >
              <LinearGradient
                colors={theme.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.startButton}
              >
                <Play size={20} color="#fff" fill="#fff" style={{ marginRight: spacing.sm }} />
                <Text style={[typography.h2, { color: '#ffffff' }]}>Start Editing</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </View>

      {/* Why AI Manual Edit Section */}
      <View style={{ marginTop: spacing.xxl, paddingHorizontal: spacing.sm }}>
        <Text style={[typography.h2, { color: theme.textPrimary, marginBottom: spacing.lg }]}>Why AI Manual Edit?</Text>
        
        <View style={{ gap: spacing.lg }}>
          {valueProps.map((prop, idx) => (
            <View key={idx} style={styles.valueRow}>
              <View style={[styles.valueIcon, { backgroundColor: theme.surfaceAlt }]}>
                <prop.icon size={20} color={theme.textPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.bodyMedium, { color: theme.textPrimary, fontWeight: '600' }]}>{prop.title}</Text>
                <Text style={[typography.caption, { color: theme.textMuted, marginTop: 2 }]}>{prop.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={{ height: 40 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    position: 'relative',
    marginHorizontal: spacing.sm,
    borderRadius: radius.xl,
  },
  glowBackground: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    borderRadius: 40,
    opacity: 0.5,
  },
  heroCard: {
    padding: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badgesRow: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 4,
  },
  heroContent: {
    marginBottom: spacing.lg,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  valueIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
