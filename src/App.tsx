/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Tag, 
  ChefHat, 
  ListChecks, 
  ScanLine, 
  Store, 
  ShoppingBag, 
  Filter, 
  ArrowRight,
  Clock,
  Truck,
  Heart,
  HelpCircle
} from 'lucide-react';

import { Product, CartItem, Coupon, ShoppingListItem, RecipeBundle, Order, StoreLocation, DietaryTag } from './types';
import { PRODUCTS_DATA, COUPONS_DATA, STORE_LOCATIONS, SUPERMARKET_AISLES } from './data/supermarketData';

import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { DealsFlyerBanner } from './components/DealsFlyerBanner';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AisleMapModal } from './components/AisleMapModal';
import { ShoppingListModal } from './components/ShoppingListModal';
import { RecipeMealKitsModal } from './components/RecipeMealKitsModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { StoreSelectorModal } from './components/StoreSelectorModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { FilterDrawer } from './components/FilterDrawer';

export default function App() {
  // State: Search & Category
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Departments');

  // State: Filters
  const [selectedTags, setSelectedTags] = useState<DietaryTag[]>([]);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // State: Cart (with localStorage persistence)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('freshroots_cart');
      return saved ? JSON.parse(saved) : [
        { product: PRODUCTS_DATA[0], quantity: 2 }, // Honeycrisp Apples
        { product: PRODUCTS_DATA[5], quantity: 1 }, // Sourdough
        { product: PRODUCTS_DATA[9], quantity: 1 }, // Eggs
      ];
    } catch {
      return [];
    }
  });

  // State: Shopping List (with localStorage persistence)
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => {
    try {
      const saved = localStorage.getItem('freshroots_shopping_list');
      return saved ? JSON.parse(saved) : [
        {
          id: 'list-1',
          productId: 'prod-001',
          name: 'Organic Honeycrisp Apples',
          aisle: 'Aisle 1: Fresh Produce',
          aisleNumber: 1,
          category: 'Produce',
          quantity: 2,
          unit: 'per lb',
          estimatedPrice: 3.49,
          checked: false
        },
        {
          id: 'list-2',
          productId: 'prod-006',
          name: 'San Francisco Sourdough Boule',
          aisle: 'Aisle 2: Bakery & Breads',
          aisleNumber: 2,
          category: 'Bakery',
          quantity: 1,
          unit: '24 oz loaf',
          estimatedPrice: 5.49,
          checked: true
        },
        {
          id: 'list-3',
          productId: 'prod-010',
          name: 'Organic Pasture-Raised Brown Eggs',
          aisle: 'Aisle 4: Dairy & Plant Milks',
          aisleNumber: 4,
          category: 'Dairy & Eggs',
          quantity: 1,
          unit: '12 ct carton',
          estimatedPrice: 5.49,
          checked: false
        }
      ];
    } catch {
      return [];
    }
  });

  // State: Digital Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('freshroots_coupons');
      return saved ? JSON.parse(saved) : COUPONS_DATA;
    } catch {
      return COUPONS_DATA;
    }
  });

  // State: Fulfillment Settings
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(STORE_LOCATIONS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, San Francisco, CA 94107');

  // State: Orders History
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('freshroots_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // State: Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAisleMapOpen, setIsAisleMapOpen] = useState(false);
  const [activeAisleForMap, setActiveAisleForMap] = useState<number>(1);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isRecipesOpen, setIsRecipesOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('freshroots_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('freshroots_shopping_list', JSON.stringify(shoppingList));
    } catch (e) {}
  }, [shoppingList]);

  useEffect(() => {
    try {
      localStorage.setItem('freshroots_coupons', JSON.stringify(coupons));
    } catch (e) {}
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('freshroots_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Coupon Handlers
  const handleToggleClipCoupon = (couponId: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === couponId ? { ...c, isClipped: !c.isClipped } : c))
    );
  };

  // Shopping List Handlers
  const shoppingListProductIds = useMemo(() => {
    return new Set(shoppingList.map(item => item.productId).filter(Boolean) as string[]);
  }, [shoppingList]);

  const handleToggleShoppingList = (product: Product) => {
    if (shoppingListProductIds.has(product.id)) {
      setShoppingList(prev => prev.filter(i => i.productId !== product.id));
    } else {
      const newItem: ShoppingListItem = {
        id: `list-${Date.now()}-${product.id}`,
        productId: product.id,
        name: product.name,
        aisle: product.aisle,
        aisleNumber: product.aisleNumber,
        category: product.category,
        quantity: 1,
        unit: product.unit,
        estimatedPrice: product.price,
        checked: false
      };
      setShoppingList(prev => [...prev, newItem]);
    }
  };

  const handleToggleShoppingListItem = (id: string) => {
    setShoppingList(prev =>
      prev.map(i => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const handleDeleteShoppingListItem = (id: string) => {
    setShoppingList(prev => prev.filter(i => i.id !== id));
  };

  const handleClearShoppingList = () => {
    setShoppingList([]);
  };

  const handleAddCustomShoppingItem = (name: string, aisleNum: number, estimatedPrice: number) => {
    const aisleDef = SUPERMARKET_AISLES.find(a => a.number === aisleNum);
    const newItem: ShoppingListItem = {
      id: `custom-${Date.now()}`,
      name,
      aisle: aisleDef ? aisleDef.name : `Aisle ${aisleNum}`,
      aisleNumber: aisleNum,
      category: aisleDef ? aisleDef.category : 'General',
      quantity: 1,
      unit: 'item',
      estimatedPrice,
      checked: false,
      isCustom: true
    };
    setShoppingList(prev => [...prev, newItem]);
  };

  const handleTransferListToCart = (itemsToTransfer: ShoppingListItem[]) => {
    itemsToTransfer.forEach(listItem => {
      if (listItem.productId) {
        const prod = PRODUCTS_DATA.find(p => p.id === listItem.productId);
        if (prod) handleAddToCart(prod, listItem.quantity);
      }
    });
    setIsCartOpen(true);
  };

  // Recipe Bundle Add Handler
  const handleAddBundleToCart = (bundle: RecipeBundle, multiplier: number) => {
    bundle.productIds.forEach(item => {
      const prod = PRODUCTS_DATA.find(p => p.id === item.productId);
      if (prod) {
        handleAddToCart(prod, item.defaultQty * multiplier);
      }
    });
  };

  // Reorder Handler
  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      handleAddToCart(item.product, item.quantity);
    });
    setIsCartOpen(true);
  };

  // Filter Handlers
  const handleToggleTag = (tag: DietaryTag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleResetFilters = () => {
    setSelectedTags([]);
    setOnlyOnSale(false);
    setOnlyOrganic(false);
    setPriceRange([0, 25]);
    setSortBy('featured');
  };

  const activeFilterCount =
    selectedTags.length +
    (onlyOnSale ? 1 : 0) +
    (onlyOrganic ? 1 : 0) +
    (priceRange[1] < 25 ? 1 : 0) +
    (sortBy !== 'featured' ? 1 : 0);

  // Aisle Map Launcher helper
  const handleOpenAisleMap = (aisleNum = 1) => {
    setActiveAisleForMap(aisleNum);
    setIsAisleMapOpen(true);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(prod => {
      // Category filter
      if (selectedCategory !== 'All Departments' && prod.category !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesCategory = prod.category.toLowerCase().includes(q);
        const matchesBrand = prod.brand.toLowerCase().includes(q);
        const matchesTags = prod.dietaryTags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesBrand && !matchesTags) return false;
      }

      // On-Sale filter
      if (onlyOnSale && !prod.isOnSale) return false;

      // Organic filter
      if (onlyOrganic && !prod.isOrganic) return false;

      // Dietary tags filter
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(t => prod.dietaryTags.includes(t));
        if (!hasAllTags) return false;
      }

      // Price range
      if (prod.price > priceRange[1]) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, searchQuery, onlyOnSale, onlyOrganic, selectedTags, priceRange, sortBy]);

  // Cart Metrics
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-green-100 selection:text-green-900">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartCount={cartItemCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenShoppingList={() => setIsShoppingListOpen(true)}
        shoppingListCount={shoppingList.length}
        onOpenAisleMap={handleOpenAisleMap}
        onOpenRecipes={() => setIsRecipesOpen(true)}
        onOpenDeals={() => {
          setOnlyOnSale(true);
          setSelectedCategory('All Departments');
        }}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenStoreSelector={() => setIsStoreSelectorOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        ordersCount={orders.length}
        fulfillmentType={fulfillmentType}
        selectedStore={selectedStore}
        allProducts={PRODUCTS_DATA}
        onSelectProduct={(p) => setDetailProduct(p)}
        activeFilterCount={activeFilterCount}
        onToggleFilterDrawer={() => setIsFilterDrawerOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Weekly Deals / Digital Flyer Banner */}
        <DealsFlyerBanner
          coupons={coupons}
          onToggleClipCoupon={handleToggleClipCoupon}
          onFilterDeals={() => {
            setOnlyOnSale(true);
            setSelectedCategory('All Departments');
          }}
        />

        {/* Catalog Control Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {selectedCategory === 'All Departments' ? 'All Supermarket Aisles' : selectedCategory}
              </h1>
              <span className="text-xs font-semibold text-green-800 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                {filteredProducts.length} items
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Organic produce, artisan bakery, fresh butcher cuts, and pantry essentials
            </p>
          </div>

          {/* Quick Active Filters & Clear */}
          <div className="flex flex-wrap items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                id="clear-all-active-filters-btn"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
              >
                Clear Filters ({activeFilterCount})
              </button>
            )}

            <button
              id="open-aisle-map-catalog-btn"
              onClick={() => handleOpenAisleMap(1)}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-green-600" />
              <span>Aisle Navigator</span>
            </button>
          </div>
        </div>

        {/* Product Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 opacity-80" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No supermarket items match your filter criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try removing some dietary tags, expanding the price range, or searching for other fresh grocery items.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => {
              const cartItem = cartItems.find(i => i.product.id === product.id);
              const quantity = cartItem ? cartItem.quantity : 0;
              const isInList = shoppingListProductIds.has(product.id);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQuantity={quantity}
                  onAddToCart={handleAddToCart}
                  onUpdateCartQuantity={handleUpdateCartQuantity}
                  onOpenDetail={(p) => setDetailProduct(p)}
                  onOpenAisleMap={handleOpenAisleMap}
                  onToggleShoppingList={handleToggleShoppingList}
                  isInShoppingList={isInList}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Supermarket Value Banner & Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8 border-b border-slate-200 text-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-600 text-white flex items-center justify-center font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-900">FreshRoots Market</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Your neighborhood destination for 100% organic local produce, artisan-baked breads, sustainable wild seafood, and prime meats.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Supermarket Departments</h4>
              <ul className="text-slate-500 space-y-1">
                <li>Aisle 1: Organic Fresh Produce</li>
                <li>Aisle 2: Daily Artisan Bakery</li>
                <li>Aisle 4: Pasture Dairy & Milks</li>
                <li>Aisle 5: Butcher & Wild Seafood</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Shopper Services</h4>
              <ul className="text-slate-500 space-y-1">
                <li>Curbside Pickup (Bay 1-8)</li>
                <li>In-Store Aisle Map Navigator</li>
                <li>Digital Coupons & Weekly Flyer</li>
                <li>Chef Recipe Meal Bundles</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Freshness Guarantee</h4>
              <p className="text-slate-500 leading-relaxed">
                If any produce item or cut does not meet your crispness standards, contact us for an instant replacement or full credit.
              </p>
              <div className="text-[11px] font-semibold text-green-700">
                📞 Customer Care: (415) 555-0198
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>© 2026 FreshRoots Supermarket Co. • Organic & Sustainable Grocery</div>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>SNAP / EBT Accepted</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-out Drawers */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          cartQuantity={cartItems.find(i => i.product.id === detailProduct.id)?.quantity || 0}
          onAddToCart={handleAddToCart}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onOpenAisleMap={handleOpenAisleMap}
          onToggleShoppingList={handleToggleShoppingList}
          isInShoppingList={shoppingListProductIds.has(detailProduct.id)}
        />
      )}

      {isAisleMapOpen && (
        <AisleMapModal
          initialAisle={activeAisleForMap}
          onClose={() => setIsAisleMapOpen(false)}
          onAddToCart={handleAddToCart}
          onToggleShoppingList={handleToggleShoppingList}
          shoppingListProductIds={shoppingListProductIds}
          onOpenProductDetail={(p) => setDetailProduct(p)}
        />
      )}

      {isShoppingListOpen && (
        <ShoppingListModal
          items={shoppingList}
          onClose={() => setIsShoppingListOpen(false)}
          onToggleItem={handleToggleShoppingListItem}
          onDeleteItem={handleDeleteShoppingListItem}
          onClearList={handleClearShoppingList}
          onAddCustomItem={handleAddCustomShoppingItem}
          onTransferToCart={handleTransferListToCart}
          onOpenAisleMap={handleOpenAisleMap}
        />
      )}

      {isRecipesOpen && (
        <RecipeMealKitsModal
          onClose={() => setIsRecipesOpen(false)}
          onAddBundleToCart={handleAddBundleToCart}
          onOpenProductDetail={(p) => setDetailProduct(p)}
        />
      )}

      {isScannerOpen && (
        <BarcodeScannerModal
          onClose={() => setIsScannerOpen(false)}
          onAddToCart={handleAddToCart}
          onOpenProductDetail={(p) => setDetailProduct(p)}
        />
      )}

      {isStoreSelectorOpen && (
        <StoreSelectorModal
          currentFulfillment={fulfillmentType}
          currentStore={selectedStore}
          deliveryAddress={deliveryAddress}
          onClose={() => setIsStoreSelectorOpen(false)}
          onSave={(type, store, address) => {
            setFulfillmentType(type);
            setSelectedStore(store);
            setDeliveryAddress(address);
          }}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        coupons={coupons}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        fulfillmentType={fulfillmentType}
        onOpenStoreSelector={() => {
          setIsCartOpen(false);
          setIsStoreSelectorOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        coupons={coupons}
        fulfillmentType={fulfillmentType}
        selectedStore={selectedStore}
        deliveryAddress={deliveryAddress}
        onOrderCompleted={(newOrder) => setOrders(prev => [newOrder, ...prev])}
        onClearCart={handleClearCart}
      />

      {isOrdersOpen && (
        <OrderHistoryModal
          orders={orders}
          onClose={() => setIsOrdersOpen(false)}
          onReorder={handleReorder}
          onOpenProductDetail={(p) => setDetailProduct(p)}
        />
      )}

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        selectedTags={selectedTags}
        onToggleTag={handleToggleTag}
        onlyOnSale={onlyOnSale}
        setOnlyOnSale={setOnlyOnSale}
        onlyOrganic={onlyOrganic}
        setOnlyOrganic={setOnlyOrganic}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
