import React, { useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Truck, 
  Store, 
  ShieldCheck 
} from 'lucide-react';
import { CartItem, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  coupons: Coupon[];
  onOpenCheckout: () => void;
  fulfillmentType: 'pickup' | 'delivery';
  onOpenStoreSelector: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  coupons,
  onOpenCheckout,
  fulfillmentType,
  onOpenStoreSelector
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

  const rawSubtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Calculate clipped coupon discounts
  const clippedCoupons = coupons.filter(c => c.isClipped);
  let totalDiscount = 0;

  clippedCoupons.forEach(coupon => {
    if (coupon.categoryLimit) {
      const catSubtotal = items
        .filter(i => i.product.category === coupon.categoryLimit)
        .reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
      
      if (catSubtotal >= coupon.minSpend) {
        if (coupon.discountType === 'percentage') {
          totalDiscount += catSubtotal * (coupon.discountValue / 100);
        } else if (coupon.discountType === 'fixed') {
          totalDiscount += Math.min(catSubtotal, coupon.discountValue);
        }
      }
    } else if (rawSubtotal >= coupon.minSpend) {
      if (coupon.discountType === 'percentage') {
        totalDiscount += rawSubtotal * (coupon.discountValue / 100);
      } else if (coupon.discountType === 'fixed') {
        totalDiscount += Math.min(rawSubtotal, coupon.discountValue);
      }
    }
  });

  const discountedSubtotal = Math.max(0, rawSubtotal - totalDiscount);
  const freeDeliveryThreshold = 50;
  const awayFromFreeDelivery = Math.max(0, freeDeliveryThreshold - rawSubtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((rawSubtotal / freeDeliveryThreshold) * 100));
  const deliveryFee = fulfillmentType === 'pickup' ? 0 : (rawSubtotal >= freeDeliveryThreshold ? 0 : 4.99);
  const estimatedTax = discountedSubtotal * 0.045; // 4.5% grocery tax
  const finalTotal = discountedSubtotal + deliveryFee + estimatedTax;
  const loyaltyPoints = Math.round(finalTotal * 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-zinc-200 animate-slideLeft"
        >
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold">Your Grocery Basket</h2>
                <p className="text-xs text-slate-400">{items.reduce((s, i) => s + i.quantity, 0)} items selected</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  id="clear-cart-btn"
                  onClick={onClearCart}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Empty Basket"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                id="close-cart-drawer-btn"
                onClick={onClose}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Delivery Bar */}
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-green-600" />
                {fulfillmentType === 'pickup' 
                  ? 'Curbside Pickup is FREE!' 
                  : awayFromFreeDelivery === 0 
                    ? '🎉 You unlocked FREE Delivery!' 
                    : `$${awayFromFreeDelivery.toFixed(2)} away from Free Delivery`}
              </span>
              <button 
                onClick={onOpenStoreSelector}
                className="text-[11px] text-green-700 hover:underline font-semibold cursor-pointer"
              >
                {fulfillmentType === 'pickup' ? 'Switch to Delivery' : 'Switch to Pickup'}
              </button>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600 rounded-full transition-all duration-300"
                style={{ width: `${fulfillmentType === 'pickup' ? 100 : freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {items.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 opacity-80" />
                </div>
                <p className="text-base font-bold text-slate-700">Your basket is empty</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Browse fresh organic produce, bakery sourdough, butcher cuts, and weekly deals to add items.
                </p>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  id={`cart-item-row-${product.id}`}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-xs"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">{product.name}</h4>
                    <span className="text-[11px] text-slate-500 block">{product.unit} • ${product.price.toFixed(2)} ea</span>
                    <span className="text-xs font-bold text-slate-900">${(product.price * quantity).toFixed(2)}</span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 shrink-0">
                    <button
                      id={`cart-minus-${product.id}`}
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      id={`cart-plus-${product.id}`}
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    id={`cart-remove-${product.id}`}
                    onClick={() => onRemoveItem(product.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Bottom Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3.5">
              {/* Clipped Coupons Applied */}
              {clippedCoupons.length > 0 && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    {clippedCoupons.length} Digital Coupon(s) Applied
                  </span>
                  <span className="font-bold text-amber-950">-${totalDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Groceries Subtotal</span>
                  <span className="font-semibold text-slate-900">${rawSubtotal.toFixed(2)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Coupon Savings</span>
                    <span>-${totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{fulfillmentType === 'pickup' ? 'Curbside Pickup' : 'Local Delivery'}</span>
                  <span>{deliveryFee === 0 ? <strong className="text-green-700">FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (4.5%)</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                  <span>Total Due</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Loyalty Club Points Reward */}
              <div className="text-[11px] text-center text-green-800 bg-green-50 border border-green-200 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Earn <strong>+{loyaltyPoints} FreshRewards Points</strong> with this order</span>
              </div>

              {/* Checkout Button */}
              <button
                id="checkout-cta-btn"
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
