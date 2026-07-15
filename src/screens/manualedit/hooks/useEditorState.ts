import { create } from 'zustand';
import { MOCK_TIMELINE } from '../constants/mockData';
import { Track, Clip } from '../types/editor.types';
import type { VideoMetadata } from '../../../store/aiManualEditStore';

interface EditorState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  selectedClipId: string | null;
  selectedToolId: string | null;
  tracks: Track[];
  rotation: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  
  // Actions
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  togglePlay: () => void;
  setSelectedClipId: (id: string | null) => void;
  setSelectedToolId: (id: string | null) => void;
  initTracksFromMetadata: (uri: string, metadata: VideoMetadata) => void;
  setRotation: (rot: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  updateClipTrim: (id: string, updates: Partial<Clip>) => void;
  splitClip: (id: string, time: number) => void;
  duplicateClip: (id: string) => void;
  deleteClip: (id: string) => void;
}

export const useEditorState = create<EditorState>((set) => ({
  currentTime: 0,
  duration: 30, // Mock 30s
  isPlaying: false,
  selectedClipId: null,
  selectedToolId: null,
  tracks: MOCK_TIMELINE,
  rotation: 0,
  playbackRate: 1,
  volume: 1,
  isMuted: false,
  
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (newDuration) => set((state) => {
    // Also update the main video clip's duration to match the real player duration
    const updatedTracks = state.tracks.map(t => {
      if (t.type !== 'video') return t;
      return {
        ...t,
        clips: t.clips.map((c, i) => {
          // Update the first video clip (the main clip) if it's the only one or the first
          if (i === 0 && t.clips.length >= 1) {
            return { ...c, duration: newDuration };
          }
          return c;
        }),
      };
    });
    return { duration: newDuration, tracks: updatedTracks };
  }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSelectedClipId: (id) => set({ selectedClipId: id }),
  setSelectedToolId: (id) => set({ selectedToolId: id }),
  initTracksFromMetadata: (uri, metadata) => {
    let durInSeconds = 30;
    if (metadata.duration) {
      if (metadata.duration.includes(':')) {
        const parts = metadata.duration.split(':').map(Number);
        if (parts.length === 3) durInSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        else if (parts.length === 2) durInSeconds = parts[0] * 60 + parts[1];
      } else {
        const parsed = parseFloat(metadata.duration);
        if (!isNaN(parsed)) durInSeconds = parsed;
      }
    }
    durInSeconds = Math.max(1, durInSeconds);

    // Track order: audio → subtitle → sticker → video (video always at bottom)
    const tracks: Track[] = [
      {
        id: 'track-audio-1',
        type: 'audio',
        clips: [] // empty — user adds music via Music button
      },
      {
        id: 'track-sub-1',
        type: 'subtitle',
        clips: [] // empty — user adds text
      },
      {
        id: 'track-sticker-1',
        type: 'sticker',
        clips: [] // empty — user adds stickers
      },
      {
        id: 'main-video',
        type: 'video',
        clips: [{
          id: 'clip-1',
          trackId: 'main-video',
          type: 'video',
          label: metadata.name || 'Uploaded Video',
          startTime: 0,
          sourceStartTime: 0,
          duration: durInSeconds,
          color: '#2DD4BF',
          uri
        }]
      }
    ];

    set({
      duration: durInSeconds,
      tracks,
      currentTime: 0
    });
  },
  setRotation: (rot) => set({ rotation: rot }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setVolume: (vol) => set({ volume: vol }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  updateClipTrim: (id, updates) => set((state) => {
    let newTracks = state.tracks.map(t => ({
      ...t,
      clips: t.clips.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
    return recalculateTimeline(newTracks, state);
  }),
  splitClip: (id, time) => set((state) => {
    // Simple split implementation
    let newTracks = [...state.tracks];
    let didSplit = false;
    newTracks = newTracks.map(t => {
      const clipIndex = t.clips.findIndex(c => c.id === id);
      if (clipIndex === -1) return t;
      const c = t.clips[clipIndex];
      // Time must be within clip
      if (time <= c.startTime || time >= c.startTime + c.duration) return t;
      
      const uniqueSuffix = Date.now().toString(36);
      const c1Duration = time - c.startTime;
      const c1 = { ...c, duration: c1Duration }; // retain original ID so it doesn't unmount
      
      const c2SourceStart = (c.sourceStartTime ?? 0) + c1Duration;
      const c2 = { 
        ...c, 
        id: `${c.id}-2-${uniqueSuffix}`, 
        startTime: time, 
        sourceStartTime: c2SourceStart,
        duration: (c.startTime + c.duration) - time 
      };
      const newClips = [...t.clips];
      newClips.splice(clipIndex, 1, c1, c2);
      didSplit = true;
      return { ...t, clips: newClips };
    });
    const result = recalculateTimeline(newTracks, state);
    return { 
      ...result,
      selectedClipId: (didSplit && state.selectedClipId === id) ? null : state.selectedClipId
    };
  }),
  duplicateClip: (id) => set((state) => {
    let newTracks = [...state.tracks];
    newTracks = newTracks.map(t => {
      const clipIndex = t.clips.findIndex(c => c.id === id);
      if (clipIndex === -1) return t;
      const c = t.clips[clipIndex];
      const newClip = { ...c, id: `${c.id}-dup` }; 
      const newClips = [...t.clips];
      newClips.splice(clipIndex + 1, 0, newClip);
      return { ...t, clips: newClips };
    });
    return recalculateTimeline(newTracks, state);
  }),
  deleteClip: (id) => set((state) => {
    let newTracks = state.tracks.map(t => ({
      ...t,
      clips: t.clips.filter(c => c.id !== id)
    }));
    const result = recalculateTimeline(newTracks, state);
    return {
      ...result,
      selectedClipId: state.selectedClipId === id ? null : state.selectedClipId
    };
  }),
}));

// Helper to ensure main track is magnetic and compute total duration
function recalculateTimeline(tracks: Track[], state: EditorState) {
  let newDuration = state.duration;
  const newTracks = tracks.map(track => {
    if (track.type === 'video') {
      let currentTime = 0;
      const newClips = track.clips.map(clip => {
        const updatedClip = { ...clip, startTime: currentTime };
        currentTime += clip.duration;
        return updatedClip;
      });
      newDuration = currentTime > 0 ? currentTime : newDuration;
      return { ...track, clips: newClips };
    }
    return track;
  });
  
  // Ensure the playhead doesn't exceed the new duration
  const newCurrentTime = Math.min(state.currentTime, newDuration);
  
  return { tracks: newTracks, duration: newDuration, currentTime: newCurrentTime };
}
