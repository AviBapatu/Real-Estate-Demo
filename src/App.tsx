import { useMapStore } from './store/useMapStore';
import { ProjectDiscovery } from './components/UI/ProjectDiscovery';
import { MapView } from './components/Map/MapView';
import { Navbar } from './components/UI/Navbar';
import { Sidebar } from './components/UI/Sidebar';
import { LeftSidebar } from './components/UI/LeftSidebar';
import { PanoramaViewer } from './components/Viewer/PanoramaViewer';
import { LoadingScreen } from './components/UI/LoadingScreen';

import { useEffect } from 'react';

function App() {
  const isLandingPageOpen = useMapStore((state) => state.isLandingPageOpen);
  const isAppLoading = useMapStore((state) => state.isAppLoading);
  const setAppLoading = useMapStore((state) => state.setAppLoading);

  useEffect(() => {
    // Initial site load: show logo pulse for 2 seconds, then transition to landing page
    if (isLandingPageOpen && isAppLoading) {
      const timer = setTimeout(() => {
        setAppLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLandingPageOpen, isAppLoading, setAppLoading]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <LoadingScreen />
      
      {isLandingPageOpen ? (
        <ProjectDiscovery />
      ) : (
        <>
          <Navbar />
          <LeftSidebar />
          <MapView />
          <Sidebar />
          <PanoramaViewer />
        </>
      )}
    </div>
  );
}

export default App;