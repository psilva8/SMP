'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    service: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will contact you soon.');
  };

  return (
    <>
      {/* Contact Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Get In Touch</h1>
              <p className="hero-subtitle">
                Ready to start your transformation? Contact us today for a consultation and discover how SMP can restore your confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact">
        <div className="container">
          <div className="section-header">
            <h2>Book Your Consultation</h2>
            <p>Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name*</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name*</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="service">Service Interest</label>
                  <select 
                    id="service" 
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '8px', 
                      fontSize: '16px' 
                    }}
                  >
                    <option value="">Select a service</option>
                    <option value="hairline">Hairline Restoration</option>
                    <option value="density">Density Enhancement</option>
                    <option value="scar">Scar Concealment</option>
                    <option value="complete">Complete Baldness Solution</option>
                    <option value="consultation">General Consultation</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your specific needs or questions..."
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Visit Our Clinic</h2>
              <p>Located in the heart of Los Angeles, our state-of-the-art clinic provides a comfortable and professional environment for your SMP treatment.</p>
              
              <div style={{ marginTop: '30px' }}>
                <h4>📍 Address</h4>
                <p>Los Angeles, CA<br />
                (Exact address provided upon booking)</p>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <h4>📞 Phone</h4>
                <p>(555) 123-4567</p>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <h4>📧 Email</h4>
                <p>info@smptreatment.com</p>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <h4>🕐 Hours</h4>
                <p>Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: By appointment only</p>
              </div>
            </div>
            
            <div className="about-text">
              <h2>What to Expect</h2>
              
              <h4>Free Consultation</h4>
              <p>Every client begins with a complimentary consultation where we assess your scalp, discuss your goals, and create a personalized treatment plan.</p>
              
              <h4>Professional Assessment</h4>
              <p>Our experts will examine your scalp condition, hair loss pattern, and skin tone to determine the best approach for natural-looking results.</p>
              
              <h4>Custom Treatment Plan</h4>
              <p>We&apos;ll design a treatment plan specifically for you, including the number of sessions needed and expected timeline for completion.</p>
              
              <h4>Transparent Pricing</h4>
              <p>No hidden costs or surprises. We&apos;ll provide clear pricing information and payment options during your consultation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="services">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Common questions about our SMP treatments and process.</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <h3>How long does SMP last?</h3>
              <p>SMP typically lasts 3-5 years before requiring a touch-up session. The longevity depends on various factors including skin type, lifestyle, and aftercare.</p>
            </div>
            
            <div className="service-card">
              <h3>Is SMP painful?</h3>
              <p>Most clients report minimal discomfort. We use topical numbing agents to ensure your comfort throughout the procedure.</p>
            </div>
            
            <div className="service-card">
              <h3>How many sessions are needed?</h3>
              <p>Most clients require 2-3 sessions spaced 7-14 days apart for optimal results. The exact number depends on your specific needs.</p>
            </div>
            
            <div className="service-card">
              <h3>What&apos;s the recovery time?</h3>
              <p>There&apos;s minimal downtime. You can return to normal activities immediately, with complete healing typically occurring within 7-10 days.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
