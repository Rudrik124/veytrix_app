import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '../../store/authStore';
import { ONBOARDING_SLIDES } from '../../constants';
import { Layers, Play, Settings2, Video, MonitorPlay, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  bg: '#09090B',
  primary: '#4F7CFF',
  secondary: '#38DDF8',
  highlight: '#8B5CF6',
  text: '#FFFFFF',
  textMuted: '#A1A1AA',
};

// Abstract hero illustrations
const WorkspaceIllustration = ({ animValue, index, width }: { animValue: SharedValue<number>, index: number, width: number }) => {
  const style = useAnimatedStyle(() => {
    const translateY = interpolate(
      animValue.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [50, 0, -50],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY }] };
  });

  return (
    <Animated.View style={[styles.illustrationContainer, style]}>
       <BlurView intensity={20} tint="dark" style={styles.glassCard}>
         <View style={styles.previewBox}>
           <Play color={COLORS.text} size={32} opacity={0.8} />
         </View>
         <View style={styles.timelineBox}>
           <View style={[styles.timelineTrack, { backgroundColor: COLORS.primary, width: '60%' }]} />
           <View style={[styles.timelineTrack, { backgroundColor: COLORS.highlight, width: '40%', marginTop: 8 }]} />
         </View>
       </BlurView>
       <View style={[styles.floatingCard, { top: -15, right: -10, backgroundColor: 'rgba(79, 124, 255, 0.2)' }]}>
          <Layers color={COLORS.primary} size={24} />
       </View>
       <View style={[styles.floatingCard, { bottom: 15, left: -15, backgroundColor: 'rgba(56, 221, 248, 0.2)' }]}>
          <Video color={COLORS.secondary} size={24} />
       </View>
    </Animated.View>
  );
};

const DistractionFreeIllustration = ({ animValue, index, width }: { animValue: SharedValue<number>, index: number, width: number }) => {
  const style = useAnimatedStyle(() => {
    const scale = interpolate(
      animValue.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );
    return { transform: [{ scale }] };
  });

  return (
    <Animated.View style={[styles.illustrationContainer, style]}>
       <BlurView intensity={30} tint="dark" style={[styles.glassCard, { borderRadius: 100, aspectRatio: 1, width: '80%', padding: 0, justifyContent: 'center', alignItems: 'center' }]}>
          <Settings2 color={COLORS.secondary} size={48} />
       </BlurView>
       <View style={[styles.floatingBadge, { top: '10%', left: 0 }]}>
         <Text style={styles.badgeText}>Color Grade</Text>
       </View>
       <View style={[styles.floatingBadge, { bottom: '15%', right: 0 }]}>
         <Text style={styles.badgeText}>Sync Audio</Text>
       </View>
    </Animated.View>
  );
};

const SeamlessWorkflowIllustration = ({ animValue, index, width }: { animValue: SharedValue<number>, index: number, width: number }) => {
  const style = useAnimatedStyle(() => {
    const rotate = interpolate(
      animValue.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [-0.2, 0, 0.2],
      Extrapolation.CLAMP
    );
    return { transform: [{ rotate: `${rotate}rad` }] };
  });

  return (
    <Animated.View style={[styles.illustrationContainer, style]}>
       <BlurView intensity={25} tint="dark" style={[styles.glassCard, { borderColor: COLORS.highlight, borderWidth: 1 }]}>
         <LinearGradient colors={['rgba(139, 92, 246, 0.3)', 'transparent']} style={StyleSheet.absoluteFillObject} />
         <MonitorPlay color={COLORS.text} size={48} style={{ marginBottom: 16 }} />
         <View style={styles.successBar} />
       </BlurView>
       <View style={[styles.floatingCard, { top: -20, left: 20, backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
          <Sparkles color={COLORS.highlight} size={24} />
       </View>
    </Animated.View>
  );
};

const Illustrations = [WorkspaceIllustration, DistractionFreeIllustration, SeamlessWorkflowIllustration];

function PaginationDot({ index, scrollX, pageWidth }: { index: number; scrollX: SharedValue<number>; pageWidth: number }) {
  const dotStyle = useAnimatedStyle(() => {
    const dotWidth = interpolate(
      scrollX.value,
      [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth],
      [8, 24, 8],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );
    return { width: dotWidth, opacity };
  });

  return <Animated.View style={[paginationStyles.dot, dotStyle]} />;
}

const paginationStyles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
});

export function OnboardingScreen() {
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const nextSlide = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      setOnboarded(true);
    }
  };

  const handleMomentumScrollEnd = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };
  
  // Use a smaller base size on small screens
  const isSmallScreen = height < 700;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.bg, '#12121A', COLORS.bg]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[styles.glowTop, { width: width * 1.4, height: height * 0.5, top: -height * 0.2, left: -width * 0.2 }]} />
      <View style={[styles.glowBottom, { width: width * 1.4, height: height * 0.5, bottom: -height * 0.2, right: -width * 0.2 }]} />

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        bounces={false}
        style={{ flex: 1 }}
      >
        {ONBOARDING_SLIDES.map((item, index) => {
          const Illustration = Illustrations[index];
          return (
            <View key={item.key} style={[styles.slide, { width, paddingTop: insets.top + (isSmallScreen ? 20 : 40) }]}>
              <View style={styles.heroSection}>
                 {Illustration && <Illustration animValue={scrollX} index={index} width={width} />}
              </View>
              <View style={styles.textSection}>
                <Text style={[styles.title, isSmallScreen && { fontSize: 28 }]}>{item.title}</Text>
                <Text style={[styles.body, isSmallScreen && { fontSize: 15 }]}>{item.body}</Text>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Footer Area */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 16, 32) }]}>
        <View style={styles.pagination}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <PaginationDot key={i} index={i} scrollX={scrollX} pageWidth={width} />
          ))}
        </View>

        <Pressable onPress={nextSlide}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.highlight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, isSmallScreen && { height: 50 }]}
          >
            <Text style={styles.buttonText}>
              {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Start Creating' : 'Continue'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  glowTop: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    opacity: 0.15,
    borderRadius: 1000,
    transform: [{ scaleY: 0.5 }],
  },
  glowBottom: {
    position: 'absolute',
    backgroundColor: COLORS.highlight,
    opacity: 0.1,
    borderRadius: 1000,
    transform: [{ scaleY: 0.5 }],
  },
  slide: { flex: 1, alignItems: 'center' },
  heroSection: {
    flex: 0.55,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCard: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    padding: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBox: {
    width: '100%',
    flex: 0.6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineBox: { width: '100%', flex: 0.4, justifyContent: 'center' },
  timelineTrack: { height: 8, borderRadius: 4, opacity: 0.8 },
  floatingCard: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  floatingBadge: {
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: { color: COLORS.text, fontSize: 12, fontWeight: '600' },
  successBar: {
    width: '80%',
    height: 6,
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
    opacity: 0.8,
  },
  textSection: {
    flex: 0.45,
    width: '100%',
    paddingHorizontal: 32,
    marginTop: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  footer: {
    width: '100%',
    paddingHorizontal: 32,
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
