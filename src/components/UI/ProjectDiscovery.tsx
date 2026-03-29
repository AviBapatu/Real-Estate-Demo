import React from 'react';
import { ProjectCarousel } from './ProjectCarousel';
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
      
      <div className="discovery__right !p-0 md:!p-8">
        <div className="w-full h-full flex items-center justify-center">
          <ProjectCarousel onProjectSelect={handleProjectSelect} />
        </div>
      </div>
    </div>
  );
};
