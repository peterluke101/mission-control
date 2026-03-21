'use client';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Simple mock events
const MOCK_EVENTS: Record<number, { label: string; color: string }[]> = {
  3: [{ label: 'Sprint planning', color: '#00d4ff' }],
  8: [{ label: 'Design review', color: '#ffaa00' }],
  12: [{ label: 'QA kickoff', color: '#00ff88' }],
  15: [{ label: 'Team sync', color: '#00d4ff' }],
  18: [{ label: 'Mission Control build', color: '#ff44aa' }],
  22: [{ label: 'Launch prep', color: '#ffaa00' }],
  25: [{ label: 'Retrospective', color: '#00ff88' }],
};

export function CalendarGrid() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Build grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: '#e8eaf0' }}>{monthName}</h2>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium py-1" style={{ color: '#8b92a8' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 gap-px" style={{ backgroundColor: '#1e2030' }}>
        {cells.map((day, i) => {
          const isToday = day === todayDate;
          const events = day ? MOCK_EVENTS[day] : [];

          return (
            <div
              key={i}
              className="flex flex-col p-1.5 min-h-[70px] transition-colors duration-150"
              style={{
                backgroundColor: day ? '#13151c' : '#0d0e14',
              }}
              onMouseEnter={(e) => day && (e.currentTarget.style.backgroundColor = '#161820')}
              onMouseLeave={(e) => day && (e.currentTarget.style.backgroundColor = '#13151c')}
            >
              {day && (
                <>
                  <span
                    className="text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium self-start mb-1"
                    style={
                      isToday
                        ? { backgroundColor: '#00d4ff', color: '#0a0b0f', boxShadow: '0 0 8px rgba(0,212,255,0.5)' }
                        : { color: '#8b92a8' }
                    }
                  >
                    {day}
                  </span>
                  <div className="space-y-0.5">
                    {(events || []).map((ev, ei) => (
                      <div
                        key={ei}
                        className="text-[10px] px-1 py-0.5 rounded truncate"
                        style={{ backgroundColor: `${ev.color}20`, color: ev.color }}
                      >
                        {ev.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
