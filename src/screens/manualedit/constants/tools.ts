import { EditorTool } from '../types/editor.types';

export const EDITOR_TOOLS: EditorTool[] = [
  { id: 'ai-edit', label: 'AI Edit', iconName: 'Sparkles', category: 'ai' },
  { id: 'trim', label: 'Trim', iconName: 'Scissors', category: 'edit' },
  { id: 'split', label: 'Split', iconName: 'SplitSquareHorizontal', category: 'edit' },
  { id: 'crop', label: 'Crop', iconName: 'Crop', category: 'edit' },
  { id: 'rotate', label: 'Rotate', iconName: 'RotateCw', category: 'edit' },
  { id: 'speed', label: 'Speed', iconName: 'FastForward', category: 'edit' },
  { id: 'volume', label: 'Volume', iconName: 'Volume2', category: 'audio' },
  { id: 'mute', label: 'Mute', iconName: 'VolumeX', category: 'audio' },
  { id: 'filters', label: 'Filters', iconName: 'Wand2', category: 'effects' },
  { id: 'effects', label: 'Effects', iconName: 'Zap', category: 'effects' },
  { id: 'adjust', label: 'Adjust', iconName: 'Sliders', category: 'edit' },
  { id: 'text', label: 'Text', iconName: 'Type', category: 'text' },
  { id: 'stickers', label: 'Stickers', iconName: 'Smile', category: 'effects' },
  { id: 'pip', label: 'PiP', iconName: 'PictureInPicture', category: 'edit' },
  { id: 'background', label: 'Background', iconName: 'Layout', category: 'edit' },
  { id: 'replace', label: 'Replace', iconName: 'RefreshCw', category: 'edit' },
  { id: 'reverse', label: 'Reverse', iconName: 'History', category: 'edit' },
  { id: 'freeze', label: 'Freeze', iconName: 'Snowflake', category: 'edit' },
  { id: 'duplicate', label: 'Duplicate', iconName: 'Copy', category: 'edit' },
  { id: 'delete', label: 'Delete', iconName: 'Trash2', category: 'edit' },
];
