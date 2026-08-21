import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Search, 
  ShoppingBag, 
  ListPlus, 
  Check, 
  Sparkles, 
  ArrowRight,
  Info,
  Layers,
  Store
} from 'lucide-react';
import { SUPERMARKET_AISLES, PRODUCTS_DATA } from '../data/supermarketData';
import { Product } from '../types';

interface AisleMapModalProps {
  initialAisle?: number;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleShoppingList: (product: Product) => void;
  shoppingListProductIds: Set<string>;
  onOpenProductDetail: (product: Product) => void;
}

export const AisleMapModal: React.FC<AisleMapModalProps> = ({
  initialAisle = 1,
  onClose,
  onAddToCart,
  onToggleShoppingList,
  shoppingListProductIds,
  onOpenProductDetail
}) => {
  const [selectedAisleNum, setSelectedAisleNum] = useState<number>(initialAisle);
  const [mapSearch, setMapSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentAisle = SUPERMARKET_AISLES.find(a => a.number === selectedAisleNum) || SUPERMARKET_AISLES[0];
  const aisleProducts = PRODUCTS_DATA.filter(p => p.aisleNumber === selectedAisleNum);

  // Filtered by search if typed
  const displayedProducts = mapSearch.trim() === '' 
    ? aisleProducts 
    : PRODUCTS_DATA.filter(p => 
        p.name.toLowerCase().includes(mapSearch.toLowerCase()) || 
        p.category.toLowerCase().includes(mapSearch.toLowerCase())
      );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="aisle-map-modal"
        className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl">
              <Store className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Interactive Supermarket Floor Plan & Aisle Guide</h2>
              <p className="text-xs text-slate-300">Navigate departments, locate exact shelf positions, and discover in-stock items</p>
            </div>
          </div>

          <button
            id="close-aisle-map-btn"
            type="button"
            aria-label="Close aisle map"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split Floor Plan & Aisle Directory */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left / Top: Interactive Visual Floor Map (7 cols) */}
          <div className="lg:col-span-7 p-6 bg-slate-50 border-r border-slate-200 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-green-600" /> Store Layout Grid
                </span>
                <span className="text-xs text-slate-500">Click any aisle to view in-stock products</span>
              </div>

              {/* Visual Floor Plan Diagram */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative select-none">
                {/* Store Top Perimeter: Deli, Bakery, Butcher */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    id="map-aisle-btn-1"
                    onClick={() => setSelectedAisleNum(1)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedAisleNum === 1
                        ? 'bg-green-600 text-white border-green-700 shadow-xs ring-1 ring-green-400'
                        : 'bg-green-50 text-green-950 border-green-200 hover:bg-green-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Aisle 1</span>
                      <span className="text-[10px] uppercase font-semibold opacity-80">Produce</span>
                    </div>
                    <div className="text-xs font-medium mt-0.5 truncate">🍏 Fresh Organic Fruits & Veggies</div>
                  </button>

                  <button
                    id="map-aisle-btn-2"
                    onClick={() => setSelectedAisleNum(2)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedAisleNum === 2
                        ? 'bg-amber-600 text-white border-amber-700 shadow-xs ring-1 ring-amber-400'
                        : 'bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Aisle 2</span>
                      <span className="text-[10px] uppercase font-semibold opacity-80">Bakery</span>
                    </div>
                    <div className="text-xs font-medium mt-0.5 truncate">🥖 Daily Artisan Sourdough</div>
                  </button>

                  <button
                    id="map-aisle-btn-3"
                    onClick={() => setSelectedAisleNum(3)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedAisleNum === 3
                        ? 'bg-orange-600 text-white border-orange-700 shadow-xs ring-1 ring-orange-400'
                        : 'bg-orange-50 text-orange-950 border-orange-200 hover:bg-orange-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Aisle 3</span>
                      <span className="text-[10px] uppercase font-semibold opacity-80">Deli</span>
                    </div>
                    <div className="text-xs font-medium mt-0.5 truncate">🍗 Rotisserie & Artisan Cheeses</div>
                  </button>
                </div>

                {/* Center Aisles: 4, 5, 6, 7, 8 */}
                <div className="grid grid-cols-2 gap-3 my-3">
                  <div className="space-y-2">
                    <button
                      id="map-aisle-btn-4"
                      onClick={() => setSelectedAisleNum(4)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedAisleNum === 4
                          ? 'bg-sky-600 text-white border-sky-700 shadow-xs ring-1 ring-sky-400'
                          : 'bg-sky-50 text-sky-950 border-sky-200 hover:bg-sky-100'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span>Aisle 4 • Dairy & Eggs</span>
                        <span>🥛</span>
                      </div>
                      <span className="text-[11px] opacity-80 block truncate font-medium">Pasture Eggs, Milk, Yogurts</span>
                    </button>

                    <button
                      id="map-aisle-btn-5"
                      onClick={() => setSelectedAisleNum(5)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedAisleNum === 5
                          ? 'bg-rose-600 text-white border-rose-700 shadow-xs ring-1 ring-rose-400'
                          : 'bg-rose-50 text-rose-950 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span>Aisle 5 • Butcher & Seafood</span>
                        <span>🥩</span>
                      </div>
                      <span className="text-[11px] opacity-80 block truncate font-medium">Ribeye, Salmon, Poultry</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button
                      id="map-aisle-btn-6"
                      onClick={() => setSelectedAisleNum(6)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedAisleNum === 6
                          ? 'bg-yellow-600 text-white border-yellow-700 shadow-xs ring-1 ring-yellow-400'
                          : 'bg-yellow-50 text-yellow-950 border-yellow-200 hover:bg-yellow-100'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span>Aisle 6 • Pantry & Grains</span>
                        <span>🥫</span>
                      </div>
                      <span className="text-[11px] opacity-80 block truncate font-medium">Olive Oils, Pasta, San Marzano</span>
                    </button>

                    <button
                      id="map-aisle-btn-7"
                      onClick={() => setSelectedAisleNum(7)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedAisleNum === 7
                          ? 'bg-teal-600 text-white border-teal-700 shadow-xs ring-1 ring-teal-400'
                          : 'bg-teal-50 text-teal-950 border-teal-200 hover:bg-teal-100'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span>Aisle 7 • Beverages</span>
                        <span>☕</span>
                      </div>
                      <span className="text-[11px] opacity-80 block truncate font-medium">Cold Brew, Botanical Water, Juices</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Freezer Aisle 8 */}
                <button
                  id="map-aisle-btn-8"
                  onClick={() => setSelectedAisleNum(8)}
                  className={`w-full p-3 rounded-xl border text-left transition-all my-2 cursor-pointer ${
                    selectedAisleNum === 8
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs ring-1 ring-indigo-400'
                      : 'bg-indigo-50 text-indigo-950 border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">Aisle 8 • Frozen Organics & Artisan Gelato ❄️</span>
                    <span className="text-[10px] uppercase font-semibold bg-white/30 px-2 py-0.5 rounded">Deep Chill</span>
                  </div>
                  <span className="text-[11px] opacity-80 block mt-0.5 font-medium">Wood-fired Pizzas, Organic Frozen Berries, Ice Creams</span>
                </button>

                {/* Front Entrance / Checkout Line */}
                <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-center text-xs text-slate-500 font-medium">
                  <div className="bg-slate-100 py-2 rounded-lg border border-slate-200">
                    🛒 Self-Checkout Registers 1-8 & Customer Service
                  </div>
                  <div className="bg-green-50 py-2 rounded-lg border border-green-200 text-green-800 font-semibold">
                    🚗 Curbside Pickup Loading Bays 1-6
                  </div>
                </div>
              </div>
            </div>

            {/* Current Aisle Info Banner */}
            <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center justify-center font-bold text-sm">
                  {currentAisle.number}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{currentAisle.name}</h4>
                  <p className="text-xs text-slate-500">{currentAisle.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Products in this Aisle (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-white flex flex-col justify-between overflow-y-auto max-h-[70vh] lg:max-h-none">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span>Items in Aisle {selectedAisleNum} ({aisleProducts.length})</span>
                </h3>
              </div>

              {/* Product mini list */}
              <div className="space-y-3">
                {displayedProducts.map((prod) => {
                  const inList = shoppingListProductIds.has(prod.id);
                  return (
                    <div 
                      key={prod.id}
                      id={`aisle-item-${prod.id}`}
                      className="p-3 rounded-xl border border-slate-200 hover:border-green-300 hover:shadow-xs transition-all flex items-center justify-between gap-3 bg-white"
                    >
                      <div 
                        onClick={() => {
                          onClose();
                          onOpenProductDetail(prod);
                        }}
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-900 truncate hover:text-green-700">{prod.name}</h4>
                          <span className="text-[11px] text-slate-500 block">{prod.unit}</span>
                          <span className="text-xs font-bold text-slate-900">${prod.price.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          id={`aisle-list-btn-${prod.id}`}
                          onClick={() => onToggleShoppingList(prod)}
                          className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                            inList
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                          }`}
                          title={inList ? 'In your in-store list' : 'Add to in-store checklist'}
                        >
                          {inList ? <Check className="w-3.5 h-3.5" /> : <ListPlus className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          id={`aisle-cart-btn-${prod.id}`}
                          onClick={() => onAddToCart(prod)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Add to Basket"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* In-Store Shopper Assistance Tip */}
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <div className="font-semibold flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>In-Store Shopper Tip</span>
              </div>
              <p>Need help finding a hard-to-reach item? Look for supermarket floor associates in green aprons or press the help bell at the end of Aisle 4.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
