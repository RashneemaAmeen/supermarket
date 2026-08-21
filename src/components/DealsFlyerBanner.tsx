import React, { useState } from 'react';
import { 
  Tag, 
  Sparkles, 
  Scissors, 
  Check, 
  Flame, 
  Clock, 
  Percent, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Coupon } from '../types';

interface DealsFlyerBannerProps {
  coupons: Coupon[];
  onToggleClipCoupon: (couponId: string) => void;
  onFilterDeals: () => void;
}

export const DealsFlyerBanner: React.FC<DealsFlyerBannerProps> = ({
  coupons,
  onToggleClipCoupon,
  onFilterDeals
}) => {
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const clippedCount = coupons.filter(c => c.isClipped).length;

  return (
    <section id="weekly-circular-section" className="my-6">
      {/* Visual Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-md p-6 sm:p-8 border border-slate-800">
        {/* Subtle accent glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-green-400" />
              <span>Weekly Supermarket Circular & Savings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              Clip Digital Coupons & Save on Fresh Daily Essentials
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Clip these coupons to automatically deduct at checkout. Exclusive farm deals updated every Wednesday!
            </p>
          </div>

          {/* Quick CTA Stats */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 px-4 py-3 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 font-medium block">Clipped to Your Card</span>
              <span className="text-lg font-bold text-green-400">{clippedCount} of {coupons.length} Active</span>
            </div>
            <button
              id="filter-sale-items-btn"
              onClick={onFilterDeals}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>View All On-Sale Groceries</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Coupons Row */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map((coupon) => {
            return (
              <div
                key={coupon.id}
                id={`coupon-card-${coupon.id}`}
                className={`rounded-xl p-4 transition-all duration-200 relative flex flex-col justify-between border ${
                  coupon.isClipped
                    ? 'bg-slate-800 border-green-500 shadow-xs ring-1 ring-green-500/50'
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="bg-slate-700 text-slate-200 font-semibold px-2 py-0.5 rounded">
                      {coupon.badge}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-green-400" /> {coupon.expires}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{coupon.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{coupon.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Code: <strong className="text-green-400">{coupon.code}</strong>
                  </div>

                  <button
                    id={`clip-coupon-btn-${coupon.id}`}
                    onClick={() => onToggleClipCoupon(coupon.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      coupon.isClipped
                        ? 'bg-green-600 text-white shadow-xs'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {coupon.isClipped ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Clipped</span>
                      </>
                    ) : (
                      <>
                        <Scissors className="w-3.5 h-3.5" />
                        <span>Clip Coupon</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
