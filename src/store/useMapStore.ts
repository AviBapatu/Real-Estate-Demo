import { create } from 'zustand';

interface MapState {
  activePlotId: string | null;
  setActivePlot: (id: string | null) => void;
  isViewerOpen: boolean;
  setViewerOpen: (isOpen: boolean) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // New: Track the selected filter category
  searchFilter: string; 
  setSearchFilter: (filter: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activePlotId: null,
  setActivePlot: (id) => set({ activePlotId: id }),
  isViewerOpen: false,
  setViewerOpen: (isOpen) => set({ isViewerOpen: isOpen }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  // Initialize with 'id' so it defaults to searching for plot numbers
  searchFilter: 'id',
  setSearchFilter: (filter) => set({ searchFilter: filter }),
}));