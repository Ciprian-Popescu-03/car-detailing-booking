import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

const STATUS_STYLES = {
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  CONFIRMED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  COMPLETED: "bg-green-500/15 text-green-400 border-green-500/30",
  CANCELLED: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  NO_SHOW: "bg-red-500/15 text-red-400 border-red-500/30",
};

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin");
      return;
    }
    loadBookings();
  }, []);

  function loadBookings() {
    client
      .get("/admin/bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin");
        } else {
          setError("Could not load bookings.");
        }
      });
  }

  async function updateStatus(bookingId, status) {
    await client.patch(`/admin/bookings/${bookingId}/status`, { status });
    loadBookings();
  }

  function logout() {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-zinc-900 bg-zinc-900/40">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <span className="text-white font-semibold tracking-wide">ONYX DETAILING · Admin</span>
          <button onClick={logout} className="text-xs text-zinc-500 hover:text-zinc-300">
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Bookings</h1>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!bookings && !error && <p className="text-zinc-500 text-sm">Loading...</p>}
        {bookings && bookings.length === 0 && (
          <p className="text-zinc-500 text-sm">No bookings yet.</p>
        )}

        <div className="space-y-3">
          {bookings?.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
            >
              <div className="sm:w-44 shrink-0">
                <p className="text-white text-sm font-medium">{formatDateTime(b.startTime)}</p>
                <p className="text-zinc-500 text-xs">{b.service.name}</p>
              </div>

              <div className="flex-1">
                <p className="text-zinc-200 text-sm">{b.customerName} · {b.customerPhone}</p>
                {b.vehicleMake && (
                  <p className="text-zinc-500 text-xs">{b.vehicleMake} {b.vehicleModel}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLES[b.status]}`}>
                  {b.status}
                </span>
                <select
                  value={b.status}
                  onChange={(e) => updateStatus(b.id, e.target.value)}
                  className="text-xs bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-zinc-300 outline-none focus:border-red-500"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
