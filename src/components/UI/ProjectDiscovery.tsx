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
  { n: '01', title: 'RERA Approved',         text: 'All our projects are fully RERA registered, ensuring legal compliance and buyer protection at every step.'          },
  { n: '02', title: 'Transparent Pricing',   text: 'No hidden charges. What you see is what you pay — detailed cost break-ups available on request.'                   },
  { n: '03', title: 'Premium Construction',  text: 'Grade-A materials, ISO-certified contractors, and rigorous QC at every stage of the build cycle.'                  },
  { n: '04', title: 'On-Time Possession',    text: 'We have a proven track record of delivering projects within committed timelines without compromise.'                },
];

/* ─── Page component ─────────────────────────────────────────── */

export const ProjectDiscovery: React.FC = () => {
  const { setAppLoading, setCurrentProject } = useMapStore();
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start / restart the 4-second auto-advance timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % projects.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  // When user clicks a dot, jump to that slide AND reset the timer
  const handleSlideChange = useCallback((index: number) => {
    setActiveSlide(index);
    startTimer();
  }, [startTimer]);

  const handleProjectSelect = (project: string) => {
    setAppLoading(true);
    setCurrentProject(project);
    setTimeout(() => {
      navigate('/project/' + encodeURIComponent(project));
    }, 300);
  };

  const active    = projects[activeSlide];
  const info      = projectData[activeSlide];

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
        />

        {/* ── 3. Amenities Strip ─────────────────────────────── */}
        <section className="landing-page__amenities">
          <div
            className="amenities__container"
            key={`a-${activeSlide}`}
            style={{ animation: 'softlyFadeIn 0.65s cubic-bezier(0.16,1,0.3,1) both' }}
          >
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

        {/* ── 4. Why Greenkrt ────────────────────────────────── */}
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

        {/* ── 5. Footer ──────────────────────────────────────── */}
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
