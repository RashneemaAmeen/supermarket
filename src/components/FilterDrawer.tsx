import React, { useEffect } from 'react';
import { 
  X, 
  RotateCcw, 
  SlidersHorizontal, 
  Sparkles, 
  Tag, 
  Check 
} from 'lucide-react';
import { DietaryTag } from '../types';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: DietaryTag[];
  onToggleTag: (tag: DietaryTag) => void;
  onlyOnSale: boolean;
  setOnlyOnSale: (v: boolean) => void;
  onlyOrganic: boolean;
  setOnlyOrganic: (v: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedTags,
  onToggleTag,
  onlyOnSale,
  setOnlyOnSale,
  onlyOrganic,
  setOnlyOrganic,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  onResetFilters,
  activeFilterCount
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allTags: DietaryTag[] = [
    'Organic',
    'Gluten-Free',
    'Vegan',
    'Vegetarian',
    'Keto-Friendly',
    'Non-GMO',
    'Local Farm',
    'BOGO Deal',
    'Chef Pick',
    'Low Sodium'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="filter-drawer-panel"
          className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slideLeft"
        >
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="w-5 h-5 text-green-400" />
              <h2 className="text-base font-bold">Filter & Sort Groceries</h2>
            </div>

            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  id="reset-filters-btn"
                  onClick={onResetFilters}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
              <button
                id="close-filter-drawer-btn"
                onClick={onClose}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Sort Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Sort By</label>
              <select
                id="filter-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-green-600"
              >
                <option value="featured">Featured & Best Matches</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Quick Deals & Organic Toggles */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Special Collections</label>
              
              <button
                id="toggle-only-sale-btn"
                onClick={() => setOnlyOnSale(!onlyOnSale)}
                className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  onlyOnSale
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-rose-600" />
                  <span>On-Sale Items Only</span>
                </span>
                {onlyOnSale && <Check className="w-4 h-4 text-rose-600" />}
              </button>

              <button
                id="toggle-only-organic-btn"
                onClick={() => setOnlyOrganic(!onlyOrganic)}
                className={`w-full p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  onlyOrganic
                    ? 'bg-green-50 border-green-300 text-green-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span>100% Certified Organic Only</span>
                </span>
                {onlyOrganic && <Check className="w-4 h-4 text-green-600" />}
              </button>
            </div>

            {/* Dietary Tags */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Dietary & Lifestyle</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      id={`tag-btn-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => onToggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-green-600 text-white border-green-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Max Slider */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <span>Max Price</span>
                <span className="text-slate-900">${priceRange[1].toFixed(2)}</span>
              </div>
              <input
                id="price-range-slider"
                type="range"
                min={2}
                max={25}
                step={1}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-green-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>$2.00</span>
                <span>$25.00+</span>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-5 bg-slate-50 border-t border-slate-200">
            <button
              id="apply-filters-btn"
              onClick={onClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-xs shadow-xs transition-all cursor-pointer"
            >
              Apply Filters ({activeFilterCount} Active)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
