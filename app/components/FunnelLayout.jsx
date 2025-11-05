/**
 * Funnel Layout Component
 * Stage 15.5 - Group-Buy Funnel UI Harmonization
 * 
 * Unified layout for purchase funnel pages
 */

import ProgressStepper from "./ProgressStepper";

export default function FunnelLayout({
  children,
  currentStep = 1,
  showProgress = true,
  maxWidth = "4xl",
}) {
  const maxWidthClasses = {
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="font-bold text-xl text-gray-900">VIPO</span>
          </div>
          
          {/* Help Link */}
          <a
            href="/help"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">עזרה</span>
          </a>
        </div>
      </header>

      {/* Progress Stepper */}
      {showProgress && (
        <div className="bg-white border-b py-6">
          <ProgressStepper currentStep={currentStep} />
        </div>
      )}

      {/* Main Content */}
      <main className={`${maxWidthClasses[maxWidth]} mx-auto px-4 py-8`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <a href="/terms" className="hover:text-gray-900">תנאי שימוש</a>
              <span>•</span>
              <a href="/privacy" className="hover:text-gray-900">מדיניות פרטיות</a>
              <span>•</span>
              <a href="/contact" className="hover:text-gray-900">צור קשר</a>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>תשלום מאובטח SSL</span>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-gray-500">
            © 2025 VIPO. כל הזכויות שמורות.
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Two Column Layout (Form + Summary)
 */
export function TwoColumnFunnelLayout({
  children,
  sidebar,
  currentStep,
}) {
  return (
    <FunnelLayout currentStep={currentStep} maxWidth="7xl">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content (2/3) */}
        <div className="md:col-span-2">
          {children}
        </div>

        {/* Sidebar (1/3) */}
        <div className="md:col-span-1">
          <div className="sticky top-4">
            {sidebar}
          </div>
        </div>
      </div>
    </FunnelLayout>
  );
}
