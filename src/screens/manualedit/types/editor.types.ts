export type TrackType = 'video' | 'audio' | 'subtitle' | 'sticker' | 'pip';

export interface Clip {
  id: string;
  trackId: string;
  type: TrackType;
  startTime: number; // in seconds (Timeline position)
  duration: number; // in seconds (Duration on timeline)
  sourceStartTime?: number; // in seconds (Start time in the source media)
  color: string;
  label: string;
  thumbnail?: string; // Optional mock thumbnail url
  uri?: string; // For generating real thumbnails
}

export interface Track {
  id: string;
  type: TrackType;
  clips: Clip[];
}

export interface EditorTool {
  id: string;
  label: string;
  iconName: string; // Used to dynamically render lucide-react-native icons, or map manually
  category: 'edit' | 'ai' | 'audio' | 'text' | 'effects';
}
