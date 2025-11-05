"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Form component for creating a new sale
 */
export default function SaleForm() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    productId: "",
    customerName: "",
    customerPhone: "",
    salePrice: ""
  });

  // Calculate commission preview (5% of sale price)
  const commissionPreview = formData.salePrice 
    ? Number(formData.salePrice) * 0.05 
    : 0;

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?active=1", { 
          cache: "no-store" 
        });
        
        if (!res.ok) throw new Error("Failed to fetch products");
        
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Format phone number on blur
  const handlePhoneBlur = (e) => {
    const { value } = e.target;
    if (!value) return;

    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    
    // Format as Israeli phone number
    if (digits.length >= 10) {
      const formatted = digits.slice(0, 3) + "-" + digits.slice(3, 10);
      setFormData(prev => ({ ...prev, customerPhone: formatted }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productId) {
      newErrors.productId = "יש לבחור מוצר";
    }
    
    if (!formData.customerName?.trim()) {
      newErrors.customerName = "יש להזין שם לקוח";
    }
    
    if (!formData.customerPhone) {
      newErrors.customerPhone = "יש להזין מספר טלפון";
    } else {
      // Validate Israeli phone number
      const phoneRegex = /^0\d{8,9}$/;
      const digits = formData.customerPhone.replace(/\D/g, "");
      if (!phoneRegex.test(digits)) {
        newErrors.customerPhone = "יש להזין מספר טלפון ישראלי תקין";
      }
    }
    
    if (!formData.salePrice) {
      newErrors.salePrice = "יש להזין מחיר מכירה";
    } else if (Number(formData.salePrice) <= 0) {
      newErrors.salePrice = "המחיר חייב להיות גדול מ-0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || submitting) return;
    
    setSubmitting(true);
    
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: formData.productId,
          customerName: formData.customerName.trim(),
          customerPhone: formData.customerPhone.replace(/\D/g, ""), // Send only digits
          salePrice: Number(formData.salePrice)
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create sale");
      }
      
      // Show success message
      alert("המכירה נוצרה בהצלחה"); // Replace with toast in production
      
      // Redirect to sales page
      router.push("/sales");
    } catch (error) {
      console.error("Submit error:", error);
      alert("פעולה נכשלה, נסה שוב"); // Replace with toast in production
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">טוען נתונים...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="productId" className="block mb-1 font-medium">
          מוצר <span className="text-red-500">*</span>
        </label>
        <select
          id="productId"
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.productId ? 'border-red-500' : 'border-gray-300'}`}
          disabled={submitting}
          required
        >
          <option value="">בחר מוצר</option>
          {products.map(product => (
            <option key={product._id} value={product._id}>
              {product.name} - ₪{product.price}
            </option>
          ))}
        </select>
        {errors.productId && (
          <p className="text-red-500 text-sm mt-1">{errors.productId}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="customerName" className="block mb-1 font-medium">
          שם לקוח <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
          disabled={submitting}
          required
        />
        {errors.customerName && (
          <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="customerPhone" className="block mb-1 font-medium">
          טלפון לקוח <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="customerPhone"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          onBlur={handlePhoneBlur}
          placeholder="050-1234567"
          className={`w-full p-2 border rounded ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'}`}
          disabled={submitting}
          required
        />
        {errors.customerPhone && (
          <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="salePrice" className="block mb-1 font-medium">
          מחיר מכירה <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="salePrice"
          name="salePrice"
          value={formData.salePrice}
          onChange={handleChange}
          min="0"
          step="0.01"
          className={`w-full p-2 border rounded ${errors.salePrice ? 'border-red-500' : 'border-gray-300'}`}
          disabled={submitting}
          required
        />
        {errors.salePrice && (
          <p className="text-red-500 text-sm mt-1">{errors.salePrice}</p>
        )}
      </div>

      <div className="mb-6 p-3 bg-blue-50 rounded">
        <p className="text-sm text-blue-800">
          עמלה צפויה: ₪{commissionPreview.toFixed(2)} (5% מהמחיר)
        </p>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded"
          disabled={submitting}
        >
          ביטול
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={submitting}
        >
          {submitting ? "שולח..." : "יצירת מכירה"}
        </button>
      </div>
    </form>
  );
}
