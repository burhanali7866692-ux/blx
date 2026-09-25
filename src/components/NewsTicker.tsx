"use client";

import React from 'react';

export default function NewsTicker() {
  return (
    <div style={{
      backgroundColor: '#f7f8f9', color: '#002f34', padding: '12px 0', 
      overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex',
      alignItems: 'center', borderBottom: '1px solid #ebeeef',
      borderTop: '1px solid #ebeeef', width: '100%'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
        @keyframes marquee-ltr {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        .ticker-text {
          display: inline-block; animation: marquee-ltr 60s linear infinite;
          font-size: 20px; letter-spacing: 0.5px; cursor: pointer; color: '#002f34';
          font-family: 'Noto Nastaliq Urdu', serif; line-height: 1.5;
          display: flex; align-items: center;
        }
        .ticker-text:hover { animation-play-state: paused; }
      `}} />
      <div className="ticker-text" dir="rtl">
        
        {/* 🚨 Yahan pehli news se pehle Rocket Emoji add kar diya gaya hai 🚨 */}
        <span style={{color: '#0095d9', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}>
          <span style={{marginLeft: '8px', fontSize: '22px', transform: 'translateY(-2px)'}}>🚀</span>
          بی ایل ایکس میں خوش آمدید:
        </span> 
        &nbsp;پاکستان کی بہترین اور مفت کلاسیفائیڈ ویب سائٹ۔ کسی بھی وقت، کچھ بھی خریدیں اور فروخت کریں! 
        <span style={{margin: '0 25px', color: '#7f9799'}}>|</span> 
        
        <span style={{color: '#e53935', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(229, 57, 53, 0.15)" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px', transform: 'translateY(-2px)'}}>
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
          </svg>
          بالکل مفت اشتہار لگائیں:
        </span> 
        &nbsp;کوئی پوشیدہ چارجز نہیں! اپنا اشتہار 100 فیصد مفت پوسٹ کریں اور ہزاروں خریداروں تک رسائی حاصل کریں۔ 
        <span style={{margin: '0 25px', color: '#7f9799'}}>|</span> 
        
        <span style={{color: '#2e7d32', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(46, 125, 50, 0.15)" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px', transform: 'translateY(-2px)'}}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          حفاظتی مشورہ:
        </span> 
        &nbsp;کبھی بھی پیشگی ادائیگی (ایڈوانس پیمنٹ) نہ کریں، بیچنے والے سے ہمیشہ کسی محفوظ عوامی مقام پر ملاقات کریں۔ 
        <span style={{margin: '0 25px', color: '#7f9799'}}>|</span> 
        
        <span style={{color: '#0095d9', fontWeight: 'bold', display: 'flex', alignItems: 'center'}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Icon.png" alt="PKR Bag" style={{height: '28px', width: 'auto', marginLeft: '8px'}} />
          فروخت کا آغاز کریں:
        </span> 
        &nbsp;اپنا پرانا یا غیر ضروری سامان بیچیں اور بغیر کسی فیس کے فوری رقم کمائیں!
      </div>
    </div>
  );
}