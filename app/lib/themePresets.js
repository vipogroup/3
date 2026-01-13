// Theme Presets - סגנונות מוכנים של אתרי מכירות מפורסמים

export const THEME_PRESETS = {
  'vipo-turquoise': {
    name: 'VIPO כחול-טורקיז',
    description: 'העיצוב החדש - גרדיאנט כחול-טורקיז מודרני ומקצועי',
    preview: 'diamond',
    colors: {
      primaryColor: '#0891b2', // Turquoise
      secondaryColor: '#1e3a8a', // Deep Blue
      accentColor: '#06b6d4', // Cyan
      successColor: '#16a34a', // Green
      warningColor: '#f59e0b', // Amber
      dangerColor: '#dc2626', // Red
      backgroundColor: '#ffffff', // White
      textColor: '#1f2937', // Gray 800
      backgroundGradient: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
      cardGradient: 'linear-gradient(white, white)',
      buttonGradient: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
    },
    typography: {
      fontFamily: "'Inter', 'Heebo', sans-serif",
      lineHeight: 1.6,
      letterSpacing: '0.01em',
      direction: 'rtl',
    },
  },

  vipo: {
    name: 'VIPO קלאסי',
    description: 'סגנון VIPO המקורי - סגול ורוד',
    preview: 'palette',
    colors: {
      primaryColor: '#3498db',
      secondaryColor: '#2980b9',
      accentColor: '#5dade2',
      successColor: '#3498db',
      warningColor: '#5dade2',
      dangerColor: '#e74c3c',
      backgroundColor: '#f8f9fa',
      textColor: '#2c3e50',
      backgroundGradient: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 52%, #ec4899 100%)',
      cardGradient:
        'linear-gradient(145deg, rgba(255,255,255,0.86) 0%, rgba(226,232,255,0.95) 100%)',
      buttonGradient: 'linear-gradient(130deg, #7c3aed 0%, #4f46e5 55%, #ec4899 100%)',
    },
    typography: {
      fontFamily: "'Inter', 'Heebo', sans-serif",
      lineHeight: 1.5,
      letterSpacing: '0.01em',
      direction: 'rtl',
    },
  },

  amazon: {
    name: 'Amazon',
    description: 'סגנון אמזון - כתום וכחול מקצועי',
    preview: 'cart',
    colors: {
      primaryColor: '#FF9900', // Amazon Orange (הצבע המפורסם של אמזון)
      secondaryColor: '#232F3E', // Amazon Dark Blue (הכחול הכהה של הלוגו)
      accentColor: '#146EB4', // Amazon Link Blue
      successColor: '#067D62', // Amazon Success Green
      warningColor: '#F0C14B', // Amazon Button Yellow (כפתור "הוסף לעגלה")
      dangerColor: '#B12704', // Amazon Red
      backgroundColor: '#EAEDED', // Amazon Light Gray (רקע ראשי)
      textColor: '#0F1111', // Amazon Text Black
    },
  },

  aliexpress: {
    name: 'AliExpress',
    description: 'סגנון עליאקספרס - אדום ולבן דינמי',
    preview: 'store',
    colors: {
      primaryColor: '#FF4747', // AliExpress Red (האדום המפורסם)
      secondaryColor: '#E62E04', // AliExpress Deep Red
      accentColor: '#FFD700', // AliExpress Gold (מבצעים)
      successColor: '#52C41A', // AliExpress Green
      warningColor: '#FAAD14', // AliExpress Orange Warning
      dangerColor: '#FF4747', // Error Red
      backgroundColor: '#F5F5F5', // AliExpress Gray Background
      textColor: '#212121', // AliExpress Dark Text
    },
  },

  ebay: {
    name: 'eBay',
    description: 'סגנון איביי - צבעוני ומרגש',
    preview: 'target',
    colors: {
      primaryColor: '#3665F3', // eBay Blue (הצבע המרכזי החדש)
      secondaryColor: '#E53238', // eBay Red (הלוגו הקלאסי)
      accentColor: '#F5AF02', // eBay Yellow (הדגשות)
      successColor: '#86B817', // eBay Green
      warningColor: '#F5AF02', // Yellow Warning
      dangerColor: '#DD1E31', // eBay Red Error
      backgroundColor: '#F7F7F7', // eBay Light Gray
      textColor: '#191919', // eBay Dark Text
    },
  },

  walmart: {
    name: 'Walmart',
    description: 'סגנון וולמארט - כחול וצהוב בהיר',
    preview: 'building',
    colors: {
      primaryColor: '#0071CE', // Walmart Blue (הכחול המפורסם)
      secondaryColor: '#FFC220', // Walmart Spark Yellow (צהוב הניצוץ)
      accentColor: '#0071DC', // Walmart Bright Blue
      successColor: '#74B72E', // Walmart Green
      warningColor: '#FFC220', // Walmart Yellow
      dangerColor: '#E02020', // Walmart Red
      backgroundColor: '#F2F8FD', // Walmart Light Blue Background
      textColor: '#2E2F32', // Walmart Dark Text
    },
  },

  etsy: {
    name: 'Etsy',
    description: 'סגנון אטסי - כתום חם ואורגני',
    preview: 'palette',
    colors: {
      primaryColor: '#F56400', // Etsy Orange (הכתום המקורי)
      secondaryColor: '#222222', // Etsy Black
      accentColor: '#595959', // Etsy Gray
      successColor: '#00A699', // Etsy Teal
      warningColor: '#FFB400', // Etsy Amber
      dangerColor: '#D32F2F', // Etsy Red
      backgroundColor: '#FFFFFF', // White Background
      textColor: '#222222', // Etsy Black Text
    },
  },

  shopify: {
    name: 'Shopify',
    description: 'סגנון שופיפיי - ירוק מנטה מודרני',
    preview: 'shopping-bag',
    colors: {
      primaryColor: '#5C6AC4', // Shopify Purple (הסגול החדש)
      secondaryColor: '#008060', // Shopify Green (הירוק הקלאסי)
      accentColor: '#00C6B5', // Shopify Teal
      successColor: '#50B83C', // Shopify Success Green
      warningColor: '#FFEA8A', // Shopify Yellow
      dangerColor: '#E00B00', // Shopify Critical Red
      backgroundColor: '#F4F6F8', // Shopify Background Gray
      textColor: '#202223', // Shopify Text Dark
    },
  },
};

// פונקציה להחלת preset
export function applyPreset(presetName) {
  const preset = THEME_PRESETS[presetName];
  if (!preset) return null;

  return {
    siteName: 'VIPO',
    siteDescription: `מערכת מתקדמת בסגנון ${preset.name}`,
    ...preset.colors,
    ...(preset.gradients || {}),
    backgroundGradient: preset.colors.backgroundGradient || preset.backgroundGradient,
    cardGradient: preset.colors.cardGradient || preset.cardGradient,
    buttonGradient: preset.colors.buttonGradient || preset.buttonGradient,
    ...(preset.typography || {}),
    themePreset: presetName,
  };
}

// פונקציה לקבלת כל ה-presets
export function getAllPresets() {
  return Object.entries(THEME_PRESETS).map(([key, preset]) => ({
    id: key,
    ...preset,
  }));
}
