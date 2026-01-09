'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FeaturedCarousel from './FeaturedCarousel';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [referralPanelOpen, setReferralPanelOpen] = useState(false);
  const [copyTooltipVisible, setCopyTooltipVisible] = useState(false);
  const magneticBtnRef = useRef(null);
  const productsContainerRef = useRef(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Fetch featured products from database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch('/api/products?featured=true');
        if (res.ok) {
          const data = await res.json();
          const products = data.products || data;
          if (Array.isArray(products) && products.length > 0) {
            setFeaturedProducts(products.slice(0, 10));
          }
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate products carousel - always running, never stops
  useEffect(() => {
    if (featuredProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentProductIndex(prev => (prev + 1) % featuredProducts.length);
    }, 1800); // 1.8 seconds like original
    
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  // Calculate container offset to center current card
  useEffect(() => {
    const container = productsContainerRef.current;
    if (!container || featuredProducts.length === 0) return;
    
    const cards = container.querySelectorAll('.product-card');
    if (cards.length === 0) return;
    
    const centerCard = cards[currentProductIndex];
    if (!centerCard) return;
    
    const containerRect = container.parentElement?.getBoundingClientRect();
    const cardRect = centerCard.getBoundingClientRect();
    if (!containerRect) return;
    
    const containerCenter = containerRect.width / 2;
    const cardCenter = cardRect.left - containerRect.left + cardRect.width / 2;
    const offset = containerCenter - cardCenter;
    
    container.style.transform = `translateX(${offset}px)`;
  }, [currentProductIndex, featuredProducts]);

  // Get card class based on position relative to current index
  const getCardClass = (index) => {
    const total = featuredProducts.length;
    if (total === 0) return '';
    
    if (index === currentProductIndex) return 'center';
    
    const next = (currentProductIndex + 1) % total;
    const prev = (currentProductIndex - 1 + total) % total;
    
    if (index === next || index === prev) return 'side';
    return 'far';
  };

  // Scroll animation for reveal-on-scroll elements
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      const screenPosition = window.innerHeight * 0.8;
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < screenPosition) {
          element.classList.add('fade-in');
        }
      });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  // 3D Tilt effect for audience cards
  useEffect(() => {
    const cards = document.querySelectorAll('.audience-card');
    const handleMouseMove = function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    };
    const handleMouseLeave = function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };
    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });
    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Counter animation for stats
  useEffect(() => {
    const animateCounter = (element, target, duration = 2000) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target.toLocaleString('he-IL');
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current).toLocaleString('he-IL');
        }
      }, 16);
    };

    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted', 'counting');
          const text = entry.target.textContent.replace(/[^0-9]/g, '');
          const target = parseInt(text);
          if (!isNaN(target)) {
            animateCounter(entry.target, target);
          }
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
    return () => statNumbers.forEach(stat => statsObserver.unobserve(stat));
  }, []);

  // Set referral meter demo data
  useEffect(() => {
    const friendsCount = document.getElementById('friends-count');
    const earnings = document.getElementById('earnings');
    const meterProgress = document.querySelector('.meter-progress');
    if (friendsCount && earnings && meterProgress) {
      const demoFriends = 3;
      const demoEarnings = demoFriends * 150;
      const progressPercent = Math.min((demoFriends / 10) * 100, 100);
      friendsCount.textContent = demoFriends;
      earnings.textContent = demoEarnings;
      meterProgress.style.width = progressPercent + '%';
    }
  }, []);

  // Magnetic button effect
  const handleMagneticMove = (e) => {
    const btn = magneticBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };
  const handleMagneticLeave = () => {
    const btn = magneticBtnRef.current;
    if (btn) btn.style.transform = 'translate(0, 0)';
  };

  // Scroll arrow click handler
  const handleScrollArrowClick = () => {
    const videoSection = document.getElementById('video-section');
    if (videoSection) {
      window.scrollTo({ top: videoSection.offsetTop - 80, behavior: 'smooth' });
    }
  };

  // Copy referral code
  const handleCopyCode = () => {
    window.open('/register', '_blank');
    setCopyTooltipVisible(true);
    setTimeout(() => setCopyTooltipVisible(false), 2000);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Format price helper
  const formatPrice = (price) => {
    return `₪${Number(price).toLocaleString('he-IL')}`;
  };

  // Calculate discount text
  const getDiscountText = (product) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      const savings = product.originalPrice - product.price;
      return `חיסכון של עד ₪${savings.toLocaleString('he-IL')}`;
    }
    return 'מבצע מיוחד';
  };

  const steps = [
    { icon: 'cart', title: 'בחירת מוצר', desc: 'בוחרים מוצרים במחיר מפעל מהמערכת שלנו עד 50% יותר זול ממחיר השוק' },
    { icon: 'users', title: 'הצטרפות לקבוצה', desc: 'מצטרפים לקבוצת הרכישה בתום ה-30 יום ההזמנה עוברת למפעל לייצור' },
    { icon: 'share', title: 'שיתוף', desc: 'משתפים את החברים ומשפחה כדי להגדיל את הקבוצה וגם מקבלים 10% עמלה על כל רכישה שהגיעה מהשיתוף שלכם' },
    { icon: 'arrowDown', title: 'המחיר יורד', desc: 'ככל שיותר חברים מצטרפים, המחיר יורד לכולם' },
    { icon: 'check', title: 'סגירת קבוצה', desc: 'בסיום ההרשמה מקבלים הודעה שמתחילים בייצור ועדכון על זמני הגעה' },
    { icon: 'truck', title: 'תשלום ומשלוח', desc: 'עד 24 תשלומים ומשלוח עד הבית (יש איסוף עצמי)' },
  ];

  const faqs = [
    { q: 'האם יש התחייבות כספית?', a: 'לא, אין שום התחייבות כספית. התשלום רק לאחר סגירת הקבוצה ורק אם אתם מעוניינים.' },
    { q: 'איך עובד "חבר מביא חבר"?', a: 'כל משתמש מקבל קישור אישי. כאשר חבר מזמין דרך הקישור שלכם, אתם מקבלים תגמול כספי בהתאם לעסקה – ללא צורך לרכוש בעצמכם.' },
    { q: 'מה אם לא מצטרפים מספיק אנשים?', a: 'נמשיך לחכות או נציע לכם לרכוש במחיר הנוכחי. אתם לא מחויבים לרכוש.' },
    { q: 'כיצד מתבצע המשלוח?', a: 'משלוח ישירות לכתובת שלכם. זמן אספקה: 7-14 ימי עסקים. עלות כלולה במחיר.' },
    { q: 'האם יש אחריות על המוצרים?', a: 'כן, כל המוצרים עם אחריות מלאה של היבואן הרשמי בישראל.' },
  ];

  const testimonials = [
    { text: 'חסכתי 700 ₪ על מכונת כביסה!', author: 'מיכל כהן', location: 'תל אביב' },
    { text: 'קיבלתי 300 ₪ מהפניות. מדהים!', author: 'יוסי לוי', location: 'חיפה' },
    { text: 'חסכתי אלפי שקלים. שירות מעולה!', author: 'דני אברהם', location: 'ירושלים' },
  ];

  const audiences = [
    { icon: 'home', title: 'משפחות', desc: 'חיסכון משמעותי במוצרים לבית ולמשפחה' },
    { icon: 'store', title: 'עסקים קטנים', desc: 'ציוד משרדי ומוצרים לעסק במחירים מוזלים' },
    { icon: 'lightbulb', title: 'יזמים', desc: 'הזדמנות לרכישת מוצרים איכותיים בעלות נמוכה' },
    { icon: 'building', title: 'מוסדות', desc: 'פתרונות רכש מרוכז למוסדות וארגונים' },
  ];

  // SVG icons for sections
  const svgIcons = {
    home: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
    store: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/></svg>,
    lightbulb: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>,
    building: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>,
    shield: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>,
    cart: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>,
    users: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
    share: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>,
    arrowDown: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>,
    check: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
    truck: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
    ticket: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46 0-1.48-.8-2.77-1.99-3.46L4 6h16v2.54z"/></svg>,
    whatsapp: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    chevronDown: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>,
    copy: <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>,
  };

  return (
    <div className="home-page" dir="rtl">
      {/* Override hero overlay opacity + mobile text position */}
      <style jsx global>{`
        .hero::before {
          background: linear-gradient(
            to bottom,
            rgba(13, 60, 97, 0.8) 0%,
            rgba(13, 60, 97, 0.75) 16.67%,
            rgba(13, 60, 97, 0.7) 33.33%,
            rgba(13, 60, 97, 0.65) 50%,
            rgba(13, 60, 97, 0.6) 66.67%,
            rgba(13, 60, 97, 0.55) 83.33%,
            rgba(13, 60, 97, 0.5) 100%
          ) !important;
        }
        
        @media (max-width: 768px) {
          .hero-content {
            margin-top: -60px !important;
            padding-top: 60px !important;
          }
        }
        
        .cta-buttons {
          flex-direction: row !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 15px !important;
        }
      `}</style>
      {/* Hero Section */}
      <section id="main-content" className="hero reveal-on-scroll">
        <div className="container">
          <div className="hero-content">
            <h1><span className="word">🇮🇱</span> <span className="word">ביחד</span> <span className="word">ננצח</span> <span className="word">🇮🇱</span><br/><span className="word" style={{fontSize: '0.55em'}}>נלחמים ביוקר המחייה</span></h1>
            <p className="hero-subtitle">רכישה קבוצתית במחיר מפעל - ככה ננצח!</p>
            <div className="cta-buttons">
              <Link 
                href="/shop" 
                className="btn btn-primary magnetic"
                ref={magneticBtnRef}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
              >
                צפו במוצרים
              </Link>
              <a 
                href="#video-section" 
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  const videoSection = document.getElementById('video-section');
                  if (videoSection) {
                    const offset = 60;
                    const top = videoSection.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
              >איך זה עובד?</a>
            </div>
          </div>
        </div>
        
        {/* Hot Products Slider - New Carousel */}
        <FeaturedCarousel />
      </section>

      {/* Video Section */}
      <section id="video-section" className="video-section reveal-on-scroll">
        <div className="container">
          <div className="video-container" aria-label="סרטון הסבר על רכישה קבוצתית">
            <div className="video-embed">
              <video width="100%" height="auto" controls preload="metadata" poster="/home/images/1.jpg">
                <source src="/home/mp4/explainer.mp4" type="video/mp4" />
                הדפדפן שלך לא תומך בתגית וידאו.
              </video>
            </div>
            <p className="video-caption">מעבירים את השליטה בחזרה לעם ונלחמים ביוקר המחייה</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works reveal-on-scroll">
        <div className="container">
          <h2 className="section-title" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>איך זה עובד?</h2>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div className="step reveal-on-scroll" key={index}>
                <div className={`step-icon ${index === 0 ? 'floating-icon' : ''}`}>
                  <span style={{color: 'white'}}>{svgIcons[step.icon]}</span>
                </div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No Commitment Section */}
      <section id="no-commitment" className="no-commitment reveal-on-scroll">
        <div className="container">
          <div className="info-box reveal-on-scroll delay-1">
            <div className="info-icon">
              <span style={{color: '#ffffff'}}>{svgIcons.shield}</span>
            </div>
            <h2 style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>שאנחנו מאוחדים אנחנו חזקים</h2>
            <p>מצטרפים ורוכשים ב-50% יותר זול ממחיר השוק בישראל ואם הצלחנו להיות מאוחדים וצרפנו חברים ומשפחה אז נקבל עוד הנחה רק ככה ננצח ביחד את יוקר המחייה</p>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section id="referral" className="referral reveal-on-scroll">
        <div className="container">
          <h2 className="section-title" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>חבר מביא חבר</h2>
          <div className="referral-content">
            <div className="referral-info">
              <h3>שיתפת – הרווחת</h3>
              <p>קבלו תגמול כספי על כל רכישה שמתבצעת באמצעות קוד הקופון או שיתוף מוצר מהאזור האישי שלכם – ללא צורך לקנות בעצמכם 10% על כל רכישה</p>
            </div>
            <button 
              type="button"
              className="btn referral-info-toggle"
              onClick={() => setReferralPanelOpen(!referralPanelOpen)}
              aria-expanded={referralPanelOpen}
            >
              משתפים חברים – ומרוויחים בלי לקנות
            </button>
            <div className={`referral-info-panel ${referralPanelOpen ? 'open' : ''}`}>
              <h4>איך מרוויחים כסף בלי לרכוש בעצמכם?</h4>
              <ol className="referral-steps">
                <li>נרשמים בחינם משתפים מוצר בלחיצת כפתור ישירות לווצאפ או לכל רשת חברתית ובכל פעם שחבר ירכוש דרך השיתוף שלך החשבון שלך יזוכה ב-10% מערך העסקה שיתפת הרווחת</li>
                <li>שולחים בקשה למימוש העמלות והכסף נשלח לחשבון בנק שלך</li>
              </ol>
              <hr className="referral-divider" />
              <p className="referral-summary">אין התחייבות אין צורך לקנות פשוט רק לשתף</p>
              <p className="referral-motto" style={{fontWeight: 'bold', marginTop: '10px'}}>רק ביחד נתאחד ונחזיר את השליטה לעם זאת לא שיטה זאת תנועה של עם אחד</p>
              <Link href="/register" className="btn btn-primary referral-panel-cta">פתחו קוד קופון אישי</Link>
            </div>
            <div className="referral-link-box">
              <label htmlFor="referral-link">קבל קוד קופון אישי:</label>
              <div className="copy-link-container">
                <input type="text" id="referral-link" value="VIPO-123456" readOnly />
                <button className="btn btn-copy" aria-label="העתק קוד קופון אישי" onClick={handleCopyCode}>
                  {svgIcons.copy}
                </button>
              </div>
              <div className={`copy-tooltip ${copyTooltipVisible ? 'show' : ''}`}>לחצו כדי להעתיק את הקוד</div>
            </div>
            <div className="referral-meter">
              <div className="meter-info">
                <span id="friends-count">0</span> חברים
                <span className="separator">|</span>
                <span id="earnings">0</span> ₪
              </div>
              <div className="meter-bar">
                <div className="meter-progress" style={{width: '0%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="target-audience" className="target-audience reveal-on-scroll">
        <div className="container">
          <h2 className="section-title" style={{ color: '#ffffff', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>למי זה מתאים</h2>
          <div className="audience-grid">
            {audiences.map((item, index) => (
              <div className="audience-card reveal-on-scroll" key={index}>
                <div className="audience-icon">
                  <span style={{color: '#1e3a8a'}}>{svgIcons[item.icon]}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="audience-description">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq reveal-on-scroll">
        <div className="container">
          <h2 className="section-title" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>שאלות נפוצות</h2>
          <div className="faq-timeline">
            {faqs.map((faq, index) => (
              <div className="faq-item reveal-on-scroll" key={index}>
                <div className="faq-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="faq-card">
                  <button className="faq-question" onClick={() => toggleFaq(index)}>
                    {faq.q}
                    <i className={`fa-solid fa-chevron-down ${activeFaq === index ? 'rotated' : ''}`}></i>
                  </button>
                  <div className={`faq-answer ${activeFaq === index ? 'open' : ''}`}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <h2 className="section-title" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>לקוחות מספרים</h2>
          <div className="testimonials-slider-wrapper">
            <div className="testimonials-slider">
              {testimonials.map((testimonial, index) => (
                <div className={`testimonial-slide ${activeTestimonial === index ? 'active' : ''}`} key={index}>
                  <div className="testimonial-compact">
                    <div className="testimonial-avatar">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="testimonial-content">
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          <i className="fa-solid fa-star" key={i}></i>
                        ))}
                      </div>
                      <p className="testimonial-text">&ldquo;{testimonial.text}&rdquo;</p>
                      <div className="testimonial-author">
                        <strong>{testimonial.author}</strong> • <span>{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <span 
                  className={`testimonial-dot ${activeTestimonial === index ? 'active' : ''}`} 
                  onClick={() => setActiveTestimonial(index)}
                  key={index}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About VIPO Section */}
      <section id="about-vipo" className="about-vipo">
        <div className="container">
          <h2 className="section-title" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>מי אנחנו</h2>
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
                  <span className="stat-number" style={{whiteSpace: 'nowrap'}}>ישראל + סין</span>
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
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor:'#1e3a8a', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#0891b2', stopOpacity:1}} />
              </linearGradient>
            </defs>
            <path d="M0,0 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,120 L0,120 Z" fill="url(#waveGradient)"></path>
          </svg>
        </div>
      </section>

      {/* Footer & Contact Section */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-brand-section" style={{textAlign: 'center', marginBottom: '30px'}}>
            <h2 className="footer-brand">VIPO GROUP</h2>
            <p className="footer-tagline">רכישה קבוצתית חכמה וחסכונית</p>
          </div>
          
          <div className="footer-main" style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px'}}>
            {/* יצירת קשר - ימין */}
            <div className="footer-contact" style={{flex: '1', minWidth: '200px'}}>
              <h3 style={{color: 'white', fontSize: '1.1rem', marginBottom: '15px', fontWeight: '700'}}>יצירת קשר</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
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
                <div className="footer-contact-item">
                  <i className="fa-solid fa-clock"></i>
                  <span>א׳-ה׳ 09:00-18:00</span>
                </div>
              </div>
            </div>
            
            {/* קישורי ניווט - שמאל */}
            <div className="footer-nav" style={{flex: '1', minWidth: '200px'}}>
              <h3 style={{color: 'white', fontSize: '1.1rem', marginBottom: '15px', fontWeight: '700'}}>ניווט מהיר</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <a href="/" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-home"></i> דף הבית</a>
                <a href="/shop" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-store"></i> חנות</a>
                <a href="#how-it-works" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-cogs"></i> איך זה עובד</a>
                <a href="#faq" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-question-circle"></i> שאלות נפוצות</a>
                <a href="#about-vipo" style={{color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}><i className="fa-solid fa-users"></i> מי אנחנו</a>
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
            <p>&copy; 2025 VIPO GROUP | ע.מ. 036517548</p>
            <div className="footer-links">
              <a href="/terms">תנאי שימוש</a>
              <a href="/privacy">מדיניות פרטיות</a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <a href="https://chat.whatsapp.com/KP5UIdBHiKdGmOdyWeJySa?mode=ac_t" className="whatsapp-button" aria-label="צור קשר בוואטסאפ" target="_blank">
        <span style={{color: 'white'}}>{svgIcons.whatsapp}</span>
      </a>
    </div>
  );
}
