import type { CardFinish } from '@/types/finance';

export const KAZA_COLORS = {
  canvas: '#F3F4F6',
  shell: '#EFEFF2',
  surface: '#FBFBFB',
  surfaceWhite: '#FFFFFF',
  surfaceMuted: '#F4F4F6',
  surfaceSubtle: '#ECECEF',
  ink: '#232325',
  inkStrong: '#18181B',
  border: '#EAEAEF',
  borderStrong: '#DCDCE2',
  textPrimary: '#18181B',
  textSecondary: '#71717A',
  textMuted: '#A1A1AA',
  positive: '#16A34A',
  positiveSoft: '#DCFCE7',
  negative: '#EF4444',
  negativeSoft: '#FEE2E2',
  warning: '#F59E0B',
  info: '#2563EB',
} as const;

export const KAZA_RADII = {
  shell: '0px',
  bento: '24px',
  card: '20px',
  navTile: '16px',
  control: '12px',
  pill: '9999px',
} as const;

export const KAZA_SHADOWS = {
  shell: '0 24px 60px -16px rgba(17, 17, 19, 0.08)',
  bento: '0 1px 2px rgba(24, 24, 27, 0.03), 0 8px 24px -12px rgba(24, 24, 27, 0.05)',
  heroCard: '0 26px 46px -18px rgba(24, 24, 27, 0.22), 0 4px 14px -4px rgba(24, 24, 27, 0.08)',
  pill: '0 8px 20px -6px rgba(24, 24, 27, 0.28)',
} as const;

export interface CardFinishSpec {
  id: CardFinish;
  label: string;
  description: string;
  swatchGradient: string;
  cardBackground: string;
  waveOverlay: string;
  textColor: string;
  mutedTextColor: string;
  chipTone: 'silver' | 'gold' | 'dark';
  borderColor: string;
}

export const CARD_FINISHES: Record<CardFinish, CardFinishSpec> = {
  champagne: {
    id: 'champagne',
    label: 'Champagne Silk',
    description: 'Warm pearlescent ivory-gold recycled polymer weave',
    swatchGradient: 'linear-gradient(135deg, #F6F1E5 0%, #DFD4BF 55%, #C8B99D 100%)',
    cardBackground:
      'radial-gradient(125% 95% at 15% 15%, #FAF7F0 0%, #ECE4D4 42%, #D9CEBA 78%, #EFE9DC 100%)',
    waveOverlay:
      'radial-gradient(68% 58% at 74% 38%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%), radial-gradient(85% 65% at 22% 72%, rgba(196,177,145,0.42) 0%, rgba(196,177,145,0) 72%)',
    textColor: '#1F1E1B',
    mutedTextColor: 'rgba(31, 30, 27, 0.58)',
    chipTone: 'silver',
    borderColor: 'rgba(214, 203, 184, 0.75)',
  },
  silver: {
    id: 'silver',
    label: 'Brushed Silver',
    description: 'Cool anodized platinum-aluminum finish',
    swatchGradient: 'linear-gradient(135deg, #F4F5F7 0%, #D4D7DD 55%, #AEB4BE 100%)',
    cardBackground:
      'radial-gradient(120% 90% at 18% 12%, #FAFAFC 0%, #E3E6EC 46%, #C7CDD6 82%, #E9ECEF 100%)',
    waveOverlay:
      'radial-gradient(65% 55% at 72% 32%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0) 70%), radial-gradient(80% 60% at 25% 75%, rgba(148,156,170,0.32) 0%, rgba(148,156,170,0) 75%)',
    textColor: '#18181B',
    mutedTextColor: 'rgba(24, 24, 27, 0.55)',
    chipTone: 'silver',
    borderColor: 'rgba(203, 208, 217, 0.8)',
  },
  obsidian: {
    id: 'obsidian',
    label: 'Obsidian Matte',
    description: 'Deep carbon-slate recycled ocean composite',
    swatchGradient: 'linear-gradient(135deg, #4B4E56 0%, #27282D 55%, #121215 100%)',
    cardBackground:
      'radial-gradient(120% 95% at 20% 15%, #3B3D44 0%, #222328 48%, #141417 85%, #27282E 100%)',
    waveOverlay:
      'radial-gradient(65% 55% at 75% 32%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%), radial-gradient(85% 65% at 20% 76%, rgba(110,115,130,0.22) 0%, rgba(0,0,0,0) 72%)',
    textColor: '#FAFAFA',
    mutedTextColor: 'rgba(250, 250, 250, 0.62)',
    chipTone: 'gold',
    borderColor: 'rgba(72, 74, 82, 0.7)',
  },
  'rose-pearl': {
    id: 'rose-pearl',
    label: 'Rose Pearl',
    description: 'Soft rose-quartz iridescent mineral finish',
    swatchGradient: 'linear-gradient(135deg, #FBF2F2 0%, #E7CECF 55%, #CFA8AA 100%)',
    cardBackground:
      'radial-gradient(125% 95% at 15% 15%, #FCF6F6 0%, #EEDADB 45%, #DEC0C2 80%, #F3E5E6 100%)',
    waveOverlay:
      'radial-gradient(68% 58% at 74% 38%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%), radial-gradient(85% 65% at 22% 72%, rgba(204,158,162,0.34) 0%, rgba(204,158,162,0) 72%)',
    textColor: '#271E1F',
    mutedTextColor: 'rgba(39, 30, 31, 0.56)',
    chipTone: 'silver',
    borderColor: 'rgba(222, 192, 194, 0.8)',
  },
  'frost-sage': {
    id: 'frost-sage',
    label: 'Frost Sage',
    description: 'Mist-tinted brushed mineral alloy finish',
    swatchGradient: 'linear-gradient(135deg, #F0F5F2 0%, #CBD8D0 55%, #A9BDB1 100%)',
    cardBackground:
      'radial-gradient(125% 95% at 15% 15%, #F5F9F7 0%, #DCE7E0 45%, #C1D2C8 80%, #E4EDE8 100%)',
    waveOverlay:
      'radial-gradient(68% 58% at 74% 38%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%), radial-gradient(85% 65% at 22% 72%, rgba(145,172,156,0.34) 0%, rgba(145,172,156,0) 72%)',
    textColor: '#19221D',
    mutedTextColor: 'rgba(25, 34, 29, 0.56)',
    chipTone: 'silver',
    borderColor: 'rgba(193, 210, 200, 0.8)',
  },
};

export const CARD_FINISH_ORDER: CardFinish[] = [
  'champagne',
  'silver',
  'obsidian',
  'rose-pearl',
  'frost-sage',
];
