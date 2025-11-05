"use client";

/**
 * Progress Stepper Component
 * Stage 15.5 - Group-Buy Funnel UI Harmonization
 * 
 * Shows user progress through the purchase funnel
 */

export default function ProgressStepper({ currentStep = 1 }) {
  const steps = [
    { number: 1, label: "הצטרפות", path: "/join" },
    { number: 2, label: "סיכום", path: "/summary" },
    { number: 3, label: "תשלום", path: "/payment" },
    { number: 4, label: "אישור", path: "/thankyou" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-300
                  ${
                    step.number < currentStep
                      ? "bg-green-500 text-white" // Completed
                      : step.number === currentStep
                      ? "bg-blue-600 text-white ring-4 ring-blue-200" // Current
                      : "bg-gray-200 text-gray-500" // Upcoming
                  }
                `}
              >
                {step.number < currentStep ? (
                  // Checkmark for completed steps
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`
                  mt-2 text-sm font-medium
                  ${
                    step.number <= currentStep
                      ? "text-gray-900"
                      : "text-gray-500"
                  }
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  w-16 h-0.5 mx-2 transition-all duration-300
                  ${
                    step.number < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            שלב {currentStep} מתוך {steps.length}
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {steps[currentStep - 1]?.label}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Labels */}
        <div className="flex justify-between mt-2">
          {steps.map((step) => (
            <span
              key={step.number}
              className={`
                text-xs
                ${
                  step.number <= currentStep
                    ? "text-gray-900 font-medium"
                    : "text-gray-400"
                }
              `}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Progress Indicator (for sticky header)
 */
export function CompactProgress({ currentStep = 1, totalSteps = 4 }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-600">
        {currentStep}/{totalSteps}
      </span>
      <div className="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
