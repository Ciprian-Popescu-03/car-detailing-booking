function formatDateInput(date) {
  return date.toISOString().slice(0, 10);
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DateStrip({ selectedDate, onSelect, daysAhead = 14 }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: daysAhead }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      {days.map((d) => {
        const iso = formatDateInput(d);
        const isSelected = iso === selectedDate;
        return (
          <button
            key={iso}
            onClick={() => onSelect(iso)}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-18 rounded-lg border px-2 py-2 transition-colors ${
              isSelected
                ? "border-red-500 bg-red-500/10 text-white"
                : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
            }`}
          >
            <span className="text-[11px] uppercase tracking-wide">{WEEKDAY[d.getDay()]}</span>
            <span className="text-lg font-semibold">{d.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}
