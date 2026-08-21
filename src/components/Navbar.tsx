import React, { useState } from 'react';
import { 
  Store, 
  ShoppingBag, 
  Search, 
  MapPin, 
  Clock, 
  Tag, 
  ChefHat, 
  ScanLine, 
  ListChecks, 
  X, 
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  History
} from 'lucide-react';
import { Product, StoreLocation } from '../types';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenShoppingList: () => void;
  shoppingListCount: number;
  onOpenAisleMap: (aisleNum?: number) => void;
  onOpenRecipes: () => void;
  onOpenDeals: () => void;
  onOpenScanner: () => void;
  onOpenStoreSelector: () => void;
  onOpenOrders: () => void;
  ordersCount: number;
  fulfillmentType: 'pickup' | 'delivery';
  selectedStore: StoreLocation;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
  activeFilterCount: number;
  onToggleFilterDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenShoppingList,
  shoppingListCount,
  onOpenAisleMap,
  onOpenRecipes,
  onOpenDeals,
  onOpenScanner,
  onOpenStoreSelector,
  onOpenOrders,
  ordersCount,
  fulfillmentType,
  selectedStore,
  allProducts,
  onSelectProduct,
  activeFilterCount,
  onToggleFilterDrawer
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const searchResults = searchQuery.trim() === '' ? [] : allProducts
    .filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dietaryTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .slice(0, 5);

  const categories = [
    'All Departments',
    'Produce',
    'Bakery',
    'Deli',
    'Dairy & Eggs',
    'Meat & Seafood',
    'Pantry',
    'Beverages',
    'Frozen'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro bar for store pickup info & quick announcement */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button 
            id="nav-store-selector-top-btn"
            onClick={onOpenStoreSelector}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-green-400" />
            <span>
              {fulfillmentType === 'pickup' ? 'Curbside Pickup:' : 'Delivering to:'} <strong>{selectedStore.name.split(' ')[0]} - {selectedStore.distance}</strong>
            </span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>
          <span className="hidden md:inline text-slate-600">•</span>
          <div className="hidden md:flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-green-400" />
            <span>{fulfillmentType === 'pickup' ? 'Ready in 45 mins' : 'Delivery window: 1 Hour'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <span className="hidden sm:inline">🌱 100% Guaranteed Freshness or Instant Refund</span>
          <button
            id="nav-quick-orders-btn"
            onClick={onOpenOrders}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-green-400" />
            <span>Orders {ordersCount > 0 ? `(${ordersCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button 
            id="nav-brand-logo-btn"
            onClick={() => { setSelectedCategory('All Departments'); setSearchQuery(''); }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">FreshRoots</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-green-50 text-green-800 border border-green-200 px-1.5 py-0.5 rounded-full">Market</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Farm Fresh & Supermarket Aisles</p>
            </div>
          </button>
        </div>

        {/* Live Search Bar with Dropdown */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="main-grocery-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search Honeycrisp apples, wild salmon, sourdough, organic eggs..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/10 rounded-xl text-sm transition-all outline-none text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Predictive Search Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-2 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between bg-slate-50">
                <span>Matching Products</span>
                <span>Press Enter for all</span>
              </div>
              <div className="divide-y divide-slate-100">
                {searchResults.map((prod) => (
                  <button
                    key={prod.id}
                    id={`search-item-${prod.id}`}
                    onClick={() => {
                      onSelectProduct(prod);
                      setShowSearchDropdown(false);
                    }}
                    className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200" 
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-900 group-hover:text-green-700">{prod.name}</div>
                        <div className="text-xs text-slate-500">{prod.aisle} • {prod.unit}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">${prod.price.toFixed(2)}</div>
                      {prod.isOnSale && <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">SALE</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Shortcuts & Cart Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Barcode Scanner Shortcut */}
          <button
            id="nav-scanner-btn"
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-green-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Scan item barcode or lookup SKU"
          >
            <ScanLine className="w-4 h-4 text-green-600" />
            <span className="hidden lg:inline">Scan SKU</span>
          </button>

          {/* Interactive Aisle Map */}
          <button
            id="nav-aisle-map-btn"
            onClick={() => onOpenAisleMap()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-green-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="View Supermarket Floor Plan & Aisle Guide"
          >
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="hidden lg:inline">Aisle Map</span>
          </button>

          {/* Recipes & Meal Bundles */}
          <button
            id="nav-recipes-btn"
            onClick={onOpenRecipes}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-green-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Browse Recipe Kits with 1-Click Ingredients to Cart"
          >
            <ChefHat className="w-4 h-4 text-amber-600" />
            <span className="hidden lg:inline">Meal Kits</span>
          </button>

          {/* Weekly Deals / Coupons */}
          <button
            id="nav-deals-btn"
            onClick={onOpenDeals}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 rounded-xl border border-rose-200 transition-colors cursor-pointer"
            title="View Weekly Deals & Digital Coupons"
          >
            <Tag className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Deals & Coupons</span>
          </button>

          {/* Shopping List Button */}
          <button
            id="nav-shopping-list-btn"
            onClick={onOpenShoppingList}
            className="relative p-2.5 text-slate-700 hover:text-green-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="In-Store Shopping Checklist & Aisle Route"
          >
            <ListChecks className="w-5 h-5 text-slate-700" />
            {shoppingListCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-green-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {shoppingListCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            id="nav-cart-btn"
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3.5 py-2.5 rounded-xl font-semibold shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-sm font-bold">${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-2.5 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="mobile-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries & aisles..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm outline-none text-slate-900"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Department Horizontal Scroll Bar */}
      <div className="border-t border-slate-200 bg-slate-50/80 px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs">
        <button
          id="filter-drawer-toggle-btn"
          onClick={onToggleFilterDrawer}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeFilterCount > 0 
              ? 'bg-green-600 text-white border-green-600 shadow-xs' 
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`cat-tab-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-green-700 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </header>
  );
};
