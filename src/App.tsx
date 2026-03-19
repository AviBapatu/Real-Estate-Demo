import { MapView } from './components/Map/MapView';
import { Navbar } from './components/UI/Navbar';
import { Sidebar } from './components/UI/Sidebar';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Navbar />
      <MapView />
      <Sidebar />
    </div>
  );
}

export default App;