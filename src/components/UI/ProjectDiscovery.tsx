import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMapStore } from '../../store/useMapStore';
import './ProjectDiscovery.css';

export const ProjectDiscovery: React.FC = () => {
  const { setAppLoading, setCurrentProject } = useMapStore();
  const navigate = useNavigate();

  const handleProjectSelect = (project: string) => {
    // 1. Show the loading screen with logo
    setAppLoading(true);
    setCurrentProject(project);

    // 3. Give 300ms for the loading screen's opacity transition to completely finish masking the browser
    // Then mount the heavy map route so it doesn't freeze the CSS animation while starting WebGL
    setTimeout(() => {
      navigate('/project/' + encodeURIComponent(project));
    }, 300);
  };

  return (
    <div className="discovery">
      <div className="discovery__left">
        <div className="discovery__brand">
          <img 
            src="/assets/logo.jpeg" 
            alt="Greenkrt Logo" 
            className="discovery__logo" 
          />
          <h1 className="discovery__company-name">Greenkrt</h1>
          <p className="discovery__tagline">Integrated Services Pvt. Ltd.</p>
        </div>
      </div>
      
      <div className="discovery__right">
        <div className="discovery__selection">
          <h2 className="discovery__title">Explore Our Projects</h2>
          <div className="discovery__projects">
            {['Project 1', 'Project 2', 'Project 3'].map((project) => (
              <button 
                key={project} 
                className="discovery__project-btn"
                onClick={() => handleProjectSelect(project)}
              >
                <span className="discovery__project-btn-text">{project}</span>
                <span className="discovery__project-btn-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
