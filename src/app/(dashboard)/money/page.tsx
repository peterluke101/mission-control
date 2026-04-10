'use client';

import { useState } from 'react';
import { CalendarGrid } from '@/components/calendar-grid';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  RefreshCw,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { useEffect } from 'react';

type MoneyView = 'revenue' | 'calendar';

interface GumroadUser {
  name: string;
  email: string;
  url: string;
  currency_type: string;
}

interface GumroadProduct {
  id: string;
  name: string;
  price: number;
  formatted_price: string;
  sales_count: number;
  sales_usd_cents: number;
  published: boolean;
  short_url: string;
  description: string;
  created_at: string;
}

interface GumroadSale {
  id: string;
  product_name: string;
  price: number;
  created_at: string;
  email: string;
  full_name: string;
  refunded: boolean;
  disputed: boolean;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = '#3DE8C3',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div
      className="rounded-lg p-5 flex flex-col gap-3"
      style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase" style={{ color: '#4a4f65' }}>
          {label}
        </span>
        <Icon size={14} style={{ color }} />
      </div>
      <div className="text-2xl font-bold tracking-tight" style={{ color }}>
        {value}
      </div>
      {sub && (
        <div className="text-[11px]" style={{ color: '#4a4f65' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function MoneyPage() {
  const [view, setView] = useState<MoneyView>('revenue');
  const [user, setUser] = useState<GumroadUser | null>(null);
  const [products, setProducts] = useState<GumroadProduct[]>([]);
  const [sales, setSales] = useState<GumroadSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [uRes, pRes, sRes] = await Promise.all([
        fetch('/api/gumroad?endpoint=user'),
        fetch('/api/gumroad?endpoint=products'),
        fetch('/api/gumroad?endpoint=sales'),
      ]);
      const [uData, pData, sData] = await Promise.all([uRes.json(), pRes.json(), sRes.json()]);

      if (uData.success) setUser(uData.user);
      if (pData.success) setProducts(pData.products || []);
      if (sData.success) setSales(sData.sales || []);
      setLastRefresh(new Date());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const totalRevenueCents = products.reduce((acc, p) => acc + (p.sales_usd_cents || 0), 0);
  const totalSalesCount = products.reduce((acc, p) => acc + (p.sales_count || 0), 0);
  const publishedCount = products.filter((p) => p.published).length;
  const recentSales = sales.slice(0, 20);

  const formatUSD = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#e8eaf0' }}>Money</h1>
          <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>
            Revenue &amp; schedule
          </p>
        </div>
        {view === 'revenue' && (
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-medium transition-all active:scale-95"
            style={{
              backgroundColor: 'rgba(61,232,195,0.08)',
              border: '1px solid rgba(61,232,195,0.2)',
              color: '#3DE8C3',
              touchAction: 'manipulation',
              minHeight: '44px',
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        )}
      </div>

      {/* View Toggle */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-2 flex gap-1"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        {(['revenue', 'calendar'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200"
            style={{
              minHeight: '44px',
              touchAction: 'manipulation',
              backgroundColor: view === v ? 'rgba(61,232,195,0.12)' : 'transparent',
              color: view === v ? '#3DE8C3' : '#4a4f65',
              border: view === v ? '1px solid rgba(61,232,195,0.3)' : '1px solid transparent',
              textShadow: view === v ? '0 0 8px rgba(61,232,195,0.4)' : 'none',
            }}
          >
            {v === 'revenue' ? 'Revenue' : 'Calendar'}
          </button>
        ))}
      </div>

      {/* Content */}
      {view === 'revenue' ? (
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          {/* Subtitle */}
          <p className="text-[11px] font-mono" style={{ color: '#4a4f65' }}>
            Gumroad · {user?.email || '—'} · Last refresh {lastRefresh.toLocaleTimeString()}
          </p>

          {error && (
            <div
              className="flex items-center gap-3 p-4 rounded-lg"
              style={{ backgroundColor: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.2)' }}
            >
              <AlertCircle size={16} style={{ color: '#ff3c3c' }} />
              <span className="text-sm" style={{ color: '#ff3c3c' }}>{error}</span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={DollarSign} label="Total Revenue" value={loading ? '—' : formatUSD(totalRevenueCents)} sub="All-time Gumroad earnings" color="#00e5a0" />
            <StatCard icon={ShoppingBag} label="Total Sales" value={loading ? '—' : totalSalesCount.toString()} sub="Units sold across all products" color="#3DE8C3" />
            <StatCard icon={Package} label="Products" value={loading ? '—' : products.length.toString()} sub={`${publishedCount} published`} color="#f0b429" />
            <StatCard icon={TrendingUp} label="Avg Sale" value={loading || totalSalesCount === 0 ? '—' : formatUSD(totalRevenueCents / totalSalesCount)} sub="Revenue per unit" color="#a78bfa" />
          </div>

          {/* Products */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #1e2030', backgroundColor: '#0d0e14' }}>
            <div className="px-5 py-3 md:py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2030' }}>
              <span className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase" style={{ color: '#4a4f65' }}>Products</span>
              <span className="text-[11px] font-mono" style={{ color: '#2a2d42' }}>{products.length} total</span>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm" style={{ color: '#4a4f65' }}>Loading...</div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Package size={32} className="mx-auto opacity-20" style={{ color: '#4a4f65' }} />
                <p className="text-sm" style={{ color: '#4a4f65' }}>No products yet</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#1e2030' }}>
                {products.map((p) => (
                  <div key={p.id} className="px-5 py-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: '#c4c9d9' }}>{p.name}</span>
                        <span
                          className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase"
                          style={
                            p.published
                              ? { backgroundColor: 'rgba(0,229,160,0.1)', color: '#00e5a0', border: '1px solid rgba(0,229,160,0.2)' }
                              : { backgroundColor: 'rgba(255,170,0,0.1)', color: '#ffaa00', border: '1px solid rgba(255,170,0,0.2)' }
                          }
                        >
                          {p.published ? 'Live' : 'Draft'}
                        </span>
                      </div>
                      <div className="text-[11px]" style={{ color: '#4a4f65' }}>
                        {p.sales_count} sales · {formatUSD(p.sales_usd_cents)} earned
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-bold" style={{ color: '#00e5a0' }}>{p.formatted_price}</span>
                      {p.short_url && (
                        <a href={p.short_url} target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity" style={{ color: '#3DE8C3' }}>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Sales */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #1e2030', backgroundColor: '#0d0e14' }}>
            <div className="px-5 py-3 md:py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2030' }}>
              <span className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase" style={{ color: '#4a4f65' }}>Recent Sales</span>
              <span className="text-[11px] font-mono" style={{ color: '#2a2d42' }}>Last 20</span>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm" style={{ color: '#4a4f65' }}>Loading...</div>
            ) : recentSales.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <ShoppingBag size={32} className="mx-auto opacity-20" style={{ color: '#4a4f65' }} />
                <p className="text-sm" style={{ color: '#4a4f65' }}>No sales yet</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#1e2030' }}>
                {recentSales.map((s) => (
                  <div key={s.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm" style={{ color: '#c4c9d9' }}>{s.full_name || s.email || 'Anonymous'}</div>
                      <div className="text-[11px]" style={{ color: '#4a4f65' }}>{s.product_name} · {new Date(s.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {s.refunded && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase" style={{ backgroundColor: 'rgba(255,60,60,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,60,60,0.2)' }}>
                          Refunded
                        </span>
                      )}
                      <span className="text-sm font-bold" style={{ color: '#00e5a0' }}>{formatUSD(s.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden px-4 md:px-6 py-4 md:py-5">
          <CalendarGrid />
        </div>
      )}
    </div>
  );
}
