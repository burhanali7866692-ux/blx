export interface Ad {
  id: number;
  title: string;
  price: string;
  priceNum: number;
  location: string;
  category: string;
  subCategory: string;
  image: string;
  allImages: string[];
  description: string;
  sellerName: string;
  mobileNumber: string;
  isMyAd: boolean;
  isHidden: boolean;
  isSold?: boolean;          // 🚨 Yahan question mark (?) add kiya hai
  isApprovedByAdmin?: boolean; 
  adminContactOnly?: boolean;  
  showMobileNumber?: boolean; 
}

export interface NewAd {
  title: string;
  price: string;
  location: string;
  category: string;
  subCategory: string;
  images: string[];
  mobileNumber: string;
  description: string;
  showMobileNumber: boolean;
  sellerName: string;
}