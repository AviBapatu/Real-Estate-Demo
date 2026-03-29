import { useMapStore } from '../../store/useMapStore';
import './Sidebar.css';

export const Sidebar = () => {
  const { 
    selectedPlot, 
    setSelectedPlot,
    setViewerImageUrl,
    setViewerOpen
  } = useMapStore();

  const isOpen = selectedPlot !== null;
  const props = selectedPlot?.properties;

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__header-top">
          <span className={`sidebar__status-badge sidebar__status-badge--${props?.status}`}>
            {props?.status === 'available' ? 'Available' : 'Sold'}
          </span>
          <button
            className="sidebar__close"
            onClick={() => setSelectedPlot(null)}
            aria-label="Close sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <h2 className="sidebar__plot-id">{props?.id}</h2>
        <p className="sidebar__price">
          {props?.price != null
            ? `₹${props.price.toLocaleString()}`
            : '—'}
        </p>
      </div>

      <div className="sidebar__divider" />

      <div className="sidebar__body">
        <section className="sidebar__section">
          <h3 className="sidebar__section-title">Plot Details</h3>
          <dl className="sidebar__dl">
            <div className="sidebar__dl-row">
              <dt>Size</dt>
              <dd>{props?.size ?? '—'}</dd>
            </div>
            <div className="sidebar__dl-row">
              <dt>Status</dt>
              <dd className={`sidebar__status-text--${props?.status}`}>
                {props?.status === 'available' ? 'Available' : 'Sold'}
              </dd>
            </div>
            <div className="sidebar__dl-row">
              <dt>Plot ID</dt>
              <dd>{props?.id ?? '—'}</dd>
            </div>
          </dl>
          {props?.distanceFromRoad && (
            <div className="sidebar__highlight-box">
              <div className="sidebar__highlight-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 18l-2-1-2 1V6l2 1 2-1 2 1 2-1v12l-2 1-2-1z" />
                </svg>
                <span>Corner Plot Detail</span>
              </div>
              <div className="sidebar__highlight-row">
                <dt>Distance to Road</dt>
                <dd>{props.distanceFromRoad}</dd>
              </div>
            </div>
          )}
        </section>

        <div className="sidebar__divider" />

        <section className="sidebar__section">
          <h3 className="sidebar__section-title">Features</h3>
          {props?.features && props.features.length > 0 ? (
            <ul className="sidebar__features">
              {props.features.map((feature) => (
                <li key={feature} className="sidebar__feature-chip">
                  <span className="sidebar__feature-dot" />
                  {feature}
                </li>
              ))}
            </ul>
          ) : (
            <p className="sidebar__empty">No features listed.</p>
          )}
        </section>
      </div>

      {(props?.status === 'available' || props?.panorama) && (
        <div className="sidebar__footer">
          {props?.panorama ? (
            <button 
              className="sidebar__cta"
              onClick={() => {
                setViewerImageUrl(props.panorama ?? null);
                setViewerOpen(true);
              }}
            >
              Open 360 View
            </button>
          ) : (
            <button className="sidebar__cta">
              Express Interest
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
