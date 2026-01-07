'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { refreshProductsFromApi } from '@/app/lib/products';
import {
  loadProductCategories,
  saveProductCategories,
  deleteCategory,
  addCategory,
  fetchCategoriesFromAPI,
  DEFAULT_PRODUCT_CATEGORIES,
} from '@/app/lib/productCategories';
import MultiMediaUpload from '@/app/components/MultiMediaUpload';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [productLoading, setProductLoading] = useState(true);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    fullDescription: '',
    price: '',
    originalPrice: '',
    category: '',
    images: [],
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
    specs: '',
    suitableFor: `מתאים לכל מי שמחפש מוצר איכותי במחיר משתלם.
מושלם לשימוש יומיומי בבית או במשרד.
מתאים גם כמתנה מקורית ושימושית.`,
    whyChooseUs: `איכות מעולה במחיר הוגן
משלוח מהיר ואמין לכל הארץ
שירות לקוחות זמין ומקצועי
אחריות מלאה על כל המוצרים`,
    warranty: `אחריות יצרן מלאה
החלפה או החזר כספי תוך 14 יום
תמיכה טכנית זמינה בטלפון ובמייל`,
    customFields: [],
    shippingEnabled: false,
    shippingPrice: '',
  });
  const [categories, setCategories] = useState(DEFAULT_PRODUCT_CATEGORIES);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategories, setEditingCategories] = useState(false);

  useEffect(() => {
    // Load categories from API
    fetchCategoriesFromAPI().then(cats => {
      setCategories(cats);
    });

    const handler = (event) => {
      const incoming = event?.detail?.categories;
      if (Array.isArray(incoming) && incoming.length > 0) {
        setCategories(incoming);
      }
    };

    window.addEventListener('productCategoriesUpdated', handler);
    return () => {
      window.removeEventListener('productCategoriesUpdated', handler);
    };
  }, []);

  const categoryOptions = useMemo(
    () => [...categories].sort((a, b) => a.localeCompare(b, 'he')),
    [categories],
  );

  useEffect(() => {
    if (!productLoading && formData.category && !categories.includes(formData.category)) {
      setCategories((prev) => {
        if (prev.includes(formData.category)) return prev;
        const updated = [...prev, formData.category];
        saveProductCategories(updated);
        return updated;
      });
    }
  }, [productLoading, formData.category, categories]);

  useEffect(() => {
    if (formData.purchaseType === 'group' && !formData.category) {
      setFormData((prev) => ({
        ...prev,
        category: categories.includes('רכישה קבוצתית') ? 'רכישה קבוצתית' : prev.category,
      }));
    }
  }, [formData.purchaseType, formData.category, categories]);

  const persistCategories = useCallback(
    (nextCategories) => {
      const saved = saveProductCategories(nextCategories);
      setCategories(saved);
      return saved;
    },
    []);

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
          sku: loadedProduct.sku || '',
          name: loadedProduct.name || '',
          description: loadedProduct.description || '',
          fullDescription: loadedProduct.fullDescription || '',
          price: loadedProduct.price?.toString() || '',
          originalPrice: loadedProduct.originalPrice?.toString() || '',
          category: loadedProduct.category || '',
          images: Array.isArray(loadedProduct.images) && loadedProduct.images.length 
            ? loadedProduct.images 
            : (loadedProduct.image || loadedProduct.imageUrl ? [loadedProduct.image || loadedProduct.imageUrl] : []),
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
          specs: loadedProduct.specs || '',
          suitableFor: loadedProduct.suitableFor || `מתאים לכל מי שמחפש מוצר איכותי במחיר משתלם.
מושלם לשימוש יומיומי בבית או במשרד.
מתאים גם כמתנה מקורית ושימושית.`,
          whyChooseUs: loadedProduct.whyChooseUs || `איכות מעולה במחיר הוגן
משלוח מהיר ואמין לכל הארץ
שירות לקוחות זמין ומקצועי
אחריות מלאה על כל המוצרים`,
          warranty: loadedProduct.warranty || `אחריות יצרן מלאה
החלפה או החזר כספי תוך 14 יום
תמיכה טכנית זמינה בטלפון ובמייל`,
          customFields: loadedProduct.customFields || [],
          shippingEnabled: loadedProduct.shippingEnabled || false,
          shippingPrice: loadedProduct.shippingPrice?.toString() || '',
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


  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      alert('נא להזין שם קטגוריה');
      return;
    }

    if (categories.some((cat) => cat.toLowerCase() === trimmed.toLowerCase())) {
      setFormData((prev) => ({ ...prev, category: trimmed }));
      setNewCategory('');
      setShowAddCategory(false);
      return;
    }

    // Add category via API
    const updated = await addCategory(trimmed, categories);
    setCategories(updated);
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setNewCategory('');
    setShowAddCategory(false);
  };

  const removeCategory = async (name) => {
    if (!name) {
      return;
    }
    if (categories.length <= 1) {
      alert('לא ניתן למחוק את הקטגוריה האחרונה.');
      return;
    }
    if (!window.confirm(`האם למחוק את הקטגוריה "${name}" לצמיתות?`)) {
      return;
    }

    // Delete category via API
    const updated = await deleteCategory(name, categories);
    setCategories(updated);
    setFormData((prevForm) => ({
      ...prevForm,
      category: prevForm.category === name ? '' : prevForm.category,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category:
          formData.category?.trim() || (formData.purchaseType === 'group' ? 'רכישה קבוצתית' : ''),
        image: formData.images[0] || '',
        imageUrl: formData.images[0] || '',
        images: formData.images,
        videoUrl: formData.videoUrl || '',
        inStock: formData.inStock,
        stockCount: parseInt(formData.stockCount) || 0,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
        purchaseType: formData.purchaseType,
        groupPurchaseDetails:
          formData.purchaseType === 'group'
            ? (() => {
                const closingDays = parseInt(formData.groupPurchaseDetails.closingDays) || 0;
                const shippingDays = parseInt(formData.groupPurchaseDetails.shippingDays) || 0;
                const minQuantity = parseInt(formData.groupPurchaseDetails.minQuantity) || 1;
                const currentQuantity =
                  parseInt(formData.groupPurchaseDetails.currentQuantity) || 0;
                return {
                  closingDays,
                  shippingDays,
                  minQuantity,
                  currentQuantity,
                  totalDays: closingDays + shippingDays,
                };
              })()
            : null,
        features: formData.features.filter((f) => f.trim() !== ''),
        specs: formData.specs || '',
        suitableFor: formData.suitableFor || '',
        whyChooseUs: formData.whyChooseUs || '',
        warranty: formData.warranty || '',
        customFields: formData.customFields.filter(f => f.title.trim() || f.content.trim()),
        shippingEnabled: formData.shippingEnabled,
        shippingPrice: formData.shippingEnabled ? (parseFloat(formData.shippingPrice) || 0) : 0,
      };

      if (payload.purchaseType === 'group' && payload.groupPurchaseDetails?.closingDays) {
        const closingDays = payload.groupPurchaseDetails.closingDays;
        payload.groupEndDate = new Date(Date.now() + closingDays * 24 * 60 * 60 * 1000).toISOString();
      } else {
        payload.groupEndDate = null;
      }

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
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">מק״ט (SKU)</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 font-mono"
                    placeholder="לדוגמה: PRD-001"
                  />
                </div>

                <div>
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
                  <div className="flex gap-2">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
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
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)')
                      }
                    >
                      {showAddCategory ? 'בטל' : 'קטגוריה חדשה'}
                    </button>
                  </div>
                  {showAddCategory && (
                    <div className="mt-3 rounded-xl p-4 space-y-3 bg-blue-50 border-2 border-blue-200">
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
                          onFocus={(e) => (e.currentTarget.style.borderColor = '#0891b2')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                          placeholder="לדוגמה: מוצרי חשמל"
                        />
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          className="px-4 py-2 text-white rounded-lg transition-all"
                          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)')
                          }
                        >
                          הוסף
                        </button>
                      </div>
                    </div>
                  )}
                  {categoryOptions.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          {editingCategories ? 'לחץ על X למחיקת קטגוריה' : 'לחץ על קטגוריה לבחירה'}
                        </p>
                        <button
                          type="button"
                          onClick={() => setEditingCategories(!editingCategories)}
                          className={`text-xs px-2 py-1 rounded-lg transition-all ${
                            editingCategories 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {editingCategories ? '✓ סיום' : '✎ ערוך'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categoryOptions.map((option) => {
                          const isSelected = formData.category === option;
                          const isLast = categoryOptions.length <= 1;
                          return (
                            <div key={option} className="relative group">
                              <button
                                type="button"
                                onClick={() => !editingCategories && setFormData(prev => ({ ...prev, category: option }))}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                  editingCategories
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : isSelected 
                                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md' 
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {option}
                              </button>
                              {editingCategories && !isLast && (
                                <button
                                  type="button"
                                  onClick={() => removeCategory(option)}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow-md hover:bg-red-600"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
                  <MultiMediaUpload
                    images={formData.images}
                    videoUrl={formData.videoUrl}
                    onImagesChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
                    onVideoChange={(url) => setFormData((prev) => ({ ...prev, videoUrl: url }))}
                    maxImages={5}
                    label="תמונות וסרטון למוצר *"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    קישור לסרטון YouTube (אופציונלי - במקום העלאה)
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

                {/* Shipping Options */}
                <div className="md:col-span-2 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-blue-900 text-lg">אפשרויות משלוח</h3>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="shippingEnabled"
                      checked={formData.shippingEnabled}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="mr-3 text-sm font-bold text-gray-900">
                      אפשר משלוח בתשלום (בנוסף לאיסוף עצמי)
                    </label>
                  </div>

                  {formData.shippingEnabled && (
                    <div className="mt-3 p-4 bg-white rounded-lg border border-blue-200">
                      <label className="block text-sm font-bold text-blue-900 mb-2">
                        מחיר משלוח (₪)
                      </label>
                      <input
                        type="number"
                        name="shippingPrice"
                        value={formData.shippingPrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="לדוגמה: 35"
                        className="w-full md:w-48 px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        הלקוח יוכל לבחור בין איסוף עצמי (חינם) למשלוח בתשלום
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">תכונות עיקריות</h2>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    features: [...prev.features, '']
                  }))}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  הוסף תכונה
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                      placeholder={`תכונה ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          features: prev.features.filter((_, i) => i !== index)
                        }))}
                        className="px-3 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">מפרט טכני</h2>
              <textarea
                name="specs"
                value={formData.specs}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                placeholder="הזן מפרט טכני מפורט..."
              />
            </div>

            {/* Suitable For */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">למי זה מתאים?</h2>
              <textarea
                name="suitableFor"
                value={formData.suitableFor}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                placeholder="תאר למי המוצר מתאים..."
              />
            </div>

            {/* Why Choose Us */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">למה לבחור בנו?</h2>
              <textarea
                name="whyChooseUs"
                value={formData.whyChooseUs}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                placeholder="הסבר למה לבחור במוצר שלנו..."
              />
            </div>

            {/* Warranty */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">אחריות</h2>
              <textarea
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                placeholder="פרטי אחריות..."
              />
            </div>

            {/* Custom Fields */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">שדות מותאמים אישית</h2>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    customFields: [...prev.customFields, { title: '', content: '' }]
                  }))}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  הוסף שדה חדש
                </button>
              </div>
              
              {formData.customFields.length === 0 ? (
                <p className="text-gray-500 text-center py-4 border-2 border-dashed border-gray-300 rounded-xl">
                  אין שדות מותאמים אישית. לחץ על הכפתור כדי להוסיף.
                </p>
              ) : (
                <div className="space-y-4">
                  {formData.customFields.map((field, index) => (
                    <div key={index} className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-600">שדה #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            customFields: prev.customFields.filter((_, i) => i !== index)
                          }))}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={field.title}
                        onChange={(e) => {
                          const newFields = [...formData.customFields];
                          newFields[index].title = e.target.value;
                          setFormData(prev => ({ ...prev, customFields: newFields }));
                        }}
                        placeholder="כותרת השדה (לדוגמה: הוראות שימוש)"
                        className="w-full px-4 py-2 mb-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                      <textarea
                        value={field.content}
                        onChange={(e) => {
                          const newFields = [...formData.customFields];
                          newFields[index].content = e.target.value;
                          setFormData(prev => ({ ...prev, customFields: newFields }));
                        }}
                        rows={3}
                        placeholder="תוכן השדה..."
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  ))}
                </div>
              )}
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
