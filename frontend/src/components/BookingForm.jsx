import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500 transition-colors";

export default function BookingForm({ onSubmit, submitting, error }) {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    vehicleMake: "",
    vehicleModel: "",
    notes: "",
  });

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Full name *</label>
          <input required className={inputClass} value={form.customerName} onChange={update("customerName")} />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Phone *</label>
          <input required className={inputClass} value={form.customerPhone} onChange={update("customerPhone")} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-zinc-400 mb-1">Email</label>
        <input type="email" className={inputClass} value={form.customerEmail} onChange={update("customerEmail")} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Vehicle make</label>
          <input className={inputClass} placeholder="BMW" value={form.vehicleMake} onChange={update("vehicleMake")} />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Vehicle model</label>
          <input className={inputClass} placeholder="320i" value={form.vehicleModel} onChange={update("vehicleModel")} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-zinc-400 mb-1">Notes</label>
        <textarea rows={2} className={inputClass} value={form.notes} onChange={update("notes")} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold py-3 transition-colors"
      >
        {submitting ? "Booking..." : "Confirm booking"}
      </button>
    </form>
  );
}
