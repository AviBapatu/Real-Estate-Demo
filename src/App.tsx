import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { useMapStore } from './store/useMapStore';
import { ProjectDiscovery } from './components/UI/ProjectDiscovery';
import { MapView } from './components/Map/MapView';
import { Navbar } from './components/UI/Navbar';
import { Sidebar } from './components/UI/Sidebar';
import { LeftSidebar } from './components/UI/LeftSidebar';
import { PanoramaViewer } from './components/Viewer/PanoramaViewer';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { useEffect } from 'react';

function MapLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const setCurrentProject = useMapStore((state) => state.setCurrentProject);
  
  useEffect(() => {
    if (projectId) {
      setCurrentProject(decodeURIComponent(projectId));
    }
  }, [projectId, setCurrentProject]);

  if (!projectId) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <LeftSidebar />
      <MapView />
      <Sidebar />
      <PanoramaViewer />
    </>
  );
}

function App() {
  const isAppLoading = useMapStore((state) => state.isAppLoading);
  const setAppLoading = useMapStore((state) => state.setAppLoading);

  useEffect(() => {
    if (isAppLoading) {
      const timer = setTimeout(() => {
        setAppLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAppLoading, setAppLoading]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <LoadingScreen />
      
      <Routes>
        <Route path="/" element={<ProjectDiscovery />} />
        <Route path="/project/:projectId" element={<MapLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;