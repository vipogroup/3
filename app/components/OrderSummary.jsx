"use client";

/**
 * Order Summary Component
 * Stage 15.5 - Group-Buy Funnel UI Harmonization
 * 
 * Sticky order summary for mobile devices
 */

export default function OrderSummary({ 
  productName = "מוצר לדוגמה",
  price = 1299,
  quantity = 1,
  discount = 0,
  onContinue,
  continueText = "המשך",
  showDetails = true,
  isSticky = true,
}) {
  const subtotal = price * quantity;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const summaryContent = (
    <div className="bg-white border-t shadow-lg p-4">
      {/* Compact View (Mobile Sticky) */}
      {!showDetails && (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">סה"כ לתשלום</p>
            <p className="text-2xl font-bold text-gray-900">₪{total.toLocaleString()}</p>
          </div>
          {onContinue && (
            <button
              onClick={onContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              {continueText}
            </button>
          )}
        </div>
      )}

      {/* Detailed View */}
      {showDetails && (
        <div className="space-y-4">
          {/* Product Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">סיכום הזמנה</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{productName}</span>
              <span className="font-medium">₪{price.toLocaleString()}</span>
            </div>
            {quantity > 1 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">כמות</span>
                <span className="font-medium">×{quantity}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">סכום ביניים</span>
              <span>₪{subtotal.toLocaleString()}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>הנחה ({discount}%)</span>
                <span>-₪{discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">סה"כ לתשלום</span>
                <span className="text-2xl font-bold text-gray-900">₪{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          {onContinue && (
            <button
              onClick={onContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {continueText}
            </button>
          )}

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>תשלום מאובטח</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>אחריות מלאה</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Sticky version for mobile
  if (isSticky) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        {summaryContent}
      </div>
    );
  }

  // Regular version for desktop
  return (
    <div className="hidden md:block bg-white rounded-lg border shadow-sm p-6">
      {summaryContent}
    </div>
  );
}

/**
 * Desktop Sidebar Summary
 */
export function SidebarSummary({ 
  productName,
  price,
  quantity,
  discount,
  onContinue,
  continueText,
}) {
  return (
    <div className="hidden md:block sticky top-4">
      <OrderSummary
        productName={productName}
        price={price}
        quantity={quantity}
        discount={discount}
        onContinue={onContinue}
        continueText={continueText}
        showDetails={true}
        isSticky={false}
      />
    </div>
  );
}
