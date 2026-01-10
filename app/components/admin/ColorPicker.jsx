'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// HSL to HEX conversion
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// HEX to HSL conversion
function hexToHsl(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 100, l: 50 };
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Popular colors palette
const POPULAR_COLORS = [
  { name: 'אדום', hex: '#ef4444' },
  { name: 'כתום', hex: '#f97316' },
  { name: 'צהוב', hex: '#eab308' },
  { name: 'ירוק', hex: '#22c55e' },
  { name: 'טורקיז', hex: '#14b8a6' },
  { name: 'תכלת', hex: '#0ea5e9' },
  { name: 'כחול', hex: '#3b82f6' },
  { name: 'סגול', hex: '#8b5cf6' },
  { name: 'ורוד', hex: '#ec4899' },
  { name: 'אפור', hex: '#6b7280' },
  { name: 'שחור', hex: '#1f2937' },
  { name: 'לבן', hex: '#ffffff' },
];

// Brand color presets
const BRAND_PRESETS = [
  {
    id: 'amazon',
    name: 'Amazon',
    emoji: '📦',
    colors: {
      primaryColor: '#ff9900',
      secondaryColor: '#146eb4',
      accentColor: '#232f3e',
      successColor: '#067d62',
      warningColor: '#f0c14b',
      dangerColor: '#c45500',
      backgroundColor: '#ffffff',
      textColor: '#0f1111',
    },
  },
  {
    id: 'aliexpress',
    name: 'AliExpress',
    emoji: '🛒',
    colors: {
      primaryColor: '#e62e04',
      secondaryColor: '#ff6a00',
      accentColor: '#1a1a1a',
      successColor: '#00b578',
      warningColor: '#ff976a',
      dangerColor: '#e62e04',
      backgroundColor: '#ffffff',
      textColor: '#1a1a1a',
    },
  },
  {
    id: 'shopify',
    name: 'Shopify',
    emoji: '🛍️',
    colors: {
      primaryColor: '#96bf48',
      secondaryColor: '#5c6ac4',
      accentColor: '#006fbb',
      successColor: '#50b83c',
      warningColor: '#f49342',
      dangerColor: '#de3618',
      backgroundColor: '#f4f6f8',
      textColor: '#212b36',
    },
  },
  {
    id: 'stripe',
    name: 'Stripe',
    emoji: '💳',
    colors: {
      primaryColor: '#635bff',
      secondaryColor: '#0a2540',
      accentColor: '#00d4ff',
      successColor: '#30c85e',
      warningColor: '#f5be4f',
      dangerColor: '#df1b41',
      backgroundColor: '#f6f9fc',
      textColor: '#0a2540',
    },
  },
  {
    id: 'ebay',
    name: 'eBay',
    emoji: '🏷️',
    colors: {
      primaryColor: '#e53238',
      secondaryColor: '#0064d2',
      accentColor: '#f5af02',
      successColor: '#86b817',
      warningColor: '#f5af02',
      dangerColor: '#e53238',
      backgroundColor: '#ffffff',
      textColor: '#191919',
    },
  },
  {
    id: 'mercado',
    name: 'MercadoLibre',
    emoji: '🤝',
    colors: {
      primaryColor: '#ffe600',
      secondaryColor: '#3483fa',
      accentColor: '#00a650',
      successColor: '#00a650',
      warningColor: '#f73',
      dangerColor: '#f23d4f',
      backgroundColor: '#ebebeb',
      textColor: '#333333',
    },
  },
];

export default function ColorPicker({ 
  value, 
  onChange, 
  label, 
  description,
  showBrandPresets = false,
  onApplyPreset,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value || '#000000');
  const [recentColors, setRecentColors] = useState([]);
  const [activeTab, setActiveTab] = useState('spectrum'); // 'spectrum', 'sliders', 'presets'
  const [hsl, setHsl] = useState(() => hexToHsl(value || '#000000'));
  const containerRef = useRef(null);
  const spectrumRef = useRef(null);
  const hueBarRef = useRef(null);

  useEffect(() => {
    setHexInput(value || '#000000');
    setHsl(hexToHsl(value || '#000000'));
  }, [value]);

  useEffect(() => {
    // Load recent colors from localStorage
    try {
      const saved = localStorage.getItem('recentColors');
      if (saved) {
        setRecentColors(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load recent colors');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelect = (color) => {
    onChange(color);
    setHexInput(color);
    addToRecent(color);
  };

  const handleHexChange = (e) => {
    const hex = e.target.value;
    setHexInput(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex);
      addToRecent(hex);
    }
  };

  const handleNativeColorChange = (e) => {
    const color = e.target.value;
    onChange(color);
    setHexInput(color);
    addToRecent(color);
  };

  const addToRecent = (color) => {
    const updated = [color, ...recentColors.filter(c => c !== color)].slice(0, 6);
    setRecentColors(updated);
    try {
      localStorage.setItem('recentColors', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save recent colors');
    }
  };

  // HSL handlers
  const handleHslChange = useCallback((key, val) => {
    const newHsl = { ...hsl, [key]: val };
    setHsl(newHsl);
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    onChange(newHex);
    setHexInput(newHex);
  }, [hsl, onChange]);

  // Spectrum picker handler
  const handleSpectrumClick = useCallback((e) => {
    const rect = spectrumRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const newS = Math.round(x * 100);
    const newL = Math.round(100 - y * 100);
    const newHsl = { ...hsl, s: newS, l: newL };
    setHsl(newHsl);
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    onChange(newHex);
    setHexInput(newHex);
    addToRecent(newHex);
  }, [hsl, onChange]);

  // Hue bar handler
  const handleHueClick = useCallback((e) => {
    const rect = hueBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newH = Math.round(x * 360);
    const newHsl = { ...hsl, h: newH };
    setHsl(newHsl);
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    onChange(newHex);
    setHexInput(newHex);
    addToRecent(newHex);
  }, [hsl, onChange]);

  return (
    <div ref={containerRef} className="relative">
      {/* Main Display */}
      <div 
        className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Color Preview */}
        <div 
          className="w-12 h-12 rounded-lg shadow-inner border-2 border-gray-300 flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        
        {/* Label and Value */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900">{label}</div>
          {description && <div className="text-sm text-gray-600">{description}</div>}
          <div className="text-xs font-mono text-gray-500 mt-1">{value}</div>
        </div>

        {/* Arrow */}
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4 space-y-4">
          
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('spectrum')}
              className={`flex-1 px-3 py-2 text-xs font-bold rounded-md transition-all ${
                activeTab === 'spectrum' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎨 ספקטרום
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sliders')}
              className={`flex-1 px-3 py-2 text-xs font-bold rounded-md transition-all ${
                activeTab === 'sliders' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎚️ מחוונים
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 px-3 py-2 text-xs font-bold rounded-md transition-all ${
                activeTab === 'presets' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎯 מוכנים
            </button>
          </div>

          {/* Spectrum Tab */}
          {activeTab === 'spectrum' && (
            <div className="space-y-3">
              {/* Color Spectrum */}
              <div 
                ref={spectrumRef}
                className="relative h-40 rounded-lg cursor-crosshair overflow-hidden border-2 border-gray-200"
                onClick={handleSpectrumClick}
                style={{
                  background: `
                    linear-gradient(to top, #000 0%, transparent 50%, #fff 100%),
                    linear-gradient(to right, #888 0%, hsl(${hsl.h}, 100%, 50%) 100%)
                  `
                }}
              >
                {/* Picker indicator */}
                <div 
                  className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ 
                    left: `${hsl.s}%`, 
                    top: `${100 - hsl.l}%`,
                    backgroundColor: value 
                  }}
                />
              </div>

              {/* Hue Bar */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">גוון (Hue)</label>
                <div 
                  ref={hueBarRef}
                  className="relative h-6 rounded-lg cursor-pointer border-2 border-gray-200"
                  onClick={handleHueClick}
                  style={{
                    background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                  }}
                >
                  <div 
                    className="absolute w-3 h-full border-2 border-white rounded shadow-lg transform -translate-x-1/2 pointer-events-none"
                    style={{ 
                      left: `${(hsl.h / 360) * 100}%`,
                      backgroundColor: `hsl(${hsl.h}, 100%, 50%)`
                    }}
                  />
                </div>
              </div>

              {/* HEX Input */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">קוד צבע (HEX)</label>
                  <input
                    type="text"
                    value={hexInput}
                    onChange={handleHexChange}
                    placeholder="#4f46e5"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                </div>
                <div 
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: value }}
                />
              </div>
            </div>
          )}

          {/* Sliders Tab */}
          {activeTab === 'sliders' && (
            <div className="space-y-4">
              {/* Hue Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">גוון (Hue)</label>
                  <span className="text-xs font-mono text-gray-500">{hsl.h}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                  }}
                />
              </div>

              {/* Saturation Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">רוויה (Saturation)</label>
                  <span className="text-xs font-mono text-gray-500">{hsl.s}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%) 0%, hsl(${hsl.h}, 100%, ${hsl.l}%) 100%)`
                  }}
                />
              </div>

              {/* Lightness Slider */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">בהירות (Lightness)</label>
                  <span className="text-xs font-mono text-gray-500">{hsl.l}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #000 0%, hsl(${hsl.h}, ${hsl.s}%, 50%) 50%, #fff 100%)`
                  }}
                />
              </div>

              {/* Preview & HEX */}
              <div className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: value }}
                />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">קוד צבע</div>
                  <input
                    type="text"
                    value={hexInput}
                    onChange={handleHexChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Presets Tab */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              {/* Popular Colors */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">צבעים פופולריים</label>
                <div className="grid grid-cols-6 gap-2">
                  {POPULAR_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => handleColorSelect(color.hex)}
                      className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                        value === color.hex ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Colors */}
              {recentColors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">צבעים אחרונים</label>
                  <div className="flex gap-2">
                    {recentColors.map((color, index) => (
                      <button
                        key={`${color}-${index}`}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                          value === color ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Presets */}
              {showBrandPresets && onApplyPreset && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">סגנונות מותגים מפורסמים</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BRAND_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => onApplyPreset(preset.colors)}
                        className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-sm"
                      >
                        <span className="text-lg">{preset.emoji}</span>
                        <span className="font-medium">{preset.name}</span>
                        <div className="flex gap-0.5 mr-auto">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.colors.primaryColor }} />
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.colors.secondaryColor }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Native Color Picker */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="color"
                  value={value}
                  onChange={handleNativeColorChange}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <div>
                  <div className="text-sm font-bold text-gray-700">בורר צבעים מתקדם</div>
                  <div className="text-xs text-gray-500">לחץ לפתיחת בורר הדפדפן</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Export brand presets for use elsewhere
export { BRAND_PRESETS, POPULAR_COLORS };
