"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Ad } from '../types'; 
import { categoriesData } from '../constants/data'; 

interface CategoriesBarProps {
  categoriesList: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  setActiveSubCategory: (subCat: string | null) => void;
  setSelectedAd: (ad: Ad | null) => void; 
}

export default function CategoriesBar({ 
  categoriesList, 
  activeCategory, 
  setActiveCategory, 
  setActiveSubCategory, 
  setSelectedAd 
}: CategoriesBarProps) {
  
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
  const allCategoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (allCategoriesRef.current && !allCategoriesRef.current.contains(event.target as Node)) {
        setIsAllCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fixedCategoriesList = categoriesList.reduce((acc: string[], cat: string) => {
    if (cat === "Books & Sports" || (cat.includes("Books") && cat.includes("Sports"))) {
      acc.push("Books", "Sports");
    } 
    else if (cat === "Business & Industrial" || cat === "Business & Industry" || cat.includes("Business")) {
      if (!acc.includes("Business")) acc.push("Business");
    } 
    else {
      acc.push(cat);
    }
    return acc;
  }, []);

  const newCategories = [
    "Auto Parts", "Appliances", "Beauty", "Jewelry", "Decor", 
    "Tools", "Stationery", "Luggage", "Tickets", "Health",
    "Computers", "Gaming", "Watches", "Garden"
  ];
  
  const combinedList = Array.from(new Set([...fixedCategoriesList, ...newCategories]));

  // Pakistan mein sabse zyada demand aur search ki jaane wali top categories ka exact order
  const preferredOrder = [
    "Mobiles", "Vehicles", "Bikes", "Property", "Electronics",
    "Animals", "Jobs", "Furniture", "Fashion", "Services",
    "Kids & Toys", "Books", "Sports", "Agriculture", "Business", "Food"
  ];

  const hasAllCategories = true; 
  
  const viralCategories = combinedList
    .filter(cat => cat !== 'ALL CATEGORIES')
    .sort((a, b) => {
      const indexA = preferredOrder.indexOf(a);
      const indexB = preferredOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  const alphabeticalCategories = combinedList
    .filter(cat => cat !== 'ALL CATEGORIES')
    .sort((a, b) => a.localeCompare(b)); 

  const getSubCats = (cat: string) => {
    if (!categoriesData) return null;
    let dataKey = cat;
    if (cat === "Business") {
      dataKey = Object.keys(categoriesData).find(k => k.toLowerCase().includes("business")) || cat;
    } else if (cat === "Books" || cat === "Sports") {
      dataKey = Object.keys(categoriesData).find(k => k.toLowerCase().includes("books") && k.toLowerCase().includes("sports")) || cat;
    }
    return categoriesData[dataKey];
  };

  return (
    <div className="categories-admin-wrapper" style={{
      display: 'flex', alignItems: 'center', padding: '12px 50px', 
      backgroundColor: '#ffffff', borderBottom: '1px solid #ebeeef', 
      borderTop: '1px solid #ebeeef', boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
      gap: '25px'
    }}>
      
      {hasAllCategories && (
        <div ref={allCategoriesRef} style={{ position: 'relative', flexShrink: 0 }}>
          <span 
            onClick={() => setIsAllCategoriesOpen(!isAllCategoriesOpen)}
            style={{
              cursor: 'pointer', fontWeight: '900', color: '#0b5a8a',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '15px', whiteSpace: 'nowrap'
            }}
          >
            ALL CATEGORIES
            <span style={{ fontSize: '12px', transition: 'transform 0.2s', transform: isAllCategoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
          </span>

          {isAllCategoriesOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, marginTop: '12px',
              backgroundColor: '#fff', border: '1px solid #ebeeef', borderRadius: '8px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 999,
              width: '340px', 
              height: 'auto', 
              padding: '12px', display: 'flex', flexDirection: 'column'
            }}>
              
              <div 
                onClick={() => {
                  setActiveCategory('ALL CATEGORIES');
                  setActiveSubCategory(null);
                  setSelectedAd(null);
                  setIsAllCategoriesOpen(false);
                }}
                style={{
                  padding: '8px 12px', cursor: 'pointer', fontSize: '14px',
                  color: '#0b5a8a',
                  fontWeight: activeCategory === 'ALL CATEGORIES' ? 'bold' : '600',
                  backgroundColor: '#f8fafc', borderRadius: '4px',
                  borderBottom: '2px solid #ebeeef', 
                  marginBottom: '12px', textAlign: 'center', transition: 'all 0.2s', flexShrink: 0
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              >
                View All Ads
              </div>

              <div style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                columnGap: '4px', 
                rowGap: '8px'
              }}>
                {alphabeticalCategories.map((cat) => (
                  <div 
                    key={`all-${cat}`}
                    onClick={() => {
                      setActiveCategory(cat);
                      setActiveSubCategory(null);
                      setSelectedAd(null);
                      setIsAllCategoriesOpen(false); 
                    }}
                    style={{
                      padding: '4px', 
                      cursor: 'pointer', 
                      fontSize: '12px', 
                      color: '#0b5a8a',
                      fontWeight: activeCategory === cat ? 'bold' : 'normal',
                      borderRadius: '4px', transition: 'all 0.2s',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f2f4f5';
                      e.currentTarget.style.color = '#7b2cbf';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#0b5a8a';
                    }}
                    title={cat} 
                  >
                    {cat}
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      )}

      {/* TOP HOT SEARCHED CATEGORIES (Sirf top demand wali categories jo bar ko perfectly fill karein) */}
      <div style={{
        display: 'flex', fontSize: '14px', 
        flexWrap: 'nowrap', alignItems: 'center', flex: 1, 
        justifyContent: 'space-between',
        overflow: 'hidden' 
      }}>
        
        {viralCategories.slice(0, 12).map((cat, index) => { 
          let textColor = '#0b5a8a'; 
          if (hoveredCategory === cat) textColor = '#7b2cbf'; 
          else if (activeCategory === cat) textColor = '#0b5a8a'; 

          const subCats = getSubCats(cat); 
          const isRightSideItem = index > 6; 

          return (
            <div 
              key={cat}
              onMouseEnter={() => setHoveredCategory(cat)} 
              onMouseLeave={() => setHoveredCategory(null)}
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <span 
                onClick={() => { setActiveCategory(cat); setActiveSubCategory(null); setSelectedAd(null); }} 
                style={{
                  cursor: 'pointer', fontWeight: activeCategory === cat ? 'bold' : '500', 
                  color: textColor, borderBottom: activeCategory === cat ? '2px solid #0b5a8a' : '2px solid transparent',
                  paddingBottom: '2px', display: 'inline-flex', alignItems: 'center',
                  gap: '4px', whiteSpace: 'nowrap', transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)', 
                  transform: hoveredCategory === cat ? 'scale(1.08)' : 'scale(1)', transformOrigin: 'center left' 
                }}
              >
                {cat}
                {subCats && (
                  <span style={{ fontSize: '10px', transition: 'transform 0.2s', transform: hoveredCategory === cat ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                )}
              </span>

              {/* Horizontal bar wali categories ka Dropdown */}
              {subCats && hoveredCategory === cat && (
                <div style={{
                  position: 'absolute', top: '100%', ...(isRightSideItem ? { right: 0 } : { left: 0 }),
                  marginTop: '12px', backgroundColor: '#fff', border: '1px solid #ebeeef',
                  borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 999,
                  minWidth: '200px', display: 'flex', flexDirection: 'column', padding: '8px 0'
                }}>
                  {subCats.map((sub: string) => (
                    <div 
                      key={sub}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCategory(cat);
                        setActiveSubCategory(sub);
                        setSelectedAd(null);
                        setHoveredCategory(null);
                      }}
                      style={{
                        padding: '10px 16px', cursor: 'pointer', fontSize: '14px',
                        color: '#0b5a8a', whiteSpace: 'nowrap', transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f2f4f5';
                        e.currentTarget.style.color = '#7b2cbf'; 
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#0b5a8a';
                      }}
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}