export type MediaType = 'image' | 'video' | 'audio';

export interface MediaAsset {
  id: string;
  type: MediaType;
  src: string;
  poster?: string;
  alt?: string;
  caption?: string;
  dateLabel?: string;
  width?: number;
  height?: number;
  duration?: number;
  order: number;
  enabled: boolean;
}

export type WishVariant =
  | 'text-only'
  | 'photo-only'
  | 'photo-text'
  | 'audio-only'
  | 'audio-text'
  | 'video-only'
  | 'video-text'
  | 'photo-audio'
  | 'photo-video'
  | 'photo-text-audio'
  | 'photo-text-video';

export interface Wish {
  id: string;
  name: string;
  relationship?: string;
  text?: string;
  photo?: MediaAsset;
  audio?: MediaAsset;
  video?: MediaAsset;
  videoPoster?: string;
  caption?: string;
  order: number;
  featured?: boolean;
  enabled: boolean;
}

export interface JourneyItem {
  id: string;
  image?: MediaAsset;
  video?: MediaAsset;
  caption?: string;
  dateLabel?: string;
  order: number;
  emphasis?: 'normal' | 'featured';
  enabled: boolean;
}

export interface GalleryItem {
  id: string;
  media: MediaAsset;
  caption?: string;
  dateLabel?: string;
  order: number;
  featured?: boolean;
  enabled: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  src: string;
  cover?: string;
  duration?: number;
  enabled: boolean;
  order: number;
}

export interface DaughterMessage {
  video?: MediaAsset;
  poster?: string;
  caption?: string;
  heading?: string;
  introText?: string;
  enabled: boolean;
}

export interface FinalMessage {
  heading: string;
  greeting: string;
  message: string;
  showAge?: boolean;
  showDate?: boolean;
  replayEnabled?: boolean;
  musicEnabled?: boolean;
  creditText?: string;
}

export interface ThemeConfig {
  primary: string;
  primaryDeep: string;
  accent: string;
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

export interface SiteConfig {
  name: string;
  displayName: string;
  domain: string;
  birthdayDate: string;
  birthdayYear: number;
  birthYear: number;
  turningAge: number;
  timezone: string;
  showCountdown: boolean;
  showJourney: boolean;
  showGallery: boolean;
  showWishes: boolean;
  showDaughterMessage: boolean;
  showMusic: boolean;
  showFinal: boolean;
  siteTitle: string;
  description: string;
  canonicalUrl: string;
  levelPhrase: string;
}

export interface AppState {
  isBirthday: boolean;
  musicEnabled: boolean;
  musicPlaying: boolean;
  reducedMotion: boolean;
}

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isZero: boolean;
}

export interface LightboxState {
  open: boolean;
  index: number;
  items: GalleryItem[];
}
