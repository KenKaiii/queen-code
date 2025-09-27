import { create } from 'zustand';

type RadioStation = 'code' | 'rain';

interface RadioState {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  activeStation: RadioStation;
  audioElement: HTMLAudioElement | null;
  reconnectAttempts: number;
  reconnectTimer: NodeJS.Timeout | null;
  wasPlayingBeforeError: boolean;

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
  clearReconnect: () => void;
}

const RADIO_SOURCES = {
  code: 'https://coderadio-admin-v2.freecodecamp.org/listen/coderadio/radio.mp3',
  rain: 'https://rainyday-mynoise.radioca.st/stream',
};

const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY = 2000;

export const useRadioStore = create<RadioState>((set, get) => ({
  isPlaying: false,
  isLoading: false,
  volume: 0.7,
  isMuted: false,
  activeStation: 'code',
  audioElement: null,
  reconnectAttempts: 0,
  reconnectTimer: null,
  wasPlayingBeforeError: false,

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

  clearReconnect: () => {
    const timer = get().reconnectTimer;
    if (timer) {
      clearTimeout(timer);
      set({ reconnectTimer: null, reconnectAttempts: 0 });
    }
  },

  initAudio: () => {
    let audio = get().audioElement;

    if (!audio) {
      audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.preload = "metadata";

      const handleLoadStart = () => set({ isLoading: true });
      const handleCanPlay = () => {
        set({ isLoading: false, reconnectAttempts: 0, wasPlayingBeforeError: false });
        get().clearReconnect();
      };
      const handlePlay = () => set({ isPlaying: true });
      const handlePause = () => set({ isPlaying: false });
      const handleEnded = () => set({ isPlaying: false });
      const handleError = () => {
        const state = get();
        const wasPlaying = state.isPlaying || state.isLoading;

        set({ isPlaying: false, isLoading: false, wasPlayingBeforeError: wasPlaying });

        if (wasPlaying && state.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = BASE_RECONNECT_DELAY * Math.pow(2, state.reconnectAttempts);
          console.log(`Connection lost. Reconnecting in ${delay}ms (attempt ${state.reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);

          const timer = setTimeout(async () => {
            const currentState = get();
            if (currentState.wasPlayingBeforeError) {
              set({ reconnectAttempts: currentState.reconnectAttempts + 1 });
              try {
                await currentState.play();
              } catch (error) {
                console.error('Reconnection attempt failed:', error);
              }
            }
          }, delay);

          set({ reconnectTimer: timer });
        } else if (state.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.log('Max reconnection attempts reached. Please try manually.');
          set({ reconnectAttempts: 0, wasPlayingBeforeError: false });
        }
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
    get().clearReconnect();
    const audio = get().audioElement;
    if (audio) {
      audio.pause();
    }
    set({ wasPlayingBeforeError: false });
  },

  stop: () => {
    get().clearReconnect();
    const audio = get().audioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      set({ isPlaying: false, isLoading: false, wasPlayingBeforeError: false });

      audio.src = '';
      audio.load();
      audio.src = RADIO_SOURCES[get().activeStation];
    }
  },

  switchStation: (station) => {
    get().clearReconnect();
    const audio = get().audioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      set({ isPlaying: false, isLoading: false, activeStation: station, wasPlayingBeforeError: false });
      audio.src = RADIO_SOURCES[station];
    }
  },
}));