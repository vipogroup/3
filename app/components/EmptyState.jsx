/**
 * Empty State Component
 * Stage 15.10 - Error & Empty States
 *
 * Friendly empty states for tables, lists, and pages
 */

function PackageIcon({ className = 'w-16 h-16' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 7.5L12 12l8.25-4.5m-16.5 0L12 3l8.25 4.5m-16.5 0V16.5L12 21m8.25-13.5V16.5L12 21m0-9v9"
      />
    </svg>
  );
}

function ChartIcon({ className = 'w-16 h-16' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 20h16"
      />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8 20v-8" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 20v-12" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M16 20v-5" />
    </svg>
  );
}

function RefreshIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.6m15.4 2A8 8 0 004.6 9m0 0H9m11 11v-5h-.6m0 0a8 8 0 01-15.4-2m15.4 2H15"
      />
    </svg>
  );
}

function SearchIcon({ className = 'w-16 h-16' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6l12 12M6 18L18 6"
      />
    </svg>
  );
}

function CreditCardIcon({ className = 'w-16 h-16' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="14" width="4" height="2" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function UsersIcon({ className = 'w-16 h-16' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M3.5 19v-.75A5.5 5.5 0 019 12.75h0A5.5 5.5 0 0114.5 18.25V19"
      />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M14.5 18.5a4.5 4.5 0 014.5 4.5"
      />
    </svg>
  );
}

function UserIcon({ className = 'w-16 h-16' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M5 20v-.75A7.25 7.25 0 0112.25 12h.5A7.25 7.25 0 0120 19.25V20"
      />
    </svg>
  );
}

function LinkIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 12a3 3 0 010-4.24l3-3a3 3 0 014.24 4.24l-.88.88"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 12a3 3 0 010 4.24l-3 3a3 3 0 11-4.24-4.24l.88-.88"
      />
    </svg>
  );
}

function PlusIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 6v12M6 12h12" />
    </svg>
  );
}

function WarningIcon({ className = 'w-16 h-16' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4l8 14H4l8-14z"
      />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 10v4" />
      <circle cx="12" cy="16.5" r=".75" fill="currentColor" />
    </svg>
  );
}

function CompassIcon({ className = 'w-16 h-16' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.5 9.5l7-3-3 7-7 3 3-7z"
      />
    </svg>
  );
}

export default function EmptyState({
  icon = <PackageIcon className="w-16 h-16 text-purple-500" />,
  title = 'אין נתונים',
  description = 'לא נמצאו פריטים להצגה',
  action,
  className = '',
}) {
  const renderIcon = (displayIcon) => {
    if (!displayIcon) return null;
    if (typeof displayIcon === 'string') {
      return (
        <span className="text-6xl" role="img" aria-label={title}>
          {displayIcon}
        </span>
      );
    }
    return displayIcon;
  };

  const renderActionIcon = (actionIcon) => {
    if (!actionIcon) return null;
    if (typeof actionIcon === 'string') {
      return <span>{actionIcon}</span>;
    }
    return actionIcon;
  };

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {/* Icon */}
      <div
        className="mb-4 flex justify-center text-purple-500"
        aria-hidden={typeof icon !== 'string'}
      >
        {renderIcon(icon)}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {action.icon && renderActionIcon(action.icon)}
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
      icon={<ChartIcon className="w-16 h-16 text-blue-500" />}
      title="אין נתונים להצגה"
      description="לא נמצאו נתונים. נסה לרענן את הדף או לבדוק את החיבור."
      action={
        onRefresh && {
          label: 'רענן',
          icon: <RefreshIcon className="w-5 h-5" />,
          onClick: onRefresh,
        }
      }
    />
  );
}

export function NoResultsEmpty({ onClear }) {
  return (
    <EmptyState
      icon={<SearchIcon className="w-16 h-16 text-indigo-500" />}
      title="לא נמצאו תוצאות"
      description="לא מצאנו תוצאות התואמות לחיפוש שלך. נסה מילות חיפוש אחרות."
      action={
        onClear && {
          label: 'נקה חיפוש',
          icon: <CloseIcon className="w-5 h-5" />,
          onClick: onClear,
        }
      }
    />
  );
}

export function NoTransactionsEmpty({ onCreate }) {
  return (
    <EmptyState
      icon={<CreditCardIcon className="w-16 h-16 text-emerald-500" />}
      title="אין עסקאות עדיין"
      description="כשתתחיל למכור, העסקאות שלך יופיעו כאן."
      action={
        onCreate && {
          label: 'צור עסקה ראשונה',
          icon: <PlusIcon className="w-5 h-5" />,
          onClick: onCreate,
        }
      }
    />
  );
}

export function NoReferralsEmpty() {
  return (
    <EmptyState
      icon={<UsersIcon className="w-16 h-16 text-purple-500" />}
      title="אין הפניות עדיין"
      description="שתף את קישור ההפניה שלך והתחל להרוויח עמלות!"
      action={{
        label: 'העתק קישור',
        icon: <LinkIcon className="w-5 h-5" />,
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
      icon={<UserIcon className="w-16 h-16 text-blue-500" />}
      title="אין משתמשים במערכת"
      description="התחל בהוספת משתמשים למערכת."
      action={
        onCreate && {
          label: 'הוסף משתמש',
          icon: <PlusIcon className="w-5 h-5" />,
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
  error = 'משהו השתבש',
  description = 'אירעה שגיאה בלתי צפויה. אנא נסה שוב.',
  onRetry,
  onGoBack,
  className = '',
}) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {/* Error Icon */}
      <div className="mb-4 flex justify-center text-red-500" aria-hidden="true">
        <WarningIcon className="w-16 h-16" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-red-800 mb-2">{error}</h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>חזור</span>
          </button>
        )}
      </div>

      {/* Help Link */}
      <p className="text-sm text-gray-500 mt-6">
        צריך עזרה?{' '}
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
export function LoadingState({ message = 'טוען...' }) {
  return (
    <div className="text-center py-12 px-4">
      {/* Spinner */}
      <div className="inline-block mb-4">
        <svg className="animate-spin h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
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
      <div className="mb-4 flex justify-center text-indigo-500">
        <CompassIcon className="w-20 h-20" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">הדף לא נמצא</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        הדף שחיפשת לא קיים או הוסר. אנא בדוק את הכתובת ונסה שוב.
      </p>
      <button
        onClick={onGoHome || (() => (window.location.href = '/'))}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span>חזור לדף הבית</span>
      </button>
    </div>
  );
}
