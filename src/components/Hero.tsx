"use client";

import React from 'react';

export default function Hero() {
  return (
    <div style={{ 
      width: '100%', 
      padding: '40px 50px', 
      backgroundColor: '#f7f8f9', 
      display: 'flex',
      justifyContent: 'center'
    }}>
      
      {/* Banner Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1280px', 
        minHeight: '240px', 
        backgroundColor: '#0b5a8a', 
        borderRadius: '8px', 
        display: 'flex',
        alignItems: 'center',
        padding: '0 60px', 
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        
        {/* Style for Glass Shine Motion */}
        <style>{`
          .hero-shine-btn {
            position: relative;
            overflow: hidden;
          }
          .hero-shine-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%);
            transform: skewX(-25deg);
            z-index: 10;
          }
          .hero-shine-btn:hover::before {
            animation: shine-sweep-hero 0.7s ease-in-out;
          }
          @keyframes shine-sweep-hero {
            0% { left: -150%; }
            100% { left: 200%; }
          }
        `}</style>

        {/* Left Side Content */}
        <div style={{ zIndex: 2, color: '#ffffff', paddingTop: '20px', paddingBottom: '20px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            margin: '0 0 16px 0', 
            fontWeight: '900',
            letterSpacing: '0.5px'
          }}>
            Apna Samaan Frokht Karein
          </h1>
          <p style={{ 
            fontSize: '18px', 
            margin: '0 0 32px 0', 
            opacity: '0.9',
            fontWeight: '400',
            maxWidth: '600px',
            lineHeight: '1.5'
          }}>
            Pakistan ki sab se bari online market mein aaj hi shamil hon aur extra cash kamayen.
          </p>
          <button 
            className="hero-shine-btn"
            style={{
              backgroundColor: '#ffffff',
              color: '#0b5a8a',
              border: '3px solid #ffffff',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '30px', 
              cursor: 'pointer',
              transition: 'all 0.3s ease', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#0b5a8a';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            Frokht ka Aaghaz Karein
          </button>
        </div>

        {/* Decorative Graphics */}
        <div style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-50px',
          width: '300px',
          height: '300px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>
        <div style={{
          position: 'absolute',
          right: '150px',
          top: '-20px',
          width: '150px',
          height: '150px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          zIndex: 1
        }}></div>

      </div>
    </div>
  );
}