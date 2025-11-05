// Theme Presets - סגנונות מוכנים של אתרי מכירות מפורסמים

export const THEME_PRESETS = {
  amazon: {
    name: "Amazon",
    description: "סגנון אמזון - כתום וכחול מקצועי",
    preview: "🛒",
    colors: {
      primaryColor: "#FF9900",      // Amazon Orange
      secondaryColor: "#146EB4",    // Amazon Blue
      accentColor: "#00A8E1",       // Light Blue
      successColor: "#067D62",      // Amazon Green
      warningColor: "#F0AD4E",      // Warning Orange
      dangerColor: "#D5281B",       // Amazon Red
      backgroundColor: "#FFFFFF",    // White
      textColor: "#0F1111",         // Almost Black
    }
  },
  
  aliexpress: {
    name: "AliExpress",
    description: "סגנון עליאקספרס - אדום ולבן דינמי",
    preview: "🏪",
    colors: {
      primaryColor: "#FF4747",      // AliExpress Red
      secondaryColor: "#FF6A00",    // Orange
      accentColor: "#FFD700",       // Gold
      successColor: "#52C41A",      // Green
      warningColor: "#FAAD14",      // Yellow
      dangerColor: "#F5222D",       // Red
      backgroundColor: "#F5F5F5",    // Light Gray
      textColor: "#333333",         // Dark Gray
    }
  },
  
  ebay: {
    name: "eBay",
    description: "סגנון איביי - צבעוני ומרגש",
    preview: "🎯",
    colors: {
      primaryColor: "#E53238",      // eBay Red
      secondaryColor: "#0064D2",    // eBay Blue
      accentColor: "#F5AF02",       // eBay Yellow
      successColor: "#86B817",      // eBay Green
      warningColor: "#F5AF02",      // Yellow
      dangerColor: "#E53238",       // Red
      backgroundColor: "#FFFFFF",    // White
      textColor: "#191919",         // Black
    }
  },
  
  walmart: {
    name: "Walmart",
    description: "סגנון וולמארט - כחול וצהוב בהיר",
    preview: "🏬",
    colors: {
      primaryColor: "#0071CE",      // Walmart Blue
      secondaryColor: "#FFC220",    // Walmart Yellow
      accentColor: "#74D1EA",       // Light Blue
      successColor: "#76B82A",      // Green
      warningColor: "#FFC220",      // Yellow
      dangerColor: "#E02020",       // Red
      backgroundColor: "#F2F8FD",    // Very Light Blue
      textColor: "#2E2F32",         // Dark Gray
    }
  },
  
  etsy: {
    name: "Etsy",
    description: "סגנון אטסי - כתום חם ואורגני",
    preview: "🎨",
    colors: {
      primaryColor: "#F1641E",      // Etsy Orange
      secondaryColor: "#F56400",    // Dark Orange
      accentColor: "#FFD4A3",       // Light Orange
      successColor: "#00A699",      // Teal
      warningColor: "#F9C74F",      // Yellow
      dangerColor: "#E94B3C",       // Red
      backgroundColor: "#FFFFFF",    // White
      textColor: "#222222",         // Black
    }
  },
  
  shopify: {
    name: "Shopify",
    description: "סגנון שופיפיי - ירוק מנטה מודרני",
    preview: "🛍️",
    colors: {
      primaryColor: "#96BF48",      // Shopify Green
      secondaryColor: "#5E8E3E",    // Dark Green
      accentColor: "#7AB55C",       // Light Green
      successColor: "#008060",      // Success Green
      warningColor: "#FFC453",      // Yellow
      dangerColor: "#E32C2B",       // Red
      backgroundColor: "#F6F6F7",    // Light Gray
      textColor: "#202223",         // Dark
    }
  }
};

// פונקציה להחלת preset
export function applyPreset(presetName) {
  const preset = THEME_PRESETS[presetName];
  if (!preset) return null;
  
  return {
    siteName: "VIPO",
    siteDescription: `מערכת מתקדמת בסגנון ${preset.name}`,
    ...preset.colors
  };
}

// פונקציה לקבלת כל ה-presets
export function getAllPresets() {
  return Object.entries(THEME_PRESETS).map(([key, preset]) => ({
    id: key,
    ...preset
  }));
}
