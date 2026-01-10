'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSiteTexts } from '@/lib/useSiteTexts';

export default function GlobalFooter() {
  const { getText } = useSiteTexts();
  const pathname = usePathname();
  
  // Check if we should hide the footer
  const isAdminPage = pathname?.startsWith('/admin');
  const isHomePage = pathname === '/';
  const isRegisterBusinessPage = pathname === '/register-business';
  const shouldHide = isAdminPage || isHomePage || isRegisterBusinessPage;

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
          <h2 className="section-title" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{getText('HOME_ABOUT_TITLE', 'מי אנחנו')}</h2>
          <div className="about-content">
            <p className="about-intro">
              {getText('HOME_ABOUT_TEXT', 'VIPO Group מובילה את תחום הרכישה הקבוצתית בישראל מאז 2018. אנו מחברים בין אלפי לקוחות פרטיים ועסקיים לספקים איכותיים בארץ ובעולם, מקצרים תהליכים ומוזילים עלויות בצורה חכמה, שקופה ומהירה – עד שהמוצר מגיע אליכם הביתה.')}
            </p>

            <div className="about-stats" style={{maxWidth: '450px', gap: '10px', marginBottom: '20px'}}>
              <div className="stat-item" style={{padding: '8px 6px', borderRadius: '8px'}}>
                <i className="fa-solid fa-user-check" style={{fontSize: '1rem'}}></i>
                <div>
                  <span className="stat-number" style={{fontSize: '0.8rem'}}>{getText('HOME_ABOUT_STAT_1', '+9,500')}</span>
                  <span className="stat-label" style={{fontSize: '0.65rem'}}>{getText('HOME_ABOUT_STAT_1_LABEL', 'לקוחות מרוצים')}</span>
                </div>
              </div>
              <div className="stat-item" style={{padding: '8px 6px', borderRadius: '8px'}}>
                <i className="fa-solid fa-calendar" style={{fontSize: '1rem'}}></i>
                <div>
                  <span className="stat-number" style={{fontSize: '0.8rem'}}>{getText('HOME_ABOUT_STAT_2', '2018')}</span>
                  <span className="stat-label" style={{fontSize: '0.65rem'}}>{getText('HOME_ABOUT_STAT_2_LABEL', 'שנת הקמה')}</span>
                </div>
              </div>
              <div className="stat-item" style={{padding: '8px 6px', borderRadius: '8px'}}>
                <i className="fa-solid fa-globe" style={{fontSize: '1rem'}}></i>
                <div>
                  <span className="stat-number" style={{whiteSpace: 'nowrap', fontSize: '0.8rem'}}>{getText('HOME_ABOUT_STAT_3', 'ישראל + סין')}</span>
                  <span className="stat-label" style={{fontSize: '0.65rem'}}>{getText('HOME_ABOUT_STAT_3_LABEL', 'נוכחות בינלאומית')}</span>
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
          <div className="footer-brand-section" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h2 className="footer-brand">{getText('FOOTER_COMPANY_NAME', 'VIPO GROUP')}</h2>
            <p className="footer-tagline">{getText('FOOTER_TAGLINE', 'רכישה קבוצתית חכמה וחסכונית')}</p>
          </div>
          
          <div className="footer-main" style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px'}}>
            {/* יצירת קשר - ימין */}
            <div className="footer-contact" style={{flex: '1', minWidth: '200px'}}>
              <h3 style={{color: 'white', fontSize: '1.1rem', marginBottom: '15px', fontWeight: '700'}}>יצירת קשר</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div className="footer-contact-item">
                  <i className="fa-solid fa-phone"></i>
                  <span>{getText('FOOTER_PHONE', '058-700-9938')}</span>
                </div>
                <div className="footer-contact-item">
                  <i className="fa-solid fa-envelope"></i>
                  <span>{getText('FOOTER_EMAIL', 'vipo.m1985@gmail.com')}</span>
                </div>
                <div className="footer-contact-item">
                  <i className="fa-solid fa-map-marker-alt"></i>
                  <span>{getText('FOOTER_ADDRESS', "ז'בוטינסקי 5, באר יעקב")}</span>
                </div>
                <div className="footer-contact-item">
                  <i className="fa-solid fa-clock"></i>
                  <span>{getText('FOOTER_HOURS', 'א׳-ה׳ 09:00-18:00')}</span>
                </div>
              </div>
            </div>
            
            {/* קישורי ניווט - שמאל */}
            <div className="footer-nav" style={{flex: '1', minWidth: '200px'}}>
              <h3 style={{color: 'white', fontSize: '1.1rem', marginBottom: '15px', fontWeight: '700'}}>ניווט מהיר</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <a href="/" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-home"></i> דף הבית</a>
                <a href="/shop" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-store"></i> חנות</a>
                <a href="/#how-it-works" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-cogs"></i> איך זה עובד</a>
                <a href="/#faq" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-question-circle"></i> שאלות נפוצות</a>
                <a href="/#about-vipo" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-users"></i> מי אנחנו</a>
              </div>
            </div>
          </div>
          
          <div className="footer-social" style={{textAlign: 'center', margin: '30px 0'}}>
            <a href="#" aria-label="פייסבוק"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/vipoconnect?igsh=MWdpdTZlbTMxMnNxcw%3D%3D&utm_source=qr" target="_blank" aria-label="אינסטגרם"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="טוויטר"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" aria-label="לינקדאין"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          
          <div className="footer-bottom">
            <p>{getText('FOOTER_COPYRIGHT', '© 2025 VIPO GROUP | ע.מ. 036517548')}</p>
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
