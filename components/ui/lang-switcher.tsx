'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { Lang } from '@/lib/i18n';
import { LANGUAGES } from '@/lib/i18n';

interface LangSwitcherProps {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

export function LangSwitcher({ lang, onChange }: LangSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (code: Lang) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative" role="navigation" aria-label="Language selector">

      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.name}`}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-200 cursor-pointer select-none"
      >
        <span className="text-[14px] leading-none" aria-hidden="true">{current.flag}</span>
        <span className="font-mono text-[11px] font-semibold tracking-widest">{current.label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="text-zinc-500"
        >
          <ChevronDown className="w-3 h-3" />
        </motion.span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="listbox"
            aria-label="Select language"
            className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[130px] rounded-2xl bg-zinc-900/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden"
          >
            {LANGUAGES.map((l, i) => {
              const isActive = lang === l.code;
              return (
                <button
                  key={l.code}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(l.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 cursor-pointer group ${
                    i < LANGUAGES.length - 1 ? 'border-b border-white/[0.05]' : ''
                  } ${
                    isActive
                      ? 'bg-white/[0.07] text-white'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                  }`}
                >
                  <span className="text-[14px] leading-none">{l.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px] font-semibold tracking-widest leading-none">
                      {l.label}
                    </span>
                    <span className="text-[10px] text-zinc-600 group-hover:text-zinc-500 mt-0.5 transition-colors">
                      {l.name}
                    </span>
                  </div>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
