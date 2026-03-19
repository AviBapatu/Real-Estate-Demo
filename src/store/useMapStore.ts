import { create } from 'zustand';

export interface PlotProperties {
  id: string;
  status: 'available' | 'sold';
  price: number;
  size: string;
  features: string[];
  panorama?: string;
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
  viewerImageUrl: string | null;
  setViewerImageUrl: (url: string | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;

  // Sidebar state
  selectedPlot: SelectedPlot | null;
  setSelectedPlot: (plot: SelectedPlot | null) => void;

  // Left Sidebar State
  isLeftSidebarOpen: boolean;
  setLeftSidebarOpen: (isOpen: boolean) => void;
  filterMinSize: string;
  setFilterMinSize: (val: string) => void;
  filterMaxSize: string;
  setFilterMaxSize: (val: string) => void;
  filterMinPrice: string;
  setFilterMinPrice: (val: string) => void;
  filterMaxPrice: string;
  setFilterMaxPrice: (val: string) => void;
  filterFeatures: string[];
  setFilterFeature: (feature: string, enabled: boolean) => void;

  // Admin mode
  isAdminMode: boolean;
  setAdminMode: (val: boolean) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activePlotId: null,
  setActivePlot: (id) => set({ activePlotId: id }),
  isViewerOpen: false,
  setViewerOpen: (isOpen) => set({ isViewerOpen: isOpen }),
  viewerImageUrl: null,
  setViewerImageUrl: (url) => set({ viewerImageUrl: url }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchFilter: 'id',
  setSearchFilter: (filter) => set({ searchFilter: filter }),

  // Sidebar state
  selectedPlot: null,
  setSelectedPlot: (plot) => set({ selectedPlot: plot }),

  // Left Sidebar state
  isLeftSidebarOpen: true, // open by default initially
  setLeftSidebarOpen: (isOpen) => set({ isLeftSidebarOpen: isOpen }),
  filterMinSize: '',
  setFilterMinSize: (val) => set({ filterMinSize: val }),
  filterMaxSize: '',
  setFilterMaxSize: (val) => set({ filterMaxSize: val }),
  filterMinPrice: '',
  setFilterMinPrice: (val) => set({ filterMinPrice: val }),
  filterMaxPrice: '',
  setFilterMaxPrice: (val) => set({ filterMaxPrice: val }),
  filterFeatures: [],
  setFilterFeature: (feature, enabled) => set((state) => {
    if (enabled) {
      if (!state.filterFeatures.includes(feature)) {
        return { filterFeatures: [...state.filterFeatures, feature] };
      }
    } else {
      return { filterFeatures: state.filterFeatures.filter((f) => f !== feature) };
    }
    return state;
  }),

  // Admin mode
  isAdminMode: false,
  setAdminMode: (val) => set({ isAdminMode: val }),
}));