import React, { useState, useEffect } from 'react';
import { 
  X, 
  ListChecks, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  ShoppingBag, 
  MapPin, 
  ArrowRight, 
  Printer, 
  Sparkles,
  Share2
} from 'lucide-react';
import { ShoppingListItem, Product } from '../types';
import { SUPERMARKET_AISLES, PRODUCTS_DATA } from '../data/supermarketData';

interface ShoppingListModalProps {
  items: ShoppingListItem[];
  onClose: () => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearList: () => void;
  onAddCustomItem: (name: string, aisleNum: number, estimatedPrice: number) => void;
  onTransferToCart: (items: ShoppingListItem[]) => void;
  onOpenAisleMap: (aisleNum: number) => void;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  items,
  onClose,
  onToggleItem,
  onDeleteItem,
  onClearList,
  onAddCustomItem,
  onTransferToCart,
  onOpenAisleMap
}) => {
  const [customName, setCustomName] = useState('');
  const [selectedAisle, setSelectedAisle] = useState<number>(1);
  const [estimatedPrice, setEstimatedPrice] = useState<string>('3.99');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const totalItems = items.length;
  const checkedItemsCount = items.filter(i => i.checked).length;
  const progressPercent = totalItems > 0 ? Math.round((checkedItemsCount / totalItems) * 100) : 0;
  const totalEstimatedCost = items.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);

  // Group items by Aisle Number for optimal in-store walking path!
  const itemsByAisle: { [key: number]: ShoppingListItem[] } = {};
  items.forEach(item => {
    const aisleNum = item.aisleNumber || 1;
    if (!itemsByAisle[aisleNum]) {
      itemsByAisle[aisleNum] = [];
    }
    itemsByAisle[aisleNum].push(item);
  });

  const sortedAisles = Object.keys(itemsByAisle).map(Number).sort((a, b) => a - b);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const priceNum = parseFloat(estimatedPrice) || 2.99;
    onAddCustomItem(customName.trim(), selectedAisle, priceNum);
    setCustomName('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="shopping-list-modal"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl">
              <ListChecks className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">In-Store Shopping Checklist & Aisle Route</h2>
              <p className="text-xs text-slate-300">Automatically sequenced by aisle to optimize your in-store walking route</p>
            </div>
          </div>

          <button
            id="close-shopping-list-btn"
            type="button"
            aria-label="Close shopping list"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & Quick Stats Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between text-xs font-semibold text-slate-900 mb-1.5">
              <span>{checkedItemsCount} of {totalItems} items gathered</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block font-medium">Est. Basket Total</span>
              <span className="text-sm font-bold text-slate-900">${totalEstimatedCost.toFixed(2)}</span>
            </div>
            {items.length > 0 && (
              <button
                id="clear-all-list-btn"
                onClick={onClearList}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ml-2 border border-slate-200"
                title="Clear entire list"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Add Custom Item Form */}
          <form onSubmit={handleAddCustom} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2">
            <input
              id="custom-list-item-input"
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Add custom item (e.g. Fresh rosemary, Olive bread)..."
              className="flex-1 min-w-[180px] px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm outline-none focus:border-green-600"
            />

            <select
              id="custom-list-aisle-select"
              value={selectedAisle}
              onChange={(e) => setSelectedAisle(Number(e.target.value))}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none"
            >
              {SUPERMARKET_AISLES.map(aisle => (
                <option key={aisle.number} value={aisle.number}>
                  Aisle {aisle.number}: {aisle.category}
                </option>
              ))}
            </select>

            <button
              id="submit-custom-item-btn"
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to List</span>
            </button>
          </form>

          {/* Grouped by Aisle */}
          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 mx-auto flex items-center justify-center border border-green-200">
                <ListChecks className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Your in-store shopping checklist is empty.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the checklist icon on any grocery item in the catalog or add custom notes above to plan your aisle walking route!
              </p>
            </div>
          ) : (
            sortedAisles.map((aisleNum) => {
              const aisleDef = SUPERMARKET_AISLES.find(a => a.number === aisleNum);
              const aisleItems = itemsByAisle[aisleNum];
              return (
                <div key={aisleNum} className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-green-700 text-white text-xs font-bold flex items-center justify-center">
                        {aisleNum}
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {aisleDef ? aisleDef.name : `Aisle ${aisleNum}`}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAisleMap(aisleNum);
                      }}
                      className="text-xs font-semibold text-green-700 hover:text-green-800 flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>View on Store Map</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {aisleItems.map((item) => (
                      <div
                        key={item.id}
                        id={`list-item-${item.id}`}
                        onClick={() => onToggleItem(item.id)}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          item.checked 
                            ? 'bg-slate-100 border-slate-200 opacity-60' 
                            : 'bg-white border-slate-200 hover:border-green-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            id={`toggle-check-${item.id}`}
                            className="text-green-600 hover:text-green-700 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleItem(item.id);
                            }}
                          >
                            {item.checked ? (
                              <CheckCircle2 className="w-5 h-5 fill-green-600 text-white" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400" />
                            )}
                          </button>

                          <div>
                            <span className={`text-sm font-bold text-slate-900 ${item.checked ? 'line-through text-slate-400' : ''}`}>
                              {item.name}
                            </span>
                            <span className="text-xs text-slate-500 block">
                              Qty: {item.quantity} {item.unit ? `• ${item.unit}` : ''} • Est: ${(item.estimatedPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <button
                          id={`delete-list-item-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(item.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              💡 <em>Check items off your phone as you walk the supermarket aisles!</em>
            </div>

            <button
              id="transfer-list-to-cart-btn"
              onClick={() => {
                onTransferToCart(items);
                onClose();
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer ml-auto"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Convert All to Online Basket</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
