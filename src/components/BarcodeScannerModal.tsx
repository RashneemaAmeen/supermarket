import React, { useState, useEffect } from 'react';
import { 
  X, 
  ScanLine, 
  Search, 
  ShoppingBag, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  Camera
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_DATA } from '../data/supermarketData';

interface BarcodeScannerModalProps {
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onOpenProductDetail: (product: Product) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  onClose,
  onAddToCart,
  onOpenProductDetail
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(PRODUCTS_DATA[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const sampleBarcodes = [
    { name: 'Honeycrisp Apples', code: '041220194821' },
    { name: 'Wild Sockeye Salmon', code: '028100014820' },
    { name: 'SF Sourdough Loaf', code: '018900401824' },
    { name: 'Pasture Brown Eggs', code: '049100010204' },
    { name: 'Tuscan Olive Oil', code: '084000104812' }
  ];

  const handleLookup = (code: string) => {
    setIsScanning(true);
    setScanMessage('Scanning barcode optical markers...');
    
    setTimeout(() => {
      const match = PRODUCTS_DATA.find(p => p.barcode === code.trim() || p.id.toLowerCase() === code.trim().toLowerCase());
      if (match) {
        setScannedProduct(match);
        setScanMessage(`Verified SKU: ${match.name}`);
      } else {
        setScannedProduct(null);
        setScanMessage('No grocery item found matching this SKU barcode.');
      }
      setIsScanning(false);
    }, 600);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSimulateLaserScan = (sampleCode: string) => {
    setBarcodeInput(sampleCode);
    handleLookup(sampleCode);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="barcode-scanner-modal"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden my-6 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-600 text-white rounded-xl">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">In-Store Barcode Scanner & SKU Price Checker</h2>
              <p className="text-xs text-slate-300">Scan packaging barcode to instantly verify price, stock, and origin</p>
            </div>
          </div>

          <button
            id="close-scanner-modal-btn"
            type="button"
            aria-label="Close scanner"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Simulated Scanner Viewfinder */}
          <div className="relative bg-slate-950 rounded-xl p-6 text-center overflow-hidden border border-slate-800 shadow-inner">
            {/* Viewfinder corner brackets */}
            <div className="w-64 h-36 mx-auto border-2 border-green-400/60 rounded-xl relative flex flex-col items-center justify-center bg-black/40">
              {/* Animated scanning laser beam */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_8px_#22c55e] animate-pulse" />
              
              <Camera className="w-8 h-8 text-green-400/70 mb-2" />
              <span className="text-[11px] font-mono text-green-300">
                {isScanning ? 'Decoding EAN-13 Barcode...' : 'Align Barcode Inside Box'}
              </span>
            </div>

            {/* Quick Presets / Samples */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Quick Test SKUs:</span>
              {sampleBarcodes.map(sample => (
                <button
                  key={sample.code}
                  id={`sample-barcode-${sample.code}`}
                  onClick={() => handleSimulateLaserScan(sample.code)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-green-950 text-slate-200 hover:text-green-200 rounded-lg text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
                >
                  {sample.name.split(' ')[0]} ({sample.code.slice(-4)})
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (barcodeInput.trim()) handleLookup(barcodeInput.trim());
            }} 
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <ScanLine className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="manual-barcode-input"
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Enter 12-digit barcode or product name..."
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:border-green-600"
              />
            </div>
            <button
              id="lookup-barcode-btn"
              type="submit"
              disabled={isScanning}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Verify</span>
            </button>
          </form>

          {/* Scanned Result Card */}
          {scannedProduct ? (
            <div className="p-4 bg-green-50/60 rounded-xl border border-green-200 animate-scaleUp">
              <div className="flex items-start gap-4">
                <img
                  src={scannedProduct.image}
                  alt={scannedProduct.name}
                  className="w-20 h-20 rounded-lg object-cover border border-green-200 bg-white shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-green-800 uppercase tracking-wider">{scannedProduct.brand}</span>
                    <span className="text-xs font-mono text-slate-500">SKU: {scannedProduct.barcode}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 truncate mt-0.5">{scannedProduct.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <span className="flex items-center gap-1 font-medium text-green-700">
                      <MapPin className="w-3 h-3" /> {scannedProduct.aisle}
                    </span>
                    <span>•</span>
                    <span>{scannedProduct.unit}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-green-200">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-slate-900">${scannedProduct.price.toFixed(2)}</span>
                      {scannedProduct.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">${scannedProduct.originalPrice.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id="scanner-inspect-btn"
                        onClick={() => {
                          onClose();
                          onOpenProductDetail(scannedProduct);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-green-300 text-xs font-semibold text-green-800 bg-white hover:bg-green-50 transition-colors cursor-pointer"
                      >
                        Nutrition & Origin
                      </button>
                      <button
                        id="scanner-add-cart-btn"
                        onClick={() => onAddToCart(scannedProduct)}
                        className="px-3.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Basket</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold">{scanMessage || 'Type or click a sample barcode above to simulate scanning.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
