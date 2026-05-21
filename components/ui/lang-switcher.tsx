'use client';

import { motion } from 'framer-motion';
import type { Lang } from '@/lib/i18n';
import { LANGUAGES } from '@/lib/i18n';

interface LangSwitcherProps {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

export function LangSwitcher({ lang, onChange }: LangSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Language selector"
      className="flex items-center gap-0.5 p-0.5 rounded-full bg-white/[0.04] border border-white/[0.08]"
    >
      {LANGUAGES.map((l) => {
        const isActive = lang === l.code;
        return (
          <button
            key={l.code}
            onClick={() => onChange(l.code)}
            aria-label={`Switch to ${l.name}`}
            aria-pressed={isActive}
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors duration-200 cursor-pointer select-none ${
              isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {/* Sliding active pill */}
            {isActive && (
              <motion.span
                layoutId="lang-active-pill"
                className="absolute inset-0 rounded-full bg-white/[0.09] border border-white/[0.13]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {/* Flag */}
            <span
              className="relative z-10 text-[13px] leading-none"
              aria-hidden="true"
            >
              {l.flag}
            </span>
            {/* Code */}
            <span className="relative z-10 font-mono text-[11px] font-semibold tracking-widest">
              {l.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
