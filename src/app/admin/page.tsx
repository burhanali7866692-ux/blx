// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { Ad } from '../../types';
import { supabase } from '../../lib/supabase';
import { updateAdContactMode, approveAdAction, deleteAdAction } from './actions';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); 
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminSearch, setAdminSearch] = useState(''); 

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdsFromDatabase();
    }
  }, [isAuthenticated]);

  async function fetchAdsFromDatabase() {
    setIsLoading(true);
    const { data: dbAds } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    
    if (dbAds) {
      const formattedAds: Ad[] = dbAds.map((dbAd: any) => ({
        id: dbAd.id,
        title: dbAd.title,
        price: dbAd.price,
        priceNum: parseInt(dbAd.price.replace(/[^0-9]/g, '')) || 0,
        location: dbAd.location,
        category: dbAd.category,
        subCategory: dbAd.sub_category || '',
        image: dbAd.image_url || '',
        allImages: dbAd.all_images || [],
        description: dbAd.description || '',
        sellerName: dbAd.seller_name || '',
        mobileNumber: dbAd.mobile_number || '',
        isApprovedByAdmin: dbAd.is_approved_by_admin, 
        adminContactOnly: dbAd.show_contact !== null ? !dbAd.show_contact : (dbAd.category === 'Jobs')
      }));
      setAds(formattedAds);
    }
    setIsLoading(false);
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Sirf secure environment variable se password check hoga (Koi purana password nahi hai)
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    
    if (password === correctPassword) { 
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password!');
    }
  };

  const pendingAds = ads.filter(ad => ad.isApprovedByAdmin === false);
  const approvedAds = ads.filter(ad => ad.isApprovedByAdmin !== false);
  
  const currentTabAds = activeTab === 'pending' ? pendingAds : approvedAds;
  const displayAds = currentTabAds.filter(ad => 
    ad.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    ad.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
    ad.location.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const handleApprove = async (id: number) => {
    const confirmApprove = window.confirm("Kya aap is ad ko LIVE karna chahte hain?");
    if (!confirmApprove) return;

    const result = await approveAdAction(id);

    if (!result.success) {
      alert("Approve nahi ho saka! Error: " + result.error);
    } else {
      setAds(ads.map(ad => ad.id === id ? { ...ad, isApprovedByAdmin: true } : ad));
      alert("Ad successfully LIVE ho gaya hai! 🎉");
      fetchAdsFromDatabase(); 
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('🚨 WARNING: Kiya aap waqai is ad ko hamesha ke liye delete karna chahte hain?')) {
      const result = await deleteAdAction(id);

      if (!result.success) {
        alert("Delete nahi ho saka! Error: " + result.error);
      } else {
        setAds(ads.filter(ad => ad.id !== id));
        alert("Ad hamesha ke liye Delete ho gaya! 🗑️");
        fetchAdsFromDatabase(); 
      }
    }
  };

  const handleToggleContactMode = async (id: number, currentAdminMode: boolean) => {
    const newAdminMode = !currentAdminMode;
    const actionText = newAdminMode ? "Admin (Blx Team)" : "Direct Seller";
    const newShowContactValue = !newAdminMode;

    if (window.confirm(`Kya aap is ad ka contact mode badal kar '${actionText}' karna chahte hain?`)) {
      const result = await updateAdContactMode(id, newShowContactValue);

      if (!result.success) {
        alert("Update nahi ho saka! Error: " + result.error);
      } else {
        setAds(ads.map(ad => ad.id === id ? { ...ad, adminContactOnly: newAdminMode } : ad));
        alert("Contact mode successfully update ho gaya hai! ✅");
        fetchAdsFromDatabase();
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f2f4f5' }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>🛡️</div>
          <h2 style={{ color: '#002f34', margin: '0 0 25px 0', fontSize: '28px', fontWeight: '900' }}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '15px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box', outline: 'none' }}
              required
            />
            <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#005b8f', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'Arial, sans-serif' }}>
      
      <div style={{ backgroundColor: '#005b8f', padding: '20px 40px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', letterSpacing: '1px' }}>🛡️ BLX Command Center</h1>
        <button onClick={() => setIsAuthenticated(false)} style={{ backgroundColor: '#fff', color: '#ef4444', border: 'none', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          Logout
        </button>
      </div>

      <div style={{ maxWidth: '1300px', margin: '30px auto 0 auto', padding: '0 30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '5px solid #005b8f' }}>
          <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>Total Ads</p>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '28px' }}>{ads.length}</h2>
        </div>
        <div style={{ flex: 1, minWidth: '200px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '5px solid #f59e0b' }}>
          <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>Pending Approval</p>
          <h2 style={{ margin: 0, color: '#f59e0b', fontSize: '28px' }}>{pendingAds.length}</h2>
        </div>
        <div style={{ flex: 1, minWidth: '200px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '5px solid #10b981' }}>
          <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>Live Active Ads</p>
          <h2 style={{ margin: 0, color: '#10b981', fontSize: '28px' }}>{approvedAds.length}</h2>
        </div>
      </div>

      <div style={{ display: 'flex', padding: '30px', gap: '30px', maxWidth: '1300px', margin: '0 auto', flexWrap: 'wrap' }}>
        
        <div style={{ width: '280px', backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: 'fit-content', flexShrink: 0 }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Navigation</h3>
          
          <button 
            onClick={() => setActiveTab('pending')} 
            style={{ width: '100%', padding: '15px', textAlign: 'left', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', backgroundColor: activeTab === 'pending' ? '#e0f2fe' : 'transparent', color: activeTab === 'pending' ? '#0284c7' : '#334155' }}
          >
            ⏳ Pending Approvals <span style={{ float: 'right', backgroundColor: activeTab === 'pending' ? '#0284c7' : '#cbd5e1', color: '#fff', padding: '2px 8px', borderRadius: '50px', fontSize: '12px' }}>{pendingAds.length}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('approved')} 
            style={{ width: '100%', padding: '15px', textAlign: 'left', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', backgroundColor: activeTab === 'approved' ? '#dcfce7' : 'transparent', color: activeTab === 'approved' ? '#16a34a' : '#334155' }}
          >
            ✅ Live Ads <span style={{ float: 'right', backgroundColor: activeTab === 'approved' ? '#16a34a' : '#cbd5e1', color: '#fff', padding: '2px 8px', borderRadius: '50px', fontSize: '12px' }}>{approvedAds.length}</span>
          </button>
        </div>

        <div style={{ flex: 1, minWidth: '400px' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="text"
              placeholder="Search ads by title, category or city..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              style={{ width: '100%', padding: '14px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}
            />
          </div>

          <h2 style={{ color: '#0f172a', margin: '0 0 20px 0', fontSize: '24px', fontWeight: '900' }}>
            {activeTab === 'pending' ? 'Waiting for Approval' : 'Active Public Ads'}
          </h2>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#64748b', fontWeight: 'bold', fontSize: '18px' }}>
              ⏳ Ads load ho rahe hain...
            </div>
          ) : displayAds.length === 0 ? (
            <div style={{ backgroundColor: '#fff', padding: '60px', textAlign: 'center', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#64748b' }}>
              <span style={{ fontSize: '40px', display: 'block', marginBottom: '15px' }}>🔍</span>
              <h2 style={{ margin: 0 }}>Koi ad nahi mila!</h2>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {displayAds.map((ad) => (
                <div key={ad.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', gap: '25px', alignItems: 'center', borderLeft: activeTab === 'pending' ? '6px solid #f59e0b' : '6px solid #10b981', flexWrap: 'wrap' }}>
                  
                  <img src={ad.image || 'https://via.placeholder.com/150'} alt={ad.title} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>{ad.title}</h3>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '50px', backgroundColor: ad.adminContactOnly ? '#fef3c7' : '#dcfce7', color: ad.adminContactOnly ? '#d97706' : '#16a34a' }}>
                        {ad.adminContactOnly ? '🔒 Admin Mode' : '🌐 Public Mode'}
                      </span>
                    </div>
                    
                    <p style={{ margin: '0 0 10px 0', color: '#005b8f', fontWeight: '900', fontSize: '18px' }}>{ad.price}</p>
                    
                    <div style={{ display: 'flex', gap: '15px', color: '#475569', fontSize: '14px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '4px' }}>🏷️ {ad.category}</span>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '4px' }}>📍 {ad.location}</span>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '4px' }}>👤 {ad.sellerName}</span>
                    </div>

                    <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>
                      📞 Mobile: {ad.mobileNumber}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
                    {!ad.isApprovedByAdmin && (
                      <button onClick={() => handleApprove(ad.id)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ✅ Approve Live
                      </button>
                    )}
                    
                    <button 
                      onClick={() => window.open(`https://wa.me/92${ad.mobileNumber?.replace(/^0+/, '')}?text=Assalam%20o%20Alaikum%20${ad.sellerName},%20Blx%20Admin%20Team...`, '_blank')}
                      style={{ backgroundColor: '#19c92e', color: '#fff', border: 'none', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      💬 WhatsApp Seller
                    </button>

                    <button onClick={() => handleToggleContactMode(ad.id, ad.adminContactOnly || false)} style={{ backgroundColor: ad.adminContactOnly ? '#0ea5e9' : '#f59e0b', color: '#fff', border: 'none', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                      🔄 Switch to {ad.adminContactOnly ? 'Seller No.' : 'Admin No.'}
                    </button>

                    <button onClick={() => handleDelete(ad.id)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                      🗑️ Delete Ad
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}