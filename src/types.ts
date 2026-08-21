export interface NutritionFacts {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber?: string;
  sugar?: string;
  sodium?: string;
  servingSize: string;
  allergens: string[];
}

export type DietaryTag = 
  | 'Organic' 
  | 'Gluten-Free' 
  | 'Vegan' 
  | 'Vegetarian' 
  | 'Keto-Friendly' 
  | 'Non-GMO' 
  | 'Local Farm' 
  | 'BOGO Deal' 
  | 'Chef Pick'
  | 'Low Sodium';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  image: string;
  aisle: string;
  aisleNumber: number;
  inStock: boolean;
  stockCount: number;
  isOrganic?: boolean;
  isOnSale?: boolean;
  dietaryTags: DietaryTag[];
  nutrition: NutritionFacts;
  origin: string;
  barcode: string;
  description: string;
  storageTip?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  id: string;
  title: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'bogo';
  discountValue: number; // e.g. 20 for 20% or 5 for $5 off
  minSpend: number;
  categoryLimit?: string;
  expires: string;
  description: string;
  isClipped: boolean;
  badge: string;
  image: string;
}

export interface ShoppingListItem {
  id: string;
  productId?: string;
  name: string;
  aisle: string;
  aisleNumber: number;
  category: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  checked: boolean;
  isCustom?: boolean;
}

export interface RecipeBundle {
  id: string;
  title: string;
  category: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Chef Level';
  caloriesPerServing: number;
  image: string;
  description: string;
  tags: string[];
  productIds: { productId: string; amount: string; defaultQty: number }[];
  instructions: string[];
}

export interface SupermarketAisle {
  number: number;
  name: string;
  category: string;
  icon: string;
  color: string;
  featuredItems: string[];
  description: string;
  side: 'North' | 'South' | 'Perimeter' | 'Central';
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  distance: string;
  status: 'Open Now' | 'Closing Soon';
  amenities: string[];
}

export interface Order {
  id: string;
  date: string;
  fulfillmentType: 'delivery' | 'pickup';
  timeSlot: string;
  storeLocation: string;
  address?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  savings: number;
  status: 'Received' | 'Picking in Aisles' | 'Packed' | 'Ready for Pickup' | 'Out for Delivery' | 'Completed';
  pickupCode: string;
  paymentMethod: string;
  loyaltyPointsEarned: number;
}
