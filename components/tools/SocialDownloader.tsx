'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Clipboard,
  AlertCircle,
  CheckCircle,
  Loader2,
  Video,
  Music,
  ArrowRight,
} from 'lucide-react';
import type { Translations } from '@/lib/i18n';

/* ── Types ──────────────────────────────────────────────────────────── */

type Platform = 'reels' | 'tiktok';
type DownloadOption = { label: string; url: string; type: 'video' | 'audio' };
type VideoResult = {
  platform: 'tiktok' | 'instagram';
  title: string | null;
  thumbnail: string | null;
  author: string | null;
  authorHandle: string | null;
  downloads: DownloadOption[];
};

/* ── Per-platform theme ─────────────────────────────────────────────── */

const THEME = {
  reels: {
    placeholder: 'https://www.instagram.com/reel/...',
    inputFocus: 'focus-within:ring-violet-500/25 focus-within:border-violet-500/40',
    btnGradient: 'from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500',
    btnShadow: 'shadow-violet-900/40',
    accent: 'text-violet-400',
    accentBg: 'bg-violet-500/10',
    accentBorder: 'border-violet-500/25',
    videoBadge: 'bg-violet-900/50 text-violet-300 border-violet-700/40',
    audioBadge: 'bg-zinc-800/80 text-zinc-400 border-zinc-700/40',
    rowHover: 'hover:border-violet-500/30 hover:bg-violet-500/5',
    doneBg: 'border-emerald-500/30 bg-emerald-500/5',
    countAccent: 'text-violet-400',
  },
  tiktok: {
    placeholder: 'https://www.tiktok.com/@user/video/...',
    inputFocus: 'focus-within:ring-cyan-500/25 focus-within:border-cyan-500/40',
    btnGradient: 'from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500',
    btnShadow: 'shadow-cyan-900/40',
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/25',
    videoBadge: 'bg-cyan-900/50 text-cyan-300 border-cyan-700/40',
    audioBadge: 'bg-zinc-800/80 text-zinc-400 border-zinc-700/40',
    rowHover: 'hover:border-cyan-500/30 hover:bg-cyan-500/5',
    doneBg: 'border-emerald-500/30 bg-emerald-500/5',
    countAccent: 'text-cyan-400',
  },
} as const;

/* ── Component ──────────────────────────────────────────────────────── */

interface Props {
  platform: Platform;
  t: Translations;
}

export default function SocialDownloader({ platform, t }: Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [justDownloaded, setJustDownloaded] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const theme = THEME[platform];
  const td = t.downloader;
  const te = t.errors;

  /* Reset when platform or language switches */
  useEffect(() => {
    setUrl('');
    setResult(null);
    setError('');
  }, [platform]);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = (seconds: number) => {
    setCooldown(seconds);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /* ── Fetch ──────────────────────────────────────────────────────────── */

  const fetchVideo = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError(te.emptyUrl);
      return;
    }
    if (cooldown > 0) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const json = await res.json();

      if (res.status === 429) {
        startCooldown(60);
        setError(te.tooMany);
      } else if (!res.ok || !json.success) {
        setError(te.notFound);
      } else {
        setResult(json.data as VideoResult);
      }
    } catch {
      setError(te.connection);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') fetchVideo();
  };

  /* ── Download ───────────────────────────────────────────────────────── */

  const handleDownload = async (opt: DownloadOption) => {
    setDownloading(opt.label);
    try {
      const resp = await fetch(opt.url);
      if (!resp.ok) throw new Error('fetch failed');
      const blob = await resp.blob();
      const ext = opt.type === 'audio' ? 'mp3' : 'mp4';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `galodev_${result?.platform ?? 'video'}_${Date.now()}.${ext}`;
      a.click();
      URL.revokeObjectURL(a.href);
      setJustDownloaded(opt.label);
      setTimeout(() => setJustDownloaded(null), 3000);
    } catch {
      window.open(opt.url, '_blank');
    } finally {
      setDownloading(null);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setResult(null);
      setError('');
    } catch {
      /* clipboard permission denied */
    }
  };

  /* ── Render ─────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-3">
      {/* URL input row */}
      <div className="space-y-2">
        <div
          className={`flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 ring-2 ring-transparent transition-all duration-300 ${theme.inputFocus}`}
        >
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (result) setResult(null);
              if (error) setError('');
            }}
            onKeyDown={handleKey}
            placeholder={theme.placeholder}
            aria-label="Video URL"
            className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none font-mono min-w-0"
          />
          <button
            onClick={fetchVideo}
            disabled={loading || !url.trim() || cooldown > 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r ${theme.btnGradient} text-white text-sm font-semibold shadow-lg ${theme.btnShadow} transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap shrink-0 cursor-pointer`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">{td.btnFetching}</span>
              </>
            ) : cooldown > 0 ? (
              <span>{cooldown}s</span>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                <span className="hidden sm:inline">{td.btnGet}</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={handlePaste}
          className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors font-mono pl-2 group cursor-pointer"
        >
          <Clipboard className="w-3 h-3 group-hover:text-zinc-400 transition-colors" />
          {td.paste}
        </button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-400 text-sm"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            {/* Video card */}
            <div className="flex gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/8">
              {result.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.thumbnail}
                  alt="thumbnail"
                  className="w-16 h-16 object-cover rounded-lg shrink-0 ring-1 ring-white/10"
                />
              )}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                {result.title && (
                  <p className="text-sm text-white/90 truncate font-medium leading-tight">
                    {result.title}
                  </p>
                )}
                {result.author && (
                  <p className="text-xs text-zinc-500 font-mono">
                    @{result.authorHandle ?? result.author}
                  </p>
                )}
                <span className={`text-xs font-mono mt-1 ${theme.countAccent}`}>
                  {td.available(result.downloads.length)}
                </span>
              </div>
            </div>

            {/* Download options */}
            <div className="space-y-2">
              {result.downloads.map((opt, i) => {
                const isDone = justDownloaded === opt.label;
                const isBusy = downloading === opt.label;
                const isVideo = opt.type === 'video';

                return (
                  <motion.button
                    key={opt.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                    onClick={() => handleDownload(opt)}
                    disabled={!!downloading}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-white/8 bg-white/[0.02] text-left transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed cursor-pointer ${
                      isDone
                        ? theme.doneBg
                        : !downloading
                          ? theme.rowHover
                          : isBusy
                            ? 'opacity-100'
                            : 'opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border tracking-wider ${
                          isVideo ? theme.videoBadge : theme.audioBadge
                        }`}
                      >
                        {isVideo ? 'MP4' : 'MP3'}
                      </span>
                      <div className="flex items-center gap-2">
                        {isVideo ? (
                          <Video className="w-3.5 h-3.5 text-zinc-600" />
                        ) : (
                          <Music className="w-3.5 h-3.5 text-zinc-600" />
                        )}
                        <span className="text-sm text-zinc-200">{opt.label}</span>
                      </div>
                    </div>

                    <span
                      className={`flex items-center gap-1.5 text-xs font-mono shrink-0 ${
                        isDone ? 'text-emerald-400' : 'text-zinc-600'
                      }`}
                    >
                      {isBusy ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span className="hidden sm:inline">{td.downloading}</span>
                        </>
                      ) : isDone ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          {td.done}
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{td.download}</span>
                        </>
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <p className="text-[11px] text-zinc-700 font-mono leading-relaxed pl-1">
              {td.disclaimer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
