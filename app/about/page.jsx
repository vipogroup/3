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
    // Prevent horizontal scroll on mobile + Add animations
    const style = document.createElement('style');
    style.textContent = `
      html, body { 
        overflow-x: hidden !important; 
        max-width: 100vw !important;
        width: 100% !important;
      }
      * { box-sizing: border-box !important; }
      
      /* Animations */
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
      .animate-fadeInDown { animation: fadeInDown 0.6s ease-out forwards; }
      .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
      .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
      .animate-slideInRight { animation: slideInRight 0.6s ease-out forwards; }
      .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
      .animate-float { animation: float 4s ease-in-out infinite; }
      
      .delay-100 { animation-delay: 0.1s; }
      .delay-200 { animation-delay: 0.2s; }
      .delay-300 { animation-delay: 0.3s; }
      .delay-400 { animation-delay: 0.4s; }
      .delay-500 { animation-delay: 0.5s; }
      .delay-600 { animation-delay: 0.6s; }
      .delay-700 { animation-delay: 0.7s; }
      .delay-800 { animation-delay: 0.8s; }
      
      .opacity-0-start { opacity: 0; }
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
        className="relative pt-8 pb-14 sm:pt-10 sm:pb-18 px-4 sm:px-6 w-full overflow-hidden"
        style={{ background: gradient }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 animate-float" />
        <div className="absolute top-1/2 -left-6 w-20 h-20 rounded-full bg-white/10 animate-float delay-500" />

        <div className="relative max-w-3xl mx-auto text-center text-white">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white/20 flex items-center justify-center opacity-0-start animate-scaleIn">
            <Globe className="w-7 h-7" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 opacity-0-start animate-fadeInDown delay-100">מי אנחנו</h1>
          
          <p className="text-sm sm:text-base leading-relaxed mb-3 opacity-0-start animate-fadeInUp delay-200">
            <span className="font-bold">VIPO Group</span> הוקמה בשנת 2018 מתוך הבנה פשוטה: הדרך לחיסכון אמיתי עוברת דרך קשר ישיר עם מקור הייצור.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed mb-4 opacity-0-start animate-fadeInUp delay-300">
            אנחנו חברה ישראלית המתמחה באיתור מפעלים גלובליים, ניהול שינוע וסגירת עסקאות - הכל תחת קורת גג אחת. אנו מלווים עסקים ואנשים פרטיים לאורך כל הדרך: מרגע האיתור, דרך המשא ומתן, ועד לרגע שהסחורה מגיעה לפתח הבית.
          </p>
          
          {/* Stats row */}
          <div className="flex justify-center gap-6 sm:gap-10 mb-5">
            {[
              { value: '7+', label: 'שנים' },
              { value: '5K+', label: 'לקוחות' },
              { value: '15+', label: 'מדינות' },
            ].map((stat, idx) => (
              <div key={idx} className={`text-center opacity-0-start animate-scaleIn delay-${(idx + 4) * 100}`}>
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs opacity-70">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Vision - inline */}
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-5 py-2.5 opacity-0-start animate-fadeInUp delay-700">
            <Heart className="w-5 h-5 animate-pulse-slow" style={{ color: colors.orange }} />
            <span className="text-sm">להנגיש את עולם הייבוא לכל אחד - בשקיפות מלאה, במחירים הוגנים, ובליווי מקצועי</span>
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
      <section className="relative py-6 sm:py-8 px-4 sm:px-6 w-full bg-white overflow-hidden">
        {/* Background Graphics */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-5" style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 right-0 w-28 h-28 opacity-5" style={{ background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)` }} />
        <div className="absolute top-1/2 right-10 w-2 h-2 rounded-full opacity-20" style={{ background: colors.secondary }} />
        <div className="absolute top-1/3 left-8 w-1.5 h-1.5 rounded-full opacity-15" style={{ background: colors.primary }} />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-1 opacity-0-start animate-fadeInDown" style={{ color: colors.primary }}>
              השירותים שלנו
            </h2>
            <div className="w-14 h-1 mx-auto rounded-full opacity-0-start animate-scaleIn delay-100" style={{ background: gradient }} />
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: Search, title: 'איתור מפעלים גלובליים', desc: 'גישה למפעלי ייצור מובילים במגוון תחומים, עם הצעות מחיר מותאמות אישית' },
              { icon: Truck, title: 'ניהול שינוע מתקדם', desc: 'שירותי שינוע ועמילות מכס מהמובילים בעולם, אנחנו מטפלים בכל הבירוקרטיה' },
              { icon: ShieldCheck, title: 'הסכמים ישירים', desc: 'סגירת עסקאות ישירות מול המפעלים, משא ומתן מקצועי שחוסך לכם כסף' },
              { icon: Megaphone, title: 'שיווק ומכירה', desc: 'ניהול קמפיינים בכל הרשתות החברתיות ובניית מערכת דיגיטלית' },
            ].map((service, idx) => (
              <div 
                key={idx} 
                className={`relative overflow-hidden group bg-white rounded-xl p-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] text-center opacity-0-start animate-fadeInUp delay-${(idx + 2) * 100}`}
                style={{ 
                  border: '2px solid transparent',
                  backgroundImage: `linear-gradient(white, white), ${gradient}`,
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
              >
                {/* Decorative corner */}
                <div 
                  className="absolute -top-3 -right-3 w-10 h-10 rounded-full opacity-20"
                  style={{ background: colors.secondary }}
                />
                {/* Decorative dots */}
                <div className="absolute bottom-1 left-1 flex gap-0.5 opacity-25">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.secondary }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.primary }} />
                </div>
                
                {/* Icon */}
                <div className="relative w-10 h-10 mx-auto rounded-md flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <service.icon className="w-6 h-6 transition-colors" style={{ color: colors.primary }} />
                </div>
                
                {/* Content */}
                <h3 className="font-bold text-sm mb-1" style={{ color: colors.primary }}>{service.title}</h3>
                <p className="text-xs leading-tight" style={{ color: colors.textLight }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process - New Design */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 w-full bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: colors.primary }}>התהליך שלנו</h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ background: gradient }} />
          </div>
          
          {/* Process Steps */}
          <div className="relative">
            {/* Connection line */}
            <div 
              className="hidden sm:block absolute top-6 left-1/2 transform -translate-x-1/2 h-0.5 w-3/4 opacity-30"
              style={{ background: gradient }}
            />
            
            <div className="flex items-start justify-center gap-1 sm:gap-3">
              {[
                { num: '1', title: 'פגישת ייעוץ', subtitle: 'הבנת הצרכים', icon: MessageCircle },
                { num: '2', title: 'איתור מפעל', subtitle: 'חיפוש גלובלי', icon: Search },
                { num: '3', title: 'משא ומתן', subtitle: 'הבטחת המחיר הטוב', icon: ShieldCheck },
                { num: '4', title: 'שינוע ומכס', subtitle: 'ניהול הלוגיסטיקה', icon: Truck },
                { num: '5', title: 'קבלת סחורה', subtitle: 'המוצר מגיע!', icon: Package },
              ].map((step, idx, arr) => (
                <div key={idx} className="flex items-start">
                  {/* Step */}
                  <div className="text-center w-14 sm:w-16">
                    <div 
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl mx-auto mb-2 flex items-center justify-center text-white"
                      style={{ background: gradient, boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)' }}
                    >
                      <step.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div 
                      className="text-xs sm:text-sm font-bold mb-0.5"
                      style={{ color: colors.primary }}
                    >
                      {step.title}
                    </div>
                  </div>
                  
                  {/* Arrow (not after last item) */}
                  {idx < arr.length - 1 && (
                    <div className="flex items-center h-12 sm:h-14 px-0.5 sm:px-1">
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: colors.secondary }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Time indicator */}
          <div className="flex items-center justify-center gap-2 mt-5 bg-white rounded-full px-5 py-2.5 w-fit mx-auto border" style={{ borderColor: `${colors.secondary}30` }}>
            <Clock className="w-5 h-5" style={{ color: colors.secondary }} />
            <span className="text-sm" style={{ color: colors.textLight }}>4-8 שבועות בממוצע</span>
          </div>
        </div>
      </section>

      {/* Group Purchase - Full Content */}
      <section className="relative py-6 sm:py-8 px-4 sm:px-6 w-full bg-white overflow-hidden">
        {/* Background Graphics */}
        <div className="absolute top-0 right-0 w-28 h-28 opacity-5" style={{ background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5" style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }} />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-5">
            <h2 className="text-lg sm:text-xl font-bold mb-1" style={{ color: colors.primary }}>הפלטפורמה שלנו - רכישה קבוצתית חכמה</h2>
            <div className="w-20 h-1 mx-auto rounded-full mb-2" style={{ background: gradient }} />
            <p className="text-xs sm:text-sm max-w-lg mx-auto" style={{ color: colors.textLight }}>
              בנוסף לשירותי היבוא והשינוע, פיתחנו פלטפורמה ייחודית לרכישה קבוצתית - שמאפשרת לכל אחד ליהנות ממחירי סיטונאות
            </p>
          </div>
          
          {/* Steps */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
            {[
              { icon: Users, title: 'נצטרף לקבוצה' },
              { icon: TrendingDown, title: 'המחיר יורד' },
              { icon: CheckCircle, title: 'כולם מרוויחים' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="text-center p-4 rounded-xl bg-white"
                style={{ 
                  border: '2px solid transparent',
                  backgroundImage: `linear-gradient(white, white), ${gradient}`,
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
              >
                <div 
                  className="w-11 h-11 mx-auto mb-2 rounded-lg flex items-center justify-center text-white"
                  style={{ background: gradient }}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-xs sm:text-sm font-bold" style={{ color: colors.primary }}>{item.title}</div>
              </div>
            ))}
          </div>
          
          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 mb-5">
            {[
              'אין התחייבות כספית עד סגירת הקבוצה',
              'אחריות מלאה על כל המוצרים',
              'משלוח עד הבית',
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: colors.secondary }} />
                <span className="text-xs sm:text-sm" style={{ color: colors.text }}>{benefit}</span>
              </div>
            ))}
          </div>
          
          {/* CTA */}
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-white font-bold rounded-lg text-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ background: gradient }}
            >
              לצפייה במוצרים
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Agents CTA - New Design with Waves */}
      <section className="relative pt-14 pb-14 sm:pt-16 sm:pb-16 px-4 sm:px-6 w-full overflow-hidden" style={{ background: gradient }}>
        {/* Top Wave SVG */}
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
          </svg>
        </div>
        
        {/* Decorative Graphics */}
        <div className="absolute top-1/4 -right-10 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute top-1/2 -left-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-white/20" />
        <div className="absolute top-1/2 left-1/3 w-2 h-2 rounded-full bg-white/15" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-5 flex-wrap">
            {/* Left - Title & Benefits */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-lg sm:text-xl font-bold">הצטרפו כשותפים!</h2>
                <div className="flex items-center gap-3 mt-1">
                  {[
                    { icon: Wallet, title: '10% עמלה' },
                    { icon: Link2, title: 'קוד אישי' },
                    { icon: BarChart3, title: 'דשבורד' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-white/80">
                      <item.icon className="w-4 h-4" />
                      <span className="text-xs">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right - CTA */}
            <Link
              href="/register?role=agent"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white font-bold rounded-lg shadow text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ color: colors.primary }}
            >
              הצטרף עכשיו
              <ChevronLeft className="w-4 h-4" />
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
      <section className="relative pt-6 pb-16 sm:pt-8 sm:pb-18 px-4 sm:px-6 bg-white w-full overflow-hidden">
        {/* Background Graphics */}
        <div className="absolute top-0 right-0 w-28 h-28 opacity-5" style={{ background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)` }} />
        
        <div className="relative max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-lg sm:text-xl font-bold mb-1" style={{ color: colors.primary }}>צרו קשר</h2>
            <div className="w-14 h-1 mx-auto rounded-full mb-2" style={{ background: gradient }} />
            <p className="text-xs sm:text-sm" style={{ color: colors.textLight }}>אנחנו כאן לכל שאלה</p>
          </div>
          
          {/* Contact Methods - Horizontal */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <a href="mailto:info@vipo.com" className="text-center p-3 transition-transform hover:scale-105">
              <Mail className="w-7 h-7 mx-auto mb-1" style={{ color: colors.primary }} />
              <div className="text-xs font-bold" style={{ color: colors.primary }}>אימייל</div>
              <div className="text-[10px]" style={{ color: colors.textLight }}>info@vipo.com</div>
              <div className="text-[9px]" style={{ color: colors.textLight }}>נענה תוך 24 שעות</div>
            </a>
            <a href="tel:050-1234567" className="text-center p-3 transition-transform hover:scale-105">
              <Phone className="w-7 h-7 mx-auto mb-1" style={{ color: colors.primary }} />
              <div className="text-xs font-bold" style={{ color: colors.primary }}>טלפון</div>
              <div className="text-[10px]" style={{ color: colors.textLight }}>050-1234567</div>
              <div className="text-[9px]" style={{ color: colors.textLight }}>א׳-ה׳ 09:00-18:00</div>
            </a>
            <a href="https://wa.me/972587009938" target="_blank" rel="noopener noreferrer" className="text-center p-3 transition-transform hover:scale-105">
              <MessageCircle className="w-7 h-7 mx-auto mb-1" style={{ color: colors.primary }} />
              <div className="text-xs font-bold" style={{ color: colors.primary }}>וואטסאפ</div>
              <div className="text-[10px]" style={{ color: colors.textLight }}>שלחו הודעה</div>
              <div className="text-[9px]" style={{ color: colors.textLight }}>זמין 7 ימים בשבוע</div>
            </a>
          </div>
          
          {/* Contact Form */}
          <div 
            className="relative overflow-hidden rounded-xl p-5"
            style={{ 
              border: '2px solid transparent',
              backgroundImage: `linear-gradient(white, white), ${gradient}`,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          >
            <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full opacity-10" style={{ background: colors.secondary }} />
            
            <div className="relative">
              <h3 className="text-sm font-bold mb-3 text-center" style={{ color: colors.primary }}>השאירו פרטים ונחזור אליכם</h3>
              
              <form className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="שם מלא"
                    className="w-full px-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:border-cyan-500"
                    style={{ borderColor: `${colors.secondary}40` }}
                  />
                  <input
                    type="tel"
                    placeholder="טלפון"
                    className="w-full px-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:border-cyan-500"
                    style={{ borderColor: `${colors.secondary}40` }}
                  />
                </div>
                <input
                  type="email"
                  placeholder="אימייל"
                  className="w-full px-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:border-cyan-500"
                  style={{ borderColor: `${colors.secondary}40` }}
                />
                <textarea
                  placeholder="הודעה"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:border-cyan-500 resize-none"
                  style={{ borderColor: `${colors.secondary}40` }}
                />
                <button
                  type="submit"
                  className="w-full py-2.5 text-white font-bold rounded-lg text-sm transition-all hover:shadow-md"
                  style={{ background: gradient }}
                >
                  שליחה
                </button>
              </form>
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
