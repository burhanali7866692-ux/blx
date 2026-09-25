"use client";

import React, { useState, useEffect } from 'react';
import { Ad, NewAd } from '../types';
import { categoriesData, mainCategories } from '../constants/data';
import { resizeImageFile } from '../utils/imageHelpers';
import { supabase } from '../lib/supabase'; 

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (ad: Ad) => void;
  editAd?: Ad | null; 
  onEdit?: (ad: Ad) => void; 
}

export default function PostAdModal({ isOpen, onClose, onPost, editAd, onEdit }: PostAdModalProps) {
  const [newAd, setNewAd] = useState<NewAd>({ 
    title: '', price: '', location: '', 
    category: '', subCategory: '', 
    images: [], mobileNumber: '', description: '', showMobileNumber: true, sellerName: '' 
  });
  const [isCheckboxHovered, setIsCheckboxHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const themeColor = '#0b5a8a';

  // Alphabetically sorted cities list
  const pakistanCities = [
    "Abbottabad", "Attock", "Badin", "Bahawalpur", "Bannu", "Bhalwal", "Bhakkar", "Burewala", "Chakwal", 
    "Charsadda", "Chiniot", "Dadu", "Dera Ghazi Khan", "Dera Ismail Khan", "Faisalabad", "Ghotki", "Gilgit", 
    "Gojra", "Gujranwala", "Gujrat", "Gwadar", "Hafizabad", "Haripur", "Hub", "Hyderabad", "Islamabad", 
    "Jacobabad", "Jhang", "Jhelum", "Kamalia", "Kamoke", "Karachi", "Kasur", "Khairpur", "Khanewal", 
    "Kharan", "Khushab", "Kohat", "Lahore", "Larkana", "Layyah", "Lodhran", "Loralai", "Mandi Bahauddin", 
    "Mansehra", "Mardan", "Mianwali", "Mingora", "Mirpur", "Mirpur Khas", "Multan", "Muzaffarabad", 
    "Muzaffargarh", "Nawabshah", "Nowshera", "Okara", "Peshawar", "Quetta", "Rahim Yar Khan", "Rawalpindi", 
    "Sadiqabad", "Sahiwal", "Sargodha", "Sialkot", "Shikarpur", "Sibi", "Skardu", "Sukkur", "Swat", 
    "Tando Adam", "Tando Allahyar", "Toba Tek Singh", "Turbat", "Umerkot", "Vehari", "Zhob"
  ];

  // Alphabetically sorted main categories list
  const sortedMainCategories = [...mainCategories].sort((a, b) => a.localeCompare(b));

  // Alphabetically sorted sub-categories list based on selected category
  const sortedSubCategories = categoriesData[newAd.category] 
    ? [...categoriesData[newAd.category]].sort((a, b) => a.localeCompare(b)) 
    : [];

  useEffect(() => {
    if (isOpen) {
      if (editAd) {
        setNewAd({
          title: editAd.title || '',
          price: editAd.priceNum?.toString() || editAd.price.replace(/[^0-9]/g, ''),
          location: editAd.location || '',
          category: editAd.category || '',
          subCategory: editAd.subCategory || '',
          images: editAd.allImages || [], 
          mobileNumber: editAd.mobileNumber || '',
          description: editAd.description || '',
          showMobileNumber: true,
          sellerName: editAd.sellerName || ''
        });
      } else {
        setNewAd({ title: '', price: '', location: '', category: '', subCategory: '', images: [], mobileNumber: '', description: '', showMobileNumber: true, sellerName: '' });
      }
    }
  }, [isOpen, editAd]);

  if (!isOpen) return null;

  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      try {
        let compressedImages: string[] = [];
        for (let file of files) {
          const compressed = await resizeImageFile(file); 
          compressedImages.push(compressed);
        }
        setNewAd(prev => ({ ...prev, images: [...prev.images, ...compressedImages] })); 
      } catch (err) {
        alert("Images load karne mein masla aya hai, baraye meharbani choti images select karein.");
      }
    }
  };

  const handlePostAd = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!newAd.images || newAd.images.length === 0) {
      alert('Kam az kam 1 image lazmi upload karein!');
      return;
    }

    if (!newAd.category.trim()) {
      alert('Baraye meharbani category select ya type karein!');
      return;
    }

    setIsSubmitting(true); 

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        alert("Ad lagane/edit karne ke liye pehle Login karna zaroori hai!");
        setIsSubmitting(false);
        return;
      }

      let finalImageUrls: string[] = [];
      
      for (let i = 0; i < newAd.images.length; i++) {
        const imgStr = newAd.images[i];
        
        if (imgStr.startsWith('http')) {
          finalImageUrls.push(imgStr);
        } else {
          try {
            const res = await fetch(imgStr);
            const blob = await res.blob();
            const fileName = `ad_${userData.user.id}_${Date.now()}_${i}.jpg`;

            const { error: uploadError } = await supabase.storage
              .from('ad-images') 
              .upload(fileName, blob, { contentType: 'image/jpeg' });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
              .from('ad-images')
              .getPublicUrl(fileName);

            finalImageUrls.push(publicUrlData.publicUrl);
          } catch (err) {
            alert(`Tasweer ${i + 1} upload karne mein masla aya.`);
            setIsSubmitting(false);
            return;
          }
        }
      }

      const cleanPriceNum = parseInt(newAd.price.replace(/[^0-9]/g, '')) || 0;
      let formattedPrice = newAd.price.trim();
      if (!formattedPrice.toLowerCase().startsWith('rs')) {
        formattedPrice = `Rs ${formattedPrice}`;
      }
      
      const isApprovedStatus = newAd.category.toLowerCase() === 'jobs' ? false : true;

      if (editAd) {
        const updatePayload = {
          title: newAd.title,
          description: newAd.description,
          price: formattedPrice,
          category: newAd.category,
          location: newAd.location,
          image_url: finalImageUrls[0] || '', 
          all_images: finalImageUrls, 
          seller_name: newAd.sellerName,
          sub_category: newAd.subCategory,
          mobile_number: newAd.mobileNumber,
          is_approved_by_admin: isApprovedStatus 
        };

        const { data: checkData, error: dbError } = await supabase
          .from('ads')
          .update(updatePayload)
          .eq('id', editAd.id)
          .select();

        if (dbError) {
          alert("Error: Ad update nahi ho saka. " + dbError.message);
          setIsSubmitting(false);
          return;
        }

        if (!checkData || checkData.length === 0) {
          alert("Ghalti! Database mein yeh ad nahi mila. F5 daba kar page refresh karein.");
          setIsSubmitting(false);
          return;
        }

        if (onEdit) {
          onEdit({
            ...editAd,
            title: newAd.title,
            description: newAd.description,
            price: formattedPrice,
            priceNum: cleanPriceNum,
            location: newAd.location,
            category: newAd.category,
            subCategory: newAd.subCategory || '',
            image: finalImageUrls[0] || '',
            allImages: finalImageUrls,
            sellerName: newAd.sellerName,
            mobileNumber: newAd.mobileNumber,
            isApprovedByAdmin: isApprovedStatus
          });
        }
        alert(isApprovedStatus ? "Mubarak ho! Aapka ad update aur Live ho gaya hai." : "Aapka Job Ad update ho kar 'Pending Approval' mein chala gaya hai.");

      } else {
        const { data: insertedData, error: dbError } = await supabase
          .from('ads')
          .insert([
            {
              title: newAd.title,
              description: newAd.description,
              price: formattedPrice,
              category: newAd.category,
              location: newAd.location,
              image_url: finalImageUrls[0] || '', 
              all_images: finalImageUrls, 
              user_id: userData.user.id,
              seller_name: newAd.sellerName,
              sub_category: newAd.subCategory,
              mobile_number: newAd.mobileNumber,
              is_sold: false,
              is_approved_by_admin: isApprovedStatus 
            }
          ])
          .select();

        if (dbError) {
          alert("Error: Ad save nahi ho saka. " + dbError.message);
          setIsSubmitting(false);
          return;
        }

        const adToAdd: Ad = {
          ...newAd,
          id: insertedData[0]?.id || Date.now(), 
          priceNum: cleanPriceNum,
          price: formattedPrice,
          image: finalImageUrls[0], 
          allImages: finalImageUrls, 
          isMyAd: true,
          isHidden: false,
          isApprovedByAdmin: isApprovedStatus,
          adminContactOnly: !isApprovedStatus 
        };
        
        onPost(adToAdd);
        alert(isApprovedStatus ? "Mubarak ho! Aapka ad live ho gaya hai." : "Aapka Job Ad receive ho gaya hai. Admin ki approval ke baad yeh Live ho jayega.");
      }
      
      setIsSubmitting(false);
      onClose(); 
      
    } catch (error) {
      alert("Ad process karte waqt unexpected error aya hai.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff', width: '100%', maxWidth: '620px', maxHeight: '90vh', 
        borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        
        {/* Modal Header */}
        <div style={{padding: '20px 25px', borderBottom: '1px solid #ebeeef', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 style={{margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold'}}>
            {editAd ? 'Edit Your Ad' : 'Post Your Ad'} 
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            style={{background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748b'}}
          >
            &times;
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handlePostAd} style={{padding: '25px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px'}}>
          
          <style>{`
            .modal-input-field:focus {
              border-color: ${themeColor} !important;
              box-shadow: 0 0 0 3px rgba(11, 90, 138, 0.15) !important;
              outline: none;
            }
          `}</style>

          <div>
            <label style={{display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '6px'}}>Your Name</label>
            <input type="text" placeholder="Enter your full name" required value={newAd.sellerName} onChange={(e) => setNewAd({...newAd, sellerName: e.target.value})} className="modal-input-field" style={{width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', transition: 'all 0.2s'}} />
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '6px'}}>Ad Title</label>
            <input type="text" placeholder="What are you selling?" required value={newAd.title} onChange={(e) => setNewAd({...newAd, title: e.target.value})} className="modal-input-field" style={{width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', transition: 'all 0.2s'}} />
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '6px'}}>Price (PKR)</label>
            <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
              <span style={{ position: 'absolute', left: '12px', color: '#64748b', fontWeight: 'bold', fontSize: '15px', pointerEvents: 'none' }}>Rs.</span>
              <input type="text" placeholder="e.g. 5000" required value={newAd.price} onChange={(e) => setNewAd({...newAd, price: e.target.value})} className="modal-input-field" style={{width: '100%', padding: '12px 12px 12px 42px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', transition: 'all 0.2s'}} />
            </div>
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '6px'}}>Description</label>
            <textarea placeholder="Describe your item in detail (Condition, Features, etc.)" required value={newAd.description} onChange={(e) => setNewAd({...newAd, description: e.target.value})} className="modal-input-field" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', fontFamily: 'inherit', resize: 'vertical', minHeight: '90px', boxSizing: 'border-box', transition: 'all 0.2s' }} />
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '6px'}}>Location / City</label>
            <input 
              type="text" 
              list="pakistan-cities" 
              placeholder="Select or Type City (e.g. Lahore, Karachi)" 
              required 
              value={newAd.location} 
              onChange={(e) => setNewAd({...newAd, location: e.target.value})} 
              className="modal-input-field"
              style={{width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', transition: 'all 0.2s'}} 
            />
            <datalist id="pakistan-cities">
              {pakistanCities.map((cityName, index) => (
                <option key={`${cityName}-${index}`} value={cityName} />
              ))}
            </datalist>
          </div>

          <div>
            <label style={{display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '6px'}}>Mobile Number</label>
            <input type="tel" placeholder="03001234567" required value={newAd.mobileNumber} onChange={(e) => setNewAd({...newAd, mobileNumber: e.target.value})} className="modal-input-field" style={{width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', transition: 'all 0.2s'}} />
          </div>
          
          <div>
            <label 
              onMouseEnter={() => setIsCheckboxHovered(true)}
              onMouseLeave={() => setIsCheckboxHovered(false)}
              style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px 0', width: 'fit-content'}}
            >
              <div style={{position: 'relative', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <input 
                  type="checkbox" 
                  checked={newAd.showMobileNumber} 
                  onChange={(e) => setNewAd({...newAd, showMobileNumber: e.target.checked})} 
                  style={{position: 'absolute', opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 5, outline: 'none'}} 
                />
                <div style={{
                  width: '100%', height: '100%', borderRadius: '6px',
                  border: newAd.showMobileNumber ? 'none' : '2px solid #cbd5e1',
                  backgroundColor: newAd.showMobileNumber ? (isCheckboxHovered ? '#094c73' : themeColor) : '#fff',
                  transition: 'all 0.2s ease', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                  {newAd.showMobileNumber && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
              <span style={{fontSize: '14px', color: '#334155', fontWeight: '600', userSelect: 'none'}}>Show my number to public</span>
            </label>
          </div>
          
          {/* Category & Sub-Category Searchable Row (Alphabetically Sorted) */}
          <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
            <div style={{flex: 1, minWidth: '220px'}}>
              <label style={{display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '6px'}}>Category</label>
              <input 
                type="text" 
                list="category-suggestions" 
                placeholder="Type or select category..." 
                required 
                value={newAd.category} 
                onChange={(e) => {
                  const val = e.target.value;
                  setNewAd(prev => ({
                    ...prev, 
                    category: val,
                    subCategory: categoriesData[val] ? [...categoriesData[val]].sort()[0] || '' : prev.subCategory 
                  }));
                }} 
                className="modal-input-field"
                style={{width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', transition: 'all 0.2s'}} 
              />
              <datalist id="category-suggestions">
                {sortedMainCategories.map((cat, idx) => (
                  <option key={`cat-${cat}-${idx}`} value={cat} />
                ))}
              </datalist>
            </div>

            <div style={{flex: 1, minWidth: '220px'}}>
              <label style={{display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '6px'}}>Sub-Category</label>
              <input 
                type="text" 
                list="subcategory-suggestions" 
                placeholder="Type or select sub-category..." 
                value={newAd.subCategory} 
                onChange={(e) => setNewAd(prev => ({...prev, subCategory: e.target.value}))} 
                className="modal-input-field"
                style={{width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', transition: 'all 0.2s'}} 
              />
              <datalist id="subcategory-suggestions">
                {sortedSubCategories.map((subCat, idx) => (
                  <option key={`subcat-${subCat}-${idx}`} value={subCat} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Professional Image Upload Box */}
          <div>
            <label style={{display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155', marginBottom: '6px'}}>Upload Images</label>
            <div style={{
              position: 'relative', border: `2px dashed ${themeColor}`, borderRadius: '10px', 
              padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer', transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            >
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                required={newAd.images.length === 0} 
                onChange={handleMultipleImagesUpload} 
                style={{
                  position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 10
                }} 
              />
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'}}>
                <span style={{fontSize: '28px'}}>📷</span>
                <span style={{fontSize: '14px', fontWeight: 'bold', color: '#0f172a'}}>Click here to upload photos</span>
                <span style={{fontSize: '12px', color: '#64748b'}}>You can select multiple images</span>
              </div>
            </div>

            {/* Image Preview Grid */}
            {newAd.images && newAd.images.length > 0 && (
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px'}}>
                {newAd.images.map((imgUrl, index) => (
                  <div key={index} style={{position: 'relative', width: '75px', height: '75px'}}>
                    <img src={imgUrl} alt={`Preview ${index}`} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1'}} />
                    <button type="button" onClick={() => setNewAd(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}))} style={{position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 12}}>&times;</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div style={{display: 'flex', gap: '12px', marginTop: '15px', borderTop: '1px solid #ebeeef', paddingTop: '20px'}}>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              style={{
                flex: 1, backgroundColor: isSubmitting ? '#cbd5e1' : themeColor, color: '#fff', 
                border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', 
                cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '15px', boxShadow: '0 4px 10px rgba(11,90,138,0.2)', transition: 'all 0.2s'
              }} 
            >
              {isSubmitting ? 'Processing...' : (editAd ? 'Update Ad' : 'Post Now')}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isSubmitting} 
              style={{
                flex: 1, backgroundColor: '#fff', color: '#0f172a', border: '1px solid #cbd5e1', 
                padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '15px', transition: 'all 0.2s'
              }}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}