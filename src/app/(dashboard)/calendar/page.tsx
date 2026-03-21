import { CalendarGrid } from '@/components/calendar-grid';

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#e8eaf0' }}>Calendar</h1>
          <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>Schedule & events</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 md:px-6 py-4 md:py-5">
        <CalendarGrid />
      </div>
    </div>
  );
}
