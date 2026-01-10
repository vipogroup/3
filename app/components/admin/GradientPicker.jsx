'use client';

import { useState, useEffect, useRef } from 'react';

// Parse gradient string to extract colors
function parseGradient(gradientString) {
  if (!gradientString) return { angle: 135, colors: [{ color: '#7c3aed', position: 0 }, { color: '#ec4899', position: 100 }] };
  
  // Try to extract angle
  const angleMatch = gradientString.match(/(\d+)deg/);
  const angle = angleMatch ? parseInt(angleMatch[1]) : 135;
  
  // Extract colors with positions
  const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g;
  const positionRegex = /(\d+)%/g;
  
  const colorMatches = gradientString.match(colorRegex) || ['#7c3aed', '#ec4899'];
  const positionMatches = [...gradientString.matchAll(/(\d+)%/g)].map(m => parseInt(m[1]));
  
  const colors = colorMatches.map((color, index) => ({
    color: color.startsWith('#') ? color : '#7c3aed',
    position: positionMatches[index] ?? (index * 100 / Math.max(colorMatches.length - 1, 1))
  }));
  
  return { angle, colors: colors.length >= 2 ? colors : [{ color: '#7c3aed', position: 0 }, { color: '#ec4899', position: 100 }] };
}

// Build gradient string from colors
function buildGradient(angle, colors) {
  const sortedColors = [...colors].sort((a, b) => a.position - b.position);
  const colorStops = sortedColors.map(c => `${c.color} ${c.position}%`).join(', ');
  return `linear-gradient(${angle}deg, ${colorStops})`;
}

export default function GradientPicker({ value, onChange, label, description }) {
  const [isOpen, setIsOpen] = useState(false);
  const [gradient, setGradient] = useState(() => parseGradient(value));
  const containerRef = useRef(null);

  useEffect(() => {
    setGradient(parseGradient(value));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorChange = (index, newColor) => {
    const newColors = [...gradient.colors];
    newColors[index] = { ...newColors[index], color: newColor };
    const newGradient = { ...gradient, colors: newColors };
    setGradient(newGradient);
    onChange(buildGradient(newGradient.angle, newGradient.colors));
  };

  const handlePositionChange = (index, newPosition) => {
    const newColors = [...gradient.colors];
    newColors[index] = { ...newColors[index], position: newPosition };
    const newGradient = { ...gradient, colors: newColors };
    setGradient(newGradient);
    onChange(buildGradient(newGradient.angle, newGradient.colors));
  };

  const handleAngleChange = (newAngle) => {
    const newGradient = { ...gradient, angle: newAngle };
    setGradient(newGradient);
    onChange(buildGradient(newGradient.angle, newGradient.colors));
  };

  const addColor = () => {
    if (gradient.colors.length >= 5) return;
    const newPosition = 50;
    const newColors = [...gradient.colors, { color: '#4f46e5', position: newPosition }];
    const newGradient = { ...gradient, colors: newColors };
    setGradient(newGradient);
    onChange(buildGradient(newGradient.angle, newGradient.colors));
  };

  const removeColor = (index) => {
    if (gradient.colors.length <= 2) return;
    const newColors = gradient.colors.filter((_, i) => i !== index);
    const newGradient = { ...gradient, colors: newColors };
    setGradient(newGradient);
    onChange(buildGradient(newGradient.angle, newGradient.colors));
  };

  const presetGradients = [
    { name: 'סגול-ורוד', value: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #ec4899 100%)' },
    { name: 'כחול-טורקיז', value: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' },
    { name: 'כתום-אדום', value: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' },
    { name: 'ירוק-טורקיז', value: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' },
    { name: 'שחור-אפור', value: 'linear-gradient(135deg, #1f2937 0%, #4b5563 100%)' },
    { name: 'זהב', value: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)' },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Main Display */}
      <div 
        className="p-4 border-2 border-purple-200 rounded-xl bg-purple-50/60 cursor-pointer hover:border-purple-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-bold text-gray-900">{label}</div>
            <div className="text-sm text-gray-600">{description}</div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-12 w-36 rounded-lg shadow-inner border-2 border-white/60"
              style={{ background: value || buildGradient(gradient.angle, gradient.colors) }}
            />
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4 space-y-4">
          
          {/* Live Preview */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">תצוגה מקדימה</label>
            <div 
              className="h-20 rounded-xl border-2 border-gray-200 shadow-inner"
              style={{ background: buildGradient(gradient.angle, gradient.colors) }}
            />
          </div>

          {/* Angle Control */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-gray-700">זווית הגרדיאנט</label>
              <span className="text-xs font-mono text-gray-500">{gradient.angle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={gradient.angle}
              onChange={(e) => handleAngleChange(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0° ימינה</span>
              <span>90° למטה</span>
              <span>180° שמאלה</span>
              <span>270° למעלה</span>
            </div>
          </div>

          {/* Color Stops */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-700">צבעים ({gradient.colors.length}/5)</label>
              {gradient.colors.length < 5 && (
                <button
                  type="button"
                  onClick={addColor}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  + הוסף צבע
                </button>
              )}
            </div>
            <div className="space-y-3">
              {gradient.colors.map((colorStop, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <input
                    type="color"
                    value={colorStop.color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="text"
                        value={colorStop.color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded font-mono text-xs"
                        dir="ltr"
                      />
                      <span className="text-xs text-gray-500 w-12">{colorStop.position}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={colorStop.position}
                      onChange={(e) => handlePositionChange(index, parseInt(e.target.value))}
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200"
                    />
                  </div>
                  {gradient.colors.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                      title="הסר צבע"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preset Gradients */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">גרדיאנטים מוכנים</label>
            <div className="grid grid-cols-3 gap-2">
              {presetGradients.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    onChange(preset.value);
                    setGradient(parseGradient(preset.value));
                  }}
                  className="flex flex-col items-center gap-1 p-2 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
                >
                  <div 
                    className="w-full h-8 rounded"
                    style={{ background: preset.value }}
                  />
                  <span className="text-xs text-gray-600">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Raw CSS Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">קוד CSS (מתקדם)</label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-xs focus:outline-none focus:border-blue-500"
              placeholder="linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)"
              dir="ltr"
            />
          </div>
        </div>
      )}
    </div>
  );
}
