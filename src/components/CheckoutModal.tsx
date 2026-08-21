import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  CreditCard, 
  Store, 
  Truck, 
  Clock, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Phone, 
  User, 
  Receipt,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { CartItem, Coupon, Order, StoreLocation } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  coupons: Coupon[];
  fulfillmentType: 'pickup' | 'delivery';
  selectedStore: StoreLocation;
  deliveryAddress: string;
  onOrderCompleted: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  coupons,
  fulfillmentType,
  selectedStore,
  deliveryAddress,
  onOrderCompleted,
  onClearCart
}) => {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [timeSlot, setTimeSlot] = useState('Today (2:00 PM - 3:00 PM)');
  const [customerName, setCustomerName] = useState('Sarah Jenkins');
  const [customerPhone, setCustomerPhone] = useState('(415) 555-0182');
  const [specialInstructions, setSpecialInstructions] = useState('Please leave produce bags on side porch or curbside bay 3.');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'snap_ebt' | 'pickup_pay'>('card');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [redeemedPoints, setRedeemedPoints] = useState<number>(0);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

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

  const rawSubtotal = items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
  
  // Calculate clipped coupon discounts
  const clippedCoupons = coupons.filter(c => c.isClipped);
  let couponDiscount = 0;
  clippedCoupons.forEach(coupon => {
    if (coupon.categoryLimit) {
      const catSubtotal = items
        .filter(i => i.product.category === coupon.categoryLimit)
        .reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
      if (catSubtotal >= coupon.minSpend) {
        if (coupon.discountType === 'percentage') {
          couponDiscount += catSubtotal * (coupon.discountValue / 100);
        } else {
          couponDiscount += Math.min(catSubtotal, coupon.discountValue);
        }
      }
    } else if (rawSubtotal >= coupon.minSpend) {
      if (coupon.discountType === 'percentage') {
        couponDiscount += rawSubtotal * (coupon.discountValue / 100);
      } else {
        couponDiscount += Math.min(rawSubtotal, coupon.discountValue);
      }
    }
  });

  const pointsDiscount = (redeemedPoints / 100) * 5; // 100 pts = $5
  const totalDiscount = couponDiscount + pointsDiscount;
  const discountedSubtotal = Math.max(0, rawSubtotal - totalDiscount);
  const deliveryFee = fulfillmentType === 'pickup' ? 0 : (rawSubtotal >= 50 ? 0 : 4.99);
  const estimatedTax = discountedSubtotal * 0.045;
  const tipAmount = fulfillmentType === 'delivery' ? (discountedSubtotal * (tipPercent / 100)) : 0;
  const grandTotal = discountedSubtotal + deliveryFee + estimatedTax + tipAmount;
  const earnedLoyaltyPoints = Math.round(grandTotal * 2);

  const availableTimeSlots = [
    'Today (2:00 PM - 3:00 PM)',
    'Today (4:00 PM - 5:00 PM)',
    'Today (6:00 PM - 7:00 PM)',
    'Tomorrow Morning (9:00 AM - 10:00 AM)',
    'Tomorrow Afternoon (1:00 PM - 2:00 PM)'
  ];

  const handlePlaceOrder = () => {
    const pickupCode = `FR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      fulfillmentType,
      timeSlot,
      storeLocation: selectedStore.name,
      address: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
      items: [...items],
      subtotal: rawSubtotal,
      discount: totalDiscount,
      deliveryFee,
      tax: estimatedTax,
      tip: tipAmount,
      total: grandTotal,
      savings: totalDiscount + (deliveryFee === 0 && rawSubtotal >= 50 ? 4.99 : 0),
      status: 'Received',
      pickupCode,
      paymentMethod: paymentMethod === 'card' ? 'Visa •••• 4242' : paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'snap_ebt' ? 'SNAP EBT' : 'Pay at Curbside Pickup',
      loyaltyPointsEarned: earnedLoyaltyPoints
    };

    setCompletedOrder(newOrder);
    setStep('success');
    onOrderCompleted(newOrder);
    onClearCart();

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="checkout-modal-card"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden my-6 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl">
              <Receipt className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {step === 'details' ? 'Supermarket Secure Checkout' : 'Order Placed Successfully!'}
              </h2>
              <p className="text-xs text-slate-300">
                {step === 'details' ? `${items.length} unique items in basket` : 'Fresh groceries are being carefully picked from aisles'}
              </p>
            </div>
          </div>

          <button
            id="close-checkout-modal-btn"
            type="button"
            aria-label="Close checkout"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Fulfillment & Time Slot */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  {fulfillmentType === 'pickup' ? <Store className="w-4 h-4 text-green-600" /> : <Truck className="w-4 h-4 text-green-600" />}
                  <span>1. {fulfillmentType === 'pickup' ? 'Curbside Pickup Details' : 'Delivery Destination'}</span>
                </span>
                <span className="text-xs font-semibold text-green-800 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                  {fulfillmentType === 'pickup' ? 'Ready in 45 Mins' : '1-Hour Slot'}
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <p><strong>Store:</strong> {selectedStore.name} ({selectedStore.address})</p>
                {fulfillmentType === 'delivery' && (
                  <p><strong>Deliver to:</strong> {deliveryAddress || '742 Evergreen Terrace, San Francisco, CA'}</p>
                )}
              </div>

              {/* Time Slot Picker */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Select Time Slot:
                </label>
                <select
                  id="checkout-timeslot-select"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-green-600 text-slate-800"
                >
                  {availableTimeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Contact & Special Notes */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-green-600" />
                <span>2. Shopper Contact & Notes</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Full Name</label>
                  <input
                    id="checkout-name-input"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none text-slate-800 focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mobile Phone (SMS updates)</label>
                  <input
                    id="checkout-phone-input"
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none text-slate-800 focus:border-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Curbside Bay / Substitution Instructions</label>
                <input
                  id="checkout-notes-input"
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Ripe avocados preferred, silver sedan at bay 3..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none text-slate-800 focus:border-green-600"
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-green-600" />
                <span>3. Payment Method</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  id="pay-card-btn"
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-green-50 border-green-600 text-green-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span>Credit Card</span>
                </button>

                <button
                  id="pay-apple-btn"
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-green-50 border-green-600 text-green-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>🍎 Apple Pay</span>
                </button>

                <button
                  id="pay-snap-btn"
                  type="button"
                  onClick={() => setPaymentMethod('snap_ebt')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'snap_ebt'
                      ? 'bg-green-50 border-green-600 text-green-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>🌾 SNAP EBT</span>
                </button>

                <button
                  id="pay-pickup-btn"
                  type="button"
                  onClick={() => setPaymentMethod('pickup_pay')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    paymentMethod === 'pickup_pay'
                      ? 'bg-green-50 border-green-600 text-green-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>🏪 Pay at Store</span>
                </button>
              </div>
            </div>

            {/* Tip Selection (for Delivery) */}
            {fulfillmentType === 'delivery' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                  <span>Driver & Personal Shopper Tip</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  {[10, 15, 20, 0].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      id={`tip-btn-${pct}`}
                      onClick={() => setTipPercent(pct)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        tipPercent === pct
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pct === 0 ? 'No Tip' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Final Order Price Breakdown */}
            <div className="p-4 bg-slate-100/80 rounded-xl space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Groceries Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold text-slate-900">${rawSubtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Digital Coupons & Savings</span>
                  <span>-${totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{fulfillmentType === 'pickup' ? 'Curbside Pickup' : 'Delivery Fee'}</span>
                <span>{deliveryFee === 0 ? <strong className="text-green-700">FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (4.5%)</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
              {fulfillmentType === 'delivery' && tipAmount > 0 && (
                <div className="flex justify-between">
                  <span>Shopper Tip ({tipPercent}%)</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="text-green-700">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              id="place-order-submit-btn"
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Place Supermarket Order • ${grandTotal.toFixed(2)}</span>
            </button>
          </div>
        ) : (
          /* Order Placed Success / Digital Itemized Receipt */
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="text-center space-y-2 py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 mx-auto flex items-center justify-center border border-green-200">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Order Confirmed!</h3>
              <p className="text-xs text-slate-500">
                Order #{completedOrder?.id} • {completedOrder?.date}
              </p>
            </div>

            {/* Interactive Pickup Barcode & Pass */}
            <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3 text-center border border-slate-800 shadow-md">
              <div className="text-xs uppercase tracking-widest text-slate-300 font-semibold">
                {completedOrder?.fulfillmentType === 'pickup' ? 'Curbside Pickup Barcode' : 'Delivery Tracking Code'}
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-bold tracking-widest text-green-400">
                {completedOrder?.pickupCode}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                <QrCode className="w-4 h-4 text-green-400" />
                <span>Show this code to associate at {completedOrder?.storeLocation}</span>
              </div>
            </div>

            {/* Aisle Picking Live Progress Indicator */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                <span>Supermarket Fulfillment Status</span>
                <span className="bg-green-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                  {completedOrder?.status}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold">
                <div className="bg-green-600 text-white py-1.5 rounded-lg">1. Received</div>
                <div className="bg-green-100 text-green-800 py-1.5 rounded-lg border border-green-200">2. Picking Aisles</div>
                <div className="bg-slate-200 text-slate-500 py-1.5 rounded-lg">3. Packed</div>
                <div className="bg-slate-200 text-slate-500 py-1.5 rounded-lg">4. Ready</div>
              </div>

              <p className="text-[11px] text-slate-600">
                🌱 Your personal shopper is gathering fresh items starting in <strong>Aisle 1 (Produce)</strong>.
              </p>
            </div>

            {/* Itemized Receipt Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ordered Groceries ({completedOrder?.items.length})</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {completedOrder?.items.map(item => (
                  <div key={item.product.id} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-2.5">
                      <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                      <div>
                        <span className="font-semibold text-slate-900">{item.product.name}</span>
                        <span className="text-[11px] text-slate-500 block">Qty: {item.quantity} ({item.product.unit}) • {item.product.aisle}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              id="finish-order-btn"
              onClick={onClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              Return to Supermarket Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
