import { create } from 'zustand';

export interface VideoMetadata {
  uri: string;
  name: string;
  size: string;
  duration: string;
  resolution: string;
  fps: number;
  lastModified: string;
  thumbnailUrl: string | null;
}

interface AIManualEditState {
  selectedVideo: string | null;
  metadata: VideoMetadata | null;
  projectName: string;
  prompt: string;
  loading: boolean;
  uploadProgress: number;
  
  // Editor Workspace State
  playbackPosition: number;
  selectedTool: string | null;
  trimValues: { start: number; end: number };
  rotation: number;
  speed: number;
  selectedFilter: string;
  savingState: 'idle' | 'saving' | 'saved';
  undoStack: any[];
  redoStack: any[];

  // AI Assistant State
  aiPrompt: string;
  promptHistory: string[];
  activeCategory: string;
  recommendations: Array<{ id: string; title: string; desc: string; time: string; selected: boolean }>;
  aiMessages: Array<{ role: 'user' | 'ai'; text: string }>;
  aiLoading: boolean;
  analysisState: 'idle' | 'analyzing_frames' | 'understanding' | 'finding_ops' | 'preparing' | 'done';

  // AI Processing State
  processingStage: number;
  overallProgress: number;
  estimatedTime: string;
  activityLogs: string[];
  currentInsight: string | null;
  processingStatus: 'idle' | 'processing' | 'success' | 'cancelled';

  // AI Preview State
  previewVideo: string | null;
  originalVideo: string | null;
  comparisonMode: 'split' | 'toggle' | 'side-by-side';
  activeToggle: 'before' | 'after';
  userFeedback: 'excellent' | 'good' | 'needs_improvement' | 'poor' | null;
  aiSummary: Array<{ id: string; icon: string; title: string; desc: string }>;
  qualityInfo: { resolution: string; fps: number; duration: string; estSize: string } | null;
  exportQuality: string;

  setProjectName: (name: string) => void;
  setPrompt: (prompt: string) => void;
  appendPrompt: (text: string) => void;
  setSelectedVideo: (uri: string | null, metadata: VideoMetadata | null) => void;
  setLoading: (loading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  
  // Editor Actions
  setPlaybackPosition: (pos: number) => void;
  setSelectedTool: (tool: string | null) => void;
  setTrimValues: (start: number, end: number) => void;
  setRotation: (rot: number) => void;
  setSpeed: (speed: number) => void;
  setSelectedFilter: (filter: string) => void;
  setSavingState: (state: 'idle' | 'saving' | 'saved') => void;
  undo: () => void;
  redo: () => void;
  applyToolAction: (actionType: string, payload: any) => void;
  
  // AI Assistant Actions
  setAiPrompt: (prompt: string) => void;
  setActiveCategory: (cat: string) => void;
  addPromptHistory: (prompt: string) => void;
  clearPromptHistory: () => void;
  deletePromptHistory: (prompt: string) => void;
  toggleRecommendation: (id: string) => void;
  setAnalysisState: (state: 'idle' | 'analyzing_frames' | 'understanding' | 'finding_ops' | 'preparing' | 'done') => void;
  setRecommendations: (recs: any[]) => void;
  setAiMessages: (messages: any[]) => void;
  setAiLoading: (loading: boolean) => void;
  
  // AI Processing Actions
  setProcessingState: (updates: Partial<AIManualEditState>) => void;
  addActivityLog: (log: string) => void;
  resetProcessing: () => void;
  
  // AI Preview Actions
  setComparisonMode: (mode: 'split' | 'toggle' | 'side-by-side') => void;
  setActiveToggle: (toggle: 'before' | 'after') => void;
  setUserFeedback: (feedback: 'excellent' | 'good' | 'needs_improvement' | 'poor' | null) => void;
  setPreviewData: (data: Partial<AIManualEditState>) => void;
  setExportQuality: (quality: string) => void;
  
  reset: () => void;
}

export const useAIManualEditStore = create<AIManualEditState>((set) => ({
  selectedVideo: null,
  metadata: null,
  projectName: 'Untitled Project',
  prompt: '',
  loading: false,
  uploadProgress: 0,
  
  // Editor initial state
  playbackPosition: 0,
  selectedTool: null,
  trimValues: { start: 0, end: 100 }, // percentages
  rotation: 0,
  speed: 1,
  selectedFilter: 'None',
  savingState: 'idle',
  undoStack: [],
  redoStack: [],
  
  // AI initial state
  aiPrompt: '',
  promptHistory: [
    'Make this cinematic',
    'Remove pauses',
    'Color grade for sunset'
  ],
  activeCategory: 'Editing',
  recommendations: [],
  aiMessages: [],
  aiLoading: false,
  analysisState: 'idle',
  
  // AI Processing initial state
  processingStage: 0,
  overallProgress: 0,
  estimatedTime: 'Est. 0s',
  activityLogs: [],
  currentInsight: null,
  processingStatus: 'idle',
  
  // AI Preview initial state
  previewVideo: null,
  originalVideo: null,
  comparisonMode: 'split',
  activeToggle: 'after',
  userFeedback: null,
  aiSummary: [],
  qualityInfo: null,
  exportQuality: '1080p',
  
  setProjectName: (name) => set({ projectName: name }),
  setPrompt: (prompt) => set({ prompt }),
  appendPrompt: (text) => set((state) => {
    const current = state.prompt.trim();
    return { prompt: current ? `${current} ${text}` : text };
  }),
  setSelectedVideo: (uri, metadata) => set({ selectedVideo: uri, metadata }),
  setLoading: (loading) => set({ loading }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  
  // Editor Actions implementation
  setPlaybackPosition: (pos) => set({ playbackPosition: pos }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setTrimValues: (start, end) => set({ trimValues: { start, end } }),
  setRotation: (rot) => set({ rotation: rot }),
  setSpeed: (speed) => set({ speed }),
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  setSavingState: (s) => set({ savingState: s }),
  
  undo: () => console.log('Mock Undo triggered'),
  redo: () => console.log('Mock Redo triggered'),
  applyToolAction: (type, payload) => console.log('Mock tool applied:', type, payload),
  
  // AI Actions implementation
  setAiPrompt: (prompt) => set({ aiPrompt: prompt }),
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  addPromptHistory: (prompt) => set((state) => {
    if (state.promptHistory.includes(prompt)) return state;
    return { promptHistory: [prompt, ...state.promptHistory] };
  }),
  clearPromptHistory: () => set({ promptHistory: [] }),
  deletePromptHistory: (prompt) => set((state) => ({
    promptHistory: state.promptHistory.filter(p => p !== prompt)
  })),
  toggleRecommendation: (id) => set((state) => ({
    recommendations: state.recommendations.map(r => r.id === id ? { ...r, selected: !r.selected } : r)
  })),
  setAnalysisState: (s) => set({ analysisState: s }),
  setRecommendations: (recs) => set({ recommendations: recs }),
  setAiMessages: (msg) => set({ aiMessages: msg }),
  setAiLoading: (l) => set({ aiLoading: l }),
  
  // AI Processing Actions implementation
  setProcessingState: (updates) => set((state) => ({ ...state, ...updates })),
  addActivityLog: (log) => set((state) => ({ activityLogs: [log, ...state.activityLogs] })),
  resetProcessing: () => set({
    processingStage: 0,
    overallProgress: 0,
    estimatedTime: 'Est. 0s',
    activityLogs: [],
    currentInsight: null,
    processingStatus: 'idle',
  }),
  
  // AI Preview Actions implementation
  setComparisonMode: (mode) => set({ comparisonMode: mode }),
  setActiveToggle: (toggle) => set({ activeToggle: toggle }),
  setUserFeedback: (feedback) => set({ userFeedback: feedback }),
  setPreviewData: (data) => set((state) => ({ ...state, ...data })),
  setExportQuality: (quality) => set({ exportQuality: quality }),
  
  reset: () => set({
    selectedVideo: null,
    metadata: null,
    projectName: 'Untitled Project',
    prompt: '',
    loading: false,
    uploadProgress: 0,
    playbackPosition: 0,
    selectedTool: null,
    trimValues: { start: 0, end: 100 },
    rotation: 0,
    speed: 1,
    selectedFilter: 'None',
    savingState: 'idle',
    undoStack: [],
    redoStack: [],
    aiPrompt: '',
    activeCategory: 'Editing',
    recommendations: [],
    aiMessages: [],
    aiLoading: false,
    analysisState: 'idle',
  }),
}));
