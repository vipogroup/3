"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addProduct } from "@/app/lib/products";

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
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
      // Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description,
        fullDescription: formData.fullDescription,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        image: formData.image,
        images: [formData.image, formData.image, formData.image], // 3 copies for gallery
        videoUrl: formData.videoUrl || null,
        inStock: formData.inStock,
        stockCount: parseInt(formData.stockCount) || 0,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        purchaseType: formData.purchaseType,
        groupPurchaseDetails: formData.purchaseType === 'group' ? {
          closingDays: parseInt(formData.groupPurchaseDetails.closingDays),
          shippingDays: parseInt(formData.groupPurchaseDetails.shippingDays),
          minQuantity: parseInt(formData.groupPurchaseDetails.minQuantity),
          currentQuantity: parseInt(formData.groupPurchaseDetails.currentQuantity),
          totalDays: parseInt(formData.groupPurchaseDetails.closingDays) + parseInt(formData.groupPurchaseDetails.shippingDays)
        } : null,
        features: formData.features.filter(f => f.trim() !== ""),
        specs: Object.fromEntries(
          Object.entries(formData.specs).filter(([_, v]) => v.trim() !== "")
        )
      };

      // Add product using the library function
      const newProduct = addProduct(productData);
      
      console.log("Product created:", newProduct);
      
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-white">הוסף מוצר חדש</h1>
          <Link
            href="/admin/products"
            className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
                    placeholder="599"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    קטגוריה *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
                  >
                    <option value="">בחר קטגוריה</option>
                    <option value="אביזרי מחשב">אביזרי מחשב</option>
                    <option value="אודיו">אודיו</option>
                    <option value="מסכים">מסכים</option>
                    <option value="ריהוט">ריהוט</option>
                  </select>
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    🎥 הדבק קישור YouTube Embed (לחץ שתף → הטמע → העתק HTML)
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
                  >
                    <option value="regular">רכישה רגילה און-ליין (מלאי בארץ)</option>
                    <option value="group">רכישה קבוצתית במחיר מפעל</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.purchaseType === 'regular' 
                      ? '🚚 משלוח מהיר - המוצר זמין במלאי בארץ'
                      : '🏭 מחיר מפעל - הזמנה קבוצתית עם זמן המתנה'}
                  </p>
                </div>

                {/* Group Purchase Details - Only show if group purchase selected */}
                {formData.purchaseType === 'group' && (
                  <>
                    <div className="md:col-span-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                      <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <span>🏭</span>
                        פרטי רכישה קבוצתית
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
                          ⏱️ סה"כ זמן המתנה משוער: 
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
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-xl ${
                  submitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "יוצר מוצר..." : "✓ צור מוצר"}
              </button>
              <Link
                href="/admin/products"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold text-lg py-4 rounded-xl transition-all text-center"
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
