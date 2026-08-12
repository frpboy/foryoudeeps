import type { DaughterMessage, FinalMessage, MusicTrack } from '@/types';

export const daughterMessage: DaughterMessage = {
  enabled: false,
  heading: 'one more message...',
  introText: 'A message made especially for you.',
};

export const finalMessage: FinalMessage = {
  heading: 'for you, deeps',
  greeting: 'happy birthday ❤️',
  message: 'Here is to a beautiful new chapter, to the little moments ahead, and to knowing how deeply you are loved.',
  showAge: true,
  showDate: true,
  replayEnabled: true,
  musicEnabled: false,
  creditText: 'made with love ♡',
};

export const musicTracks: MusicTrack[] = [];
