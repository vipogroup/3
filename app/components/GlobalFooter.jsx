'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalFooter() {
  const pathname = usePathname();
  
  // Check if we should hide the footer
  const isAdminPage = pathname?.startsWith('/admin');
  const isHomePage = pathname === '/';
  const shouldHide = isAdminPage || isHomePage;

  // Load homepage styles for footer
  useEffect(() => {
    if (shouldHide) return;
    
    // Check if style is already loaded
    const existingLink = document.querySelector('link[href="/home/css/style.css"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/home/css/style.css';
      document.head.appendChild(link);
    }
  }, [shouldHide]);
  
  // Don't render on admin or homepage
  if (shouldHide) {
    return null;
  }

  return (
    <>
      {/* About VIPO Section */}
      <section id="about-vipo" className="about-vipo">
        <div className="container">
          <h2 className="section-title">מי אנחנו</h2>
          <div className="about-content">
            <p className="about-intro">
              VIPO Group מובילה את תחום הרכישה הקבוצתית בישראל מאז 2018. אנו מחברים בין אלפי
              לקוחות פרטיים ועסקיים לספקים איכותיים בארץ ובעולם, מקצרים תהליכים ומוזילים עלויות בצורה חכמה,
              שקופה ומהירה – עד שהמוצר מגיע אליכם הביתה.
            </p>

            <div className="about-stats">
              <div className="stat-item">
                <i className="fa-solid fa-user-check"></i>
                <div>
                  <span className="stat-number">+9,500</span>
                  <span className="stat-label">לקוחות מרוצים</span>
                </div>
              </div>
              <div className="stat-item">
                <i className="fa-solid fa-calendar"></i>
                <div>
                  <span className="stat-number">2018</span>
                  <span className="stat-label">שנת הקמה</span>
                </div>
              </div>
              <div className="stat-item">
                <i className="fa-solid fa-globe"></i>
                <div>
                  <span className="stat-number">ישראל + סין</span>
                  <span className="stat-label">נוכחות בינלאומית</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradientGlobal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor:'#1e3a8a', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#0891b2', stopOpacity:1}} />
              </linearGradient>
            </defs>
            <path d="M0,0 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,120 L0,120 Z" fill="url(#waveGradientGlobal)"></path>
          </svg>
        </div>
      </section>

      {/* Footer & Contact Section */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand-section">
              <h2 className="footer-brand">קונים חכם</h2>
              <p className="footer-tagline">רכישה קבוצתית חכמה וחסכונית</p>
            </div>
            
            <div className="footer-contact-grid">
              <a href="tel:+972587009938" className="footer-contact-item">
                <i className="fa-solid fa-phone"></i>
                <span>058-700-9938</span>
              </a>
              <a href="mailto:vipo.m1985@gmail.com" className="footer-contact-item">
                <i className="fa-solid fa-envelope"></i>
                <span>vipo.m1985@gmail.com</span>
              </a>
              <div className="footer-contact-item">
                <i className="fa-solid fa-map-marker-alt"></i>
                <span>ז&apos;בוטינסקי 5, באר יעקב</span>
              </div>
            </div>
            
            <div className="footer-social">
              <a href="#" aria-label="פייסבוק"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="https://www.instagram.com/vipoconnect?igsh=MWdpdTZlbTMxMnNxcw%3D%3D&utm_source=qr" target="_blank" aria-label="אינסטגרם"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="טוויטר"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" aria-label="לינקדאין"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 קונים חכם | ע.מ. 036517548</p>
            <div className="footer-links">
              <a href="/terms">תנאי שימוש</a>
              <a href="/privacy">מדיניות פרטיות</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
