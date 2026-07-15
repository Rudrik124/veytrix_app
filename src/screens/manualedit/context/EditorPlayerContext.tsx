import React, { createContext, useContext } from 'react';
import type { VideoPlayer } from 'expo-video';

interface EditorPlayerContextType {
  player: VideoPlayer | null;
}

const EditorPlayerContext = createContext<EditorPlayerContextType>({ player: null });

export function useEditorPlayer() {
  return useContext(EditorPlayerContext);
}

export function EditorPlayerProvider({ player, children }: { player: VideoPlayer | null, children: React.ReactNode }) {
  return (
    <EditorPlayerContext.Provider value={{ player }}>
      {children}
    </EditorPlayerContext.Provider>
  );
}
