'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  FileText,
  Settings,
  LayoutDashboard,
  DollarSign,
  Zap,
  ClipboardList,
  ScrollText,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { approvals } = useAppStore();
  const pendingCount = approvals.filter((a) => a.status === 'PENDING').length;

  const navItems = [
    { href: '/pete', label: 'Pete', icon: Zap, shortcode: 'CMD', badge: pendingCount > 0 ? pendingCount : null },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcode: 'HQ', badge: null },
    { href: '/team', label: 'Team', icon: Users, shortcode: 'TMR', badge: null },
    { href: '/work', label: 'Work', icon: ClipboardList, shortcode: 'WRK', badge: null },
    { href: '/documents', label: 'Documents', icon: FileText, shortcode: 'DOC', badge: null },
    { href: '/logs', label: 'Logs', icon: ScrollText, shortcode: 'LOG', badge: null },
    { href: '/money', label: 'Money', icon: DollarSign, shortcode: 'MON', badge: null },
    { href: '/settings', label: 'Settings', icon: Settings, shortcode: 'SYS', badge: null },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-11 z-30 flex h-[calc(100%-44px)] flex-col',
        'hidden md:flex'
      )}
      style={{
        width: '240px',
        backgroundColor: '#0d0e14',
        borderRight: '1px solid #1e2030',
      }}
    >
      {/* Section label */}
      <div className="px-4 pt-5 pb-2">
        <span
          className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase"
          style={{ color: '#2a2d42' }}
        >
          Navigation
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, shortcode, badge }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 relative overflow-hidden',
                isActive
                  ? 'text-[#3DE8C3]'
                  : 'text-[#8b92a8] hover:text-[#c4c9d9] hover:bg-white/[0.03]'
              )}
              style={
                isActive
                  ? {
                      backgroundColor: 'rgba(61,232,195,0.06)',
                      boxShadow: '0 0 20px rgba(61,232,195,0.1), inset 0 0 20px rgba(61,232,195,0.03), -2px 0 0 0 #3DE8C3',
                      border: '1px solid rgba(61,232,195,0.15)',
                      textShadow: '0 0 8px rgba(61,232,195,0.4)',
                    }
                  : { border: '1px solid transparent' }
              }
            >
              <Icon size={15} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge !== null && badge !== undefined && (
                <span
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  style={{
                    backgroundColor: 'rgba(255,170,0,0.18)',
                    color: '#ffaa00',
                    border: '1px solid rgba(255,170,0,0.3)',
                  }}
                >
                  {badge}
                </span>
              )}
              {isActive && badge === null && (
                <span
                  className="text-[9px] font-mono tracking-widest opacity-50"
                  style={{ color: '#3DE8C3' }}
                >
                  {shortcode}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: '#1e2030', margin: '0 16px' }} />

      {/* Footer */}
      <div className="px-4 py-4 space-y-3">
        {/* Operational status */}
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full status-dot-active flex-shrink-0"
            style={{ backgroundColor: '#00ff88' }}
          />
          <span className="text-[11px]" style={{ color: '#4a4f65' }}>
            Systems nominal
          </span>
        </div>

        {/* Version badge */}
        <div
          className="flex items-center justify-between px-2.5 py-1.5 rounded-md"
          style={{ backgroundColor: '#0a0b0f', border: '1px solid #1e2030' }}
        >
          <span
            className="text-[9px] font-mono font-bold tracking-[0.18em] uppercase"
            style={{ color: '#2a2d42' }}
          >
            Mission Control
          </span>
          <span
            className="text-[9px] font-mono font-bold"
            style={{ color: '#3DE8C3', opacity: 0.6 }}
          >
            v3.0
          </span>
        </div>
      </div>
    </aside>
  );
}
