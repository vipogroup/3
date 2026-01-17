'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSiteTexts } from '@/lib/useSiteTexts';
import EditableTextField from './EditableTextField';

export default function GlobalFooter() {
  const { getText } = useSiteTexts();
  const pathname = usePathname();
  const [footerExpanded, setFooterExpanded] = useState(false);
  const footerMainRef = useRef(null);
  const scrollArrowRef = useRef(null);

  // Handle arrow click - expand footer and scroll to it
  const handleExpandFooter = () => {
    setFooterExpanded(true);
    // Smooth scroll to footer main section
    setTimeout(() => {
      if (footerMainRef.current) {
        footerMainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  
  // Check pages where footer should NOT appear
  const isAdminPage = pathname?.startsWith('/admin');
  const isHomePage = pathname === '/';
  const isRegisterBusinessPage = pathname === '/register-business';
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';
  
  const shouldHide = isAdminPage || isHomePage || isRegisterBusinessPage || isLoginPage || isRegisterPage;
  
  // Don't render on excluded pages
  if (shouldHide) {
    return null;
  }

  return (
    <>
      {/* About VIPO Section - hidden on mobile when footer is collapsed */}
      <section 
        id="about-vipo" 
        className="about-vipo"
        style={{
          display: !footerExpanded ? 'none' : undefined,
        }}
      >
        <div className="container">
          <EditableTextField textKey="HOME_ABOUT_TITLE" fallback="מי אנחנו" as="h2" className="section-title" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
          <div className="about-content">
            <EditableTextField textKey="HOME_ABOUT_TEXT" fallback="VIPO Group מובילה את תחום הרכישה הקבוצתית בישראל מאז 2018. אנו מחברים בין אלפי לקוחות פרטיים ועסקיים לספקים איכותיים בארץ ובעולם, מקצרים תהליכים ומוזילים עלויות בצורה חכמה, שקופה ומהירה – עד שהמוצר מגיע אליכם הביתה." as="p" className="about-intro" multiline />

            <div className="about-stats" style={{maxWidth: '450px', gap: '10px', marginBottom: '20px'}}>
              <div className="stat-item" style={{padding: '8px 6px', borderRadius: '8px'}}>
                <i className="fa-solid fa-user-check" style={{fontSize: '1rem'}}></i>
                <div>
                  <EditableTextField textKey="HOME_ABOUT_STAT_1" fallback="+9,500" as="span" className="stat-number" style={{fontSize: '0.8rem'}} />
                  <EditableTextField textKey="HOME_ABOUT_STAT_1_LABEL" fallback="לקוחות מרוצים" as="span" className="stat-label" style={{fontSize: '0.65rem'}} />
                </div>
              </div>
              <div className="stat-item" style={{padding: '8px 6px', borderRadius: '8px'}}>
                <i className="fa-solid fa-calendar" style={{fontSize: '1rem'}}></i>
                <div>
                  <EditableTextField textKey="HOME_ABOUT_STAT_2" fallback="2018" as="span" className="stat-number" style={{fontSize: '0.8rem'}} />
                  <EditableTextField textKey="HOME_ABOUT_STAT_2_LABEL" fallback="שנת הקמה" as="span" className="stat-label" style={{fontSize: '0.65rem'}} />
                </div>
              </div>
              <div className="stat-item" style={{padding: '8px 6px', borderRadius: '8px'}}>
                <i className="fa-solid fa-globe" style={{fontSize: '1rem'}}></i>
                <div>
                  <EditableTextField textKey="HOME_ABOUT_STAT_3" fallback="ישראל + סין" as="span" className="stat-number" style={{whiteSpace: 'nowrap', fontSize: '0.8rem'}} />
                  <EditableTextField textKey="HOME_ABOUT_STAT_3_LABEL" fallback="נוכחות בינלאומית" as="span" className="stat-label" style={{fontSize: '0.65rem'}} />
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

      {/* Dynamic styles for collapsed footer */}
      <style jsx global>{`
        .footer-collapsed {
          padding-bottom: 0 !important;
          padding-top: 15px !important;
        }
        .footer-collapsed .container {
          padding-bottom: 0 !important;
        }
        .footer-collapsed .footer-brand-section {
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
        .footer-collapsed .footer-brand {
          margin-bottom: 5px !important;
        }
        .footer-collapsed .footer-tagline {
          margin-bottom: 8px !important;
        }
        
        /* Mobile specific - minimize space between chatbot icon and footer */
        @media (max-width: 768px) {
          /* Hide about-vipo section on mobile when footer is collapsed */
          .about-vipo {
            padding-top: 10px !important;
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
          }
          .about-vipo .container {
            padding: 5px 10px !important;
          }
          .about-vipo .section-title {
            margin-bottom: 5px !important;
            font-size: 1.1rem !important;
          }
          .about-vipo .about-intro {
            font-size: 0.75rem !important;
            margin-bottom: 5px !important;
            line-height: 1.3 !important;
          }
          .about-vipo .about-content {
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
          }
          .about-vipo .about-stats {
            margin-bottom: 5px !important;
            gap: 5px !important;
          }
          .about-vipo .stat-item {
            padding: 4px 3px !important;
          }
          .about-vipo .stat-number {
            font-size: 0.7rem !important;
          }
          .about-vipo .stat-label {
            font-size: 0.55rem !important;
          }
          .wave-divider {
            height: 15px !important;
            margin: 0 !important;
          }
          .wave-divider svg {
            height: 15px !important;
          }
          
          .footer-collapsed {
            padding-top: 3px !important;
            padding-bottom: 0 !important;
          }
          .footer-collapsed .container {
            padding: 0 10px !important;
          }
          .footer-collapsed .footer-brand {
            margin-bottom: 0 !important;
            font-size: 1.3rem !important;
          }
          .footer-collapsed .footer-tagline {
            margin-bottom: 3px !important;
            font-size: 0.75rem !important;
          }
          .footer-collapsed .footer-scroll-arrow {
            margin-top: 3px !important;
            margin-bottom: 0 !important;
            width: 36px !important;
            height: 36px !important;
          }
        }
      `}</style>

      {/* Footer & Contact Section */}
      <footer 
        id="contact" 
        className={`footer ${!footerExpanded ? 'footer-collapsed' : ''}`}
      >
        <div className="container">
          <div className="footer-brand-section" style={{textAlign: 'center'}}>
            <EditableTextField textKey="FOOTER_COMPANY_NAME" fallback="VIPO GROUP" as="h2" className="footer-brand" />
            <EditableTextField textKey="FOOTER_TAGLINE" fallback="רכישה קבוצתית חכמה וחסכונית" as="p" className="footer-tagline" />
            
            {/* Scroll Down Arrow - appears only when footer is not expanded */}
            {!footerExpanded && (
              <button
                ref={scrollArrowRef}
                onClick={handleExpandFooter}
                className="footer-scroll-arrow"
                aria-label="גלול למטה לפרטי קשר"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '10px auto 0',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                  border: 'none',
                  cursor: 'pointer',
                  animation: 'bounce 2s infinite',
                  boxShadow: '0 4px 15px rgba(8, 145, 178, 0.4)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  fill="white" 
                  width="28" 
                  height="28"
                  style={{ transform: 'rotate(0deg)' }}
                >
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </button>
            )}
          </div>
          
          {/* Footer Main - hidden until arrow is clicked */}
          <div 
            ref={footerMainRef}
            className="footer-main" 
            style={{
              display: footerExpanded ? 'flex' : 'none',
              justifyContent: 'space-between', 
              flexWrap: 'wrap', 
              gap: '30px',
              opacity: footerExpanded ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            {/* יצירת קשר - ימין */}
            <div className="footer-contact" style={{flex: '1', minWidth: '200px'}}>
              <h3 style={{color: 'white', fontSize: '1.1rem', marginBottom: '15px', fontWeight: '700'}}>יצירת קשר</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div className="footer-contact-item">
                  <i className="fa-solid fa-phone"></i>
                  <EditableTextField textKey="FOOTER_PHONE" fallback="058-700-9938" as="span" />
                </div>
                <div className="footer-contact-item">
                  <i className="fa-solid fa-envelope"></i>
                  <EditableTextField textKey="FOOTER_EMAIL" fallback="vipo.m1985@gmail.com" as="span" />
                </div>
                <div className="footer-contact-item">
                  <i className="fa-solid fa-map-marker-alt"></i>
                  <EditableTextField textKey="FOOTER_ADDRESS" fallback="ז'בוטינסקי 5, באר יעקב" as="span" />
                </div>
                <div className="footer-contact-item">
                  <i className="fa-solid fa-clock"></i>
                  <EditableTextField textKey="FOOTER_HOURS" fallback="א׳-ה׳ 09:00-18:00" as="span" />
                </div>
              </div>
            </div>
            
            {/* קישורי ניווט - שמאל */}
            <div className="footer-nav" style={{flex: '1', minWidth: '200px'}}>
              <h3 style={{color: 'white', fontSize: '1.1rem', marginBottom: '15px', fontWeight: '700'}}>ניווט מהיר</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <a href="/" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-home"></i> דף הבית</a>
                <a href="/" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-store"></i> חנות</a>
                <a href="/#how-it-works" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-cogs"></i> איך זה עובד</a>
                <a href="/#faq" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-question-circle"></i> שאלות נפוצות</a>
                <a href="/#about-vipo" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-users"></i> מי אנחנו</a>
              </div>
            </div>
          </div>
          
          {/* Footer Social - hidden until expanded */}
          <div 
            className="footer-social" 
            style={{
              textAlign: 'center', 
              margin: '30px 0',
              display: footerExpanded ? 'block' : 'none',
            }}
          >
            <a href="#" aria-label="פייסבוק"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/vipoconnect?igsh=MWdpdTZlbTMxMnNxcw%3D%3D&utm_source=qr" target="_blank" aria-label="אינסטגרם"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="טוויטר"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" aria-label="לינקדאין"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          
          {/* Footer Bottom - hidden until expanded */}
          <div 
            className="footer-bottom"
            style={{
              display: footerExpanded ? 'flex' : 'none',
            }}
          >
            <EditableTextField textKey="FOOTER_COPYRIGHT" fallback="© 2025 VIPO GROUP | ע.מ. 036517548" as="p" />
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
