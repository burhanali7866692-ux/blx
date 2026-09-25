"use client";

import React, { useState, useEffect } from 'react';
import { categoriesData, locationsList } from '../constants/data';
import { Ad } from '../types';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeSubCategory: string | null;
  setActiveSubCategory: (cat: string | null) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  setSelectedAd: (ad: Ad | null) => void;
  visibleAds: Ad[];
}

export default function Sidebar({ 
  activeCategory, setActiveCategory, activeSubCategory, setActiveSubCategory, 
  selectedCity, setSelectedCity, setSelectedAd, visibleAds 
}: SidebarProps) {
  
  // Dynamic categories & locations state (Syncs static data with any newly typed categories/locations from ads)
  const [dynamicCategories, setDynamicCategories] = useState<Record<string, string[]>>(categoriesData);
  const [dynamicLocations, setDynamicLocations] = useState<string[]>(locationsList);

  useEffect(() => {
    if (visibleAds && visibleAds.length > 0) {
      // 1. Auto-merge newly created categories and subcategories from ads
      setDynamicCategories(prev => {
        let changed = false;
        const updated = { ...prev };

        visibleAds.forEach(ad => {
          if (ad.category && ad.category.trim()) {
            const cat = ad.category.trim();
            if (!updated[cat]) {
              updated[cat] = [];
              changed = true;
            }
            if (ad.subCategory && ad.subCategory.trim()) {
              const sub = ad.subCategory.trim();
              if (!updated[cat].includes(sub)) {
                updated[cat] = [...updated[cat], sub];
                changed = true;
              }
            }
          }
        });

        return changed ? updated : prev;
      });

      // 2. Auto-merge newly typed Pakistani cities from ads
      setDynamicLocations(prev => {
        let changed = false;
        const updated = [...prev];

        visibleAds.forEach(ad => {
          if (ad.location && ad.location.trim()) {
            const loc = ad.location.trim();
            const exists = updated.some(l => l.toLowerCase() === loc.toLowerCase());
            if (!exists) {
              updated.push(loc);
              changed = true;
            }
          }
        });

        return changed ? updated : prev;
      });
    }
  }, [visibleAds]);

  const getCategoryCount = (catName: string) => {
    if (catName === 'ALL CATEGORIES') return visibleAds.length;
    return visibleAds.filter(ad => ad.category && ad.category.toLowerCase() === catName.toLowerCase()).length;
  };

  const getSubCategoryCount = (subCatName: string) => {
    return visibleAds.filter(ad => ad.subCategory && ad.subCategory.toLowerCase() === subCatName.toLowerCase()).length;
  };

  const getLocationCount = (locName: string) => {
    if (locName === 'All Pakistan') return visibleAds.length;
    return visibleAds.filter(ad => ad.location && ad.location.toLowerCase() === locName.toLowerCase()).length;
  };

  const textColor = '#334155';
  const hoverBgColor = '#eef2f6';
  const themeBlueColor = '#0095d9';

  const allMainCats = Object.keys(dynamicCategories);

  return (
    <aside style={{width: '240px', flexShrink: 0, paddingRight: '10px'}}>
      {/* CATEGORIES SECTION */}
      <h2 style={{fontSize: '15px', color: '#002f34', marginBottom: '15px', borderBottom: '1px solid #ebeeef', paddingBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold'}}>Categories</h2>
      <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
        
        {/* All Categories Option */}
        <li 
          onClick={() => { setActiveCategory('ALL CATEGORIES'); setActiveSubCategory(null); setSelectedAd(null); }}
          style={{
            cursor: 'pointer', fontSize: '15px', 
            color: activeCategory === 'ALL CATEGORIES' ? '#002f34' : textColor, 
            marginBottom: '8px', 
            fontWeight: activeCategory === 'ALL CATEGORIES' ? 'bold' : '500', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            width: '100%', padding: '8px 12px', borderRadius: '6px',
            backgroundColor: activeCategory === 'ALL CATEGORIES' ? hoverBgColor : 'transparent',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { if (activeCategory !== 'ALL CATEGORIES') e.currentTarget.style.backgroundColor = hoverBgColor; e.currentTarget.style.color = themeBlueColor; }}
          onMouseLeave={(e) => { if (activeCategory !== 'ALL CATEGORIES') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = textColor; } }}
        >
          <span>All categories</span>
          <span style={{fontWeight: 'normal', color: '#64748b', fontSize: '13px'}}>({getCategoryCount('ALL CATEGORIES')})</span>
        </li>
        
        {/* Active Category with Subcategories */}
        {activeCategory !== 'ALL CATEGORIES' ? (
          <div style={{marginLeft: '10px', borderLeft: '2px solid #ebeeef', paddingLeft: '10px', marginTop: '10px'}}>
            <li style={{fontSize: '15px', fontWeight: 'bold', color: '#002f34', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '4px 10px'}}>
              <span>{activeCategory}</span>
              <span style={{fontWeight: 'normal', color: '#64748b', fontSize: '13px'}}>({getCategoryCount(activeCategory)})</span>
            </li>
            
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {(dynamicCategories[activeCategory] || []).map((subCat) => (
                <li 
                  key={subCat}
                  onClick={() => { setActiveSubCategory(subCat); setSelectedAd(null); }}
                  style={{
                    cursor: 'pointer', fontSize: '14px', marginBottom: '6px', 
                    color: activeSubCategory === subCat ? '#002f34' : textColor,
                    fontWeight: activeSubCategory === subCat ? 'bold' : 'normal',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    width: '100%', padding: '6px 10px', borderRadius: '6px',
                    backgroundColor: activeSubCategory === subCat ? hoverBgColor : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { if (activeSubCategory !== subCat) { e.currentTarget.style.backgroundColor = hoverBgColor; e.currentTarget.style.color = themeBlueColor; } }}
                  onMouseLeave={(e) => { if (activeSubCategory !== subCat) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = textColor; } }}
                >
                  <span>{subCat}</span>
                  <span style={{color: '#64748b', fontSize: '13px', fontWeight: 'normal'}}>({getSubCategoryCount(subCat)})</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          /* List of All Dynamic Categories */
          allMainCats.map((cat) => (
            <li 
              key={cat} 
              onClick={() => { setActiveCategory(cat); setSelectedAd(null); }}
              style={{
                cursor: 'pointer', fontSize: '15px', color: textColor, marginBottom: '6px', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                width: '100%', padding: '8px 12px', borderRadius: '6px',
                fontWeight: '500', transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverBgColor; e.currentTarget.style.color = themeBlueColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = textColor; }}
            >
              <span>{cat}</span>
              <span style={{color: '#64748b', fontSize: '13px'}}>({getCategoryCount(cat)})</span>
            </li>
          ))
        )}
      </ul>

      {/* LOCATIONS SECTION */}
      <h2 style={{fontSize: '15px', color: '#002f34', marginTop: '35px', marginBottom: '15px', borderBottom: '1px solid #ebeeef', paddingBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold'}}>Locations</h2>
      <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
        {dynamicLocations.map(loc => (
          <li 
            key={loc}
            onClick={() => { setSelectedCity(loc); setSelectedAd(null); }}
            style={{
              cursor: 'pointer', fontSize: '15px', marginBottom: '6px',
              color: selectedCity === loc ? '#002f34' : textColor,
              fontWeight: selectedCity === loc ? 'bold' : '500',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              width: '100%', padding: '8px 12px', borderRadius: '6px',
              backgroundColor: selectedCity === loc ? hoverBgColor : 'transparent',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { if (selectedCity !== loc) { e.currentTarget.style.backgroundColor = hoverBgColor; e.currentTarget.style.color = themeBlueColor; } }}
            onMouseLeave={(e) => { if (selectedCity !== loc) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = textColor; } }}
          >
            <span style={{display: 'flex', alignItems: 'center'}}>
              {loc === 'All Pakistan' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#cyanPurpleGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="url(#cyanPurpleGradient)"/>
                  <ellipse cx="12" cy="21.5" rx="7" ry="2.5" stroke="url(#cyanPurpleGradient)" strokeWidth="1.5" fill="none" opacity="0.8"/>
                </svg>
              )}
              {loc}
            </span>
            <span style={{color: '#64748b', fontSize: '13px', fontWeight: 'normal'}}>({getLocationCount(loc)})</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}