'use client';

import Image from "next/image";
import { useState } from "react";

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterImages = (category: string) => {
    setActiveFilter(category);
  };

  return (
    <>
      {/* Gallery Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Transformative Results</h1>
              <p className="hero-subtitle">
                Explore our gallery of successful SMP treatments and see the incredible transformations we&apos;ve achieved for our clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery">
        <div className="container">
          <div className="section-header">
            <h2>Before & After Gallery</h2>
            <p>Real results from real clients. See the life-changing transformations.</p>
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => filterImages('all')}
            >
              All Results
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'hairline' ? 'active' : ''}`}
              onClick={() => filterImages('hairline')}
            >
              Hairline Restoration
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'density' ? 'active' : ''}`}
              onClick={() => filterImages('density')}
            >
              Density Enhancement
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'scar' ? 'active' : ''}`}
              onClick={() => filterImages('scar')}
            >
              Scar Concealment
            </button>
          </div>
          
          <div className="gallery-grid">
            <div className={`gallery-item ${activeFilter !== 'all' && activeFilter !== 'before-after' ? 'hidden' : ''}`}>
              <Image 
                src="/img/smp before and after.JPG" 
                alt="SMP Before and After Treatment" 
                width={350} 
                height={250}
              />
            </div>
            <div className={`gallery-item ${activeFilter !== 'all' && activeFilter !== 'before-after' ? 'hidden' : ''}`}>
              <Image 
                src="/img/before and after smp.webp" 
                alt="SMP Before and After Treatment" 
                width={350} 
                height={250}
              />
            </div>
            <div className={`gallery-item ${activeFilter !== 'all' && activeFilter !== 'density' ? 'hidden' : ''}`}>
              <Image 
                src="/img/hair density smp.jpeg" 
                alt="Hair Density SMP Treatment" 
                width={350} 
                height={250}
              />
            </div>
            <div className={`gallery-item ${activeFilter !== 'all' && activeFilter !== 'hairline' ? 'hidden' : ''}`}>
              <Image 
                src="/img/hair-tattoo-los-angeles.png" 
                alt="Professional SMP Treatment" 
                width={350} 
                height={250}
              />
            </div>
            <div className={`gallery-item ${activeFilter !== 'all' && activeFilter !== 'hairline' ? 'hidden' : ''}`}>
              <Image 
                src="/img/hairline restoration.jpg" 
                alt="Hairline Restoration SMP Treatment" 
                width={350} 
                height={250}
              />
            </div>
            <div className={`gallery-item ${activeFilter !== 'all' && activeFilter !== 'scar' ? 'hidden' : ''}`}>
              <Image 
                src="/img/scarp concealment.jpg" 
                alt="Scar Concealment SMP Treatment" 
                width={350} 
                height={250}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="about">
        <div className="container">
          <div className="section-header">
            <h2>Client Success Stories</h2>
            <p>Hear from our satisfied clients about their SMP experience.</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <p>&quot;The results exceeded my expectations. The team was professional and the process was comfortable. I finally have my confidence back!&quot;</p>
              <h4>- Mike R.</h4>
            </div>
            
            <div className="service-card">
              <p>&quot;Amazing work! The hairline looks so natural, nobody can tell it&apos;s SMP. Worth every penny.&quot;</p>
              <h4>- David L.</h4>
            </div>
            
            <div className="service-card">
              <p>&quot;Professional service from start to finish. The scar from my hair transplant is completely invisible now.&quot;</p>
              <h4>- James K.</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact">
        <div className="container">
          <h2>Ready for Your Transformation?</h2>
          <p>Join hundreds of satisfied clients who have restored their confidence with our expert SMP treatments.</p>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </section>
    </>
  );
}
