'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Briefcase,
  FolderKanban,
  FileText,
  Bot,
} from 'lucide-react';

const tabs = [
  { href: '/dashboard', label: 'HQ', icon: LayoutDashboard },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/documents', label: 'Docs', icon: FileText },
  { href: '/agents', label: 'Agents', icon: Bot },
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
            className="flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] py-2 px-1 transition-colors"
            style={{
              color: isActive ? '#00d4ff' : '#4a4f65',
              textShadow: isActive ? '0 0 8px rgba(0,212,255,0.4)' : 'none',
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
