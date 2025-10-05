import Image from "next/image";

export default function Services() {
  return (
    <>
      {/* Services Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Professional SMP Services</h1>
              <p className="hero-subtitle">
                Discover our comprehensive range of scalp micropigmentation treatments designed to restore your confidence and natural appearance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Expert Services</h2>
            <p>Professional scalp micropigmentation solutions tailored to your specific needs.</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <Image 
                  src="/img/hairline restoration.jpg" 
                  alt="Hairline Restoration SMP Treatment" 
                  width={80} 
                  height={80}
                />
              </div>
              <h3>Hairline Restoration</h3>
              <p>Restore your natural hairline with precision micropigmentation techniques. Our experts create realistic, age-appropriate hairlines that frame your face perfectly.</p>
              
              <h4>Key Benefits:</h4>
              <ul className="features-list">
                <li>Natural-looking hairline design</li>
                <li>Gradual density transition</li>
                <li>Age-appropriate styling</li>
                <li>Long-lasting results</li>
                <li>Minimal maintenance required</li>
              </ul>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <Image 
                  src="/img/Density Enhancement.jpg" 
                  alt="Hair Density Enhancement SMP Treatment" 
                  width={80} 
                  height={80}
                />
              </div>
              <h3>Density Enhancement</h3>
              <p>Add fullness and volume to thinning areas. Perfect for those experiencing early-stage hair loss or wanting to enhance existing hair density.</p>
              
              <h4>Key Benefits:</h4>
              <ul className="features-list">
                <li>Crown area enhancement</li>
                <li>Temple point restoration</li>
                <li>Overall scalp density improvement</li>
                <li>Color matching expertise</li>
                <li>Seamless integration with existing hair</li>
              </ul>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <Image 
                  src="/img/scarp concealment.jpg" 
                  alt="Scar Concealment SMP Treatment" 
                  width={80} 
                  height={80}
                />
              </div>
              <h3>Scar Concealment</h3>
              <p>Expert camouflage for surgical scars, injury marks, and hair transplant scars. Our specialized techniques blend scars seamlessly with surrounding areas.</p>
              
              <h4>Key Benefits:</h4>
              <ul className="features-list">
                <li>FUT scar coverage</li>
                <li>Accident scar treatment</li>
                <li>Surgical scar blending</li>
                <li>Texture matching</li>
                <li>Complete scar camouflage</li>
              </ul>
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
              <p>Transform complete baldness with our comprehensive SMP treatment. Create the appearance of a full head of freshly shaved hair with natural-looking results.</p>
              
              <h4>Key Benefits:</h4>
              <ul className="features-list">
                <li>Full scalp coverage</li>
                <li>Natural stubble effect</li>
                <li>3D hair follicle simulation</li>
                <li>Maintenance planning</li>
                <li>Confidence restoration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="about">
        <div className="container">
          <div className="section-header">
            <h2>Our Process</h2>
            <p>From consultation to completion, we ensure every step delivers exceptional results.</p>
          </div>
          
          <div className="about-content">
            <div className="about-text">
              <h3>1. Consultation</h3>
              <p>We begin with a comprehensive consultation to understand your goals, assess your scalp condition, and design a customized treatment plan.</p>
              
              <h3>2. Design & Planning</h3>
              <p>Our experts create a detailed hairline design and treatment strategy tailored specifically to your facial structure and preferences.</p>
              
              <h3>3. Treatment Sessions</h3>
              <p>Typically requiring 2-3 sessions, each treatment is performed with precision using state-of-the-art equipment and hypoallergenic pigments.</p>
              
              <h3>4. Follow-up & Care</h3>
              <p>We provide comprehensive aftercare instructions and follow-up appointments to ensure perfect healing and optimal results.</p>
            </div>
            
            <div className="about-image">
              <Image 
                src="/img/smp expert.jpg" 
                alt="SMP Process"
                width={400} 
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Contact us today for a consultation and discover how SMP can transform your appearance.</p>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <a href="/contact" className="cta-button">Book Consultation</a>
          </div>
        </div>
      </section>
    </>
  );
}
