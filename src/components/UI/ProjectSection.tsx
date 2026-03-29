import React from 'react';
import './ProjectSection.css';
import { projects } from './ProjectCarousel';

interface CardDef {
  icon: string;
  label: string;
  value: string;
}

interface ProjectSectionProps {
  title: string;
  location: string;
  description: string;
  price: string;
  backgroundImage: string;
  cards: CardDef[];
  onCTAClick: () => void;
  onSlideChange?: (index: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  onPauseToggle?: () => void;
  isPaused?: boolean;
  animKey: number;
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({
  title,
  location,
  description,
  price,
  backgroundImage,
  cards,
  onCTAClick,
  onSlideChange,
  onPrev,
  onNext,
  onPauseToggle,
  isPaused = false,
  animKey,
}) => {
  return (
    <section className="project-section" key={animKey}>

      {/* Cinematic background with zoom animation */}
      <div
        className="project-section__bg"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* ── Playback Controls (top-right) ── */}
      {(onPrev || onNext || onPauseToggle) && (
        <div className="project-section__controls">
          <button
            className="ps-ctrl-btn"
            onClick={onPrev}
            aria-label="Previous project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            className={`ps-ctrl-btn ps-ctrl-btn--pause${isPaused ? ' ps-ctrl-btn--active' : ''}`}
            onClick={onPauseToggle}
            aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
          >
            {isPaused ? (
              /* Play icon */
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            ) : (
              /* Pause icon */
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>

          <button
            className="ps-ctrl-btn"
            onClick={onNext}
            aria-label="Next project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}

      <div className="project-section__inner">

        {/* ── LEFT: Editorial Copy ── */}
        <div className="project-section__left">
          <span className="project-section__tag">
            <span className="project-section__tag-dot" />
            Featured Project
          </span>

          <h2 className="project-section__title">{title}</h2>

          <p className="project-section__location">
            <svg className="project-section__location-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {location}
          </p>

          <div className="project-section__divider" />

          <p className="project-section__desc">{description}</p>

          <p className="project-section__price">Starting from {price}</p>

          <button className="project-section__cta" onClick={onCTAClick}>
            View Master Plan
            <svg className="project-section__cta-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        {/* ── RIGHT: Glassmorphism Stat Cards ── */}
        <div className="project-section__right">
          {cards.map((card) => (
            <div key={card.label} className="project-card">
              <div className="project-card__icon-wrap">{card.icon}</div>
              <div className="project-card__body">
                <span className="project-card__label">{card.label}</span>
                <span className="project-card__value">{card.value}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
      {/* Dot navigation */}
      {onSlideChange && (
        <div className="project-section__dots">
          {projects.map((_, i) => (
            <button
              key={i}
              className={`project-section__dot${i === animKey ? ' project-section__dot--active' : ''}`}
              onClick={() => onSlideChange(i)}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      )}

    </section>
  );
};
