import React, { useState, useEffect, useRef } from 'react';

interface Project {
  id: number;
  title: string;
  location: string;
  image: string;
}

const projects: Project[] = [
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
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ onProjectSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <div className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden bg-gray-900 group rounded-2xl shadow-2xl">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full w-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="w-full h-full flex-shrink-0 relative cursor-pointer"
            onClick={() => onProjectSelect(project.title)}
          >
            {/* Background Image */}
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-contain"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors duration-300"></div>
            
            {/* Centered Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white pointer-events-none">
              <h2 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg tracking-tight">
                {project.title}
              </h2>
              <p className="text-xl md:text-3xl font-light tracking-wide uppercase drop-shadow-md text-gray-200">
                {project.location}
              </p>
              
              <div className="mt-8 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-sm font-semibold tracking-wider hover:bg-white/20 transition-all pointer-events-auto">
                Explore Project
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button 
        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
        className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
        aria-label="Previous Slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button 
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
        aria-label="Next Slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Bottom Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {projects.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={(e) => { e.stopPropagation(); goToSlide(slideIndex); }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === slideIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
