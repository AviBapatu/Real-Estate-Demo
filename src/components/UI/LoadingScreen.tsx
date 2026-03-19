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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        animation: 'pulse 2s infinite ease-in-out'
      }}>
        <img 
          src="/assets/logo.jpeg" 
          alt="Greenkrt Logo" 
          style={{ height: '80px', width: 'auto', borderRadius: '8px' }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '3rem', 
            color: '#577c1a',
            fontWeight: 800,
            lineHeight: '1.1',
            letterSpacing: '-0.025em',
            fontFamily: 'sans-serif'
          }}>
            Greenkrt
          </h1>
          <span style={{
            fontSize: '1.2rem',
            color: '#577c1a',
            fontWeight: 600,
            lineHeight: '1',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif'
          }}>
            integrated services pvt. ltd.
          </span>
        </div>
      </div>
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
