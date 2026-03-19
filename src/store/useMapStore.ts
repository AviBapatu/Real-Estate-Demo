import { create } from 'zustand';

export interface PlotProperties {
  id: string;
  status: 'available' | 'sold';
  price: number;
  size: string;
  features: string[];
}

export interface SelectedPlot {
  properties: PlotProperties;
  coordinates: [number, number]; // [lng, lat] centroid for flyTo
}

interface MapState {
  activePlotId: string | null;
  setActivePlot: (id: string | null) => void;
  isViewerOpen: boolean;
  setViewerOpen: (isOpen: boolean) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;

  // Sidebar state
  selectedPlot: SelectedPlot | null;
  setSelectedPlot: (plot: SelectedPlot | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activePlotId: null,
  setActivePlot: (id) => set({ activePlotId: id }),
  isViewerOpen: false,
  setViewerOpen: (isOpen) => set({ isViewerOpen: isOpen }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchFilter: 'id',
  setSearchFilter: (filter) => set({ searchFilter: filter }),

  // Sidebar state
  selectedPlot: null,
  setSelectedPlot: (plot) => set({ selectedPlot: plot }),
}));