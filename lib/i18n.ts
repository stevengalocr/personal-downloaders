/* ── Language config ────────────────────────────────────────────────── */

export type Lang = 'es' | 'en' | 'pt';

export const LANGUAGES = [
  { code: 'es' as Lang, label: 'ES', flag: '🇪🇸', name: 'Español' },
  { code: 'en' as Lang, label: 'EN', flag: '🇺🇸', name: 'English' },
  { code: 'pt' as Lang, label: 'PT', flag: '🇧🇷', name: 'Português' },
] as const;

/* ── Translation shape ──────────────────────────────────────────────── */

export interface Translations {
  hero: {
    line1: string;
    line2: string;
    subtitle: string;
  };
  platforms: {
    reels: string;
    tiktok: string;
  };
  downloader: {
    btnGet: string;
    btnFetching: string;
    paste: string;
    downloading: string;
    done: string;
    download: string;
    available: (n: number) => string;
    disclaimer: string;
  };
  errors: {
    emptyUrl: string;
    tooMany: string;
    notFound: string;
    connection: string;
  };
  footer: {
    rights: string;
  };
}

/* ── Spanish ────────────────────────────────────────────────────────── */

const es: Translations = {
  hero: {
    line1: 'Descarga lo que',
    line2: 'más te gusta',
    subtitle: 'Reels y TikToks sin marca de agua. Sin registro, sin esperas.',
  },
  platforms: { reels: 'Instagram', tiktok: 'TikTok' },
  downloader: {
    btnGet: 'Obtener',
    btnFetching: 'Buscando',
    paste: 'Pegar desde portapapeles',
    downloading: 'Descargando',
    done: 'Listo',
    download: 'Descargar',
    available: (n) =>
      `${n} opción${n !== 1 ? 'es' : ''} disponible${n !== 1 ? 's' : ''}`,
    disclaimer:
      'Solo descarga contenido del que tengas permisos. Respeta los derechos de autor.',
  },
  errors: {
    emptyUrl: 'Introduce un enlace válido.',
    tooMany: 'Demasiadas solicitudes. Espera un momento.',
    notFound: 'No se pudo procesar el video.',
    connection: 'Error de conexión. Comprueba tu internet e inténtalo de nuevo.',
  },
  footer: { rights: 'Solo para contenido con permisos' },
};

/* ── English ────────────────────────────────────────────────────────── */

const en: Translations = {
  hero: {
    line1: 'Download what',
    line2: 'you love most',
    subtitle: 'Reels & TikToks without watermark. No sign-up, no waiting.',
  },
  platforms: { reels: 'Instagram', tiktok: 'TikTok' },
  downloader: {
    btnGet: 'Get',
    btnFetching: 'Searching',
    paste: 'Paste from clipboard',
    downloading: 'Downloading',
    done: 'Done',
    download: 'Download',
    available: (n) => `${n} option${n !== 1 ? 's' : ''} available`,
    disclaimer:
      'Only download content you have rights to. Respect copyright laws.',
  },
  errors: {
    emptyUrl: 'Enter a valid link.',
    tooMany: 'Too many requests. Wait a moment.',
    notFound: 'Could not process the video.',
    connection: 'Connection error. Check your internet and try again.',
  },
  footer: { rights: 'Only for content you have rights to' },
};

/* ── Portuguese ─────────────────────────────────────────────────────── */

const pt: Translations = {
  hero: {
    line1: 'Baixe o que',
    line2: 'você mais gosta',
    subtitle: "Reels e TikToks sem marca d'água. Sem cadastro, sem espera.",
  },
  platforms: { reels: 'Instagram', tiktok: 'TikTok' },
  downloader: {
    btnGet: 'Obter',
    btnFetching: 'Buscando',
    paste: 'Colar da área de transferência',
    downloading: 'Baixando',
    done: 'Pronto',
    download: 'Baixar',
    available: (n) =>
      n === 1 ? '1 opção disponível' : `${n} opções disponíveis`,
    disclaimer:
      'Baixe apenas conteúdo com permissões. Respeite os direitos autorais.',
  },
  errors: {
    emptyUrl: 'Insira um link válido.',
    tooMany: 'Muitas solicitações. Aguarde um momento.',
    notFound: 'Não foi possível processar o vídeo.',
    connection: 'Erro de conexão. Verifique sua internet e tente novamente.',
  },
  footer: { rights: 'Apenas para conteúdo com permissões' },
};

/* ── Export ─────────────────────────────────────────────────────────── */

export const TRANSLATIONS: Record<Lang, Translations> = { es, en, pt };
