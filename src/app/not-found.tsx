import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
      <h1
        className="text-7xl md:text-[12rem] leading-[0.8] font-black tracking-tighter text-tbsm-red font-oswald glitch mix-blend-difference mb-8"
        data-text="404"
      >
        404
      </h1>
      <p className="text-zinc-500 text-lg font-mono uppercase tracking-[0.5em] text-center mb-12">
        Track Not Found
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-full font-oswald uppercase tracking-widest hover:bg-tbsm-red hover:text-black hover:border-tbsm-red transition-all duration-300 text-center"
      >
        Back to Archive
      </Link>
    </main>
  );
}
