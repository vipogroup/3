"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { refreshProductsFromApi } from "@/app/lib/products";

export default function NewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fullDescription: "",
    price: "",
    originalPrice: "",
    category: "",
    image: "",
    videoUrl: "", // YouTube embed URL
    inStock: true,
    stockCount: "",
    rating: "4.5",
    reviews: "0",
    purchaseType: "regular", // regular or group
    groupPurchaseDetails: {
      closingDays: "40",
      shippingDays: "60",
      minQuantity: "10",
      currentQuantity: "0"
    },
    features: ["", "", "", ""],
    specs: {
      "מפרט 1": "",
      "מפרט 2": "",
      "מפרט 3": "",
      "מפרט 4": "",
      "מפרט 5": "",
      "מפרט 6": ""
    }
  });

  const [categories, setCategories] = useState([
    "אביזרי מחשב",
    "אודיו",
    "מסכים",
    "ריהוט",
  ]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const categoryOptions = useMemo(() => categories.sort((a, b) => a.localeCompare(b, "he")), [categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      alert("נא להזין שם קטגוריה");
      return;
    }

    setCategories((prev) => {
      if (prev.some((cat) => cat.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return [...prev, trimmed];
    });
    setFormData((prev) => ({
      ...prev,
      category: trimmed,
    }));
    setNewCategory("");
    setShowAddCategory(false);
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [key]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const priceValue = parseFloat(formData.price) || 0;
      const originalPriceValue = formData.originalPrice ? parseFloat(formData.originalPrice) : null;
      const stockCountValue = parseInt(formData.stockCount) || 0;
      const ratingValue = parseFloat(formData.rating) || 0;
      const reviewsValue = parseInt(formData.reviews) || 0;
      const isGroupPurchase = formData.purchaseType === "group";

      const groupPurchaseDetails = isGroupPurchase
        ? {
            closingDays: parseInt(formData.groupPurchaseDetails.closingDays) || 0,
            shippingDays: parseInt(formData.groupPurchaseDetails.shippingDays) || 0,
            minQuantity: parseInt(formData.groupPurchaseDetails.minQuantity) || 1,
            currentQuantity: parseInt(formData.groupPurchaseDetails.currentQuantity) || 0,
            totalDays:
              (parseInt(formData.groupPurchaseDetails.closingDays) || 0) +
              (parseInt(formData.groupPurchaseDetails.shippingDays) || 0),
          }
        : null;

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        price: priceValue,
        originalPrice: originalPriceValue,
        category: formData.category,
        image: formData.image,
        imageUrl: formData.image,
        images: formData.image ? [formData.image] : [],
        videoUrl: formData.videoUrl || "",
        inStock: formData.inStock,
        stockCount: stockCountValue,
        rating: ratingValue,
        reviews: reviewsValue,
        purchaseType: formData.purchaseType,
        type: isGroupPurchase ? "group" : "online",
        groupPurchaseDetails,
        groupMinQuantity: groupPurchaseDetails?.minQuantity ?? null,
        groupCurrentQuantity: groupPurchaseDetails?.currentQuantity ?? null,
        expectedDeliveryDays: groupPurchaseDetails?.shippingDays ?? null,
        commission: priceValue * 0.1,
        features: formData.features.filter((f) => f.trim() !== ""),
        specs: Object.fromEntries(
          Object.entries(formData.specs).filter(([_, v]) => v.trim() !== "")
        ),
        active: true,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "יצירת המוצר נכשלה");
      }

      await response.json();
      await refreshProductsFromApi();
      window.dispatchEvent(new Event("productsUpdated"));

      alert("מוצר נוצר בהצלחה! המוצר יופיע בכל הדפים.");
      router.push("/admin/products");
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message || "שגיאה ביצירת המוצר");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>הוסף מוצר חדש</h1>
          <Link
            href="/admin/products"
            className="font-semibold px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl shadow-md transition-all text-xs sm:text-sm"
            style={{
              background: 'white',
              border: '2px solid #0891b2',
              color: '#0891b2'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
          >
            ← חזרה
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 text-white px-6 py-4 rounded-xl mb-6 shadow-lg">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">מידע בסיסי</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    שם המוצר *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                    placeholder="לדוגמה: מקלדת מכנית RGB"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    תיאור קצר *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                    placeholder="תיאור קצר של המוצר (1-2 שורות)"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    תיאור מלא *
                  </label>
                  <textarea
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                    placeholder="תיאור מפורט של המוצר (מספר פסקאות)"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    מחיר *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                    placeholder="450"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    מחיר מקורי (אופציונלי)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                    placeholder="599"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    קטגוריה *
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                    >
                      <option value="">בחר קטגוריה</option>
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddCategory((prev) => !prev)}
                      className="px-4 py-3 text-white rounded-xl transition-all"
                      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'}
                    >
                      {showAddCategory ? "בטל" : "קטגוריה חדשה"}
                    </button>
                  </div>
                  {showAddCategory && (
                    <div className="mt-3 rounded-xl p-4 space-y-3" style={{ background: 'rgba(8, 145, 178, 0.05)', border: '2px solid rgba(8, 145, 178, 0.2)' }}>
                      <label className="block text-sm font-semibold" style={{ color: '#1e3a8a' }}>
                        הזן שם קטגוריה חדש
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none transition-all"
                          style={{ borderColor: '#cbd5e1' }}
                          onFocus={(e) => e.currentTarget.style.borderColor = '#0891b2'}
                          onBlur={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                          placeholder="לדוגמה: מוצרי חשמל"
                        />
                        <button
                          type="button"
                          onClick={addCategory}
                          className="px-4 py-2 text-white rounded-lg transition-all"
                          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'}
                        >
                          הוסף
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    כמות במלאי *
                  </label>
                  <input
                    type="number"
                    name="stockCount"
                    value={formData.stockCount}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                    placeholder="15"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    קישור לתמונה *
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    השתמש ב-Unsplash או העלה תמונה לשרת
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    קישור לסרטון YouTube (אופציונלי)
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  />
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    <svg className="w-4 h-4" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>הדבק קישור YouTube Embed (לחץ שתף → הטמע → העתק HTML)</span>
                  </p>
                </div>

                {/* Purchase Type */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    סוג רכישה *
                  </label>
                  <select
                    name="purchaseType"
                    value={formData.purchaseType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                  >
                    <option value="regular">רכישה רגילה און-ליין (מלאי בארץ)</option>
                    <option value="group">רכישה קבוצתית במחיר מפעל</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    {formData.purchaseType === 'regular' ? (
                      <>
                        <svg className="w-4 h-4" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>משלוח מהיר - המוצר זמין במלאי בארץ</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>מחיר מפעל - הזמנה קבוצתית עם זמן המתנה</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Group Purchase Details - Only show if group purchase selected */}
                {formData.purchaseType === 'group' && (
                  <>
                    <div className="md:col-span-2 p-4 rounded-xl" style={{ background: 'rgba(8, 145, 178, 0.05)', border: '2px solid rgba(8, 145, 178, 0.2)' }}>
                      <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e3a8a' }}>
                        <svg className="w-5 h-5" style={{ color: '#0891b2' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>פרטי רכישה קבוצתית</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-blue-900 mb-1">
                            ימים עד סגירת מכירה *
                          </label>
                          <input
                            type="number"
                            value={formData.groupPurchaseDetails.closingDays}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              groupPurchaseDetails: {
                                ...prev.groupPurchaseDetails,
                                closingDays: e.target.value
                              }
                            }))}
                            required={formData.purchaseType === 'group'}
                            min="1"
                            className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600"
                            placeholder="40"
                          />
                          <p className="text-xs text-blue-700 mt-1">בדרך כלל 30-45 ימים</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-blue-900 mb-1">
                            ימי משלוח לאחר סגירה *
                          </label>
                          <input
                            type="number"
                            value={formData.groupPurchaseDetails.shippingDays}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              groupPurchaseDetails: {
                                ...prev.groupPurchaseDetails,
                                shippingDays: e.target.value
                              }
                            }))}
                            required={formData.purchaseType === 'group'}
                            min="1"
                            className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600"
                            placeholder="60"
                          />
                          <p className="text-xs text-blue-700 mt-1">בדרך כלל 45-90 ימים</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-blue-900 mb-1">
                            כמות מינימלית לסגירה *
                          </label>
                          <input
                            type="number"
                            value={formData.groupPurchaseDetails.minQuantity}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              groupPurchaseDetails: {
                                ...prev.groupPurchaseDetails,
                                minQuantity: e.target.value
                              }
                            }))}
                            required={formData.purchaseType === 'group'}
                            min="1"
                            className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600"
                            placeholder="10"
                          />
                          <p className="text-xs text-blue-700 mt-1">מינימום הזמנות לסגירת עסקה</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-blue-900 mb-1">
                            כמות נוכחית
                          </label>
                          <input
                            type="number"
                            value={formData.groupPurchaseDetails.currentQuantity}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              groupPurchaseDetails: {
                                ...prev.groupPurchaseDetails,
                                currentQuantity: e.target.value
                              }
                            }))}
                            min="0"
                            className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600"
                            placeholder="0"
                          />
                          <p className="text-xs text-blue-700 mt-1">מספר הזמנות נוכחי</p>
                        </div>
                      </div>

                      {/* Total Days Summary */}
                      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                        <p className="text-sm font-bold text-blue-900">
                          {'⏱️ סה&quot;כ זמן המתנה משוער:'} 
                          <span className="text-blue-600 text-lg mr-2">
                            {parseInt(formData.groupPurchaseDetails.closingDays) + parseInt(formData.groupPurchaseDetails.shippingDays)} ימים
                          </span>
                          ({parseInt(formData.groupPurchaseDetails.closingDays)} ימים סגירה + {parseInt(formData.groupPurchaseDetails.shippingDays)} ימים משלוח)
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="w-5 h-5 rounded"
                    style={{ accentColor: '#0891b2' }}
                  />
                  <label className="mr-3 text-sm font-bold text-gray-900">
                    במלאי
                  </label>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">תכונות עיקריות</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.features.map((feature, index) => (
                  <input
                    key={index}
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                    placeholder={`תכונה ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">מפרט טכני</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.specs).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleSpecChange(key, e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                      placeholder={`ערך עבור ${key}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">דירוג וביקורות</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    דירוג (1-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    מספר ביקורות
                  </label>
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 text-white font-bold text-base sm:text-lg py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
                style={{
                  background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)'
                }}
                onMouseEnter={(e) => !submitting && (e.currentTarget.style.background = 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)')}
                onMouseLeave={(e) => !submitting && (e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)')}
              >
                {submitting ? "יוצר מוצר..." : "צור מוצר"}
              </button>
              <Link
                href="/admin/products"
                className="flex-1 font-bold text-base sm:text-lg py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all text-center"
                style={{
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                ביטול
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
