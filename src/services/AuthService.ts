import type { UserProfile } from '../types';

/**
 * MOCK AuthService
 * This service simulates authentication requests with promises and setTimeouts.
 * No real backend or Supabase is connected here.
 */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createMockUser = (email: string): UserProfile => ({
  id: 'mock-user-1234',
  email: email,
  displayName: email.split('@')[0],
  avatarUrl: null,
  plan: 'free',
  credits: 20,
  createdAt: new Date().toISOString(),
});

export const AuthService = {
  async login(email: string, password: string): Promise<{ data?: UserProfile; error: string | null }> {
    await delay(1500); // Simulate API call

    if (password.length < 6) {
      return { error: 'Invalid credentials. Password is too short.' };
    }

    if (email === 'error@test.com') {
      return { error: 'Invalid email or password.' };
    }

    return { data: createMockUser(email), error: null };
  },

  async signup(name: string, email: string, password: string): Promise<{ error: string | null }> {
    await delay(1500);
    
    if (email === 'taken@test.com') {
      return { error: 'This email is already registered.' };
    }

    return { error: null };
  },

  async verifyOTP(email: string, otp: string): Promise<{ data?: UserProfile; error: string | null }> {
    await delay(1500);

    if (otp === '000000') {
      return { error: 'Invalid OTP code.' };
    }

    return { data: createMockUser(email), error: null };
  },

  async forgotPassword(email: string): Promise<{ error: string | null }> {
    await delay(1500);
    
    if (!email.includes('@')) {
      return { error: 'Please enter a valid email address.' };
    }

    return { error: null };
  },

  // In this mock, session restoration is just simulating fetching the user data
  async restoreSession(email: string): Promise<{ data?: UserProfile; error: string | null }> {
    await delay(500);
    return { data: createMockUser(email), error: null };
  },
};
