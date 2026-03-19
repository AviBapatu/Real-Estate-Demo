import { useMapStore } from '../../store/useMapStore';
import './LeftSidebar.css';

const ALL_FEATURES = [
  'corner',
  'east-facing',
  'north-facing',
  'park-facing',
  'premium-view',
  'near-entry'
];

export const LeftSidebar = () => {
  const {
    isLeftSidebarOpen, setLeftSidebarOpen,
    filterMinSize, setFilterMinSize,
    filterMaxSize, setFilterMaxSize,
    filterMinPrice, setFilterMinPrice,
    filterMaxPrice, setFilterMaxPrice,
    filterFeatures, setFilterFeature,
  } = useMapStore();

  if (!isLeftSidebarOpen) {
    return (
      <button 
        className="left-sidebar-toggle-open" 
        onClick={() => setLeftSidebarOpen(true)}
        aria-label="Open Filters"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    );
  }

  return (
    <aside className="left-sidebar">
      <div className="left-sidebar__header">
        <h2 className="left-sidebar__title">Filters & Legend</h2>
        <button 
          className="left-sidebar__close" 
          onClick={() => setLeftSidebarOpen(false)}
          aria-label="Close Filters"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="left-sidebar__content">
        {/* Legend */}
        <section className="left-sidebar__section">
          <h3 className="left-sidebar__section-title">Legend</h3>
          <div className="left-sidebar__legend">
            <div className="left-sidebar__legend-item">
              <span className="left-sidebar__legend-color" style={{ background: '#22c55e' }}></span>
              <span>Available</span>
            </div>
            <div className="left-sidebar__legend-item">
              <span className="left-sidebar__legend-color" style={{ background: '#ef4444' }}></span>
              <span>Sold</span>
            </div>
          </div>
        </section>

        {/* Size Range */}
        <section className="left-sidebar__section">
          <h3 className="left-sidebar__section-title">Size (sqft)</h3>
          <div className="left-sidebar__range-inputs">
            <input 
              type="number" 
              placeholder="Min" 
              value={filterMinSize} 
              onChange={(e) => setFilterMinSize(e.target.value)} 
              className="left-sidebar__input"
            />
            <span className="left-sidebar__separator">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={filterMaxSize} 
              onChange={(e) => setFilterMaxSize(e.target.value)} 
              className="left-sidebar__input"
            />
          </div>
        </section>

        {/* Price Range */}
        <section className="left-sidebar__section">
          <h3 className="left-sidebar__section-title">Price ($)</h3>
          <div className="left-sidebar__range-inputs">
            <input 
              type="number" 
              placeholder="Min" 
              value={filterMinPrice} 
              onChange={(e) => setFilterMinPrice(e.target.value)} 
              className="left-sidebar__input"
            />
            <span className="left-sidebar__separator">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={filterMaxPrice} 
              onChange={(e) => setFilterMaxPrice(e.target.value)} 
              className="left-sidebar__input"
            />
          </div>
        </section>

        {/* Features */}
        <section className="left-sidebar__section">
          <h3 className="left-sidebar__section-title">Features</h3>
          <div className="left-sidebar__features">
            {ALL_FEATURES.map(feat => (
              <label key={feat} className="left-sidebar__feature-label">
                <input 
                  type="checkbox" 
                  checked={filterFeatures.includes(feat)}
                  onChange={(e) => setFilterFeature(feat, e.target.checked)}
                  className="left-sidebar__checkbox"
                />
                <span className="left-sidebar__feature-text">{feat.replace(/-/g, ' ')}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};
