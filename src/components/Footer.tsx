"use client";

import React from 'react';

export default function Footer() {
  return (
    <footer style={{ width: '100%', marginTop: 'auto', overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .footer-container {
          background-color: #ebeeef;
          padding: 40px 50px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          color: #1a1a1a;
        }
        .footer-bottom {
          background-color: #0b5a8a;
          color: #ffffff;
          padding: 15px 50px;
          display: flex;
          justify-content: flex-end;
          font-size: 12px;
          font-weight: bold;
        }
        
        /* Mobile Responsiveness Rules */
        @media (max-width: 768px) {
          .footer-container {
            padding: 30px 15px 30px 25px; /* Left padding thori barha di taake columns right shift ho jayein */
            gap: 12px; 
          }
          .footer-heading {
            font-size: 12px !important;
            margin-bottom: 10px !important;
          }
          .footer-links {
            font-size: 10px !important;
          }
          .footer-bottom {
            padding: 15px 15px;
            justify-content: center; 
          }
        }
      `}} />

      {/* Top Footer */}
      <div className="footer-container">
        <div>
          <h3 className="footer-heading" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>POPULAR CATEGORIES</h3>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: '#707a7c', lineHeight: '2' }}>
            <li>Cars</li>
            <li>Flats for rent</li>
            <li>Mobile Phones</li>
            <li>Jobs</li>
          </ul>
        </div>
        <div>
          <h3 className="footer-heading" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>TRENDING SEARCHES</h3>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: '#707a7c', lineHeight: '2' }}>
            <li>Bikes</li>
            <li>Watches</li>
            <li>Books</li>
            <li>Dogs</li>
          </ul>
        </div>
        <div>
          <h3 className="footer-heading" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>ABOUT US</h3>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: '#707a7c', lineHeight: '2' }}>
            <li>About blx Group</li>
            <li>blx Blog</li>
            <li>Contact Us</li>
            <li>blx for Businesses</li>
          </ul>
        </div>
        <div>
          <h3 className="footer-heading" style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>blx</h3>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px', color: '#707a7c', lineHeight: '2' }}>
            <li>Help</li>
            <li>Sitemap</li>
            <li>Terms of use</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer (Copyright Bar) */}
      <div className="footer-bottom">
        <span>Free Classifieds in Pakistan . © 2026 blx</span>
      </div>
    </footer>
  );
}