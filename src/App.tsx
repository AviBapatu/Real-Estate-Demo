import { MapView } from './components/Map/MapView';
import { Navbar } from './components/UI/Navbar';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Navbar />
      <MapView />
    </div>
  );
}

export default App;