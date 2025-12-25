'use client';

import { useMemo, useState } from 'react';

const DEFAULT_TEMPLATE = `🔥 הזדמנות מיוחדת! 🔥

הצטרפו לרכישה קבוצתית ותיהנו ממחירים מטורפים!

🛒 לרכישה: {link}

🎁 קוד קופון להנחה: {coupon}

נלחמים ביוקר המחיה - ורוכשים ביחד! 💪`;

function buildShareMessage(asset, { coupon, link, discountPercent }) {
  const template = (asset.messageTemplate ? asset.messageTemplate.trim() : '') || DEFAULT_TEMPLATE;

  return template
    .replaceAll('{coupon}', coupon || '')
    .replaceAll('{link}', link || '')
    .replaceAll('{discount}', discountPercent != null ? `${discountPercent}%` : '');
}

export default function AgentMarketingLibrary({
  agentName,
  referralLink,
  couponCode,
  discountPercent,
  commissionPercent,
  assets,
}) {
  const [copyStatus, setCopyStatus] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState(assets?.[0]?.id || null);

  const selectedAsset = useMemo(() => assets?.find((asset) => asset.id === selectedAssetId) || assets?.[0] || null, [
    assets,
    selectedAssetId,
  ]);

  const sharePayload = useMemo(
    () => ({
      coupon: couponCode || '',
      link: referralLink || '',
      discountPercent: discountPercent ?? 0,
    }),
    [couponCode, discountPercent, referralLink],
  );

  async function handleCopyText(text) {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopyStatus('text');
        setTimeout(() => setCopyStatus(null), 2000);
      } else {
        throw new Error('clipboard unavailable');
      }
    } catch (error) {
      console.error('copy failed', error);
      setCopyStatus('error');
    }
  }

  async function handleCopyLink() {
    if (!referralLink) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(referralLink);
        setCopyStatus('link');
        setTimeout(() => setCopyStatus(null), 2000);
      } else {
        throw new Error('clipboard unavailable');
      }
    } catch (error) {
      console.error('copy link failed', error);
      setCopyStatus('error');
    }
  }

  function handleDownloadMedia(asset) {
    if (!asset?.mediaUrl) return;
    const link = document.createElement('a');
    link.href = asset.mediaUrl;
    link.download = asset.title || 'marketing_asset';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const preview = selectedAsset ? buildShareMessage(selectedAsset, sharePayload) : '';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1
            className="text-3xl font-bold mb-1"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            תוכן שיווקי מוכן לשיתוף
          </h1>
          <p className="text-gray-600 text-sm">
            שלום {agentName || 'סוכן'}! כאן תמצא ספריית תוכן להעלאה לרשתות החברתיות. כל שיתוף משתמש באופן
            אוטומטי בלינק ובקופון שלך.
          </p>
        </header>

        <section
          className="rounded-xl mb-6 p-4 sm:p-5"
          style={{
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: '0 4px 20px rgba(8, 145, 178, 0.12)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#1e3a8a' }}>
                פרטי שיתוף שלך
              </h2>
              <p className="text-sm text-gray-600">
                כל הודעה שנעתיק עבורך תכלול את הלינק האישי ואת קוד הקופון {couponCode || ''} לקבלת {discountPercent ?? 0}%
                הנחה.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleCopyLink()}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
              >
                {copyStatus === 'link' ? '✓ הלינק הועתק' : 'העתק לינק אישי'}
              </button>
              <a
                href={referralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white text-center"
                style={{ background: 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)' }}
              >
                פתח לינק
              </a>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1">
            <div className="space-y-3">
              {assets?.map((asset) => {
                const createdLabel = asset.createdAt ? new Date(asset.createdAt).toLocaleDateString('he-IL') : '';
                return (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                    selectedAssetId === asset.id ? 'border-transparent text-white shadow-lg' : 'border-gray-200'
                  }`}
                  style={
                    selectedAssetId === asset.id
                      ? {
                          background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)',
                        }
                      : {
                          backgroundColor: '#ffffff',
                        }
                  }
                >
                  <p className="text-sm font-semibold mb-1">{asset.title}</p>
                  <p className="text-xs opacity-75">
                    {asset.type === 'video' ? 'וידאו' : 'תמונה'}{createdLabel ? ` · ${createdLabel}` : ''}
                  </p>
                </button>
                );
              })}
            </div>
          </aside>

          <section className="lg:col-span-2">
            {selectedAsset ? (
              <div
                className="rounded-xl p-5"
                style={{
                  border: '2px solid transparent',
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #1e3a8a, #0891b2)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  boxShadow: '0 8px 24px rgba(8, 145, 178, 0.18)',
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {/* Video/Image Preview */}
                    <div className="rounded-xl overflow-hidden bg-black aspect-video mb-3 relative">
                      {selectedAsset.type === 'video' ? (
                        /* eslint-disable-next-line jsx-a11y/media-has-caption */
                        <video 
                          src={selectedAsset.mediaUrl} 
                          controls 
                          className="w-full h-full object-cover"
                          poster=""
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={selectedAsset.mediaUrl}
                          alt={selectedAsset.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {selectedAsset.type === 'video' && (
                        <a
                          href={selectedAsset.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white text-center flex items-center justify-center gap-2"
                          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          צפה בסרטון
                        </a>
                      )}
                      <button
                        onClick={() => handleDownloadMedia(selectedAsset)}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        הורד קובץ
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a8a' }}>
                        טקסט לשיתוף
                      </h3>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 h-48 overflow-y-auto text-sm leading-relaxed">
                        {preview.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleCopyText(preview)}
                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}
                      >
                        {copyStatus === 'text' ? '✓ הטקסט הועתק' : 'העתק טקסט לשיתוף'}
                      </button>
                      {selectedAsset.type === 'video' ? (
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(preview)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white text-center"
                          style={{ background: 'linear-gradient(135deg, #0891b2 0%, #1e3a8a 100%)' }}
                        >
                          שתף ב-WhatsApp
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-10 text-center text-gray-500">
                טרם הועלו תכנים שיווקיים.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
