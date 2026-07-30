import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-900 bg-black/80 backdrop-blur">
      <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold text-white">O</div>
          <span className="text-white font-semibold tracking-wide">ONYX DETAILING</span>
        </NavLink>
        <nav className="flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `hidden sm:inline text-xs transition-colors ${
                  isActive ? "text-white font-medium" : "text-zinc-500 hover:text-zinc-300"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a href="/admin" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Staff login
          </a>
        </nav>
      </div>
    </header>
  );
}
