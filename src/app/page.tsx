// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CategoriesBar from '../components/CategoriesBar';
import Hero from '../components/Hero'; 
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import NewsTicker from '../components/NewsTicker';
import Sidebar from '../components/Sidebar';
import AdDetails from '../components/AdDetails';
import PostAdModal from '../components/PostAdModal';
import { Ad } from '../types';
import { categoriesList } from '../constants/data';
import { supabase } from '../lib/supabase'; 

export type { Ad, NewAd } from '../types';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); 
  
  const [selectedCity, setSelectedCity] = useState('All Pakistan'); 
  const [activeCategory, setActiveCategory] = useState('ALL CATEGORIES');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  
  const [tabViewMode, setTabViewMode] = useState<'all' | 'favorites'>('all');

  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { label: 'Newly listed', value: 'newest' },
    { label: 'Lowest price', value: 'price_asc' },
    { label: 'Highest price', value: 'price_desc' },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || 'Newly listed';

  const [favorites, setFavorites] = useState<number[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null); 
  
  const [isLoading, setIsLoading] = useState(true); 
  const [isLoadingMore, setIsLoadingMore] = useState(false); 

  const [page, setPage] = useState(1);
  const itemsPerPage = 20; 
  const [hasMore, setHasMore] = useState(true);

  // Footer matching theme color (#0b5a8a)
  const themeColor = '#0b5a8a';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchUserFavorites(userId: string) {
      const { data, error } = await supabase
        .from('favorites')
        .select('ad_id')
        .eq('user_id', userId);

      if (!error && data) {
        setFavorites(data.map((fav: any) => fav.ad_id));
      }
    }

    async function checkUserAndFavs() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user) {
        fetchUserFavorites(user.id);
      }
    }

    checkUserAndFavs();
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); 
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, activeSubCategory, selectedCity, tabViewMode, sortBy]);

  useEffect(() => {
    async function fetchAdsFromDatabase() {
      if (page === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      
      try {
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        let query = supabase
          .from('ads')
          .select('*', { count: 'exact' })
          .eq('is_approved_by_admin', true);

        if (sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'price_asc') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price_desc') {
          query = query.order('price', { ascending: false });
        }

        if (tabViewMode === 'favorites') {
          if (favorites.length === 0) {
            setAds([]);
            setIsLoading(false);
            setIsLoadingMore(false);
            return;
          }
          query = query.in('id', favorites);
        } else {
          query = query.range(from, to);
          if (activeCategory !== 'ALL CATEGORIES') {
            query = query.eq('category', activeCategory);
          }
          if (activeSubCategory) {
            query = query.eq('sub_category', activeSubCategory);
          }
          if (selectedCity !== 'All Pakistan') {
            query = query.ilike('location', `%${selectedCity}%`);
          }
          if (debouncedSearchTerm) {
            query = query.ilike('title', `%${debouncedSearchTerm}%`);
          }
        }

        const { data: dbAds, error, count } = await query;

        if (error) {
          console.error(error);
        } else if (dbAds) {
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
            isMyAd: currentUser ? dbAd.user_id === currentUser.id : false,
            isHidden: false,
            isSold: dbAd.is_sold || false, 
            isApprovedByAdmin: dbAd.is_approved_by_admin,
            show_contact: dbAd.show_contact ?? true,
            adminContactOnly: dbAd.category === 'Jobs' ? true : false
          }));

          if (page === 1) {
            setAds(formattedAds);
          } else {
            setAds((prevAds) => {
              const existingIds = new Set(prevAds.map(ad => ad.id));
              const uniqueNewAds = formattedAds.filter(ad => !existingIds.has(ad.id));
              return [...prevAds, ...uniqueNewAds];
            });
          }

          if (count !== null) {
             setHasMore(to < count - 1); 
          } else {
             setHasMore(formattedAds.length === itemsPerPage);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }

    fetchAdsFromDatabase();
  }, [debouncedSearchTerm, selectedCity, activeCategory, activeSubCategory, page, tabViewMode, favorites, sortBy]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const toggleFavorite = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!currentUser) {
      alert("Favorites mein save karne ke liye pehle login karein!");
      return;
    }

    const isFav = favorites.includes(id);

    if (isFav) {
      setFavorites(favorites.filter(favId => favId !== id));
      await supabase.from('favorites').delete().match({ user_id: currentUser.id, ad_id: id });
    } else {
      setFavorites([...favorites, id]);
      await supabase.from('favorites').insert([{ user_id: currentUser.id, ad_id: id }]);
    }
  };

  const handleDeleteClick = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Kya aap waqai is ad ko delete karna chahte hain?");
    if (!confirmDelete) return;

    await supabase.from('ads').delete().eq('id', id);
    setAds(ads.filter((ad) => ad.id !== id));
    setFavorites(favorites.filter((favId) => favId !== id));
  };

  const handleToggleHide = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAds(ads.map(ad => {
      if (ad.id === id) { return { ...ad, isHidden: !ad.isHidden }; }
      return ad;
    }));
  };

  const handleNewAdPost = (newAd: Ad) => {
    if (newAd.isApprovedByAdmin !== false) {
      setAds([newAd, ...ads]);
    }
    setIsModalOpen(false);
  };

  const visibleAds = ads.filter(ad => !ad.isHidden);

  if (!isMounted) return null; 

  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f7f8f9'}}>
      
      <Navbar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        setIsModalOpen={setIsModalOpen}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      <NewsTicker />

      <CategoriesBar 
        categoriesList={categoriesList}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        setActiveSubCategory={setActiveSubCategory}
        setSelectedAd={setSelectedAd}
      />

      {!selectedAd && (
        <Hero />
      )}

      {/* Tabs Bar - Hero section ke sath exact align kiya gaya hai */}
      {!selectedAd && (
        <div style={{ maxWidth: '1280px', margin: '20px auto 0 auto', padding: '0 20px', width: '100%', boxSizing: 'border-box', display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setTabViewMode('all')}
            style={{
              padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', border: 'none',
              backgroundColor: tabViewMode === 'all' ? themeColor : '#ebeeef',
              color: tabViewMode === 'all' ? '#fff' : themeColor,
              transition: 'all 0.2s',
              boxShadow: tabViewMode === 'all' ? '0 2px 6px rgba(11, 90, 138, 0.3)' : 'none'
            }}
          >
            🔥 All Recommendations
          </button>
          
          <button 
            onClick={() => {
              if (!currentUser) {
                alert("Favorites dekhne ke liye pehle login karein!");
                return;
              }
              setTabViewMode('favorites');
            }}
            style={{
              padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', border: 'none',
              backgroundColor: tabViewMode === 'favorites' ? themeColor : '#ebeeef',
              color: tabViewMode === 'favorites' ? '#fff' : themeColor,
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: tabViewMode === 'favorites' ? '0 2px 6px rgba(11, 90, 138, 0.3)' : 'none'
            }}
          >
            ❤️ My Favorites ({favorites.length})
          </button>
        </div>
      )}

      {/* Main Ads Container - Hero section ki exact width aur padding ke mutabiq */}
      <div style={{display: 'flex', maxWidth: '1280px', margin: '0 auto', padding: '20px 20px', gap: '30px', flex: 1, width: '100%', boxSizing: 'border-box', alignItems: 'flex-start'}}>
        
        {!selectedAd && tabViewMode === 'all' && layoutMode === 'list' && (
          <Sidebar 
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeSubCategory={activeSubCategory}
            setActiveSubCategory={setActiveSubCategory}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            setSelectedAd={setSelectedAd}
            visibleAds={visibleAds}
          />
        )}

        <main style={{flex: 1}}>
          {selectedAd ? (
            <AdDetails selectedAd={selectedAd} setSelectedAd={setSelectedAd} />
          ) : (
            <>
              {visibleAds.length > 0 && !isLoading && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '0', flexWrap: 'wrap', gap: '15px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', margin: 0 }}>
                    {tabViewMode === 'favorites' ? 'Aap ke Pasandeeda Ads (Favorites)' : 'Taza Tareen Ads (Fresh Recommendations)'}
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '8px 15px', borderRadius: '8px', border: '1px solid #ebeeef', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#5c7a7d' }}>View:</span>
                      <button
                        onClick={() => setLayoutMode('list')}
                        style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: layoutMode === 'list' ? `1px solid ${themeColor}` : '1px solid #dcdcdc', backgroundColor: layoutMode === 'list' ? '#eef2f3' : '#fff', color: themeColor }}
                      >
                        List
                      </button>
                      <button
                        onClick={() => setLayoutMode('grid')}
                        style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: layoutMode === 'grid' ? `1px solid ${themeColor}` : '1px solid #dcdcdc', backgroundColor: layoutMode === 'grid' ? '#eef2f3' : '#fff', color: themeColor }}
                      >
                        Grid
                      </button>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', color: '#5c7a7d' }}>Sort:</span>
                        <button
                          onClick={() => setIsSortOpen(!isSortOpen)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', backgroundColor: '#f8f9fa', border: '1px solid #dcdcdc', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: themeColor, cursor: 'pointer' }}
                        >
                          <span>{currentSortLabel}</span>
                          <span style={{ transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                        </button>
                      </div>

                      {isSortOpen && (
                        <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '5px', width: '160px', backgroundColor: '#fff', border: '1px solid #ebeeef', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden' }}>
                          {sortOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortBy(option.value);
                                setIsSortOpen(false);
                              }}
                              style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '13px', backgroundColor: sortBy === option.value ? '#f0f4f5' : '#fff', color: sortBy === option.value ? themeColor : '#333', border: 'none', cursor: 'pointer', fontWeight: sortBy === option.value ? 'bold' : 'normal' }}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isLoading && page === 1 ? (
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
              ) : visibleAds.length === 0 ? (
                <div style={{textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ebeeef', marginTop: '10px'}}>
                  <h3 style={{color: themeColor, fontSize: '20px', marginBottom: '8px'}}>
                    {tabViewMode === 'favorites' ? 'Aap ne abhi tak koi ad favorite nahi kiya!' : 'Is category mein koi ad nahi hai.'}
                  </h3>
                  <p style={{color: '#5c7a7d', fontSize: '14px'}}>
                    {tabViewMode === 'favorites' ? 'Ads par bane huay ❤️ icon par click karke unhein yahan save karein.' : 'Mukhtalif categories ya cities check karein.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className={layoutMode === 'grid' ? "ads-grid" : ""} style={layoutMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: '15px' } : {}}>
                    {visibleAds.map((ad) => (
                      <div key={ad.id} style={layoutMode === 'list' ? { width: '100%', backgroundColor: '#fff', border: '1px solid #ebeeef', borderRadius: '8px', padding: '10px' } : {}}>
                        <ProductCard 
                          ad={ad} 
                          setSelectedAd={setSelectedAd} 
                          favorites={favorites} 
                          toggleFavorite={toggleFavorite} 
                          handleDeleteClick={handleDeleteClick}
                          handleToggleHide={handleToggleHide}
                          layoutMode={layoutMode}     
                        />
                      </div>
                    ))}
                  </div>
                  
                  {hasMore && !isLoading && tabViewMode === 'all' && (
                    <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
                      <button 
                        onClick={handleLoadMore} 
                        disabled={isLoadingMore}
                        style={{
                          padding: '12px 30px',
                          backgroundColor: themeColor, 
                          color: '#ffffff',
                          border: `2px solid ${themeColor}`,
                          borderRadius: '6px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                          opacity: isLoadingMore ? 0.7 : 1,
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                      >
                        {isLoadingMore ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>

      <PostAdModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPost={handleNewAdPost} />

      <Footer />
    </div>
  );
}