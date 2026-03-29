import { useMapStore } from '../../store/useMapStore';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC<{ variant?: 'landing' | 'map' }> = ({ variant = 'map' }) => {
  const { searchQuery, setSearchQuery, searchFilter, setSearchFilter, isAdminMode, setAdminMode } = useMapStore();
  const navigate = useNavigate();

  const getPlaceholderText = () => {
    switch (searchFilter) {
      case 'size': return 'Enter plot size (e.g., 1200)...';
      case 'features': return 'Search features (e.g., corner)...';
      case 'id': default: return 'Search for plot number...';
    }
  };

  return (
    <nav style={{
      position: variant === 'landing' ? 'relative' : 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '64px',
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      zIndex: 10,
      boxSizing: 'border-box'
    }}>
      
      {/* Brand */}
      <div 
        onClick={() => navigate('/')}
        title="Back to Projects"
        style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
      >
        <img 
          src="/assets/logo.jpeg" 
          alt="Greenkrt Logo" 
          style={{ height: '40px', width: 'auto', borderRadius: '4px' }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.25rem', 
            color: '#577c1a',
            fontWeight: 800,
            lineHeight: '1.2',
            letterSpacing: '-0.025em'
          }}>
            Greenkrt
          </h1>
          <span style={{
            fontSize: '0.7rem',
            color: '#577c1a',
            fontWeight: 600,
            lineHeight: '1',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            integrated services pvt. ltd.
          </span>
        </div>
      </div>

      {variant !== 'landing' && (
        <>
          {/* Unified Search Component */}
          <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '520px',
              overflow: 'hidden',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}>
              
              <select 
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  setSearchQuery('');
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '10px 16px',
                  fontSize: '0.875rem',
                  color: '#4b5563',
                  fontWeight: 500,
                  outline: 'none',
                  cursor: 'pointer',
                  borderRight: '1px solid #e5e7eb',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              >
                <option value="id">Plot Number</option>
                <option value="size">Size</option>
                <option value="features">Features</option>
              </select>

              <input 
                type={searchFilter === 'size' ? 'number' : 'text'}
                placeholder={getPlaceholderText()} 
                value={searchQuery}
                onChange={(e) => {
                  let val = e.target.value;
                  if (searchFilter === 'features') {
                    val = val.replace(/[0-9]/g, '');
                  }
                  setSearchQuery(val);
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '10px 16px',
                  fontSize: '0.875rem',
                  color: '#111827'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                  }}
                  aria-label="Clear search"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Admin Mode Toggle */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setAdminMode(!isAdminMode)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                background: isAdminMode ? '#ef4444' : '#f3f4f6',
                color: isAdminMode ? '#fff' : '#374151',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {isAdminMode ? '🔴 EXIT ADMIN' : '🔑 ADMIN LOGIN'}
            </button>
          </div>
        </>
      )}

    </nav>
  );
};
