/**
 * Empty State Component
 * Stage 15.10 - Error & Empty States
 * 
 * Friendly empty states for tables, lists, and pages
 */

export default function EmptyState({
  icon = "📦",
  title = "אין נתונים",
  description = "לא נמצאו פריטים להצגה",
  action,
  className = "",
}) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {/* Icon */}
      <div className="text-6xl mb-4" role="img" aria-label={title}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {action.icon && <span>{action.icon}</span>}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
}

/**
 * Predefined Empty States
 */

export function NoDataEmpty({ onRefresh }) {
  return (
    <EmptyState
      icon="📊"
      title="אין נתונים להצגה"
      description="לא נמצאו נתונים. נסה לרענן את הדף או לבדוק את החיבור."
      action={
        onRefresh && {
          label: "רענן",
          icon: "🔄",
          onClick: onRefresh,
        }
      }
    />
  );
}

export function NoResultsEmpty({ onClear }) {
  return (
    <EmptyState
      icon="🔍"
      title="לא נמצאו תוצאות"
      description="לא מצאנו תוצאות התואמות לחיפוש שלך. נסה מילות חיפוש אחרות."
      action={
        onClear && {
          label: "נקה חיפוש",
          icon: "✕",
          onClick: onClear,
        }
      }
    />
  );
}

export function NoTransactionsEmpty({ onCreate }) {
  return (
    <EmptyState
      icon="💳"
      title="אין עסקאות עדיין"
      description="כשתתחיל למכור, העסקאות שלך יופיעו כאן."
      action={
        onCreate && {
          label: "צור עסקה ראשונה",
          icon: "+",
          onClick: onCreate,
        }
      }
    />
  );
}

export function NoReferralsEmpty() {
  return (
    <EmptyState
      icon="👥"
      title="אין הפניות עדיין"
      description="שתף את קישור ההפניה שלך והתחל להרוויח עמלות!"
      action={{
        label: "העתק קישור",
        icon: "🔗",
        onClick: () => {
          const link = `${window.location.origin}/join?ref=${localStorage.getItem('referralId')}`;
          navigator.clipboard.writeText(link);
          alert('הקישור הועתק!');
        },
      }}
    />
  );
}

export function NoUsersEmpty({ onCreate }) {
  return (
    <EmptyState
      icon="👤"
      title="אין משתמשים במערכת"
      description="התחל בהוספת משתמשים למערכת."
      action={
        onCreate && {
          label: "הוסף משתמש",
          icon: "+",
          onClick: onCreate,
        }
      }
    />
  );
}

/**
 * Error State Component
 */
export function ErrorState({
  error = "משהו השתבש",
  description = "אירעה שגיאה בלתי צפויה. אנא נסה שוב.",
  onRetry,
  onGoBack,
  className = "",
}) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {/* Error Icon */}
      <div className="text-6xl mb-4" role="img" aria-label="שגיאה">
        ⚠️
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-red-800 mb-2">
        {error}
      </h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>נסה שוב</span>
          </button>
        )}

        {onGoBack && (
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>חזור</span>
          </button>
        )}
      </div>

      {/* Help Link */}
      <p className="text-sm text-gray-500 mt-6">
        צריך עזרה?{" "}
        <a href="/support" className="text-blue-600 hover:text-blue-700 underline">
          צור קשר עם התמיכה
        </a>
      </p>
    </div>
  );
}

/**
 * Loading State Component
 */
export function LoadingState({ message = "טוען..." }) {
  return (
    <div className="text-center py-12 px-4">
      {/* Spinner */}
      <div className="inline-block mb-4">
        <svg
          className="animate-spin h-12 w-12 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      {/* Message */}
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
}

/**
 * 404 Not Found State
 */
export function NotFoundState({ onGoHome }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        הדף לא נמצא
      </h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        הדף שחיפשת לא קיים או הוסר. אנא בדוק את הכתובת ונסה שוב.
      </p>
      <button
        onClick={onGoHome || (() => window.location.href = '/')}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>חזור לדף הבית</span>
      </button>
    </div>
  );
}
