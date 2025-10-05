import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <p>Professional scalp micropigmentation services for natural hair restoration results.</p>
          </div>
          
          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><Link href="/services">Hairline Restoration</Link></li>
              <li><Link href="/services">Density Enhancement</Link></li>
              <li><Link href="/services">Scar Concealment</Link></li>
              <li><Link href="/services">Complete Solutions</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Get Started</h4>
            <p>Ready to transform your look?</p>
            <p><Link href="/contact">Schedule a consultation</Link></p>
            <p>📍 Los Angeles, CA</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 SMP Treatment. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
