import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ListPlus, 
  Check, 
  Layers, 
  Share2, 
  Info, 
  ScanLine 
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  cartQuantity: number;
  onAddToCart: (product: Product, quantity?: number) => void;
  onUpdateCartQuantity: (productId: string, delta: number) => void;
  onOpenAisleMap: (aisleNum: number) => void;
  onToggleShoppingList: (product: Product) => void;
  isInShoppingList: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  cartQuantity,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenAisleMap,
  onToggleShoppingList,
  isInShoppingList
}) => {
  const [selectedQty, setSelectedQty] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="product-detail-modal"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden my-8 border border-slate-200 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-detail-btn"
          type="button"
          aria-label="Close product details"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 hover:bg-slate-100 text-slate-600 rounded-full shadow-xs border border-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Badges */}
          <div className="p-6 bg-slate-50/70 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-200 bg-white relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isOnSale && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                    SALE SPECIAL
                  </span>
                )}
              </div>

              {/* Dietary Tags Pill Box */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Dietary & Quality Standards</div>
                <div className="flex flex-wrap gap-1.5">
                  {product.dietaryTags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 rounded-md bg-green-50 text-green-800 border border-green-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Origin & Sourcing */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Sourcing Origin</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{product.origin}</p>
                {product.storageTip && (
                  <div className="mt-2 pt-2 border-t border-slate-100 text-slate-500 italic">
                    💡 <strong>Storage Tip:</strong> {product.storageTip}
                  </div>
                )}
              </div>
            </div>

            {/* Barcode & SKU display */}
            <div className="pt-4 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ScanLine className="w-3.5 h-3.5 text-slate-400" /> SKU: {product.barcode}
              </span>
              <span>Stock: {product.stockCount} available</span>
            </div>
          </div>

          {/* Right Column: Details, Nutrition, Aisle & Add */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Department & Aisle Locator link */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-green-700 uppercase tracking-wider">{product.brand}</span>
                <button
                  id="detail-aisle-map-btn"
                  onClick={() => {
                    onClose();
                    onOpenAisleMap(product.aisleNumber);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-green-800 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-green-600" />
                  <span>Locate in {product.aisle}</span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{product.name}</h2>
              <p className="text-xs text-slate-500 mt-1">{product.unit}</p>

              {/* Price & Rating Row */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-base text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                  <span className="text-xs font-medium text-slate-500">/ {product.unit.split(' ')[0]}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-amber-950">{product.rating}</span>
                  <span className="text-xs text-amber-800">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">{product.description}</p>

              {/* Nutrition Facts Label */}
              <div className="mt-5 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">Nutrition Overview</span>
                  <span className="text-xs text-slate-500 font-medium">{product.nutrition.servingSize}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Calories</span>
                    <span className="text-base font-bold text-slate-900">{product.nutrition.calories}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Protein</span>
                    <span className="text-sm font-bold text-green-700">{product.nutrition.protein}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Carbs</span>
                    <span className="text-sm font-bold text-amber-700">{product.nutrition.carbs}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Fat</span>
                    <span className="text-sm font-bold text-rose-700">{product.nutrition.fat}</span>
                  </div>
                </div>

                {product.nutrition.allergens.length > 0 ? (
                  <div className="mt-2.5 text-[11px] text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                    ⚠️ <strong>Allergens:</strong> {product.nutrition.allergens.join(', ')}
                  </div>
                ) : (
                  <div className="mt-2.5 text-[11px] text-green-800 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                    ✅ No major food allergens declared
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper for adding */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-100 p-0.5">
                  <button
                    id="detail-qty-decrease"
                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-900">{selectedQty}</span>
                  <button
                    id="detail-qty-increase"
                    onClick={() => setSelectedQty(selectedQty + 1)}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  id="detail-add-to-cart-btn"
                  onClick={() => {
                    onAddToCart(product, selectedQty);
                    onClose();
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add {selectedQty} to Basket • ${(product.price * selectedQty).toFixed(2)}</span>
                </button>
              </div>

              {/* In-Store shopping list toggle */}
              <button
                id="detail-toggle-shopping-list-btn"
                onClick={() => onToggleShoppingList(product)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                  isInShoppingList
                    ? 'bg-green-50 text-green-800 border-green-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isInShoppingList ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span>In In-Store Shopping List (Checklist ready)</span>
                  </>
                ) : (
                  <>
                    <ListPlus className="w-4 h-4 text-slate-500" />
                    <span>Save to In-Store Shopping List</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
