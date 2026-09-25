"use client"; 

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; 

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // 🚨 Loading state add ki

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false); // 🚨 Data check hone ke baad loading band
    }
    getUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); 
  };

  // 🚨 1. Jab tak user data fetch ho raha hai, Skeleton Loader dikhayega
  if (isLoading) {
    return (
      <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '10px', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Profile Pic Skeleton */}
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#cbd5e1', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        {/* Name Skeleton */}
        <div style={{ width: '70%', height: '22px', backgroundColor: '#cbd5e1', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        {/* Email Skeleton */}
        <div style={{ width: '90%', height: '16px', backgroundColor: '#cbd5e1', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        {/* Button Skeleton */}
        <div style={{ width: '80px', height: '35px', backgroundColor: '#cbd5e1', borderRadius: '5px', marginTop: '8px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  // 🚨 2. Agar loading khatam hone ke baad bhi user null hai
  if (!user) {
    return <div style={{ padding: '20px', color: '#64748b' }}>Aap login nahi hain. Kripya login karein.</div>;
  }

  // 🚨 3. Asli User Profile (Jab data mil jaye)
  return (
    <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '10px', maxWidth: '300px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      
      <img 
        src={user.user_metadata?.avatar_url || 'https://via.placeholder.com/60'} 
        alt="Profile" 
        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', marginBottom: '10px' }} 
      />
      
      <h3 style={{ margin: '0', color: '#0f172a' }}>{user.user_metadata?.full_name || 'Verified User'}</h3>
      <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 10px 0' }}>{user.email}</p>
      
      <button 
        onClick={handleLogout} 
        style={{ marginTop: '5px', padding: '8px 18px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
        onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
      >
        Logout
      </button>

    </div>
  );
}