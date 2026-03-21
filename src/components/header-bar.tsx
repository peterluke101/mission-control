'use client';

import { useEffect, useState } from 'react';
import { Zap, Radio } from 'lucide-react';

export function HeaderBar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDate(
        now.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).toUpperCase()
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 md:px-5 h-11"
      style={{
        backgroundColor: 'rgba(10, 11, 15, 0.96)',
        borderBottom: '1px solid #1e2030',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      {/* Left: Mission name */}
      <div className="flex items-center gap-2">
        <Zap size={14} style={{ color: '#00d4ff' }} />
        <span
          className="text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase"
          style={{ color: '#00d4ff', textShadow: '0 0 8px rgba(0,212,255,0.5)' }}
        >
          MC
          <span className="hidden md:inline"> — Mission Control</span>
        </span>
        <span
          className="text-[10px] font-mono tracking-widest ml-1 hidden md:inline"
          style={{ color: '#2a2d42', fontWeight: 600 }}
        >
          v2.0
        </span>
      </div>

      {/* Center: Status pill — hidden on mobile */}
      <div
        className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full"
        style={{
          backgroundColor: 'rgba(0, 255, 136, 0.06)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
        }}
      >
        <Radio size={10} style={{ color: '#00ff88' }} />
        <span
          className="text-[10px] font-mono font-semibold tracking-[0.15em] uppercase"
          style={{ color: '#00ff88', textShadow: '0 0 6px rgba(0,255,136,0.5)' }}
        >
          All Systems Operational
        </span>
      </div>

      {/* Mobile: small green dot indicator */}
      <div className="md:hidden flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full status-dot-active"
          style={{ backgroundColor: '#00ff88' }}
        />
        <span className="text-[9px] font-mono font-semibold uppercase" style={{ color: '#00ff88' }}>
          OK
        </span>
      </div>

      {/* Right: System clock */}
      <div className="flex items-center gap-2 md:gap-3">
        <span className="system-clock hidden md:inline" style={{ color: '#4a4f65' }}>{date}</span>
        <span
          className="system-clock font-semibold tabular-nums text-[10px] md:text-xs"
          style={{ color: '#8b92a8', minWidth: '3.5rem', textAlign: 'right' }}
        >
          {time}
        </span>
      </div>
    </header>
  );
}
