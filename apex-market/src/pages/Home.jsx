// import React from 'react';
import { useNavigate } from 'react-router-dom';

// Swiper React Components & Modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  Headphones,
  Award,
} from 'lucide-react';

import './Home.css';

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'Pro Performance Edition',
    title: 'Elite Athletic Apparel',
    description: 'Gear up with official match kits and high-performance sportswear engineered with dynamic moisture-wicking weave technology.',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 2,
    tag: 'Modern Living Innovations',
    title: 'Smart Home & Appliances',
    description: 'Transform your daily routine with high-end automated kitchen systems, precision espresso brewers, and minimalist smart home devices.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 3,
    tag: 'Flagship Innovations',
    title: 'Next-Gen Cyber Hardware',
    description: 'Experience luminous OLED displays, pro-grade computational optics, and high-performance desktop processing units.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 4,
    tag: 'Connectivity & Mobility',
    title: 'Apex Smartphone Ultra 5G',
    description: 'Discover cutting-edge mobile devices engineered with pro computational cameras and ultra-fast next-gen processors.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80',
  },
];

const CATEGORY_SPOTLIGHTS = [
  {
    title: 'Sportswear & Kits',
    subtitle: 'Match-Day Excellence',
    desc: 'Official club jerseys and breathable training wear built for peak physical exertion.',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
    path: '/sportswear',
  },
  {
    title: 'Electronics & Gear',
    subtitle: 'Cyber Hardware',
    desc: 'Cutting-edge mechanical peripherals, high-res audio systems, and immersive displays.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    path: '/electronics',
  },
  {
    title: 'Home Appliances',
    subtitle: 'Automated Living',
    desc: 'Precision coffee makers, smart kitchen gadgets, and minimalist modern home automation.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    path: '/appliances',
  },
  {
    title: 'Mobile Tech',
    subtitle: 'Next-Gen Portables',
    desc: 'Flagship 5G smartphones, foldable innovations, and high-performance mobile devices.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    path: '/mobiles',
  },
];

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="editorial-apex-wrapper">

      {/* Refined Ambient Background Lighting */}
      <div className="editorial-ambient ambient-champagne" />
      <div className="editorial-ambient ambient-stone" />

      {/* Hero Swiper Section */}
      <section className="editorial-hero-section">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          speed={900}
          loop={true}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="editorial-hero-swiper"
        >
          {HERO_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="editorial-slide-container">
                <div
                  className="editorial-slide-bg"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="editorial-slide-backdrop" />

                <div className="editorial-hero-content">
                  <div className="editorial-tag">
                    <Sparkles size={14} className="sparkle-icon" />
                    <span>{slide.tag}</span>
                  </div>

                  <h1 className="editorial-hero-title">{slide.title}</h1>
                  <p className="editorial-hero-desc">{slide.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Feature Value Props Grid / Site Introduction */}
      <section className="editorial-section">
        <div className="editorial-features-grid">
          <div className="editorial-card feature-card">
            <div className="editorial-card-icon">
              <Truck size={22} />
            </div>
            <h3>Global Express</h3>
            <p>Priority international logistics with end-to-end telemetry on orders over $150.</p>
          </div>

          <div className="editorial-card feature-card">
            <div className="editorial-card-icon">
              <ShieldCheck size={22} />
            </div>
            <h3>Verified Authentic</h3>
            <p>Cryptographically verified inventory from authorized brand manufacturers.</p>
          </div>

          <div className="editorial-card feature-card">
            <div className="editorial-card-icon">
              <Headphones size={22} />
            </div>
            <h3>24/7 VIP Concierge</h3>
            <p>Direct priority line to specialized product and technical assistance advisors.</p>
          </div>

          <div className="editorial-card feature-card">
            <div className="editorial-card-icon">
              <Award size={22} />
            </div>
            <h3>Elite Guarantee</h3>
            <p>Industry-leading multi-year extended warranty coverage across all electronics.</p>
          </div>
        </div>
      </section>

      {/* Immersive Category Spotlights Section */}
      <section className="editorial-section category-spotlight-section">
        <div className="editorial-section-header">
          <div>
            <span className="editorial-section-tag">CURATED ECOSYSTEMS</span>
            <h2 className="editorial-section-title">Explore by Category</h2>
          </div>
        </div>

        <div className="category-grid">
          {CATEGORY_SPOTLIGHTS.map((cat, index) => (
            <div 
              key={index}
              onClick={() => navigate(cat.path)}
              className="category-card"
            >
              {/* Background Image with Overlay */}
              <div 
                className="category-card-bg"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="category-card-backdrop" />

              {/* Content Layer */}
              <div className="category-card-content">
                <div>
                  <span className="category-card-subtitle">{cat.subtitle}</span>
                  <h3 className="category-card-title">{cat.title}</h3>
                  <p className="category-card-desc">{cat.desc}</p>
                </div>
                <div className="category-card-footer">
                  <span className="category-browse-link">
                    Browse <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;