'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import SocialDownloader from '@/components/tools/SocialDownloader';
import { LangSwitcher } from '@/components/ui/lang-switcher';
import { TRANSLATIONS, type Lang } from '@/lib/i18n';

const WHOBEE_SCENE = 'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';
const BG = '#020202';

/* Spline — client-only */
const InteractiveRobotSpline = dynamic(
  () =>
    import('@/components/ui/interactive-3d-robot').then((m) => ({
      default: m.InteractiveRobotSpline,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full border-t border-violet-500/50 animate-spin" />
        </div>
      </div>
    ),
  }
);

/* ── Platform config ────────────────────────────────────────────────── */

type Platform = 'reels' | 'tiktok';

const PLATFORMS = {
  reels: {
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    activePill: 'from-violet-600 to-fuchsia-600',
    glowColor: 'rgba(124,58,237,0.18)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  tiktok: {
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    activePill: 'from-cyan-600 to-blue-600',
    glowColor: 'rgba(6,182,212,0.16)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
} as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ── Robot scene helper ─────────────────────────────────────────────── */

function RobotScene({ glowColor }: { glowColor: string }) {
  return (
    <div className="relative w-full h-full">
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 65%, ${glowColor}, transparent)`,
        }}
      />
      <InteractiveRobotSpline scene={WHOBEE_SCENE} className="w-full h-full" />
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default function Home() {
  const [platform, setPlatform] = useState<Platform>('reels');
  const [lang, setLang] = useState<Lang>('es');

  /* Persist language preference */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('galodev-lang') as Lang | null;
      if (saved && ['es', 'en', 'pt'].includes(saved)) setLang(saved);
    } catch {
      /* localStorage not available */
    }
  }, []);

  const handleLangChange = (next: Lang) => {
    setLang(next);
    try { localStorage.setItem('galodev-lang', next); } catch { /* noop */ }
  };

  const pConfig = PLATFORMS[platform];
  const t = TRANSLATIONS[lang];

  return (
    <div className="relative min-h-screen bg-[#020202] overflow-x-hidden noise-overlay">

      {/* Aurora blobs */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute -top-64 -left-64 w-[700px] h-[700px] rounded-full blur-[140px] animate-aurora-1"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)' }} />
        <div className="absolute top-1/2 -right-48 w-[550px] h-[550px] rounded-full blur-[120px] animate-aurora-2"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.10), transparent 70%)' }} />
        <div className="absolute -bottom-48 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-aurora-3"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)' }} />
      </div>

      {/* Dot grid */}
      <div className="fixed inset-0 dot-grid pointer-events-none z-0 opacity-40" aria-hidden />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between px-6 sm:px-10 py-5">
          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <span className={`text-xl font-bold bg-gradient-to-r ${pConfig.gradient} bg-clip-text text-transparent transition-all duration-700`}>
              GaloDev
            </span>
            <span className="text-xl font-bold text-white/20">↓</span>
            <span className="hidden sm:block text-xs font-mono text-zinc-600 border border-zinc-800 rounded-full px-2.5 py-0.5">
              downloader
            </span>
          </motion.div>

          {/* Language switcher */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <LangSwitcher lang={lang} onChange={handleLangChange} />
          </motion.div>
        </header>

        {/* ── Mobile / tablet robot ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="block lg:hidden relative h-72 sm:h-80 md:h-[26rem] overflow-hidden"
        >
          <RobotScene glowColor={pConfig.glowColor} />
          {/* top fade — thin so robot head isn't clipped */}
          <div className="absolute top-0 inset-x-0 h-10 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, ${BG}, transparent)` }} />
          {/* bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-24 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${BG} 30%, rgba(2,2,2,0.55) 65%, transparent)` }} />
          {/* side fades for tablets */}
          <div className="absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${BG}, transparent)` }} />
          <div className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${BG}, transparent)` }} />
        </motion.div>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <main className="flex-1 flex items-center py-4 lg:py-10">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center">

              {/* Left: tool */}
              <div className="flex flex-col gap-7 w-full max-w-lg mx-auto lg:mx-0">

                <motion.div {...fadeUp(0)} className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl xl:text-[3.4rem] font-extrabold leading-[1.06] tracking-tight">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${lang}-line1`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.28 }}
                        className="block text-gradient-neutral"
                      >
                        {t.hero.line1}
                      </motion.span>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${lang}-line2`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.28, delay: 0.05 }}
                        className={`block bg-gradient-to-r ${pConfig.gradient} bg-clip-text text-transparent transition-all duration-700`}
                      >
                        {t.hero.line2}
                      </motion.span>
                    </AnimatePresence>
                  </h1>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`${lang}-subtitle`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-sm"
                    >
                      {t.hero.subtitle}
                    </motion.p>
                  </AnimatePresence>
                </motion.div>

                {/* Platform tabs */}
                <motion.div {...fadeUp(0.1)}>
                  <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/8">
                    {(Object.entries(PLATFORMS) as [Platform, typeof PLATFORMS[Platform]][]).map(([key, cfg]) => {
                      const isActive = platform === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setPlatform(key)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                            isActive
                              ? `bg-gradient-to-r ${cfg.activePill} text-white shadow-lg`
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          <span className={isActive ? 'text-white' : 'opacity-60'}>{cfg.icon}</span>
                          {t.platforms[key]}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Downloader */}
                <motion.div {...fadeUp(0.18)}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={platform}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <SocialDownloader platform={platform} t={t} />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

              </div>

              {/* Right: desktop robot — 4-sided vignette */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.6, delay: 0.15 }}
                className="hidden lg:block relative overflow-hidden self-stretch"
                style={{ minHeight: '580px' }}
              >
                <div className="absolute inset-0">
                  <RobotScene glowColor={pConfig.glowColor} />
                </div>

                {/* 4-sided fades */}
                <div className="absolute top-0 inset-x-0 h-32 z-10 pointer-events-none"
                  style={{ background: `linear-gradient(to bottom, ${BG} 5%, transparent)` }} />
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                  style={{ background: `linear-gradient(to right, ${BG} 10%, transparent)` }} />
                <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                  style={{ background: `linear-gradient(to left, ${BG} 0%, transparent)` }} />
                <div className="absolute bottom-0 inset-x-0 h-48 z-10 pointer-events-none"
                  style={{ background: `linear-gradient(to top, ${BG} 10%, rgba(2,2,2,0.65) 45%, transparent)` }} />
              </motion.div>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 sm:px-10 py-5 flex items-center justify-between border-t border-white/[0.04]">
          <p className="text-xs text-zinc-700 font-mono">
            © {new Date().getFullYear()} GaloDev · {t.footer.rights}
          </p>
          <span className="text-xs font-mono text-zinc-800">v1.0</span>
        </footer>

      </div>
    </div>
  );
}
