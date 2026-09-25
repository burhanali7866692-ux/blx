"use client";
import React, { useState } from 'react';
import { Ad } from '../types';
import ChatModal from './ChatModal';

interface ProductCardProps {
  ad: Ad;
  setSelectedAd: (ad: Ad | null) => void;
  favorites: number[];
  toggleFavorite: (id: number, e: React.MouseEvent) => void;
  handleDeleteClick?: (id: number, e: React.MouseEvent) => void;
  handleToggleHide?: (id: number, e: React.MouseEvent) => void;
  handleMarkAsSold?: (id: number, e: React.MouseEvent) => void;
  handleEditClick?: (id: number, e: React.MouseEvent) => void;
  layoutMode?: 'grid' | 'list';
  hideActions?: boolean;
}

export default function ProductCard({
  ad,
  setSelectedAd,
  favorites,
  toggleFavorite,
  handleDeleteClick,
  handleToggleHide,
  handleMarkAsSold,
  handleEditClick,
  layoutMode = 'grid',
  hideActions = false
}: ProductCardProps) {
  const isFav = favorites.includes(ad.id);
  const defaultImage = 'https://via.placeholder.com/300x200?text=No+Image';
  const cardImage = ad.image || (ad.allImages && ad.allImages.length > 0 ? ad.allImages[0] : defaultImage);

  const [showNumber, setShowNumber] = useState(false);
  const [isCardChatOpen, setIsCardChatOpen] = useState(false);

  // Footer theme color
  const themeColor = '#0b5a8a';

  // Professional Price Formatting: Rs. 600,000/-
  const formatPrice = (priceVal: string | number) => {
    if (!priceVal) return 'Rs. 0/-';
    const cleanNum = typeof priceVal === 'number' ? priceVal : parseInt(priceVal.toString().replace(/[^0-9]/g, ''));
    if (isNaN(cleanNum)) return priceVal;
    return `Rs. ${cleanNum.toLocaleString('en-PK')}/-`;
  };

  // Contact lock check for card
  const isContactLocked = (
    (ad as any).show_contact === false || 
    (ad as any).showContact === false
  );

  const adminWhatsAppNumber = "923121225404"; 
  const adminWhatsAppLink = `https://wa.me/${adminWhatsAppNumber}?text=Assalam%20o%20Alaikum!%20Mujhe%20is%20Ad%20(ID:%20${ad.id.toString().slice(-6)})%20ki%20details%20chahiye.`;

  return (
    <>
      <div 
        onClick={() => setSelectedAd(ad)}
        style={{
          backgroundColor: '#fff',
          border: '1px solid #ebeeef',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: layoutMode === 'list' ? 'row' : 'column',
          position: 'relative',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
          height: '100%'
        }}
        className="ad-card-item"
      >
        <style>{`
          .ad-card-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
            transform: skewX(-25deg);
            z-index: 10;
            pointer-events: none;
          }
          .ad-card-item:hover::before {
            animation: shine-sweep-card 0.8s ease-in-out;
          }
          @keyframes shine-sweep-card {
            0% { left: -150%; }
            100% { left: 200%; }
          }
          
          .ad-card-item:hover {
            boxShadow: 0 8px 20px rgba(0,0,0,0.12) !important;
            transform: translateY(-4px);
          }
          .ad-card-item:hover .ad-card-img {
            transform: scale(1.05);
          }
          .card-action-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          .rich-whatsapp-btn {
            background-color: #1EBE5D !important;
            border-color: #1EBE5D !important;
            color: #ffffff !important;
          }
          .rich-whatsapp-btn:hover {
            background-color: #179b4d !important;
          }
        `}</style>

        {/* Image Container */}
        <div style={{ 
          position: 'relative', 
          width: layoutMode === 'list' ? '280px' : '100%', 
          height: layoutMode === 'list' ? '200px' : '180px', 
          backgroundColor: '#f8fafc',
          flexShrink: 0,
          overflow: 'hidden' 
        }}>
          <img 
            src={cardImage} 
            alt={ad.title} 
            className="ad-card-img"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              display: 'block',
              transition: 'transform 0.4s ease' 
            }} 
          />

          {ad.category === 'Jobs' && !ad.isApprovedByAdmin ? (
            <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#eab308', color: '#000', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', zIndex: 11 }}>
              PENDING
            </span>
          ) : ad.isSold ? (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 11 }}>
              <span style={{ backgroundColor: '#000', color: '#fff', padding: '6px 14px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px' }}>
                SOLD OUT
              </span>
            </div>
          ) : null}

          {/* Favorite Heart Button */}
          <button 
            onClick={(e) => toggleFavorite(ad.id, e)}
            style={{ 
              position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', 
              cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 12,
              transition: 'transform 0.2s ease, background-color 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            aria-label="Favorite"
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Card Content */}
        <div style={{ 
          padding: layoutMode === 'list' ? '20px 24px' : '15px', 
          display: 'flex', flexDirection: 'column', flex: 1, zIndex: 1 
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: layoutMode === 'list' ? '24px' : '20px', fontWeight: '900', color: '#0f172a' }}>
                {formatPrice(ad.price)}
              </div>
              {layoutMode === 'list' && (
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>TODAY</span>
              )}
            </div>

            <h3 style={{ 
              fontSize: layoutMode === 'list' ? '16px' : '15px', color: '#334155', marginBottom: '8px', fontWeight: '500', lineHeight: '1.4',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' 
            }}>
              {ad.title}
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill={themeColor} xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
                {ad.location}
              </span>
              {layoutMode === 'grid' && <span>TODAY</span>}
            </div>
          </div>

          {/* Action Buttons or Locked Admin WhatsApp */}
          {!hideActions && (
            <div style={{ 
              display: 'flex', gap: '8px', 
              borderTop: layoutMode === 'grid' ? '1px solid #f1f5f9' : 'none', 
              paddingTop: layoutMode === 'grid' ? '12px' : '0', 
              marginTop: 'auto', 
              justifyContent: layoutMode === 'list' ? 'flex-end' : 'stretch',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              {isContactLocked ? (
                <a 
                  href={adminWhatsAppLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rich-whatsapp-btn"
                  style={{ 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', 
                    padding: '8px 12px', borderRadius: '6px', 
                    fontWeight: 'bold', textDecoration: 'none', fontSize: '12px', width: '100%',
                    zIndex: 12
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  Contact Admin on WhatsApp
                </a>
              ) : (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!showNumber && ad.mobileNumber) {
                        setShowNumber(true);
                      } else if (ad.mobileNumber) {
                        window.location.href = `tel:${ad.mobileNumber}`;
                      } else {
                        alert('Seller phone number is not available.');
                      }
                    }}
                    className="card-action-btn"
                    style={{ 
                      flex: layoutMode === 'list' ? '0 1 auto' : 1, 
                      minWidth: layoutMode === 'list' ? '110px' : '90px', 
                      padding: '8px 12px', backgroundColor: '#fff', border: `2px solid ${themeColor}`, 
                      borderRadius: '6px', color: themeColor, fontWeight: 'bold', fontSize: '12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s ease', position: 'relative', zIndex: 12
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={themeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0_1 22 16.92z"></path>
                    </svg>
                    {showNumber && ad.mobileNumber ? ad.mobileNumber : 'Call'}
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCardChatOpen(true);
                    }}
                    className="card-action-btn"
                    style={{ 
                      flex: layoutMode === 'list' ? '0 1 auto' : 1, 
                      minWidth: layoutMode === 'list' ? '110px' : '90px', 
                      padding: '8px 12px', backgroundColor: themeColor, border: `2px solid ${themeColor}`, 
                      borderRadius: '6px', color: '#fff', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                      boxShadow: '0 2px 5px rgba(11, 90, 138, 0.2)', transition: 'all 0.2s ease', position: 'relative', zIndex: 12
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Chat
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isCardChatOpen && (
        <ChatModal 
          adId={ad.id} 
          adTitle={ad.title} 
          sellerId={(ad as any).user_id || ''} 
          onClose={() => setIsCardChatOpen(false)} 
        />
      )}
    </>
  );
}