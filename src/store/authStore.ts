import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/AuthService';
import type { UserProfile } from '../types';

interface AuthState {
  status: 'checking' | 'signedOut' | 'signedIn';
  user: UserProfile | null;
  hasOnboarded: boolean;
  init: () => Promise<void>;
  setOnboarded: (v: boolean) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: string | null }>;
  sendPasswordReset: (email: string) => Promise<{ error: string | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const SESSION_KEY = '@mock_session_email';

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'checking',
  user: null,
  hasOnboarded: false,

  init: async () => {
    try {
      const savedEmail = await AsyncStorage.getItem(SESSION_KEY);
      if (savedEmail) {
        const { data } = await AuthService.restoreSession(savedEmail);
        if (data) {
          set({ status: 'signedIn', user: data });
          return;
        }
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    }
    set({ status: 'signedOut', user: null });
  },

  setOnboarded: (v) => set({ hasOnboarded: v }),

  signInWithEmail: async (email, password) => {
    const { data, error } = await AuthService.login(email, password);
    if (error) return { error };
    
    if (data) {
      await AsyncStorage.setItem(SESSION_KEY, data.email);
      set({ status: 'signedIn', user: data });
    }
    return { error: null };
  },

  signUpWithEmail: async (name, email, password) => {
    const { error } = await AuthService.signup(name, email, password);
    return { error };
  },

  signInWithOAuth: async (provider) => {
    const { data, error } = await AuthService.login(`demo+${provider}@veytrix.app`, 'password123');
    if (error) return { error };
    
    if (data) {
      await AsyncStorage.setItem(SESSION_KEY, data.email);
      set({ status: 'signedIn', user: data });
    }
    return { error: null };
  },

  sendPasswordReset: async (email) => {
    const { error } = await AuthService.forgotPassword(email);
    return { error };
  },

  verifyOtp: async (email, token) => {
    const { data, error } = await AuthService.verifyOTP(email, token);
    if (error) return { error };
    
    if (data) {
      await AsyncStorage.setItem(SESSION_KEY, data.email);
      set({ status: 'signedIn', user: data });
    }
    return { error: null };
  },

  signOut: async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    set({ status: 'signedOut', user: null });
  },

  updateProfile: async (updates) => {
    // simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => {
      if (!state.user) return state;
      return { user: { ...state.user, ...updates } };
    });
  },
}));
