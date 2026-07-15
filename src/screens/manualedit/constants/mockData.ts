import { Track } from '../types/editor.types';

/**
 * Mock timeline used before a real video is loaded.
 * Track order (top to bottom in UI): audio → subtitle → sticker → video
 * The video track must always be last (rendered at the bottom of the timeline).
 */
export const MOCK_TIMELINE: Track[] = [
  {
    id: 'track-audio-1',
    type: 'audio',
    clips: [
      { id: 'a1', trackId: 'track-audio-1', type: 'audio', startTime: 2, duration: 20, color: '#8B5CF6', label: 'Cinematic Beat' },
    ]
  },
  {
    id: 'track-sub-1',
    type: 'subtitle',
    clips: [
      { id: 's1', trackId: 'track-sub-1', type: 'subtitle', startTime: 5, duration: 3, color: '#EAB308', label: '"Here we go!"' },
      { id: 's2', trackId: 'track-sub-1', type: 'subtitle', startTime: 9, duration: 4, color: '#EAB308', label: '"Beautiful sunset..."' },
    ]
  },
  {
    id: 'track-sticker-1',
    type: 'sticker',
    clips: [
      { id: 'st1', trackId: 'track-sticker-1', type: 'sticker', startTime: 3, duration: 5, color: '#F472B6', label: 'Sticker 1' },
    ]
  },
  {
    id: 'track-video-1',
    type: 'video',
    clips: [
      { id: 'v1', trackId: 'track-video-1', type: 'video', startTime: 0, duration: 25, color: '#38DDF8', label: 'Main Video' },
    ]
  },
];
