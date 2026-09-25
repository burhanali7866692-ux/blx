export const categoriesData: Record<string, string[]> = {
  'Food': ['Fast Food', 'Desi Food', 'Chinese & Continental', 'Beverages & Drinks', 'Desserts & Sweets', 'Home Cooked Food', 'Bakery Items'],
  'Mobiles': ['Mobile Phones', 'Accessories', 'Tablets', 'Smart Watches'],
  'Vehicles': ['Cars', 'Commercial Vehicles', 'Spare Parts'], 
  'Property': ['Houses', 'Apartments', 'Plots', 'Commercial'],
  'Bikes': ['Motorcycles', 'Bicycles', 'Electric Bikes', 'Spare Parts'], 
  'Electronics': ['Laptops', 'TVs', 'Home Appliances', 'Cameras', 'AC & Coolers'], 
  'Animals': ['Cats', 'Dogs', 'Birds', 'Livestock', 'Pet Food'], 
  
  // 🚨 Shuru ki 4 categories (Online, Marketing, Customer Service, Sales) remove kar di gayi hain
  'Jobs': [
    'IT & Networking', 
    'Freelance', 
    'Books Typing', 
    'Translations', 
    'Web Designing', 
    'UI/UX Designing', 
    'Legal Documentation', 
    'Video Making'
  ], 
  
  'Fashion': ['Men', 'Women', 'Kids', 'Watches & Jewelry'],
  'Furniture': ['Sofa & Chairs', 'Beds & Wardrobes', 'Home Decoration', 'Tables & Dining'],
  'Services': ['Web Development', 'Content Writing', 'Plumbing', 'Event Planners', 'Graphic Design'],
  'Kids & Toys': ['Toys', 'Baby Vehicles', 'Kids Clothing', 'Accessories'],
  'Business & Industrial': ['Machinery', 'Construction', 'Medical & Pharma', 'Office Equipment'],
  'Agriculture': ['Tractors', 'Seeds & Plants', 'Fertilizers', 'Farming Tools'],
  'Books & Sports': ['Books & Magazines', 'Musical Instruments', 'Sports Equipment']
};

export const mainCategories = Object.keys(categoriesData);
export const categoriesList = ['ALL CATEGORIES', ...mainCategories];
export const locationsList = ['All Pakistan', 'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];