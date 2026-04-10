'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  DollarSign,
  Users,
  Zap,
  ScrollText,
} from 'lucide-react';

const tabs = [
  { href: '/pete', label: 'Pete', icon: Zap },
  { href: '/dashboard', label: 'HQ', icon: LayoutDashboard },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/work', label: 'Work', icon: ClipboardList },
  { href: '/documents', label: 'Docs', icon: FileText },
  { href: '/logs', label: 'Logs', icon: ScrollText },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around md:hidden"
      style={{
        backgroundColor: 'rgba(10, 11, 15, 0.97)',
        borderTop: '1px solid #1e2030',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] py-2 px-1 transition-colors active:opacity-70"
            style={{
              color: isActive ? '#3DE8C3' : '#4a4f65',
              textShadow: isActive ? '0 0 8px rgba(61,232,195,0.4)' : 'none',
              touchAction: 'manipulation',
            }}
          >
            <Icon size={20} />
            <span className="text-[9px] font-mono font-semibold tracking-wide uppercase">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
