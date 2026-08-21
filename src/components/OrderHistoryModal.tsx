import React, { useEffect } from 'react';
import { 
  X, 
  History, 
  ShoppingBag, 
  RotateCcw, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  QrCode, 
  ChevronRight 
} from 'lucide-react';
import { Order, Product } from '../types';

interface OrderHistoryModalProps {
  orders: Order[];
  onClose: () => void;
  onReorder: (order: Order) => void;
  onOpenProductDetail: (product: Product) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  orders,
  onClose,
  onReorder,
  onOpenProductDetail
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="order-history-modal"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-xl">
              <History className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Past Supermarket Orders & Receipts</h2>
              <p className="text-xs text-slate-300">Track pickups, view itemized receipts, and 1-click reorder</p>
            </div>
          </div>

          <button
            id="close-order-history-btn"
            type="button"
            aria-label="Close order history"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 mx-auto flex items-center justify-center border border-green-200">
                <History className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-base font-bold text-slate-700">No supermarket orders yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once you place a pickup or delivery order, your digital receipts and barcode pickup passes will appear here.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                id={`order-card-${order.id}`}
                className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 shadow-xs hover:border-green-300 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{order.id}</span>
                      <span className="text-xs font-semibold bg-green-50 text-green-800 border border-green-200 px-2.5 py-0.5 rounded-full">
                        {order.fulfillmentType === 'pickup' ? 'Curbside Pickup' : 'Delivery'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {order.date} • {order.storeLocation}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900">${order.total.toFixed(2)}</span>
                    <span className="text-[11px] text-green-700 block font-medium">
                      Saved ${order.savings.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Pickup Barcode / Code */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-green-600" />
                    <span>Pickup Code: <strong className="font-mono text-green-800">{order.pickupCode}</strong></span>
                  </div>
                  <span className="text-slate-500 font-medium">{order.timeSlot}</span>
                </div>

                {/* Items Thumbnails */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {order.items.map(item => (
                    <img
                      key={item.product.id}
                      src={item.product.image}
                      alt={item.product.name}
                      title={`${item.quantity}x ${item.product.name}`}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer"
                      onClick={() => onOpenProductDetail(item.product)}
                    />
                  ))}
                  <span className="text-xs text-slate-500 whitespace-nowrap pl-2">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} total items
                  </span>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    id={`reorder-btn-${order.id}`}
                    onClick={() => {
                      onReorder(order);
                      onClose();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder All Items (${order.subtotal.toFixed(2)})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
