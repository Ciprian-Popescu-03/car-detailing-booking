export default function Footer() {
  return (
    <footer id="contact" className="border-t border-zinc-900 bg-zinc-900/20 mt-20">
      <div className="max-w-3xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center font-bold text-white text-sm">
              O
            </div>
            <span className="text-white font-semibold tracking-wide text-sm">ONYX DETAILING</span>
          </div>
          <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
            Premium hand car care. Wash, interior detail, paint correction and ceramic coating.
          </p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Visit us</h3>
          <address className="mt-3 text-sm text-zinc-400 not-italic leading-relaxed space-y-1">
            <p>Str. Fabricii 12</p>
            <p>Cluj-Napoca, Romania</p>
            <p className="pt-2">
              <a href="tel:+40712345678" className="hover:text-red-400 transition-colors">
                +40 712 345 678
              </a>
            </p>
            <p>
              <a href="mailto:contact@onyxdetailing.ro" className="hover:text-red-400 transition-colors">
                contact@onyxdetailing.ro
              </a>
            </p>
          </address>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Hours</h3>
          <dl className="mt-3 text-sm text-zinc-400 space-y-1">
            <div className="flex justify-between gap-4">
              <dt>Mon – Fri</dt>
              <dd>09:00 – 18:00</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Saturday</dt>
              <dd>10:00 – 16:00</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Sunday</dt>
              <dd className="text-zinc-600">Closed</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-zinc-900 py-5">
        <p className="text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Onyx Detailing. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
