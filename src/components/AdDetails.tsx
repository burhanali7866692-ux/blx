"use client";
import React, { useState, useEffect } from 'react';
import { Ad } from '../types';
import ChatModal from './ChatModal';

interface AdDetailsProps {
  selectedAd: Ad;
  setSelectedAd: (ad: Ad | null) => void;
}

export default function AdDetails({ selectedAd, setSelectedAd }: AdDetailsProps) {
  const defaultImage = 'https://via.placeholder.com/600x400?text=No+Image';
  
  const imagesArray = selectedAd.allImages && selectedAd.allImages.length > 0 
    ? selectedAd.allImages 
    : [selectedAd.image || defaultImage];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Footer wala exact deep blue theme color (#0b5a8a)
  const themeColor = '#0b5a8a';

  useEffect(() => {
    setCurrentIndex(0);
    setShowNumber(false); 
    setIsLightboxOpen(false);
  }, [selectedAd]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < imagesArray.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Price formatting with Rs. and /- suffix (e.g., Rs. 600,000/-)
  const formatPrice = (priceVal: string | number) => {
    if (!priceVal) return 'Rs. 0/-';
    const cleanNum = typeof priceVal === 'number' ? priceVal : parseInt(priceVal.toString().replace(/[^0-9]/g, ''));
    if (isNaN(cleanNum)) return priceVal;
    return `Rs. ${cleanNum.toLocaleString('en-PK')}/-`;
  };

  // FIXED: TypeScript error-free checking for show_contact column
  const isJobContactLocked = selectedAd.category === 'Jobs' && (
    (selectedAd as any).show_contact === false || 
    (selectedAd as any).showContact === false
  );
  
  const adminWhatsAppNumber = "923121225404"; 
  const adminWhatsAppLink = `https://wa.me/${adminWhatsAppNumber}?text=Assalam%20o%20Alaikum!%20Mujhe%20is%20Job%20Ad%20(ID:%20${selectedAd.id.toString().slice(-6)})%20ki%20details%20chahiye.`;

  return (
    <div style={{ padding: '25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', animation: 'fadeIn 0.3s ease-in' }}>
      
      <style>{`
        .back-btn { background-color: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; }
        .back-btn:hover { background-color: ${themeColor}; color: #fff; border-color: ${themeColor}; }

        /* Rich Professional WhatsApp Green */
        .rich-whatsapp-btn {
          background-color: #1EBE5D !important;
          border-color: #1EBE5D !important;
          color: #ffffff !important;
        }
        .rich-whatsapp-btn:hover {
          background-color: #179b4d !important;
          border-color: #179b4d !important;
        }

        /* Image Navigation Arrow Styling */
        .slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s ease;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .slider-btn:hover { background: rgba(0, 0, 0, 0.85); }
        .slider-btn-left { left: 15px; }
        .slider-btn-right { right: 15px; }
      `}</style>

      {/* Back Button */}
      <button 
        className="back-btn"
        onClick={() => setSelectedAd(null)} 
        style={{ marginBottom: '25px', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', fontSize: '14px' }}
      >
        <span style={{fontSize: '18px', lineHeight: 1}}>←</span> Back to Homepage
      </button>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* LEFT SIDE: Clean Image Gallery */}
        <div style={{ flex: '1 1 450px', minWidth: '300px' }}>
          <div 
            onClick={() => setIsLightboxOpen(true)}
            style={{ position: 'relative', width: '100%', height: '420px', backgroundColor: '#fcfcfc', borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #e2e8f0', cursor: 'zoom-in' }}
            title="Click to view full image"
          >
            <img src={imagesArray[currentIndex]} alt={selectedAd.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            
            {imagesArray.length > 1 && currentIndex > 0 && (
              <button onClick={handlePrev} className="slider-btn slider-btn-left" aria-label="Previous Image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {imagesArray.length > 1 && currentIndex < imagesArray.length - 1 && (
              <button onClick={handleNext} className="slider-btn slider-btn-right" aria-label="Next Image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          
          {imagesArray.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
              {imagesArray.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  onClick={() => setCurrentIndex(idx)} 
                  style={{ 
                    width: '85px', height: '85px', objectFit: 'cover', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    border: currentIndex === idx ? `3px solid ${themeColor}` : '1px solid #cbd5e1', 
                    opacity: currentIndex === idx ? 1 : 0.6, transition: 'all 0.2s' 
                  }} 
                  alt={`Thumbnail ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Details & Actions */}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ margin: 0, fontSize: '34px', color: '#0f172a', fontWeight: '900', letterSpacing: '-0.5px' }}>
              {formatPrice(selectedAd.price)}
            </h1>
            <span style={{ fontSize: '12px', color: '#475569', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '50px', fontWeight: 'bold', border: '1px solid #e2e8f0' }}>
              ID: {selectedAd.id.toString().slice(-6)}
            </span>
          </div>
          
          <h2 style={{ margin: 0, fontSize: '24px', color: '#334155', lineHeight: '1.4' }}>{selectedAd.title}</h2>
          
          <div style={{ marginTop: '5px', display: 'flex', gap: '20px', color: '#64748b', fontSize: '14px', fontWeight: '600', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#0b5a8a" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
              </svg>
              {selectedAd.location}
            </span>
            <span>🏷️ {selectedAd.category} {selectedAd.subCategory ? `> ${selectedAd.subCategory}` : ''}</span>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', margin: '15px 0' }}></div>

          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</h3>
          <p style={{ color: '#334155', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '15px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
            {selectedAd.description || 'No description provided by the seller.'}
          </p>

          <div style={{ borderTop: '1px solid #f1f5f9', margin: '15px 0' }}></div>

          {/* Seller Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '20px 25px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: `6px solid ${themeColor}` }}>
            
            <div style={{ width: '65px', height: '65px', borderRadius: '50px', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px', fontWeight: 'bold', background: `linear-gradient(135deg, ${themeColor}, #0ea5e9)`, flexShrink: 0 }}>
              {selectedAd.sellerName ? selectedAd.sellerName.charAt(0).toUpperCase() : 'S'}
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#0f172a' }}>
                {selectedAd.sellerName || 'Verified User'}
              </h4>
              
              {/* If Job category and show_contact is false, lock buttons and show Admin WhatsApp */}
              {isJobContactLocked ? (
                <div>
                  <p style={{ fontSize: '13px', color: '#dc2626', marginBottom: '8px', fontWeight: '600' }}>
                    🔒 Contact options are locked by admin for this Job ad.
                  </p>
                  <a 
                    href={adminWhatsAppLink}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="rich-whatsapp-btn"
                    style={{ 
                      display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', 
                      padding: '10px 16px', borderRadius: '8px', 
                      fontWeight: 'bold', textDecoration: 'none', fontSize: '14px', width: 'fit-content' 
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    Contact Admin on WhatsApp
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  {selectedAd.showMobileNumber !== false && selectedAd.mobileNumber ? (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      
                      {/* 1. CALL BUTTON */}
                      <button 
                        onClick={() => {
                          if (!showNumber) {
                            setShowNumber(true);
                          } else {
                            window.location.href = `tel:${selectedAd.mobileNumber}`;
                          }
                        }}
                        style={{ 
                          flex: 1, minWidth: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', 
                          padding: '10px 8px', backgroundColor: '#fff', border: `2px solid ${themeColor}`, borderRadius: '8px', 
                          color: themeColor, fontWeight: 'bold', cursor: 'pointer', fontSize: '14px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.03)', transition: 'all 0.2s'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={themeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        {showNumber ? selectedAd.mobileNumber : 'Call'}
                      </button>

                      {/* 2. CHAT BUTTON */}
                      <button 
                        onClick={() => setIsChatOpen(true)}
                        style={{ 
                          flex: 1, minWidth: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', 
                          padding: '10px 8px', backgroundColor: '#0b5a8a', border: '2px solid #0b5a8a', borderRadius: '8px', 
                          color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px',
                          boxShadow: '0 2px 5px rgba(11, 90, 138, 0.2)', transition: 'all 0.2s'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        Chat
                      </button>

                      {/* 3. WHATSAPP BUTTON */}
                      <a 
                        href={`https://wa.me/${selectedAd.mobileNumber.startsWith('0') ? '92' + selectedAd.mobileNumber.substring(1) : selectedAd.mobileNumber}?text=Assalam%20o%20Alaikum!%20Mujhe%20aap%20ke%20is%20ad%20ki%20details%20chahiye:%20${selectedAd.title}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="rich-whatsapp-btn"
                        style={{ 
                          flex: 1, minWidth: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', 
                          padding: '10px 8px', borderRadius: '8px', 
                          fontWeight: 'bold', textDecoration: 'none', fontSize: '14px',
                          boxShadow: '0 2px 5px rgba(30, 190, 93, 0.3)', transition: 'all 0.2s'
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                        WhatsApp
                      </a>

                    </div>
                  ) : (
                    <div style={{ padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>🚫 Number Hidden by Seller</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '10px', fontSize: '13px', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fefce8', padding: '12px', borderRadius: '8px', border: '1px solid #fef08a' }}>
            <span>💡</span> 
            <span><strong>Safety Tip:</strong> Never pay anything in advance. Always meet in a safe public place.</span>
          </div>

        </div>
      </div>

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '1000px',
              maxHeight: '90vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              style={{
                position: 'absolute',
                top: '-45px',
                right: '0',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '32px',
                cursor: 'pointer',
                fontWeight: 'bold',
                zIndex: 10
              }}
            >
              &times;
            </button>

            <div style={{
              position: 'absolute',
              top: '-40px',
              left: '0',
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              zIndex: 10
            }}>
              {currentIndex + 1} / {imagesArray.length}
            </div>

            <img 
              src={imagesArray[currentIndex]} 
              alt={selectedAd.title} 
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }} 
            />

            {imagesArray.length > 1 && currentIndex > 0 && (
              <button 
                onClick={handlePrev} 
                className="slider-btn slider-btn-left"
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: 'white',
                  border: 'none',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {imagesArray.length > 1 && currentIndex < imagesArray.length - 1 && (
              <button 
                onClick={handleNext} 
                className="slider-btn slider-btn-right"
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: 'white',
                  border: 'none',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chat Modal Component */}
      {isChatOpen && (
        <ChatModal 
          adId={selectedAd.id} 
          adTitle={selectedAd.title} 
          sellerId={(selectedAd as any).user_id || ''} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
}