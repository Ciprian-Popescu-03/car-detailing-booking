function formatTime(isoDateTime) {
  const d = new Date(isoDateTime);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function SlotGrid({ slots, selectedSlot, onSelect, loading }) {
  if (loading) {
    return <p className="text-neutral-500 text-sm">Loading available times...</p>;
  }

  if (slots.length === 0) {
    return (
      <p className="text-neutral-500 text-sm">
        No open slots this day - try another date.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {slots.map((slot) => {
        const isSelected = selectedSlot?.startTime === slot.startTime;
        return (
          <button
            key={slot.startTime}
            onClick={() => onSelect(slot)}
            className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
              isSelected
                ? "border-red-500 bg-red-500 text-white"
                : "border-neutral-800 text-neutral-300 hover:border-neutral-600"
            }`}
          >
            {formatTime(slot.startTime)}
          </button>
        );
      })}
    </div>
  );
}
