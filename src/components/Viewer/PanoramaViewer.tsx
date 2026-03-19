import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { useMapStore } from '../../store/useMapStore';

export const PanoramaViewer = () => {
  const { isViewerOpen, setViewerOpen, viewerImageUrl } = useMapStore();

  if (!isViewerOpen || !viewerImageUrl) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 50,
      backgroundColor: 'black'
    }}>
      <button
        onClick={() => setViewerOpen(false)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 51,
          background: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'; // red-500 equivalent hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        Close 360 View
      </button>

      <ReactPhotoSphereViewer 
        src={viewerImageUrl}
        height="100vh"
        width="100vw"
        littlePlanet={false}
        navbar={['zoom', 'fullscreen']}
      />
    </div>
  );
};
