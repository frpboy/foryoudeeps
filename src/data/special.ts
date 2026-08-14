import type { DaughterMessage, FinalMessage, MusicTrack } from '@/types';

export const daughterMessage: DaughterMessage = {
  enabled: true,
  heading: 'a little birthday surprise...',
  introText: 'One small voice, with all the love in the world.',
  caption: 'the sweetest little wish ♡',
  video: {
    id: 'deepthi-kid-message',
    type: 'video',
    src: '/media/daughter/deepthi-kid-message.mp4',
    order: 1,
    enabled: true,
  },
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

export const musicTracks: MusicTrack[] = [
  {
    id: 'aye-brown-happy-birthday',
    title: 'Happy Birthday',
    artist: 'Aye Brown',
    src: '/media/music/aye-brown-happy-birthday.mp3',
    order: 1,
    enabled: true,
  },
];
