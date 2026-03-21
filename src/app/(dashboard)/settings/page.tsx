'use client';

import { useState } from 'react';

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between py-4 px-4 rounded-lg"
      style={{ backgroundColor: '#13151c', border: '1px solid #1e2030' }}
    >
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium" style={{ color: '#e8eaf0' }}>{label}</p>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className="relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0"
      style={{ backgroundColor: on ? 'rgba(0,212,255,0.3)' : '#1e2030', border: `1px solid ${on ? '#00d4ff' : '#2a2d42'}` }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
        style={{
          left: on ? 'calc(100% - 18px)' : '2px',
          backgroundColor: on ? '#00d4ff' : '#4a4f65',
          boxShadow: on ? '0 0 6px rgba(0,212,255,0.6)' : 'none',
        }}
      />
    </button>
  );
}

function Select({ options, defaultValue }: { options: string[]; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="text-xs px-2.5 py-1.5 rounded-md outline-none cursor-pointer"
      style={{
        backgroundColor: '#1e2030',
        color: '#e8eaf0',
        border: '1px solid #2a2d42',
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <h1 className="text-lg font-semibold" style={{ color: '#e8eaf0' }}>Settings</h1>
        <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>Configure your Mission Control</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5">
        <div className="space-y-6 max-w-2xl">

          {/* Appearance */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#00d4ff' }}>
              Appearance
            </h2>
            <div className="space-y-2">
              <SettingRow label="Dark Mode" description="Command center aesthetic">
                <Toggle defaultOn />
              </SettingRow>
              <SettingRow label="Accent Color" description="Primary highlight color">
                <div className="flex items-center gap-2">
                  {['#00d4ff', '#00ff88', '#ffaa00', '#ff44aa', '#8b5cf6'].map((c) => (
                    <button
                      key={c}
                      className="w-5 h-5 rounded-full transition-transform hover:scale-110"
                      style={{ backgroundColor: c, boxShadow: c === '#00d4ff' ? `0 0 8px ${c}` : 'none' }}
                    />
                  ))}
                </div>
              </SettingRow>
              <SettingRow label="Sidebar" description="Default state on load">
                <Select options={['Expanded', 'Collapsed']} defaultValue="Expanded" />
              </SettingRow>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#ffaa00' }}>
              Notifications
            </h2>
            <div className="space-y-2">
              <SettingRow label="Agent Activity Alerts" description="Notify when agent status changes">
                <Toggle defaultOn />
              </SettingRow>
              <SettingRow label="Task Updates" description="Notify on task status changes">
                <Toggle defaultOn />
              </SettingRow>
              <SettingRow label="Project Milestones" description="Notify on progress thresholds">
                <Toggle />
              </SettingRow>
              <SettingRow label="Daily Digest" description="Morning summary email">
                <Toggle />
              </SettingRow>
            </div>
          </section>

          {/* Agent Defaults */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#00ff88' }}>
              Agent Defaults
            </h2>
            <div className="space-y-2">
              <SettingRow label="Default Model" description="LLM used for new agent tasks">
                <Select options={['claude-sonnet-4', 'claude-opus-4', 'gpt-4o', 'gemini-2.0']} defaultValue="claude-sonnet-4" />
              </SettingRow>
              <SettingRow label="Auto-assign Tasks" description="Automatically assign tasks to available agents">
                <Toggle />
              </SettingRow>
              <SettingRow label="Parallel Execution" description="Allow concurrent agent tasks">
                <Toggle defaultOn />
              </SettingRow>
              <SettingRow label="Max Concurrent Agents" description="Limit parallel agent sessions">
                <Select options={['1', '2', '3', '5', '10', 'Unlimited']} defaultValue="5" />
              </SettingRow>
            </div>
          </section>

          {/* System */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#8b92a8' }}>
              System
            </h2>
            <div className="space-y-2">
              <SettingRow label="Persist State to localStorage" description="Save UI state across sessions">
                <Toggle defaultOn />
              </SettingRow>
              <SettingRow label="Telemetry" description="Anonymous usage data to improve the system">
                <Toggle />
              </SettingRow>
            </div>
          </section>

          {/* Save button */}
          <div className="pt-2 pb-8">
            <button
              className="px-4 md:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-lg"
              style={{
                backgroundColor: 'rgba(0,212,255,0.15)',
                color: '#00d4ff',
                border: '1px solid rgba(0,212,255,0.4)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
