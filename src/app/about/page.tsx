import Image from "next/image";

export default function About() {
  return (
    <>
      {/* About Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Expert SMP Artists</h1>
              <p className="hero-subtitle">
                Meet our team of certified scalp micropigmentation specialists with over 10 years of combined experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>10+ Years of Excellence</h2>
              <p>Our team of certified scalp micropigmentation specialists combines artistic talent with medical precision to deliver natural-looking results that exceed expectations.</p>
              
              <p>We pride ourselves on staying at the forefront of SMP technology and techniques, ensuring every client receives the highest quality treatment available.</p>
              
              <ul className="about-features">
                <li>Certified SMP specialists</li>
                <li>State-of-the-art equipment</li>
                <li>Hypoallergenic pigments</li>
                <li>Lifetime support guarantee</li>
                <li>500+ successful treatments</li>
                <li>Award-winning results</li>
              </ul>
            </div>
            
            <div className="about-image">
              <Image 
                src="/img/smp expert.jpg" 
                alt="SMP Expert Team"
                width={400} 
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <p>What drives us to deliver exceptional scalp micropigmentation results.</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <h3>Precision</h3>
              <p>Every dot is placed with meticulous attention to detail, ensuring natural-looking results that stand the test of time.</p>
            </div>
            
            <div className="service-card">
              <h3>Artistry</h3>
              <p>Our artists understand facial structure and hair growth patterns to create believable, aesthetically pleasing results.</p>
            </div>
            
            <div className="service-card">
              <h3>Innovation</h3>
              <p>We continuously invest in the latest techniques and equipment to provide cutting-edge SMP treatments.</p>
            </div>
            
            <div className="service-card">
              <h3>Care</h3>
              <p>From consultation to aftercare, we provide comprehensive support throughout your SMP journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact">
        <div className="container">
          <h2>Ready to Meet Our Team?</h2>
          <p>Schedule a consultation to discuss your SMP goals with our expert artists.</p>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <a href="/contact" className="cta-button">Book Consultation</a>
          </div>
        </div>
      </section>
    </>
  );
}
