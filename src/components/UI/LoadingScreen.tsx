import { useMapStore } from '../../store/useMapStore';

export const LoadingScreen = () => {
  const isAppLoading = useMapStore((state) => state.isAppLoading);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      opacity: isAppLoading ? 1 : 0,
      transition: 'opacity 0.8s ease-out',
      pointerEvents: isAppLoading ? 'all' : 'none'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 700, 
        fontFamily: 'sans-serif',
        letterSpacing: '-0.05em', 
        color: '#111827',
        animation: 'pulse 2s infinite ease-in-out'
      }}>
        almostworks!
      </h1>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
