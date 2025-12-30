'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import {
  Search,
  Truck,
  ShieldCheck,
  Megaphone,
  Building2,
  Home,
  ShoppingCart,
  Landmark,
  Wallet,
  Link2,
  BarChart3,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  MapPin,
  Facebook,
  Instagram,
  ChevronLeft,
  Users,
  Package,
  Globe,
  Star,
  Heart,
  CheckCircle,
  TrendingDown,
} from 'lucide-react';

// צבעי האתר לפי מפרט העיצוב
const colors = {
  primary: '#1e3a8a',      // כחול נייבי
  secondary: '#0891b2',    // טורקיז
  accent: '#06b6d4',       // טורקיז בהיר
  text: '#2c3e50',         // טקסט כהה
  textLight: '#4b5563',    // טקסט משני
  gold: '#d4af37',         // זהב
  orange: '#f59e0b',       // כתום
  light: '#f8f9fa',        // רקע בהיר
};

const gradient = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
const gradientReverse = `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`;

export default function AboutPage() {
  useEffect(() => {
    // Prevent horizontal scroll on mobile
    const style = document.createElement('style');
    style.textContent = `
      html, body { 
        overflow-x: hidden !important; 
        max-width: 100vw !important;
        width: 100% !important;
      }
      * { box-sizing: border-box !important; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div 
      className="min-h-screen w-full"
      style={{ 
        backgroundColor: colors.light,
        overflowX: 'hidden',
        maxWidth: '100vw',
      }}
    >
      {/* About Section - Compact with Wave */}
      <section 
        className="relative pt-6 pb-12 sm:pt-8 sm:pb-16 px-3 sm:px-4 w-full overflow-hidden"
        style={{ background: gradient }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute top-1/2 -left-6 w-16 h-16 rounded-full bg-white/10" />

        <div className="relative max-w-3xl mx-auto text-center text-white">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/20 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          
          <h1 className="text-xl sm:text-2xl font-bold mb-2">מי אנחנו</h1>
          
          <p className="text-xs sm:text-sm leading-relaxed mb-3 opacity-95">
            <span className="font-bold">VIPO Group</span> הוקמה בשנת 2018 מתוך הבנה פשוטה: הדרך לחיסכון אמיתי עוברת דרך קשר ישיר עם מקור הייצור.
          </p>
          <p className="text-[10px] sm:text-xs leading-relaxed mb-3 opacity-85">
            אנחנו חברה ישראלית המתמחה באיתור מפעלים גלובליים, ניהול שינוע וסגירת עסקאות - הכל תחת קורת גג אחת. אנו מלווים עסקים ואנשים פרטיים לאורך כל הדרך: מרגע האיתור, דרך המשא ומתן, ועד לרגע שהסחורה מגיעה לפתח הבית.
          </p>
          
          {/* Stats row */}
          <div className="flex justify-center gap-5 sm:gap-8 mb-4">
            {[
              { value: '7+', label: 'שנים' },
              { value: '5K+', label: 'לקוחות' },
              { value: '15+', label: 'מדינות' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-lg sm:text-xl font-bold">{stat.value}</div>
                <div className="text-[10px] opacity-70">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Vision - inline */}
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2">
            <Heart className="w-4 h-4" style={{ color: colors.orange }} />
            <span className="text-xs">להנגיש את עולם הייבוא לכל אחד - בשקיפות מלאה, במחירים הוגנים, ובליווי מקצועי</span>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Services - Compact */}
      <section className="relative py-4 sm:py-6 px-3 sm:px-4 w-full bg-white overflow-hidden">
        {/* Background Graphics */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-5" style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 right-0 w-28 h-28 opacity-5" style={{ background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)` }} />
        <div className="absolute top-1/2 right-10 w-2 h-2 rounded-full opacity-20" style={{ background: colors.secondary }} />
        <div className="absolute top-1/3 left-8 w-1.5 h-1.5 rounded-full opacity-15" style={{ background: colors.primary }} />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-base sm:text-lg font-bold mb-1" style={{ color: colors.primary }}>
              השירותים שלנו
            </h2>
            <div className="w-12 h-0.5 mx-auto rounded-full" style={{ background: gradient }} />
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {[
              { icon: Search, title: 'איתור מפעלים גלובליים', desc: 'גישה למפעלי ייצור מובילים במגוון תחומים, עם הצעות מחיר מותאמות אישית' },
              { icon: Truck, title: 'ניהול שינוע מתקדם', desc: 'שירותי שינוע ועמילות מכס מהמובילים בעולם, אנחנו מטפלים בכל הבירוקרטיה' },
              { icon: ShieldCheck, title: 'הסכמים ישירים', desc: 'סגירת עסקאות ישירות מול המפעלים, משא ומתן מקצועי שחוסך לכם כסף' },
              { icon: Megaphone, title: 'שיווק ומכירה', desc: 'ניהול קמפיינים בכל הרשתות החברתיות ובניית מערכת דיגיטלית' },
            ].map((service, idx) => (
              <div 
                key={idx} 
                className="relative overflow-hidden group bg-white rounded-lg p-2 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 text-center"
                style={{ 
                  border: '2px solid transparent',
                  backgroundImage: `linear-gradient(white, white), ${gradient}`,
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
              >
                {/* Decorative corner */}
                <div 
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full opacity-20"
                  style={{ background: colors.secondary }}
                />
                {/* Decorative dots */}
                <div className="absolute bottom-1 left-1 flex gap-0.5 opacity-25">
                  <div className="w-1 h-1 rounded-full" style={{ background: colors.secondary }} />
                  <div className="w-1 h-1 rounded-full" style={{ background: colors.primary }} />
                </div>
                
                {/* Icon */}
                <div className="relative w-8 h-8 mx-auto rounded-md flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110">
                  <service.icon className="w-5 h-5" style={{ color: colors.primary }} />
                </div>
                
                {/* Content */}
                <h3 className="font-bold text-xs mb-0.5" style={{ color: colors.primary }}>{service.title}</h3>
                <p className="text-[10px] leading-tight" style={{ color: colors.textLight }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process - New Design */}
      <section className="py-5 sm:py-6 px-3 sm:px-4 w-full bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-5">
            <h2 className="text-lg sm:text-xl font-bold mb-2" style={{ color: colors.primary }}>התהליך שלנו</h2>
            <div className="w-16 h-1 mx-auto rounded-full" style={{ background: gradient }} />
          </div>
          
          {/* Process Steps */}
          <div className="relative">
            {/* Connection line */}
            <div 
              className="hidden sm:block absolute top-6 left-1/2 transform -translate-x-1/2 h-0.5 w-3/4 opacity-30"
              style={{ background: gradient }}
            />
            
            <div className="flex items-start justify-center gap-1 sm:gap-2">
              {[
                { num: '1', title: 'פגישת ייעוץ', subtitle: 'הבנת הצרכים', icon: MessageCircle },
                { num: '2', title: 'איתור מפעל', subtitle: 'חיפוש גלובלי', icon: Search },
                { num: '3', title: 'משא ומתן', subtitle: 'הבטחת המחיר הטוב', icon: ShieldCheck },
                { num: '4', title: 'שינוע ומכס', subtitle: 'ניהול הלוגיסטיקה', icon: Truck },
                { num: '5', title: 'קבלת סחורה', subtitle: 'המוצר מגיע!', icon: Package },
              ].map((step, idx, arr) => (
                <div key={idx} className="flex items-start">
                  {/* Step */}
                  <div className="text-center w-12 sm:w-14">
                    <div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl mx-auto mb-2 flex items-center justify-center text-white"
                      style={{ background: gradient, boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)' }}
                    >
                      <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div 
                      className="text-[10px] sm:text-xs font-bold mb-0.5"
                      style={{ color: colors.primary }}
                    >
                      {step.title}
                    </div>
                  </div>
                  
                  {/* Arrow (not after last item) */}
                  {idx < arr.length - 1 && (
                    <div className="flex items-center h-10 sm:h-12 px-0.5 sm:px-1">
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.secondary }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Time indicator */}
          <div className="flex items-center justify-center gap-2 mt-4 bg-white rounded-full px-4 py-2 w-fit mx-auto border" style={{ borderColor: `${colors.secondary}30` }}>
            <Clock className="w-4 h-4" style={{ color: colors.secondary }} />
            <span className="text-xs" style={{ color: colors.textLight }}>4-8 שבועות בממוצע</span>
          </div>
        </div>
      </section>

      {/* Group Purchase - Full Content */}
      <section className="relative py-5 sm:py-6 px-3 sm:px-4 w-full bg-white overflow-hidden">
        {/* Background Graphics */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{ background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 left-0 w-20 h-20 opacity-5" style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }} />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-base sm:text-lg font-bold mb-1" style={{ color: colors.primary }}>הפלטפורמה שלנו - רכישה קבוצתית חכמה</h2>
            <div className="w-16 h-0.5 mx-auto rounded-full mb-2" style={{ background: gradient }} />
            <p className="text-[10px] sm:text-xs max-w-lg mx-auto" style={{ color: colors.textLight }}>
              בנוסף לשירותי היבוא והשינוע, פיתחנו פלטפורמה ייחודית לרכישה קבוצתית - שמאפשרת לכל אחד ליהנות ממחירי סיטונאות
            </p>
          </div>
          
          {/* Steps */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
            {[
              { icon: Users, title: 'נצטרף לקבוצה' },
              { icon: TrendingDown, title: 'המחיר יורד' },
              { icon: CheckCircle, title: 'כולם מרוויחים' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="text-center p-3 rounded-xl bg-white"
                style={{ 
                  border: '2px solid transparent',
                  backgroundImage: `linear-gradient(white, white), ${gradient}`,
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
              >
                <div 
                  className="w-9 h-9 mx-auto mb-2 rounded-lg flex items-center justify-center text-white"
                  style={{ background: gradient }}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold" style={{ color: colors.primary }}>{item.title}</div>
              </div>
            ))}
          </div>
          
          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-4">
            {[
              'אין התחייבות כספית עד סגירת הקבוצה',
              'אחריות מלאה על כל המוצרים',
              'משלוח עד הבית',
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" style={{ color: colors.secondary }} />
                <span className="text-[10px] sm:text-xs" style={{ color: colors.text }}>{benefit}</span>
              </div>
            ))}
          </div>
          
          {/* CTA */}
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-white font-bold rounded-lg text-xs transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ background: gradient }}
            >
              לצפייה במוצרים
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Agents CTA - New Design with Waves */}
      <section className="relative pt-12 pb-12 sm:pt-14 sm:pb-14 px-3 sm:px-4 w-full overflow-hidden" style={{ background: gradient }}>
        {/* Top Wave SVG */}
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
          </svg>
        </div>
        
        {/* Decorative Graphics */}
        <div className="absolute top-1/4 -right-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute top-1/2 -left-6 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-white/20" />
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 rounded-full bg-white/15" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left - Title & Benefits */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-base sm:text-lg font-bold">הצטרפו כשותפים!</h2>
                <div className="flex items-center gap-2 mt-1">
                  {[
                    { icon: Wallet, title: '10% עמלה' },
                    { icon: Link2, title: 'קוד אישי' },
                    { icon: BarChart3, title: 'דשבורד' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-white/80">
                      <item.icon className="w-3 h-3" />
                      <span className="text-[10px]">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right - CTA */}
            <Link
              href="/register?role=agent"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white font-bold rounded-lg shadow text-xs transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ color: colors.primary }}
            >
              הצטרף עכשיו
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        
        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Contact - Compact Design */}
      <section className="relative pt-5 pb-14 sm:pt-6 sm:pb-16 px-3 sm:px-4 bg-white w-full overflow-hidden">
        {/* Background Graphics */}
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5" style={{ background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)` }} />
        
        <div className="relative max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-base sm:text-lg font-bold mb-1" style={{ color: colors.primary }}>צרו קשר</h2>
            <div className="w-12 h-0.5 mx-auto rounded-full mb-2" style={{ background: gradient }} />
            <p className="text-[10px] sm:text-xs" style={{ color: colors.textLight }}>אנחנו כאן לכל שאלה</p>
          </div>
          
          {/* Contact Methods - Horizontal */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <a href="mailto:info@vipo.com" className="text-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center text-white" style={{ background: gradient }}>
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold" style={{ color: colors.primary }}>אימייל</div>
            </a>
            <a href="tel:050-1234567" className="text-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center text-white" style={{ background: gradient }}>
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold" style={{ color: colors.primary }}>טלפון</div>
            </a>
            <a href="https://wa.me/972587009938" target="_blank" rel="noopener noreferrer" className="text-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center bg-green-500 text-white">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold" style={{ color: colors.primary }}>וואטסאפ</div>
            </a>
          </div>
          
          {/* Contact Form */}
          <div 
            className="relative overflow-hidden rounded-xl p-4"
            style={{ 
              border: '2px solid transparent',
              backgroundImage: `linear-gradient(white, white), ${gradient}`,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          >
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-10" style={{ background: colors.secondary }} />
            
            <div className="relative">
              <h3 className="text-xs font-bold mb-2 text-center" style={{ color: colors.primary }}>השאירו פרטים ונחזור אליכם</h3>
              
              <form className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="שם מלא"
                    className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:border-cyan-500"
                    style={{ borderColor: `${colors.secondary}40` }}
                  />
                  <input
                    type="tel"
                    placeholder="טלפון"
                    className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:border-cyan-500"
                    style={{ borderColor: `${colors.secondary}40` }}
                  />
                </div>
                <input
                  type="email"
                  placeholder="אימייל"
                  className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:border-cyan-500"
                  style={{ borderColor: `${colors.secondary}40` }}
                />
                <textarea
                  placeholder="הודעה"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:border-cyan-500 resize-none"
                  style={{ borderColor: `${colors.secondary}40` }}
                />
                <button
                  type="submit"
                  className="w-full py-2 text-white font-bold rounded-lg text-xs transition-all hover:shadow-md"
                  style={{ background: gradient }}
                >
                  שליחה
                </button>
              </form>
            </div>
          </div>
          
          {/* Info Bar */}
          <div className="flex justify-center gap-4 mt-3 text-[9px]" style={{ color: colors.textLight }}>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" style={{ color: colors.secondary }} />
              <span>תל אביב</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" style={{ color: colors.secondary }} />
              <span>א׳-ה׳ 09:00-18:00</span>
            </div>
          </div>
        </div>
        
        {/* Wave SVG to Footer */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <linearGradient id="footerWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="url(#footerWaveGradient)"/>
          </svg>
        </div>
      </section>

      {/* Footer - Full Content */}
      <footer className="relative overflow-hidden w-full" style={{ background: gradient }}>
        {/* Decorative Graphics */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute top-1/3 -left-10 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-white/10" />
          <div className="absolute top-1/2 left-1/3 w-2 h-2 rounded-full bg-white/10" />
        </div>

        <div className="relative max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {/* Main Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-5">
            {/* Logo & Description */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">VIPO Group</span>
              </div>
              <p className="text-white/70 text-[10px] sm:text-xs mb-3 max-w-xs">
                מובילים את מהפכת הסחר החכם בישראל. מחברים לקוחות למפעלים בעולם.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-2">
                {[
                  { href: 'https://facebook.com/vipogroup', icon: Facebook },
                  { href: 'https://instagram.com/vipogroup', icon: Instagram },
                  { href: 'https://wa.me/972587009938', icon: MessageCircle },
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center transition-all hover:bg-white/20 hover:scale-105"
                  >
                    <social.icon className="w-4 h-4 text-white" />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-2 text-xs">קישורים</h4>
              <ul className="space-y-1.5">
                {[
                  { href: '/', label: 'עמוד הבית' },
                  { href: '/products', label: 'מוצרים' },
                  { href: '/about', label: 'אודות' },
                  { href: '/join', label: 'סוכנים' },
                  { href: '/contact', label: 'צרו קשר' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-white/70 hover:text-white text-[10px] sm:text-xs transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-white mb-2 text-xs">יצירת קשר</h4>
              <ul className="space-y-2 text-[10px] sm:text-xs">
                <li>
                  <a href="mailto:info@vipo.com" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                    <Mail className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                    <span>info@vipo.com</span>
                  </a>
                </li>
                <li>
                  <a href="tel:050-1234567" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                    <Phone className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                    <span>050-1234567</span>
                  </a>
                </li>
                <li className="flex items-center gap-1.5 text-white/70">
                  <Clock className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                  <span>א׳-ה׳ 09:00-18:00</span>
                </li>
                <li className="flex items-center gap-1.5 text-white/70">
                  <MapPin className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                  <span>תל אביב, ישראל</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs">
            <p className="text-white/50">
              © {new Date().getFullYear()} VIPO Group. כל הזכויות שמורות.
            </p>
            <div className="flex gap-3">
              <Link href="/terms" className="text-white/50 hover:text-white transition-colors">תנאי שימוש</Link>
              <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">פרטיות</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
