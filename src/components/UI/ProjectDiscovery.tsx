import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMapStore } from '../../store/useMapStore';
import { projects } from './ProjectCarousel';
import { ProjectSection } from './ProjectSection';
import './ProjectDiscovery.css';

/* ─── Per-project data ───────────────────────────────────────── */

const projectData = [
  {
    price: '₹1.8 Cr onwards',
    desc: 'Experience ultra-premium lakeside living with panoramic views and infinity pools. The absolute paradigm of modern luxury architecture designed for the uncompromising elite.',
    cards: [
      { icon: '📐', label: 'Project Area',   value: '12,000 sq.ft.'       },
      { icon: '🏠', label: 'Configuration', value: '4 & 5 BHK'            },
      { icon: '🏗️', label: 'Status',        value: 'Under Construction'   },
      { icon: '📅', label: 'Possession',    value: 'Dec 2026'             },
      { icon: '💰', label: 'Starting Price', value: '₹1.8 Cr'             },
    ],
    amenities: [
      { icon: '🏊', label: 'Infinity Pool'  },
      { icon: '🏋️', label: 'Olympic Gym'   },
      { icon: '🌿', label: 'Zen Garden'     },
      { icon: '🎾', label: 'Tennis Court'   },
      { icon: '🚗', label: 'Smart Parking'  },
      { icon: '🔐', label: '24/7 Security'  },
    ],
  },
  {
    price: '₹95 L onwards',
    desc: 'A serene sanctuary featuring smart-home integration, vertical gardens, and a state‑of‑the‑art multi-level clubhouse. Move right in and start living your dream.',
    cards: [
      { icon: '📐', label: 'Project Area',   value: '8,500 sq.ft.'         },
      { icon: '🏠', label: 'Configuration', value: '3 & 4 BHK + Study'    },
      { icon: '✅', label: 'Status',        value: 'Ready to Move'        },
      { icon: '📅', label: 'Possession',    value: 'Immediate'            },
      { icon: '💰', label: 'Starting Price', value: '₹95 L'               },
    ],
    amenities: [
      { icon: '🏡', label: 'Clubhouse'       },
      { icon: '🌱', label: 'Vertical Garden' },
      { icon: '💡', label: 'Smart Home'      },
      { icon: '🛝', label: 'Kids Zone'       },
      { icon: '🏃', label: 'Jogging Track'   },
      { icon: '⚡', label: 'Solar Power'     },
    ],
  },
  {
    price: '₹4.5 Cr onwards',
    desc: 'Ascend to the pinnacle of skyline extravagance. Unrivaled premium amenities situated gracefully in the heart of the booming financial district. Simply breathtaking.',
    cards: [
      { icon: '📐', label: 'Project Area',   value: '15,000 sq.ft.'       },
      { icon: '🏠', label: 'Configuration', value: 'Sky Penthouses'       },
      { icon: '🚀', label: 'Status',        value: 'New Launch'           },
      { icon: '📅', label: 'Possession',    value: 'Mar 2028'             },
      { icon: '💰', label: 'Starting Price', value: '₹4.5 Cr'            },
    ],
    amenities: [
      { icon: '🌆', label: 'Sky Lounge'      },
      { icon: '🍽️', label: 'Fine Dining'     },
      { icon: '🛁', label: 'Spa & Sauna'     },
      { icon: '🎬', label: 'Private Cinema'  },
      { icon: '🚁', label: 'Helipad'         },
      { icon: '🏦', label: 'Concierge'       },
    ],
  },
];

const whyPoints = [
  { n: '01', icon: '🏛️', title: 'RERA Approved',         text: 'All our projects are fully RERA registered, ensuring legal compliance and buyer protection at every step.'          },
  { n: '02', icon: '💎', title: 'Transparent Pricing',   text: 'No hidden charges. What you see is what you pay — detailed cost break-ups available on request.'                   },
  { n: '03', icon: '🔨', title: 'Premium Construction',  text: 'Grade-A materials, ISO-certified contractors, and rigorous QC at every stage of the build cycle.'                  },
  { n: '04', icon: '📅', title: 'On-Time Possession',    text: 'We have a proven track record of delivering projects within committed timelines without compromise.'                },
];

/* ─── Page component ─────────────────────────────────────────── */

export const ProjectDiscovery: React.FC = () => {
  const { setAppLoading, setCurrentProject } = useMapStore();
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // Start / restart the 4-second auto-advance timer
  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % projects.length);
    }, 4000);
  }, [stopTimer]);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  // Dot click: jump + reset timer (only if not paused)
  const handleSlideChange = useCallback((index: number) => {
    setActiveSlide(index);
    if (!isPaused) startTimer();
  }, [isPaused, startTimer]);

  const handlePrev = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + projects.length) % projects.length);
    if (!isPaused) startTimer();
  }, [isPaused, startTimer]);

  const handleNext = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % projects.length);
    if (!isPaused) startTimer();
  }, [isPaused, startTimer]);

  const handlePauseToggle = useCallback(() => {
    setIsPaused((prev) => {
      if (prev) { startTimer(); return false; }
      else       { stopTimer();  return true;  }
    });
  }, [startTimer, stopTimer]);

  const handleProjectSelect = (project: string) => {
    setAppLoading(true);
    setCurrentProject(project);
    setTimeout(() => {
      navigate('/project/' + encodeURIComponent(project));
    }, 300);
  };

  const active = projects[activeSlide];
  const info   = projectData[activeSlide];

  return (
    <div className="landing-page">
      <main className="landing-page__main">

        {/* ── 1. Cinematic Project Section (now at top, replaces carousel) ── */}
        <ProjectSection
          key={activeSlide}
          animKey={activeSlide}
          title={active.title}
          location={active.location}
          description={info.desc}
          price={info.price}
          backgroundImage={active.image}
          cards={info.cards}
          onCTAClick={() => handleProjectSelect(active.title)}
          onSlideChange={handleSlideChange}
          onPrev={handlePrev}
          onNext={handleNext}
          onPauseToggle={handlePauseToggle}
          isPaused={isPaused}
        />

        {/* ── 3. Amenities ─────────────────────────────────── */}
        <section className="landing-page__amenities">
          <div className="amenities__container" key={`a-${activeSlide}`}>
            <div className="amenities__header">
              <span className="amenities__eyebrow">Lifestyle</span>
              <h3 className="amenities__heading">Built for the way<br />you want to live.</h3>
              <p className="amenities__subheading">
                Every amenity is chosen deliberately — nothing is filler,
                everything is intentional.
              </p>
            </div>
            <div className="amenities__grid">
              {info.amenities.map((a) => (
                <div key={a.label} className="amenity__item">
                  <div className="amenity__icon-wrap">{a.icon}</div>
                  <span className="amenity__label">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Why Greenkrt ──────────────────────────────── */}
        <section className="landing-page__why">
          <div className="why__container">
            <div className="why__header">
              <div>
                <p className="why__eyebrow">Our Promise</p>
                <h3 className="why__heading">The standard<br />others aspire to.</h3>
              </div>
              <p className="why__intro">
                We don't just build homes — we build confidence. Every decision
                we make is backed by clarity, quality, and a commitment to doing
                right by the people who trust us.
              </p>
            </div>
            <div className="why__list">
              {whyPoints.map((w) => (
                <div key={w.n} className="why__item">
                  <div className="why__item-icon">{w.icon}</div>
                  <h4 className="why__item-title">{w.title}</h4>
                  <p className="why__item-text">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Footer ────────────────────────────────────── */}
        <footer className="landing-page__footer">
          <div className="footer__inner">
            <div className="footer__top">
              <div>
                <div className="footer__brand-name">Greenkrt</div>
                <div className="footer__brand-sub">Integrated Services Pvt. Ltd.</div>
                <p className="footer__tagline">
                  Premium residential and commercial real estate built on trust,
                  transparency, and timeless design.
                </p>
              </div>
              <div>
                <p className="footer__col-heading">Projects</p>
                <ul className="footer__links">
                  <li>Luxury Villas — Hyderabad</li>
                  <li>Green Estates — Bangalore</li>
                  <li>Skyline Residences — Mumbai</li>
                </ul>
              </div>
              <div>
                <p className="footer__col-heading">Contact</p>
                <ul className="footer__links">
                  <li>sales@greenkrt.in</li>
                  <li>+91 XXXXX XXXXX </li>
                  <li>RERA Registered Developer</li>
                </ul>
              </div>
            </div>
            <div className="footer__bottom">
              <span className="footer__copy">
                © {new Date().getFullYear()} Greenkrt Integrated Services Pvt. Ltd. All rights reserved.
              </span>
              <span className="footer__badge">RERA Approved</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
};
