import { create } from 'zustand';

type RadioStation = 'code' | 'rain';

interface RadioState {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  activeStation: RadioStation;
  audioElement: HTMLAudioElement | null;

  setIsPlaying: (playing: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setActiveStation: (station: RadioStation) => void;
  initAudio: () => HTMLAudioElement;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  switchStation: (station: RadioStation) => void;
}

const RADIO_SOURCES = {
  code: 'https://coderadio-admin-v2.freecodecamp.org/listen/coderadio/radio.mp3',
  rain: 'https://rainyday-mynoise.radioca.st/stream',
};

export const useRadioStore = create<RadioState>((set, get) => ({
  isPlaying: false,
  isLoading: false,
  volume: 0.7,
  isMuted: false,
  activeStation: 'code',
  audioElement: null,

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setVolume: (volume) => {
    set({ volume });
    const audio = get().audioElement;
    if (audio) {
      audio.volume = get().isMuted ? 0 : volume;
    }
  },
  setIsMuted: (muted) => {
    set({ isMuted: muted });
    const audio = get().audioElement;
    if (audio) {
      audio.volume = muted ? 0 : get().volume;
    }
  },
  setActiveStation: (station) => set({ activeStation: station }),

  initAudio: () => {
    let audio = get().audioElement;

    if (!audio) {
      audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.preload = "metadata";

      const handleLoadStart = () => set({ isLoading: true });
      const handleCanPlay = () => set({ isLoading: false });
      const handlePlay = () => set({ isPlaying: true });
      const handlePause = () => set({ isPlaying: false });
      const handleEnded = () => set({ isPlaying: false });
      const handleError = () => {
        set({ isPlaying: false, isLoading: false });
      };

      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      audio.src = RADIO_SOURCES[get().activeStation];
      audio.volume = get().isMuted ? 0 : get().volume;

      set({ audioElement: audio });
    }

    return audio;
  },

  play: async () => {
    const audio = get().initAudio();
    try {
      set({ isLoading: true });
      await audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  pause: () => {
    const audio = get().audioElement;
    if (audio) {
      audio.pause();
    }
  },

  stop: () => {
    const audio = get().audioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      set({ isPlaying: false, isLoading: false });

      audio.src = '';
      audio.load();
      audio.src = RADIO_SOURCES[get().activeStation];
    }
  },

  switchStation: (station) => {
    const audio = get().audioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      set({ isPlaying: false, isLoading: false, activeStation: station });
      audio.src = RADIO_SOURCES[station];
    }
  },
}));