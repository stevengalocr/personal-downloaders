'use client';
import SocialDownloader from './SocialDownloader';
import { TRANSLATIONS } from '@/lib/i18n';

export default function TikTokDownloader() {
  return <SocialDownloader platform="tiktok" t={TRANSLATIONS.es} />;
}
