import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Get Full SMP Service<br />By Just Paying for the Materials per Session</h1>
              <p className="hero-subtitle">
                Join hundreds who&apos;ve restored their confidence with natural-looking hair restoration. 
                FOR LIMITED TIME GET THE SERVICE FREE AND PAY ONLY FOR MATERIALS PER SESSION.
              </p>
              
              <div className="stats">
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Successful Treatments</span>
                </div>
                <div className="stat">
                  <span className="stat-number">⭐ 5.0</span>
                  <span className="stat-label">Client Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-number">🏆</span>
                  <span className="stat-label">Award Winner 2024</span>
                </div>
              </div>
            </div>
            
            <div className="form-container">
              <div className="form-header">
                <h2>Limited Time Offer</h2>
                <p><strong>Pay Only for Materials</strong> per Session</p>
              </div>
              
              <form>
                <div className="form-group">
                  <label htmlFor="firstName">First name</label>
                  <input type="text" id="firstName" name="firstName" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last name</label>
                  <input type="text" id="lastName" name="lastName" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input type="email" id="email" name="email" required />
                </div>
                
                <button type="submit" className="submit-btn">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <h2>Your complete hair restoration solution. One professional clinic.</h2>
            <p>Everything you need to restore your hairline and confidence, all in one place.</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <Image 
                  src="/img/hairline restoration.jpg" 
                  alt="Hairline Restoration SMP" 
                  width={80} 
                  height={80}
                />
              </div>
              <h3>Hairline Restoration</h3>
              <p>Create a natural-looking hairline that frames your face perfectly. Our precision techniques ensure realistic hair follicle replication.</p>
              
              <h4>Popular Features:</h4>
              <ul className="features-list">
                <li>Natural hairline design</li>
                <li>Gradual density transition</li>
                <li>Age-appropriate styling</li>
                <li>Scar tissue coverage</li>
              </ul>
              
              <a href="/services" className="learn-more-btn">Learn More</a>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <Image 
                  src="/img/Density Enhancement.jpg" 
                  alt="Hair Density Enhancement SMP" 
                  width={80} 
                  height={80}
                />
              </div>
              <h3>Density Enhancement</h3>
              <p>Add fullness to thinning areas and create the appearance of thicker, denser hair coverage throughout your scalp.</p>
              
              <h4>Popular Features:</h4>
              <ul className="features-list">
                <li>Crown area enhancement</li>
                <li>Temple point restoration</li>
                <li>Overall scalp density</li>
                <li>Color matching expertise</li>
              </ul>
              
              <a href="/services" className="learn-more-btn">Learn More</a>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <Image 
                  src="/img/scarp concealment.jpg" 
                  alt="Scar Concealment SMP" 
                  width={80} 
                  height={80}
                />
              </div>
              <h3>Scar Concealment</h3>
              <p>Expertly camouflage surgical scars, injury marks, and transplant scars with precision micropigmentation techniques.</p>
              
              <h4>Popular Features:</h4>
              <ul className="features-list">
                <li>FUT scar coverage</li>
                <li>Accident scar treatment</li>
                <li>Surgical scar blending</li>
                <li>Texture matching</li>
              </ul>
              
              <a href="/services" className="learn-more-btn">Learn More</a>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <Image 
                  src="/img/smp for boldness.jpg" 
                  alt="Complete Baldness SMP Treatment" 
                  width={80} 
                  height={80}
                />
              </div>
              <h3>Complete Baldness Solution</h3>
              <p>Transform complete baldness with our comprehensive SMP treatment that creates the appearance of a full head of freshly shaved hair.</p>
              
              <h4>Popular Features:</h4>
              <ul className="features-list">
                <li>Full scalp coverage</li>
                <li>Natural stubble effect</li>
                <li>3D hair follicle simulation</li>
                <li>Maintenance planning</li>
              </ul>
              
              <a href="/services" className="learn-more-btn">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery" id="gallery">
        <div className="container">
          <div className="section-header">
            <h2>Transformative Results</h2>
            <p>See the incredible before and after transformations from our expert SMP treatments.</p>
          </div>
          
          <div className="gallery-grid">
            <div className="gallery-item">
              <Image 
                src="/img/smp before and after.JPG" 
                alt="SMP Before and After Treatment" 
                width={350} 
                height={250}
              />
            </div>
            <div className="gallery-item">
              <Image 
                src="/img/before and after smp.webp" 
                alt="SMP Before and After Treatment" 
                width={350} 
                height={250}
              />
            </div>
            <div className="gallery-item">
              <Image 
                src="/img/hair density smp.jpeg" 
                alt="Hair Density SMP Treatment" 
                width={350} 
                height={250}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Expert SMP Artists with 10+ Years Experience</h2>
              <p>Our team of certified scalp micropigmentation specialists combines artistic talent with medical precision to deliver natural-looking results that exceed expectations.</p>
              
              <ul className="about-features">
                <li>Certified SMP specialists</li>
                <li>State-of-the-art equipment</li>
                <li>Hypoallergenic pigments</li>
                <li>Lifetime support guarantee</li>
              </ul>
              
              <a href="/about" className="cta-button">Meet Our Team</a>
            </div>
            
            <div className="about-image">
              <Image 
                src="/img/smp expert.jpg" 
                alt="SMP Expert"
                width={400} 
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <h2>Get In Touch</h2>
          <p>Ready to start your transformation? We&apos;re here to help with any questions.</p>
        </div>
      </section>
    </>
  );
}