import React, { useState, useEffect, useRef } from 'react';
import './ProjectCarousel.css';

export interface Project {
  id: number;
  title: string;
  location: string;
  image: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Luxury Villas",
    location: "Hyderabad",
    image: "/assets/locations/beautiful-view-construction-site-city-sunset.jpg"
  },
  {
    id: 2,
    title: "Green Estates",
    location: "Bangalore",
    image: "/assets/locations/construction-site-sunset.jpg"
  },
  {
    id: 3,
    title: "Skyline Residences",
    location: "Mumbai",
    image: "/assets/locations/illustration-construction-site.jpg"
  }
];

interface ProjectCarouselProps {
  onProjectSelect: (projectTitle: string) => void;
  onSlideChange?: (index: number) => void;
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ onProjectSelect, onSlideChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Broadcast out the slide state whenever it changes
  useEffect(() => {
    if (onSlideChange) onSlideChange(currentIndex);
  }, [currentIndex, onSlideChange]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === projects.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? projects.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === projects.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="carousel">
      {/* Slides Container */}
      <div 
        className="carousel__track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="carousel__slide"
            onClick={() => onProjectSelect(project.title)}
          >
            {/* Background Image */}
            <img 
              src={project.image} 
              alt={project.title} 
              className="carousel__image"
            />
            {/* Dark Overlay */}
            <div className="carousel__overlay"></div>
            
            {/* Centered Text */}
            <div className="carousel__content">
              <h2 className="carousel__title">
                {project.title}
              </h2>
              <p className="carousel__location">
                {project.location}
              </p>
              
              <button className="carousel__button">
                Explore Project
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button 
        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
        className="carousel__control carousel__control--prev"
        aria-label="Previous Slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button 
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        className="carousel__control carousel__control--next"
        aria-label="Next Slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Bottom Dot Indicators */}
      <div className="carousel__indicators">
        {projects.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={(e) => { e.stopPropagation(); goToSlide(slideIndex); }}
            className={`carousel__dot ${currentIndex === slideIndex ? 'carousel__dot--active' : ''}`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
