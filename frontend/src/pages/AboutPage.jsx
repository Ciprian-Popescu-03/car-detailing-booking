import Header from "../components/Header";
import Footer from "../components/Footer";

const STATS = [
  { value: "1,200+", label: "Cars detailed" },
  { value: "4.9 / 5", label: "Average rating" },
  { value: "6 yrs", label: "In business" },
  { value: "3", label: "Certified detailers" },
];

const VALUES = [
  {
    title: "Attention to detail",
    body: "Every panel, seam, and vent gets checked before a car leaves the bay — not just the parts you'll notice first.",
  },
  {
    title: "Premium products only",
    body: "Professional-grade wax, ceramic coatings, and interior treatments, never the cheapest option on the shelf.",
  },
  {
    title: "Transparent pricing",
    body: "The price you see when you book is the price you pay. No surprise add-ons at pickup.",
  },
  {
    title: "Built around your schedule",
    body: "Book online in under a minute, pick a slot that fits your day, and get in and out without a phone call.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pb-24">
        <section className="pt-14 pb-10">
          <p className="text-red-500 text-xs uppercase tracking-[0.2em] font-semibold">About us</p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Detailing done <span className="text-red-500">properly</span>.
          </h1>
          <p className="mt-4 text-zinc-400 max-w-lg leading-relaxed">
            Onyx Detailing started as a two-person operation with a pressure washer and a
            reputation to build. Today we run a full-service detailing bay in Cluj-Napoca,
            still with the same rule: we don't hand back a car we wouldn't be happy to drive
            ourselves.
          </p>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center"
            >
              <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
              <div className="mt-1 text-xs text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold text-white mb-4">What we stand for</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
              >
                <div className="w-8 h-1 bg-red-600 rounded-full" />
                <h3 className="mt-3 text-white font-semibold">{value.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{value.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/40 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">Ready to see the difference?</h2>
          <p className="mt-2 text-sm text-zinc-400">Book a slot online — takes under a minute.</p>
          <a
            href="/"
            className="mt-5 inline-block rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-6 py-2.5 transition-colors"
          >
            Book now
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
