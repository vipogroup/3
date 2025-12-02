'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageUpload({ value, onChange, label = 'תמונה' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('סוג קובץ לא נתמך. השתמש ב-PNG, JPEG או WebP');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('הקובץ גדול מדי. מקסימום 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'העלאה נכשלה');
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>{label}</label>

      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
        style={{
          display: 'block',
          marginBottom: '12px',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          width: '100%',
        }}
      />

      {uploading && <p style={{ color: '#0070f3', marginBottom: '12px' }}>מעלה תמונה...</p>}

      {error && <p style={{ color: 'crimson', marginBottom: '12px' }}>{error}</p>}

      {value && (
        <div style={{ marginTop: '12px' }}>
          <p style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>תצוגה מקדימה:</p>
          <div
            style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <Image src={value} alt="Preview" fill style={{ objectFit: 'contain' }} />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            הסר תמונה
          </button>
        </div>
      )}
    </div>
  );
}
