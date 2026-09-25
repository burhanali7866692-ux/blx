"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import PostAdModal from '../../components/PostAdModal';
import AdDetails from '../../components/AdDetails';
import { Ad } from '../../types';
import { supabase } from '../../lib/supabase';

export default function MyAdsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [myAds, setMyAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Pakistan');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetchMyAds();
  }, []);

  async function fetchMyAds() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (!user) {
        setLoading(false);
        return; 
      }

      const { data: dbAds, error } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && dbAds) {
        const formattedAds: Ad[] = dbAds.map((dbAd: any) => ({
          id: dbAd.id,
          title: dbAd.title,
          price: dbAd.price,
          priceNum: parseInt(dbAd.price.toString().replace(/[^0-9]/g, '')) || 0,
          location: dbAd.location,
          category: dbAd.category,
          subCategory: dbAd.sub_category || '',
          image: dbAd.image_url || '',
          allImages: dbAd.all_images || [],
          description: dbAd.description || '',
          sellerName: dbAd.seller_name || '',
          mobileNumber: dbAd.mobile_number || '',
          isMyAd: true, 
          isHidden: false,
          isSold: dbAd.is_sold || false, 
          isApprovedByAdmin: dbAd.category === 'Jobs' ? false : true,
          adminContactOnly: dbAd.category === 'Jobs' ? true : false
        }));
        setMyAds(formattedAds);
      }
    } catch (err) {
      console.error("Error fetching my ads", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Kya aap waqai is ad ko hamesha k liye delete karna chahte hain?");
    if (!confirmDelete) return;

    await supabase.from('ads').delete().eq('id', id);
    setMyAds((prevAds) => prevAds.filter((ad) => ad.id !== id));
  };

  const handleMarkAsSold = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const confirmSold = window.confirm("Kya aap waqai is ad ko Sold mark karna chahte hain?");
    if (!confirmSold) return;

    const { error } = await supabase
      .from('ads')
      .update({ is_sold: true }) 
      .eq('id', id);

    if (error) {
      alert("Error aa gaya: " + error.message);
    } else {
      setMyAds((prevAds) => prevAds.map(ad => ad.id === id ? { ...ad, isSold: true } : ad));
      alert("Mubarak ho! Aapka ad Sold mark ho gaya hai.");
    }
  };

  const handleEditClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const adToEdit = myAds.find(ad => ad.id === id);
    if (adToEdit) {
      setEditingAd(adToEdit); 
      setIsModalOpen(true);   
    }
  };

  const handleNewAdPost = (newAd: Ad) => {
    setMyAds((prevAds) => [newAd, ...prevAds]); 
    setIsModalOpen(false);
  };

  const handleEditAdSubmit = (updatedAd: Ad) => {
    setMyAds((prevAds) => prevAds.map(ad => (ad.id === updatedAd.id ? updatedAd : ad)));
    setEditingAd(null); 
  };

  if (!isMounted) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f7f8f9' }}>
      
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setIsModalOpen={setIsModalOpen}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', width: '100%' }}>
        
        {selectedAd ? (
          <AdDetails selectedAd={selectedAd} setSelectedAd={setSelectedAd} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#002f34', marginBottom: '5px' }}>
                  My Ads Dashboard
                </h1>
                <p style={{ color: '#5c7a7d' }}>
                  Yahan aap apne post kiye gaye tamam ads dekh aur manage kar sakte hain.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="ads-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <div key={index} className="skeleton-card">
                    <div className="skeleton skeleton-img"></div>
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-price"></div>
                    <div className="skeleton skeleton-location"></div>
                  </div>
                ))}
              </div>
            ) : !currentUser ? (
              <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ebeeef', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#e63946', marginBottom: '10px', fontSize: '22px' }}>Please Login First</h3>
                <p style={{ color: '#5c7a7d' }}>Apne ads dekhne ke liye Navbar se login karna zaroori hai.</p>
              </div>
            ) : myAds.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ebeeef', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <h3 style={{ color: '#002f34', marginBottom: '15px', fontSize: '22px' }}>Aap ne abhi tak koi ad post nahi kiya!</h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  style={{ padding: '12px 25px', backgroundColor: '#0095d9', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'background 0.2s' }}
                >
                  Post Your First Ad
                </button>
              </div>
            ) : (
              <div className="ads-grid">
                {myAds.map((ad) => (
                  <ProductCard
                    key={ad.id}
                    ad={ad}
                    setSelectedAd={setSelectedAd} 
                    favorites={[]} 
                    toggleFavorite={() => {}} 
                    handleDeleteClick={handleDeleteClick}
                    handleToggleHide={() => {}}
                    handleMarkAsSold={handleMarkAsSold} 
                    handleEditClick={handleEditClick}   
                    layoutMode="grid"
                    hideActions={true}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <PostAdModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingAd(null); }} 
        onPost={handleNewAdPost}
        editAd={editingAd}
        onEdit={handleEditAdSubmit}
      />
      
      <Footer />
    </div>
  );
}