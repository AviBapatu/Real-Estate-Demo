import { MapView } from './components/Map/MapView';
import { Navbar } from './components/UI/Navbar';
import { Sidebar } from './components/UI/Sidebar';
import { LeftSidebar } from './components/UI/LeftSidebar';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Navbar />
      <LeftSidebar />
      <MapView />
      <Sidebar />
    </div>
  );
}

export default App;