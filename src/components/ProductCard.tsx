import React from 'react';
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  MapPin, 
  Star, 
  ListPlus, 
  Check, 
  Sparkles, 
  Flame, 
  Info 
} from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (product: Product) => void;
  onUpdateCartQuantity: (productId: string, delta: number) => void;
  onOpenDetail: (product: Product) => void;
  onOpenAisleMap: (aisleNum: number) => void;
  onToggleShoppingList: (product: Product) => void;
  isInShoppingList: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenDetail,
  onOpenAisleMap,
  onToggleShoppingList,
  isInShoppingList
}) => {
  const savingsPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative"
    >
      {/* Top badges & Quick actions */}
      <div className="relative">
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
          {product.isOnSale && (
            <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <Flame className="w-3 h-3" />
              SAVE {savingsPercent}%
            </span>
          )}
          {product.isOrganic && (
            <span className="bg-green-50 text-green-800 border border-green-200 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-green-600" />
              ORGANIC
            </span>
          )}
          {product.dietaryTags.includes('BOGO Deal') && (
            <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
              BOGO
            </span>
          )}
        </div>

        {/* Quick Add to in-store list button */}
        <button
          id={`btn-toggle-list-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleShoppingList(product);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-xl transition-all shadow-xs cursor-pointer ${
            isInShoppingList
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-white/90 text-slate-600 hover:text-green-700 hover:bg-white'
          }`}
          title={isInShoppingList ? 'In your shopping list' : 'Add to in-store shopping list'}
        >
          {isInShoppingList ? <Check className="w-4 h-4 stroke-[3]" /> : <ListPlus className="w-4 h-4" />}
        </button>

        {/* Product Image */}
        <div 
          onClick={() => onOpenDetail(product)}
          className="w-full h-44 sm:h-48 overflow-hidden bg-slate-100 relative cursor-pointer"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Aisle Locator Link */}
          <div className="flex items-center justify-between gap-1 text-xs text-slate-500 mb-1">
            <span className="truncate font-medium">{product.brand}</span>
            <button
              id={`btn-aisle-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenAisleMap(product.aisleNumber);
              }}
              className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-2 py-0.5 rounded-lg font-medium shrink-0 transition-colors cursor-pointer"
              title="Locate item on store floor plan"
            >
              <MapPin className="w-3 h-3 text-green-600" />
              <span>Aisle {product.aisleNumber}</span>
            </button>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onOpenDetail(product)}
            className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 hover:text-green-700 transition-colors cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Unit & Ratings */}
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span>{product.unit}</span>
            <span>•</span>
            <div className="flex items-center gap-1 text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-800">{product.rating}</span>
              <span className="text-slate-400 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 block">In Stock: {product.stockCount} left</span>
          </div>

          {/* Add / Stepper Controls */}
          <div>
            {cartQuantity === 0 ? (
              <button
                id={`add-to-cart-${product.id}`}
                onClick={() => onAddToCart(product)}
                className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </button>
            ) : (
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-xs">
                <button
                  id={`cart-decrease-${product.id}`}
                  onClick={() => onUpdateCartQuantity(product.id, -1)}
                  className="w-7 h-7 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  title="Decrease"
                >
                  <Minus className="w-3 h-3 stroke-[2.5]" />
                </button>
                <span className="w-7 text-center text-xs font-bold text-slate-900">{cartQuantity}</span>
                <button
                  id={`cart-increase-${product.id}`}
                  onClick={() => onUpdateCartQuantity(product.id, 1)}
                  className="w-7 h-7 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  title="Increase"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
