import React from 'react';
import { create } from 'zustand';
import { CameraMode, ModuleInfo } from './types';
import * as THREE from 'three';

interface AppState {
  // UI State
  activeModule: ModuleInfo | null;
  setActiveModule: (module: ModuleInfo | null) => void;
  
  // Camera State
  cameraMode: CameraMode;
  toggleCameraMode: () => void;

  // Input State (Normalized -1 to 1)
  input: {
    moveForward: number; // -1 (back) to 1 (forward)
    moveRight: number;   // -1 (left) to 1 (right)
    rotateY: number;     // -1 (left) to 1 (right)
    ascend: number;      // -1 (down) to 1 (up)
  };
  setInput: (partial: Partial<AppState['input']>) => void;

  // Player Ref for Camera following
  playerRef: React.MutableRefObject<THREE.Group | null> | null;
  setPlayerRef: (ref: React.MutableRefObject<THREE.Group | null>) => void;
}

export const useStore = create<AppState>((set) => ({
  activeModule: null,
  setActiveModule: (module) => set({ activeModule: module }),

  cameraMode: 'THIRD_PERSON',
  toggleCameraMode: () => set((state) => ({ 
    cameraMode: state.cameraMode === 'FIRST_PERSON' ? 'THIRD_PERSON' : 'FIRST_PERSON' 
  })),

  input: { moveForward: 0, moveRight: 0, rotateY: 0, ascend: 0 },
  setInput: (partial) => set((state) => ({ input: { ...state.input, ...partial } })),

  playerRef: null,
  setPlayerRef: (ref) => set({ playerRef: ref }),
}));