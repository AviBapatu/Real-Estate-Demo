import { useMapStore } from '../../store/useMapStore';

export const Navbar = () => {
  const { searchQuery, setSearchQuery, searchFilter, setSearchFilter } = useMapStore();

  const getPlaceholderText = () => {
    switch (searchFilter) {
      case 'size': return 'Enter plot size (e.g., 1200)...';
      case 'features': return 'Search features (e.g., corner)...';
      case 'id': default: return 'Search for plot number...';
    }
  };

  return (
    <nav style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '64px', // Fixed height for SaaS consistency
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb', // Crisp separator from the map
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      zIndex: 10,
      boxSizing: 'border-box'
    }}>
      
      {/* Brand */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.125rem', 
          color: '#111827', // Near-black for high contrast
          fontWeight: 700,
          letterSpacing: '-0.025em'
        }}>
          almostworks!
        </h1>
      </div>

      {/* Unified Search Component */}
      <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f9fafb', // Very subtle off-white
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '520px',
          overflow: 'hidden', // Ensures inner elements respect the rounded corners
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
          
          <select 
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '10px 16px',
              fontSize: '0.875rem',
              color: '#4b5563', // Slate gray
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer',
              borderRight: '1px solid #e5e7eb',
              WebkitAppearance: 'none', // Removes default browser styling on Mac
              MozAppearance: 'none'
            }}
          >
            <option value="id">Plot Number</option>
            <option value="size">Size</option>
            <option value="features">Features</option>
          </select>

          <input 
            type="text" 
            placeholder={getPlaceholderText()} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        </div>
      </div>

      {/* Right Balancer */}
      <div style={{ flex: 1 }}></div>

    </nav>
  );
};
