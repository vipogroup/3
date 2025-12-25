'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * MultiMediaUpload - Component for uploading multiple images and one video
 * Supports drag & drop and file selection from device
 */
export default function MultiMediaUpload({ 
  images = [], 
  videoUrl = '',
  onImagesChange, 
  onVideoChange,
  maxImages = 5,
  label = 'מדיה למוצר'
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi'];

  async function uploadFile(file) {
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
    return data.url;
  }

  async function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    await processFiles(files);
  }

  async function processFiles(files) {
    setError('');
    setUploading(true);

    try {
      for (const file of files) {
        // Check if it's an image
        if (allowedImageTypes.includes(file.type)) {
          if (images.length >= maxImages) {
            setError(`ניתן להעלות עד ${maxImages} תמונות`);
            continue;
          }
          if (file.size > 5 * 1024 * 1024) {
            setError('תמונה גדולה מדי. מקסימום 5MB');
            continue;
          }
          const url = await uploadFile(file);
          onImagesChange([...images, url]);
        }
        // Check if it's a video
        else if (allowedVideoTypes.includes(file.type)) {
          if (file.size > 100 * 1024 * 1024) {
            setError('סרטון גדול מדי. מקסימום 100MB');
            continue;
          }
          const url = await uploadFile(file);
          onVideoChange(url);
        } else {
          setError('סוג קובץ לא נתמך. תמונות: PNG, JPEG, WebP. סרטונים: MP4, WebM');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  async function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) {
      await processFiles(files);
    }
  }

  function removeImage(index) {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }

  function removeVideo() {
    onVideoChange('');
  }

  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold text-gray-700">{label}</label>
      
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/webm,video/quicktime"
          onChange={handleFileChange}
          disabled={uploading}
          multiple
          className="hidden"
          id="media-upload"
        />
        <label 
          htmlFor="media-upload" 
          className="cursor-pointer"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 font-medium">גרור קבצים לכאן או לחץ לבחירה</p>
              <p className="text-gray-500 text-sm mt-1">
                עד {maxImages} תמונות (PNG, JPEG, WebP) + סרטון אחד (MP4, WebM)
              </p>
            </div>
          </div>
        </label>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 mt-3 text-blue-600">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>מעלה קבצים...</span>
        </div>
      )}

      {error && (
        <p className="text-red-500 mt-2 text-sm">{error}</p>
      )}

      {/* Images Preview */}
      {images.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600 mb-2">תמונות ({images.length}/{maxImages}):</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <Image 
                    src={url} 
                    alt={`תמונה ${index + 1}`} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                    ראשית
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Preview */}
      {videoUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600 mb-2">סרטון:</p>
          <div className="relative inline-block">
            <video 
              src={videoUrl} 
              controls 
              className="max-w-full h-48 rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={removeVideo}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
