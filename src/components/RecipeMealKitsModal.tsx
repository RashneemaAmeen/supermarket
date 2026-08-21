import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChefHat, 
  Clock, 
  Flame, 
  Users, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { RecipeBundle, Product } from '../types';
import { RECIPE_BUNDLES, PRODUCTS_DATA } from '../data/supermarketData';

interface RecipeMealKitsModalProps {
  onClose: () => void;
  onAddBundleToCart: (bundle: RecipeBundle, servingsMultiplier: number) => void;
  onOpenProductDetail: (product: Product) => void;
}

export const RecipeMealKitsModal: React.FC<RecipeMealKitsModalProps> = ({
  onClose,
  onAddBundleToCart,
  onOpenProductDetail
}) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(RECIPE_BUNDLES[0].id);
  const [servingsMultiplier, setServingsMultiplier] = useState<number>(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const activeRecipe = RECIPE_BUNDLES.find(r => r.id === selectedRecipeId) || RECIPE_BUNDLES[0];

  // Resolve ingredients to products
  const ingredientProducts = activeRecipe.productIds.map(item => {
    const prod = PRODUCTS_DATA.find(p => p.id === item.productId);
    return {
      ...item,
      product: prod,
      totalQty: item.defaultQty * servingsMultiplier
    };
  });

  const bundleSubtotal = ingredientProducts.reduce((sum, item) => {
    return sum + (item.product ? item.product.price * item.totalQty : 0);
  }, 0);

  const handleAddToCart = () => {
    onAddBundleToCart(activeRecipe, servingsMultiplier);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="recipe-meal-kits-modal"
        className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-600 text-white rounded-xl">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Chef-Curated Supermarket Meal Bundles</h2>
              <p className="text-xs text-slate-300">Fresh farm ingredients paired with step-by-step recipes • 1-Click to Cart</p>
            </div>
          </div>

          <button
            id="close-recipe-modal-btn"
            type="button"
            aria-label="Close recipe kits"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Recipe Switcher Sidebar (4 cols) */}
          <div className="lg:col-span-4 p-5 bg-slate-50 border-r border-slate-200 overflow-y-auto space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Featured Weekly Kits</div>
            {RECIPE_BUNDLES.map((rec) => {
              const isSelected = rec.id === selectedRecipeId;
              return (
                <button
                  key={rec.id}
                  id={`recipe-tab-${rec.id}`}
                  onClick={() => {
                    setSelectedRecipeId(rec.id);
                    setServingsMultiplier(1);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-green-600 shadow-xs ring-1 ring-green-600/20'
                      : 'bg-white border-slate-200 hover:bg-slate-100/50 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={rec.image}
                    alt={rec.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      {rec.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-1">{rec.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>⏱️ {rec.prepTime}</span>
                      <span>•</span>
                      <span>🔥 {rec.caloriesPerServing} kcal</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Recipe Detail, Scaler, Ingredients & Add to Cart (8 cols) */}
          <div className="lg:col-span-8 p-6 bg-white overflow-y-auto flex flex-col justify-between space-y-6">
            <div>
              {/* Recipe Hero Banner */}
              <div className="relative rounded-xl overflow-hidden h-52 border border-slate-200 shadow-xs mb-4">
                <img
                  src={activeRecipe.image}
                  alt={activeRecipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex flex-wrap gap-2 mb-1.5">
                    {activeRecipe.tags.map(t => (
                      <span key={t} className="text-[10px] font-semibold uppercase bg-green-600/90 backdrop-blur-xs px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold">{activeRecipe.title}</h3>
                </div>
              </div>

              {/* Cooking Stats & Servings Scaler */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>Prep: {activeRecipe.prepTime} | Cook: {activeRecipe.cookTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span>{activeRecipe.caloriesPerServing} Cal/serving</span>
                  </div>
                </div>

                {/* Servings Multiplier */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Servings:</span>
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                    {[1, 2, 3].map((mul) => (
                      <button
                        key={mul}
                        id={`servings-btn-${mul}`}
                        onClick={() => setServingsMultiplier(mul)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                          servingsMultiplier === mul
                            ? 'bg-green-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {activeRecipe.servings * mul} People
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">{activeRecipe.description}</p>

              {/* Ingredients Checklist with direct product links */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-green-600" />
                    <span>Included Supermarket Groceries ({ingredientProducts.length} items)</span>
                  </h4>
                  <span className="text-xs font-medium text-slate-500">
                    Bundle Total: <strong className="text-slate-900 text-sm font-bold">${bundleSubtotal.toFixed(2)}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ingredientProducts.map((item, idx) => {
                    if (!item.product) return null;
                    return (
                      <div
                        key={idx}
                        id={`bundle-item-${item.product.id}`}
                        onClick={() => item.product && onOpenProductDetail(item.product)}
                        className="p-2.5 bg-slate-50 hover:bg-green-50/50 rounded-xl border border-slate-200 flex items-center justify-between gap-2.5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-semibold text-slate-900 truncate">{item.product.name}</h5>
                            <span className="text-[11px] text-slate-500 block">
                              Need: {item.amount} ({item.totalQty} in basket)
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-900 shrink-0">
                          ${(item.product.price * item.totalQty).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="mt-6 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Chef Cooking Steps</span>
                </h4>
                <div className="space-y-2">
                  {activeRecipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-green-700 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-500 block">All {ingredientProducts.length} Fresh Ingredients Total</span>
                <span className="text-xl font-bold text-slate-900">${bundleSubtotal.toFixed(2)}</span>
              </div>

              <button
                id="add-recipe-bundle-btn"
                onClick={handleAddToCart}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                {addedToast ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added {ingredientProducts.length} Items to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add All Ingredients to Basket • ${bundleSubtotal.toFixed(2)}</span>
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
