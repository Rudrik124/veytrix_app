import { Plan } from '../types';

export const PLANS: Plan[] = [
  { id: 'free', name: 'Free', priceInr: 0, creditsPerMonth: 20, perks: ['20 credits/month', 'Watermarked exports', 'Standard queue'] },
  { id: 'plus', name: 'Plus', priceInr: 99, creditsPerMonth: 150, perks: ['150 credits/month', 'No watermark', 'Priority queue'] },
  { id: 'pro', name: 'Pro', priceInr: 199, creditsPerMonth: 400, perks: ['400 credits/month', '1080p exports', 'Faster generation'] },
  { id: 'premium', name: 'Premium', priceInr: 299, creditsPerMonth: 1000, perks: ['1000 credits/month', '4K exports', 'Fastest queue', 'Early access features'] },
];

export const CREDIT_COSTS = {
  text_to_video: 10,
  image_to_video: 8,
  reference_video: 12,
  manual_edit_export: 2,
};

export const ASPECT_RATIOS = ['9:16', '1:1', '16:9', '4:5'] as const;
export const DURATIONS_SEC = [4, 8, 12, 16] as const;
export const QUALITY_TIERS = ['Standard', 'High', 'Ultra'] as const;
export const VIDEO_STYLES = ['Cinematic', 'Anime', 'Realistic', 'Claymation', '3D Render', 'Retro Film'] as const;

export const ONBOARDING_SLIDES = [
  {
    key: 'workspace',
    title: 'Your Creative Workspace',
    body: 'Everything begins in one organized space where your media, timeline, and tools work together naturally.',
  },
  {
    key: 'distraction_free',
    title: 'Edit Without Distractions',
    body: 'Focus on your creativity with an interface designed to make every adjustment feel effortless and intuitive.',
  },
  {
    key: 'seamless_workflow',
    title: 'Bring Every Idea Together',
    body: 'Preview, refine, and complete your project in one seamless creative workflow built for speed and precision.',
  },
];

export const NAV_TABS = ['Home', 'Projects', 'Create', 'Downloads', 'Profile'] as const;
