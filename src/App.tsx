import { MapView } from './components/Map/MapView';
import { Navbar } from './components/UI/Navbar';
import { Sidebar } from './components/UI/Sidebar';
import { LeftSidebar } from './components/UI/LeftSidebar';
import { PanoramaViewer } from './components/Viewer/PanoramaViewer';
import { LoadingScreen } from './components/UI/LoadingScreen';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <LoadingScreen />
      <Navbar />
      <LeftSidebar />
      <MapView />
      <Sidebar />
      <PanoramaViewer />
    </div>
  );
}

export default App;