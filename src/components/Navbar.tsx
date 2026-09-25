"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import LoginModal from './LoginModal';

import { supabase } from '../lib/supabase'; 

interface NavbarProps {
  searchTerm?: string;
  setSearchTerm?: (val: string) => void;
  setIsModalOpen?: (val: boolean) => void;
  selectedCity?: string;
  setSelectedCity?: (val: string) => void;
}

export default function Navbar({ searchTerm, setSearchTerm, setIsModalOpen, selectedCity, setSelectedCity }: NavbarProps) {
  
  const locationsList = ['All Pakistan', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Profile States
  const [user, setUser] = useState<any>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          setIsLoginModalOpen(false); 
        }
      });
      return () => authListener.subscription.unsubscribe();
    }
    checkUser();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileMenuOpen(false);
    setUser(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="header">
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="navCyanPurple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#8a2be2" />
            </linearGradient>
          </defs>
        </svg>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes mainNavbarLogoMove {
            0%, 75% { transform: perspective(1000px) rotateY(0deg) scale(1); }
            85% { transform: perspective(1000px) rotateY(180deg) scale(1.05); }
            95%, 100% { transform: perspective(1000px) rotateY(360deg) scale(1); }
          }
          .main-logo-vip {
            animation: mainNavbarLogoMove 6s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
            transform-style: preserve-3d; display: inline-block; cursor: pointer;
          }
          .sell-3d-container {
            perspective: 1000px; cursor: pointer; background: transparent; border: none; padding: 0; width: 140px; height: 44px; display: inline-block;
          }
          .sell-3d-flipper {
            position: relative; width: 100%; height: 100%; transform-style: preserve-3d;
            animation: flipSpin3Sides 12s cubic-bezier(0.5, 0, 0.5, 1) infinite; transform: translateZ(-46px);
          }
          .sell-3d-container:hover .sell-3d-flipper { animation-play-state: paused; }
          @keyframes flipSpin3Sides {
            0%, 20%   { transform: translateZ(-46px) rotateY(0deg); }
            33%, 53%  { transform: translateZ(-46px) rotateY(-120deg); }
            66%, 86%  { transform: translateZ(-46px) rotateY(-240deg); }
            100%      { transform: translateZ(-46px) rotateY(-360deg); }
          }
          
          /* Base styles for all 3 sides */
          .sell-3d-front, .sell-3d-back, .sell-3d-third {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            backface-visibility: hidden; display: flex; align-items: center; justify-content: center;
            border-radius: 30px; font-weight: bold; color: #ffffff; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); white-space: nowrap;
            transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          }
          
          /* Side 1: Green (#8cc63f) */
          .sell-3d-front { 
            transform: rotateY(0deg) translateZ(46px); font-size: 18.4px; gap: 8px; padding-bottom: 4px; 
            background-color: #8cc63f;
            border: 2px solid #8cc63f;
          }
          .sell-3d-container:hover .sell-3d-front { background-color: #75a633; border-color: #75a633; }

          /* Side 2: Blue (#0095d9) */
          .sell-3d-back { 
            transform: rotateY(120deg) translateZ(46px); display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 7px; overflow: hidden; 
            background-color: #0095d9;
            border: 2px solid #0095d9;
          }
          .sell-3d-container:hover .sell-3d-back { background-color: #007cb3; border-color: #007cb3; }

          /* Side 3: Purple (#7b2cbf) */
          .sell-3d-third { 
            transform: rotateY(240deg) translateZ(46px); font-size: 17.3px; gap: 8px; padding-bottom: 4px; 
            background-color: #7b2cbf;
            border: 2px solid #7b2cbf;
          }
          .sell-3d-container:hover .sell-3d-third { background-color: #6a25a3; border-color: #6a25a3; }
          
          /* Hover Shadow for all */
          .sell-3d-container:hover .sell-3d-front,
          .sell-3d-container:hover .sell-3d-back,
          .sell-3d-container:hover .sell-3d-third {
             box-shadow: 0 6px 12px rgba(0,0,0,0.15);
          }
          
          .custom-search-input:hover {
            border-color: #0095d9 !important;
          }

          .vip-coin-container {
            width: 28px;
            height: 28px;
            perspective: 1000px; 
            flex-shrink: 0;
          }
          
          .vip-coin-flipper {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            animation: coinSpinWait 13s ease-in-out infinite; 
          }
          
          @keyframes coinSpinWait {
            0% { transform: rotateY(0deg); }
            23% { transform: rotateY(360deg); }
            100% { transform: rotateY(360deg); }
          }
          
          .vip-coin-front, .vip-coin-back {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 50%;
            backface-visibility: hidden; 
            -webkit-backface-visibility: hidden;
            object-fit: cover;
          }
          
          .vip-coin-back {
            transform: rotateY(180deg); 
          }

          /* Mobile Responsiveness Rules - FIXED SINGLE LINE ALIGNMENT */
          @media (max-width: 768px) {
            .header {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between; 
              align-items: center;
              padding: 10px 15px;
            }
            .main-logo-link {
              flex: 0 1 auto;
              margin-right: auto; 
              margin-left: 36px; 
            }
            .header nav {
              flex: 0 1 auto;
              display: flex;
              gap: 75px; /* LOGIN KO AUR LEFT KARNE KE LIYE GAP 75px KAR DIYA HAI */
              align-items: center;
            }
            .center-search-area {
              order: 3;
              width: 100%;
              margin-left: 0 !important;
              margin-right: 0 !important;
              margin-top: 12px; 
            }
            .location-selector-wrap {
              display: none; 
            }
            .main-logo-vip {
              height: 65px !important; 
              object-fit: contain;
            }
          }
        `}} />

        <Link href="/" className="main-logo-link">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/blx-logo.png" alt="BLX platform logo" className="main-logo-vip" style={{ height: '92.4px' }} />
        </Link>

        {/* Center Search Area */}
        <div className="center-search-area" style={{ display: 'flex', flex: 1, marginLeft: '5px', marginRight: '15px', gap: '10px', alignItems: 'center' }}>
          
          <div ref={dropdownRef} className="location-selector-wrap" style={{ position: 'relative', width: '280px', height: '52px' }}>
            <div onClick={() => setIsLocationOpen(!isLocationOpen)} style={{ width: '100%', height: '100%', border: isLocationOpen ? '2px solid #0095d9' : '2px solid #002f34', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 15px', boxSizing: 'border-box' }}>
              
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                
                {(!selectedCity || selectedCity === "All Pakistan") ? (
                  <div className="vip-coin-container">
                    <div className="vip-coin-flipper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/Pak_Flag.png" alt="Pakistan Front" className="vip-coin-front" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/Pak_Flag.png" alt="Pakistan Back" className="vip-coin-back" />
                    </div>
                  </div>
                ) : (
                  <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {/* Custom Light Blue Pin Icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <ellipse cx="12" cy="20" rx="7" ry="2.5" fill="#0095d9" fillOpacity="0.2"/>
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 21 12 21C12 21 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#eef6f7" stroke="#0095d9" strokeWidth="1.5"/>
                      <circle cx="12" cy="9" r="3" fill="#00e5ff" />
                    </svg>
                  </div>
                )}

                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#002f34', fontSize: '15px', fontWeight: 'bold' }}>
                  {selectedCity || "All Pakistan"}
                </span>
              </div>
              
              <span style={{ fontSize: '12px', color: '#002f34', transition: 'transform 0.2s', transform: isLocationOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </div>

            {isLocationOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: '#fff', border: '1px solid #ebeeef', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 50, maxHeight: '350px', overflowY: 'auto', marginTop: '4px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {locationsList.map(loc => (
                    <li key={loc} onClick={() => { setSelectedCity && setSelectedCity(loc); setIsLocationOpen(false); }} style={{ padding: '12px 15px', cursor: 'pointer', backgroundColor: selectedCity === loc ? '#eef6f7' : '#fff' }}>
                      <span style={{ fontWeight: selectedCity === loc ? 'bold' : 'normal', color: '#002f34', fontSize: '15px' }}>{loc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ flex: 1, position: 'relative', height: '52px' }}>
            <input 
              type="text" 
              className="custom-search-input search-bar-input"
              placeholder="Find Cars, Mobile Phones and more..." 
              value={searchTerm || ""} 
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)} 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              style={{ 
                width: '100%', 
                padding: '0 45px 0 20px', 
                height: '100%', 
                boxSizing: 'border-box', 
                border: isSearchFocused ? '2px solid #0095d9' : '2px solid #002f34', 
                borderRadius: '8px', 
                fontSize: '16px', 
                outline: 'none',
                transition: 'border-color 0.2s ease',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23002f34\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\' /%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 15px center',
                backgroundSize: '20px'
              }} 
            />
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* User Profile Section */}
          {user ? (
            <div ref={profileMenuRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={user.user_metadata?.avatar_url || user.user_metadata?.picture || 'https://via.placeholder.com/40'} 
                  alt="Profile" 
                  referrerPolicy="no-referrer"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00e5ff' }} 
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div style={{ position: 'absolute', top: '55px', right: '0', backgroundColor: '#fff', border: '1px solid #ebeeef', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, width: '240px', overflow: 'hidden' }}>
                  
                  {/* User Info Section */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f2f4' }}>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#002f34', fontSize: '15px' }}>
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p style={{ margin: '0', color: '#666', fontSize: '13px', wordBreak: 'break-all' }}>
                      {user.email}
                    </p>
                  </div>
                  
                  {/* Action Section */}
                  <div style={{ padding: '8px' }}>
                    <Link href="/my-ads" style={{ textDecoration: 'none' }}>
                      <button 
                        onClick={() => setIsProfileMenuOpen(false)}
                        style={{ 
                          width: '100%', 
                          padding: '10px 12px', 
                          background: 'transparent', 
                          color: '#002f34', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          fontWeight: '500', 
                          fontSize: '14px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px',
                          transition: 'background 0.2s ease',
                          textAlign: 'left'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="3" y1="9" x2="21" y2="9"></line>
                          <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                        My Ads
                      </button>
                    </Link>

                    {/* Logout Option */}
                    <button 
                      onClick={handleLogout}
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        background: 'transparent', 
                        color: '#e63946', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: 'pointer', 
                        fontWeight: '500', 
                        fontSize: '14px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        transition: 'background 0.2s ease',
                        marginTop: '4px',
                        textAlign: 'left'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff0f0'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                  
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setIsLoginModalOpen(true)} style={{ background: 'none', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', textDecoration: 'underline', color: '#002f34' }}>
              Login
            </button>
          )}
          
          <button className="sell-3d-container" onClick={() => setIsModalOpen && setIsModalOpen(true)}>
            <div className="sell-3d-flipper">
              <div className="sell-3d-front">Sell & Buy</div>
              
              <div className="sell-3d-back">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/kharido_becho.png" 
                  alt="Kharido Becho Urdu" 
                  style={{ maxHeight: '23.5px', maxWidth: '100%', objectFit: 'contain', transform: 'translateY(-0.5px)', filter: 'brightness(0) invert(1)' }} 
                />
              </div>

              <div className="sell-3d-third">Post Your Ad</div>
            </div>
          </button>
        </nav>
      </header>

      {/* MODAL COMPONENT */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}