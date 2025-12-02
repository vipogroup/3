'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { refreshProductsFromApi } from '@/app/lib/products';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [productLoading, setProductLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fullDescription: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    videoUrl: '',
    inStock: true,
    stockCount: '',
    rating: '4.5',
    reviews: '0',
    purchaseType: 'regular',
    groupPurchaseDetails: {
      closingDays: '40',
      shippingDays: '60',
      minQuantity: '10',
      currentQuantity: '0',
    },
    features: ['', '', '', ''],
    specs: {
      'מפרט 1': '',
      'מפרט 2': '',
      'מפרט 3': '',
      'מפרט 4': '',
      'מפרט 5': '',
      'מפרט 6': '',
    },
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setProductLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'מוצר לא נמצא' : 'טעינת המוצר נכשלה');
        }

        const loadedProduct = await res.json();
        if (cancelled) return;

        setFormData({
          name: loadedProduct.name || '',
          description: loadedProduct.description || '',
          fullDescription: loadedProduct.fullDescription || '',
          price: loadedProduct.price?.toString() || '',
          originalPrice: loadedProduct.originalPrice?.toString() || '',
          category: loadedProduct.category || '',
          image: loadedProduct.image || loadedProduct.imageUrl || '',
          videoUrl: loadedProduct.videoUrl || '',
          inStock: loadedProduct.inStock !== undefined ? loadedProduct.inStock : true,
          stockCount: loadedProduct.stockCount?.toString() || '',
          rating: loadedProduct.rating?.toString() || '4.5',
          reviews: loadedProduct.reviews?.toString() || '0',
          purchaseType: loadedProduct.purchaseType || 'regular',
          groupPurchaseDetails: loadedProduct.groupPurchaseDetails || {
            closingDays: '40',
            shippingDays: '60',
            minQuantity: '10',
            currentQuantity: '0',
          },
          features:
            Array.isArray(loadedProduct.features) && loadedProduct.features.length
              ? loadedProduct.features
              : ['', '', '', ''],
          specs:
            loadedProduct.specs && Object.keys(loadedProduct.specs).length
              ? loadedProduct.specs
              : {
                  'מפרט 1': '',
                  'מפרט 2': '',
                  'מפרט 3': '',
                  'מפרט 4': '',
                  'מפרט 5': '',
                  'מפרט 6': '',
                },
        });
      } catch (err) {
        console.error('Failed to load product', err);
        if (!cancelled) {
          setError(err.message || 'טעינת המוצר נכשלה');
        }
      } finally {
        if (!cancelled) {
          setProductLoading(false);
        }
      }
    }

    if (params?.id) {
      loadProduct();
    }

    return () => {
      cancelled = true;
    };
  }, [params?.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSpecChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      specs: { ...prev.specs, [key]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        image: formData.image,
        imageUrl: formData.image,
        images: formData.image ? [formData.image] : [],
        videoUrl: formData.videoUrl || '',
        inStock: formData.inStock,
        stockCount: parseInt(formData.stockCount) || 0,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
        purchaseType: formData.purchaseType,
        groupPurchaseDetails:
          formData.purchaseType === 'group'
            ? {
                closingDays: parseInt(formData.groupPurchaseDetails.closingDays) || 0,
                shippingDays: parseInt(formData.groupPurchaseDetails.shippingDays) || 0,
                minQuantity: parseInt(formData.groupPurchaseDetails.minQuantity) || 1,
                currentQuantity: parseInt(formData.groupPurchaseDetails.currentQuantity) || 0,
                totalDays:
                  (parseInt(formData.groupPurchaseDetails.closingDays) || 0) +
                  (parseInt(formData.groupPurchaseDetails.shippingDays) || 0),
              }
            : null,
        features: formData.features.filter((f) => f.trim() !== ''),
        specs: Object.fromEntries(
          Object.entries(formData.specs).filter(([_, v]) => (v ?? '').toString().trim() !== ''),
        ),
      };

      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const details = await response.json().catch(() => ({}));
        throw new Error(details?.error || 'שגיאה בעדכון המוצר');
      }

      await refreshProductsFromApi();
      window.dispatchEvent(new Event('productsUpdated'));

      alert('מוצר עודכן בהצלחה! השינויים יוחלו בכל הדפים.');
      router.push('/admin/products');
    } catch (error) {
      setError(error.message || 'שגיאה בעדכון המוצר');
    } finally {
      setSubmitting(false);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">טוען נתוני מוצר…</div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-xl bg-red-100 px-6 py-4 text-red-700 shadow">{error}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <Link
            href="/admin/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            חזרה לרשימת מוצרים
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">ערוך מוצר</h1>
            <p className="text-gray-600 mt-2">{formData.name}</p>
          </div>
          <Link
            href="/admin/products"
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition"
          >
            ← חזרה
          </Link>
        </div>

        {error && (
          <div className="bg-red-500 text-white px-6 py-4 rounded-xl mb-6 shadow-lg">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">מידע בסיסי</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">שם המוצר *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                    placeholder="לדוגמה: מקלדת מכנית RGB"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">תיאור קצר *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                    placeholder="תיאור קצר של המוצר (1-2 שורות)"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">תיאור מלא *</label>
                  <textarea
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                    placeholder="תיאור מפורט של המוצר (מספר פסקאות)"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">מחיר *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                    placeholder="599"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">קטגוריה *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  >
                    <option value="">בחר קטגוריה</option>
                    <option value="אביזרי מחשב">אביזרי מחשב</option>
                    <option value="אודיו">אודיו</option>
                    <option value="מסכים">מסכים</option>
                    <option value="ריהוט">ריהוט</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">כמות במלאי *</label>
                  <input
                    type="number"
                    name="stockCount"
                    value={formData.stockCount}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                    placeholder="https://images.unsplash.com/..."
                  />
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  />
                </div>

                {/* Purchase Type */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">סוג רכישה *</label>
                  <select
                    name="purchaseType"
                    value={formData.purchaseType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  >
                    <option value="regular">רכישה רגילה און-ליין (מלאי בארץ)</option>
                    <option value="group">רכישה קבוצתית במחיר מפעל</option>
                  </select>
                </div>

                {/* Group Purchase Details */}
                {formData.purchaseType === 'group' && (
                  <div className="md:col-span-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <h3 className="font-bold text-blue-900 mb-3">🏭 פרטי רכישה קבוצתית</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-blue-900 mb-1">
                          ימים עד סגירת מכירה *
                        </label>
                        <input
                          type="number"
                          value={formData.groupPurchaseDetails.closingDays}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              groupPurchaseDetails: {
                                ...prev.groupPurchaseDetails,
                                closingDays: e.target.value,
                              },
                            }))
                          }
                          required={formData.purchaseType === 'group'}
                          min="1"
                          className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-blue-900 mb-1">
                          ימי משלוח לאחר סגירה *
                        </label>
                        <input
                          type="number"
                          value={formData.groupPurchaseDetails.shippingDays}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              groupPurchaseDetails: {
                                ...prev.groupPurchaseDetails,
                                shippingDays: e.target.value,
                              },
                            }))
                          }
                          required={formData.purchaseType === 'group'}
                          min="1"
                          className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-blue-900 mb-1">
                          כמות מינימלית לסגירה *
                        </label>
                        <input
                          type="number"
                          value={formData.groupPurchaseDetails.minQuantity}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              groupPurchaseDetails: {
                                ...prev.groupPurchaseDetails,
                                minQuantity: e.target.value,
                              },
                            }))
                          }
                          required={formData.purchaseType === 'group'}
                          min="1"
                          className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-blue-900 mb-1">
                          כמות נוכחית
                        </label>
                        <input
                          type="number"
                          value={formData.groupPurchaseDetails.currentQuantity}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              groupPurchaseDetails: {
                                ...prev.groupPurchaseDetails,
                                currentQuantity: e.target.value,
                              },
                            }))
                          }
                          min="0"
                          className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-blue-500"
                  />
                  <label className="mr-3 text-sm font-bold text-gray-900">במלאי</label>
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleSpecChange(key, e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
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
                  <label className="block text-sm font-bold text-gray-900 mb-2">דירוג (1-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">מספר ביקורות</label>
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg ${
                  submitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'שומר...' : '✓ שמור שינויים'}
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
