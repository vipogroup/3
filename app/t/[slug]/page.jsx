'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Phone, Mail, MapPin, Search, Filter, X, Plus, Minus, Check, User, LogIn } from 'lucide-react';

export default function TenantStorePage() {
  const params = useParams();
  const slug = params?.slug;
  
  const [tenant, setTenant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${slug}`);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, [slug]);

  // Save cart to localStorage
  useEffect(() => {
    if (slug && cart.length >= 0) {
      localStorage.setItem(`cart_${slug}`, JSON.stringify(cart));
    }
  }, [cart, slug]);

  const loadData = useCallback(async () => {
    if (!slug) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Load tenant info
      const tenantRes = await fetch(`/api/tenants/by-slug/${slug}`, { credentials: 'include' });
      if (!tenantRes.ok) {
        throw new Error('העסק לא נמצא');
      }
      const tenantData = await tenantRes.json();
      setTenant(tenantData.tenant);
      
      // Load products for this tenant
      const productsRes = await fetch(`/api/products?tenant=${slug}`, { credentials: 'include' });
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setAddedToCart(product._id);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item._id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get branding colors
  const primaryColor = tenant?.branding?.primaryColor || '#1e3a8a';
  const secondaryColor = tenant?.branding?.secondaryColor || '#0891b2';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full" style={{ borderColor: primaryColor, borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">שגיאה</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="px-6 py-3 text-white rounded-lg" style={{ background: primaryColor }}>
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tenant?.branding?.logo ? (
                <Image src={tenant.branding.logo} alt="לוגו" width={48} height={48} className="rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}>
                  <span className="text-xl font-bold text-white">{tenant?.name?.charAt(0)}</span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-gray-900">{tenant?.name}</h1>
                {tenant?.contact?.phone && (
                  <a href={`tel:${tenant.contact.phone}`} className="text-sm text-gray-500 hover:text-gray-700">
                    {tenant.contact.phone}
                  </a>
                )}
              </div>
            </div>
            
            {/* Login/Register & Cart Buttons */}
            <div className="flex items-center gap-2">
              <Link
                href={`/register?tenant=${slug}`}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">הרשמה</span>
              </Link>
              <Link
                href={`/login?tenant=${slug}`}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 transition-all"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">התחברות</span>
              </Link>
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    style={{ background: secondaryColor }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div 
        className="py-8 px-4 text-white text-center"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
      >
        <h2 className="text-2xl font-bold mb-2">ברוכים הבאים ל{tenant?.name}</h2>
        <p className="text-white/80">גלו את המוצרים שלנו</p>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="חפש מוצרים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': secondaryColor }}
            />
          </div>
          
          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2"
            >
              <option value="">כל הקטגוריות</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory ? 'לא נמצאו מוצרים' : 'אין מוצרים עדיין'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory ? 'נסה לחפש משהו אחר' : 'העסק עדיין לא הוסיף מוצרים'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.image || product.imageUrl ? (
                    <Image 
                      src={product.image || product.imageUrl} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                      מבצע
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold" style={{ color: primaryColor }}>₪{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">₪{product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                    style={{ background: addedToCart === product._id ? '#10b981' : `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
                  >
                    {addedToCart === product._id ? (
                      <>
                        <Check className="w-4 h-4" />
                        נוסף!
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        הוסף לסל
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Contact Section */}
      {(tenant?.contact?.phone || tenant?.contact?.email || tenant?.contact?.address) && (
        <section className="py-8 px-4" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}>
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4 text-center">צרו קשר</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {tenant.contact.phone && (
                <a href={`tel:${tenant.contact.phone}`} className="flex items-center gap-2 text-white/90 hover:text-white">
                  <Phone className="w-5 h-5" />
                  {tenant.contact.phone}
                </a>
              )}
              {tenant.contact.email && (
                <a href={`mailto:${tenant.contact.email}`} className="flex items-center gap-2 text-white/90 hover:text-white">
                  <Mail className="w-5 h-5" />
                  {tenant.contact.email}
                </a>
              )}
              {tenant.contact.address && (
                <span className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-5 h-5" />
                  {tenant.contact.address}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          {tenant?.name} © {new Date().getFullYear()} | מופעל על ידי VIPO
        </div>
      </footer>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold">סל הקניות ({cartCount})</h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    הסל ריק
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item._id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image && (
                            <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-sm font-bold" style={{ color: primaryColor }}>₪{item.price}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button 
                              onClick={() => updateQuantity(item._id, -1)}
                              className="w-6 h-6 flex items-center justify-center border rounded"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, 1)}
                              className="w-6 h-6 flex items-center justify-center border rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => removeFromCart(item._id)}
                              className="mr-auto text-red-500 text-xs hover:underline"
                            >
                              הסר
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">סה״כ:</span>
                    <span className="text-xl font-bold" style={{ color: primaryColor }}>₪{cartTotal.toLocaleString()}</span>
                  </div>
                  <Link
                    href={`/checkout?tenant=${slug}`}
                    className="block w-full py-3 text-white text-center font-medium rounded-lg"
                    style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
                    onClick={() => setShowCart(false)}
                  >
                    המשך לתשלום
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
