import { create } from 'zustand';

interface MapState {
  activePlotId: string | null;
  setActivePlot: (id: string | null) => void;
  isViewerOpen: boolean;
  setViewerOpen: (isOpen: boolean) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activePlotId: null,
  setActivePlot: (id) => set({ activePlotId: id }),
  isViewerOpen: false,
  setViewerOpen: (isOpen) => set({ isViewerOpen: isOpen }),
}));