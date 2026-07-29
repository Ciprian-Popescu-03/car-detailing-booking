export default function ServiceCard({ service, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(service)}
      className={`text-left rounded-xl border p-5 transition-all duration-150 ${
        selected
          ? "border-red-500 bg-neutral-900 ring-1 ring-red-500/50"
          : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-600 hover:bg-neutral-900"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-wider text-red-400 font-medium">
          {service.category}
        </span>
        <span className="text-xs text-neutral-500">{service.durationMinutes} min</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-white">{service.name}</h3>
      <p className="mt-1 text-sm text-neutral-400 leading-relaxed">{service.description}</p>
      <div className="mt-4 text-xl font-bold text-white">
        {Number(service.price).toFixed(0)} <span className="text-sm font-normal text-neutral-500">RON</span>
      </div>
    </button>
  );
}
