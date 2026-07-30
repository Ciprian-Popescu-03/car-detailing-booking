import Header from "../components/Header";
import Footer from "../components/Footer";

const SHOWCASE = [
  {
    title: "Exterior Wash",
    tag: "Before → After",
    gradient: "from-sky-500/25 via-zinc-900 to-zinc-900",
    note: "Two-bucket hand wash, decontamination, tire shine.",
  },
  {
    title: "Interior Detail",
    tag: "Before → After",
    gradient: "from-amber-500/20 via-zinc-900 to-zinc-900",
    note: "Deep vacuum, upholstery clean, dash & console detail.",
  },
  {
    title: "Full Detail",
    tag: "Before → After",
    gradient: "from-red-600/25 via-zinc-900 to-zinc-900",
    note: "The complete package — exterior and interior in one visit.",
  },
  {
    title: "Paint Correction",
    tag: "Before → After",
    gradient: "from-fuchsia-500/20 via-zinc-900 to-zinc-900",
    note: "Machine polish removes swirl marks and light scratches.",
  },
  {
    title: "Ceramic Coating",
    tag: "Before → After",
    gradient: "from-cyan-500/25 via-zinc-900 to-zinc-900",
    note: "Long-term paint protection with a durable glossy layer.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Booked online in the evening, dropped the car off next morning, looked brand new by lunch.",
    author: "Andrei M.",
  },
  {
    quote: "Paint correction took out scratches I thought were permanent. Worth every leu.",
    author: "Ioana R.",
  },
  {
    quote: "No more waiting on hold to book — I just picked a slot on my phone. Simple.",
    author: "Vlad T.",
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pb-24">
        <section className="pt-14 pb-10">
          <p className="text-red-500 text-xs uppercase tracking-[0.2em] font-semibold">Our work</p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold text-white tracking-tight">
            See the <span className="text-red-500">transformation</span>.
          </h1>
          <p className="mt-4 text-zinc-400 max-w-lg leading-relaxed">
            A look at what each service covers. Real before/after photos from recent jobs go
            here as they come in — this preview shows what to expect from every tier.
          </p>
        </section>

        <section className="grid sm:grid-cols-2 gap-4">
          {SHOWCASE.map((item) => (
            <div
              key={item.title}
              className={`rounded-xl border border-zinc-800 bg-gradient-to-br ${item.gradient} p-6 h-40 flex flex-col justify-between`}
            >
              <span className="text-xs uppercase tracking-wider text-zinc-300/80 font-medium">
                {item.tag}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-300/80 leading-relaxed">{item.note}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold text-white mb-4">What clients say</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 flex flex-col justify-between"
              >
                <p className="text-sm text-zinc-300 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-xs text-zinc-500">— {t.author}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/40 p-8 text-center">
          <h2 className="text-xl font-semibold text-white">Want results like these?</h2>
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
