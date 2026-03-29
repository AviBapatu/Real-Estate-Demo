import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMapStore } from '../../store/useMapStore';
import { ProjectCarousel, projects } from './ProjectCarousel';
import { Navbar } from './Navbar';
import './ProjectDiscovery.css';

// Rich per-project info panels
const projectInfo = [
  {
    area: '12,000 sq.ft.',
    config: '4 & 5 BHK',
    status: 'Under Construction',
    possession: 'Dec 2026',
    price: '₹1.8 Cr onwards',
    desc: 'Experience ultra-premium lakeside living with panoramic views and infinity pools. The absolute paradigm of modern luxury architecture designed for the uncompromising elite.',
    amenities: [
      { icon: '🏊', label: 'Infinity Pool' },
      { icon: '🏋️', label: 'Olympic Gym' },
      { icon: '🌿', label: 'Zen Garden' },
      { icon: '🎾', label: 'Tennis Court' },
      { icon: '🚗', label: 'Smart Parking' },
      { icon: '🔐', label: '24/7 Security' },
    ],
  },
  {
    area: '8,500 sq.ft.',
    config: '3 & 4 BHK + Study',
    status: 'Ready to Move',
    possession: 'Immediate',
    price: '₹95 L onwards',
    desc: 'A serene sanctuary featuring smart-home integration, vertical gardens, and a state‑of‑the‑art multi-level clubhouse. Move right in and start living your dream.',
    amenities: [
      { icon: '🏡', label: 'Clubhouse' },
      { icon: '🌱', label: 'Vertical Garden' },
      { icon: '💡', label: 'Smart Home' },
      { icon: '🛝', label: 'Kids Zone' },
      { icon: '🏃', label: 'Jogging Track' },
      { icon: '⚡', label: 'Solar Power' },
    ],
  },
  {
    area: '15,000 sq.ft.',
    config: 'Sky Penthouses',
    status: 'New Launch',
    possession: 'Mar 2028',
    price: '₹4.5 Cr onwards',
    desc: 'Ascend to the pinnacle of skyline extravagance. Unrivaled premium amenities situated gracefully in the heart of the booming financial district. Simply breathtaking.',
    amenities: [
      { icon: '🌆', label: 'Sky Lounge' },
      { icon: '🍽️', label: 'Fine Dining' },
      { icon: '🛁', label: 'Spa & Sauna' },
      { icon: '🎬', label: 'Private Cinema' },
      { icon: '🚁', label: 'Helipad' },
      { icon: '🏦', label: 'Concierge' },
    ],
  },
];

const whyPoints = [
  { n: '01', title: 'RERA Approved', text: 'All our projects are fully RERA registered, ensuring legal compliance and buyer protection at every step.' },
  { n: '02', title: 'Transparent Pricing', text: 'No hidden charges. What you see is what you pay — detailed cost break-ups available on request.' },
  { n: '03', title: 'Premium Construction', text: 'Grade-A materials, ISO-certified contractors, and rigorous QC at every stage of the build cycle.' },
  { n: '04', title: 'On-Time Possession', text: 'We have a proven track record of delivering projects within committed timelines without compromise.' },
];

export const ProjectDiscovery: React.FC = () => {
  const { setAppLoading, setCurrentProject } = useMapStore();
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleProjectSelect = (project: string) => {
    setAppLoading(true);
    setCurrentProject(project);
    setTimeout(() => {
      navigate('/project/' + encodeURIComponent(project));
    }, 300);
  };

  const active = projects[activeSlide];
  const info = projectInfo[activeSlide];

  return (
    <div className="landing-page">
      {/* Navbar — position:relative so it flows naturally, no gap below */}
      <Navbar variant="landing" />

      <main className="landing-page__main">

        {/* ── Hero Carousel (full width, flush with navbar) ── */}
        <section className="landing-page__hero">
          <ProjectCarousel
            onProjectSelect={handleProjectSelect}
            onSlideChange={setActiveSlide}
          />
        </section>

        {/* ── Dynamic Project Details (re-mounts on slide change → fade animation) ── */}
        <section className="landing-page__details">
          <div className="details__container" key={activeSlide}>
            <div className="details__header">
              <h2 className="details__title">{active.title}</h2>
              <p className="details__location">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '1rem', height: '1rem', display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {active.location}
              </p>
            </div>

            <div className="details__grid">
              <div className="details__card">
                <span className="details__label">Project Area</span>
                <span className="details__value">{info.area}</span>
              </div>
              <div className="details__card">
                <span className="details__label">Configuration</span>
                <span className="details__value">{info.config}</span>
              </div>
              <div className="details__card">
                <span className="details__label">Status</span>
                <span className="details__value">{info.status}</span>
              </div>
              <div className="details__card">
                <span className="details__label">Possession</span>
                <span className="details__value">{info.possession}</span>
              </div>
              <div className="details__card">
                <span className="details__label">Starting Price</span>
                <span className="details__value">{info.price}</span>
              </div>
            </div>

            <div className="details__description">
              <p>{info.desc}</p>
              <button
                className="details__action-btn"
                onClick={() => handleProjectSelect(active.title)}
              >
                View Master Plan
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" style={{ width: '1rem', height: '1rem' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ── Amenities Strip (also re-animates per slide) ── */}
        <section className="landing-page__amenities">
          <div className="amenities__container" key={`a-${activeSlide}`} style={{ animation: 'softlyFadeIn 0.65s cubic-bezier(0.16,1,0.3,1) both' }}>
            <h3 className="amenities__heading">World-Class Amenities</h3>
            <p className="amenities__subheading">Every detail curated for the way you want to live.</p>
            <div className="amenities__grid">
              {info.amenities.map((a) => (
                <div key={a.label} className="amenity__item">
                  <span className="amenity__icon">{a.icon}</span>
                  <span className="amenity__label">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Greenkrt (static) ── */}
        <section className="landing-page__why">
          <div className="why__container">
            <h3 className="why__heading">Why Choose Greenkrt?</h3>
            <p className="why__subheading">Built on trust, delivered with excellence.</p>
            <div className="why__grid">
              {whyPoints.map((w) => (
                <div key={w.n} className="why__card">
                  <div className="why__number">{w.n}</div>
                  <div className="why__card-title">{w.title}</div>
                  <div className="why__card-text">{w.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="landing-page__footer">
          <div className="footer__inner">
            <span className="footer__brand">Greenkrt Integrated Services Pvt. Ltd.</span>
            <span className="footer__copy">© {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </footer>

      </main>
    </div>
  );
};
