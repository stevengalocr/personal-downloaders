'use client';
import SocialDownloader from './SocialDownloader';
import { TRANSLATIONS } from '@/lib/i18n';

export default function ReelsDownloader() {
  return <SocialDownloader platform="reels" t={TRANSLATIONS.es} />;
}
