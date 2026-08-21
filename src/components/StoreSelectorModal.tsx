import React, { useState, useEffect } from 'react';
import { 
  X, 
  Store, 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Navigation 
} from 'lucide-react';
import { StoreLocation } from '../types';
import { STORE_LOCATIONS } from '../data/supermarketData';

interface StoreSelectorModalProps {
  currentFulfillment: 'pickup' | 'delivery';
  currentStore: StoreLocation;
  deliveryAddress: string;
  onClose: () => void;
  onSave: (fulfillment: 'pickup' | 'delivery', store: StoreLocation, address: string) => void;
}

export const StoreSelectorModal: React.FC<StoreSelectorModalProps> = ({
  currentFulfillment,
  currentStore,
  deliveryAddress,
  onClose,
  onSave
}) => {
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>(currentFulfillment);
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(currentStore);
  const [addressInput, setAddressInput] = useState<string>(deliveryAddress || '742 Evergreen Terrace, San Francisco, CA 94107');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleConfirm = () => {
    onSave(fulfillment, selectedStore, addressInput);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="store-selector-modal"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden my-6 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl">
              <Store className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Store Branch & Fulfillment Preferences</h2>
              <p className="text-xs text-slate-300">Select curbside pickup branch or door delivery</p>
            </div>
          </div>

          <button
            id="close-store-selector-btn"
            type="button"
            aria-label="Close store selector"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Fulfillment Toggle */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl">
            <button
              id="select-pickup-mode-btn"
              onClick={() => setFulfillment('pickup')}
              className={`py-3 px-4 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                fulfillment === 'pickup'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-4 h-4 text-green-600" />
              <span>Curbside Pickup (FREE)</span>
            </button>

            <button
              id="select-delivery-mode-btn"
              onClick={() => setFulfillment('delivery')}
              className={`py-3 px-4 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                fulfillment === 'delivery'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-4 h-4 text-green-600" />
              <span>Local Home Delivery</span>
            </button>
          </div>

          {/* Delivery Address Input if delivery chosen */}
          {fulfillment === 'delivery' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-green-600" />
                <span>Delivery Destination Address</span>
              </label>
              <input
                id="delivery-address-input"
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Enter street address, Apt/Suite, City, Zip"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-green-600"
              />
              <span className="text-[11px] text-green-700 block font-medium">
                🚚 Free delivery on supermarket orders over $50.00!
              </span>
            </div>
          )}

          {/* Store Branch List */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {fulfillment === 'pickup' ? 'Select Pickup Store Branch' : 'Fulfilling Supermarket Location'}
            </div>

            <div className="space-y-2.5">
              {STORE_LOCATIONS.map((store) => {
                const isSelected = selectedStore.id === store.id;
                return (
                  <div
                    key={store.id}
                    id={`store-option-${store.id}`}
                    onClick={() => setSelectedStore(store)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-green-50/70 border-green-600 ring-1 ring-green-600/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{store.name}</h4>
                        <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                          {store.distance}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{store.address}, {store.city}</span>
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {store.hours}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {store.phone}</span>
                      </div>

                      {/* Amenities pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {store.amenities.map(a => (
                          <span key={a} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 shrink-0">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-green-600 border-green-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            id="cancel-store-selector-btn"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="confirm-store-selector-btn"
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            Confirm Store & Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
