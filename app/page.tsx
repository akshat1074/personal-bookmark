import Link from "next/link";
import {
  BookmarkSimple,
  ArrowRight,
  LinkedinLogo,
  GithubLogo,
  Globe,
  Command,
  Lightning,
  Layout,
  ShieldCheck
} from "@phosphor-icons/react/dist/ssr";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0B] text-white selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white text-black p-1.5 rounded-lg">
            <BookmarkSimple size={20} weight="bold" />
          </div>
          <span className="font-outfit font-bold text-xl tracking-tight">Bookmarks</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-zinc-200 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-400 mb-8 animate-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Next Generation Tool for Links
        </div>

        <h1 className="font-outfit text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl animate-in [animation-delay:100ms]">
          The only link manager <br />
          <span className="text-zinc-500">you&apos;ll ever need.</span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-12 animate-in [animation-delay:200ms]">
          Fast, simple, and beautifully designed. Save, organize, and share your favorite links with an experience inspired by Linear and Raycast.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in [animation-delay:300ms]">
          <Link
            href="/signup"
            className="h-12 px-8 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all group"
          >
            Start for free
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/akshat"
            className="h-12 px-8 glass-dark rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10"
          >
            View Demo
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full animate-in [animation-delay:400ms]">
          <div className="glass-dark border border-white/5 p-8 rounded-3xl text-left hover:border-white/10 transition-all group">
            <div className="bg-zinc-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-colors">
              <Lightning size={24} weight="fill" />
            </div>
            <h3 className="font-outfit text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Keyboard first navigation. Everything happens in real-time. No loading spinners, just speed.
            </p>
          </div>

          <div className="glass-dark border border-white/5 p-8 rounded-3xl text-left hover:border-white/10 transition-all group">
            <div className="bg-zinc-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-colors">
              <Layout size={24} weight="fill" />
            </div>
            <h3 className="font-outfit text-xl font-bold mb-3">Stunning UI</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Glassmorphism and soft shadows. A clean UI that feels at home on any modern browser.
            </p>
          </div>

          <div className="glass-dark border border-white/5 p-8 rounded-3xl text-left hover:border-white/10 transition-all group">
            <div className="bg-zinc-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-colors">
              <ShieldCheck size={24} weight="fill" />
            </div>
            <h3 className="font-outfit text-xl font-bold mb-3">Privacy First</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Your data is yours. Public or private, you decide which links are shared with the world.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 opacity-50">
          <BookmarkSimple size={18} weight="bold" />
          <span className="font-outfit font-bold text-sm">Bookmarks</span>
          <span className="text-xs text-zinc-600 ml-4">© 2026 Bookmarks Inc.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="https://github.com" className="text-zinc-500 hover:text-white transition-colors">
            <GithubLogo size={20} />
          </Link>
          <Link href="https://twitter.com" className="text-zinc-500 hover:text-white transition-colors">
            <Globe size={20} />
          </Link>
          <Link href="https://linkedin.com" className="text-zinc-500 hover:text-white transition-colors">
            <LinkedinLogo size={20} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
