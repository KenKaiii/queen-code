import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Stop,
  Radio,
  SpeakerHigh,
  SpeakerX,
  Waveform,
  CloudRain
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toast, ToastContainer } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface CodeRadioProps {
  className?: string;
}

type RadioStation = 'code' | 'rain';

interface RadioSource {
  id: RadioStation;
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
}

/**
 * Code Radio - Dual radio player for Code Radio and Rain Radio
 * Features: Play/Pause/Stop controls, volume control, background playback, station switching
 */
export const CodeRadio: React.FC<CodeRadioProps> = ({
  className,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStation, setActiveStation] = useState<RadioStation>('code');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const radioSources: RadioSource[] = [
    {
      id: 'code',
      name: 'Code Radio',
      url: 'https://coderadio-admin-v2.freecodecamp.org/listen/coderadio/radio.mp3',
      icon: <Radio className="h-4 w-4" weight="duotone" />,
      description: '24/7 coding beats from freeCodeCamp'
    },
    {
      id: 'rain',
      name: 'Rain Radio',
      url: 'https://rainyday-mynoise.radioca.st/stream',
      icon: <CloudRain className="h-4 w-4" weight="duotone" />,
      description: 'Peaceful rain sounds for focus'
    }
  ];

  const currentSource = radioSources.find(source => source.id === activeStation)!;

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.src = currentSource.url;
    audioRef.current.preload = "metadata";
    audioRef.current.volume = volume;
    audioRef.current.crossOrigin = "anonymous";

    const audio = audioRef.current;

    // Audio event listeners
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e: any) => {
      console.error('Audio error details:', {
        error: e,
        url: RADIO_URL,
        readyState: audio.readyState,
        networkState: audio.networkState
      });
      setError('Failed to connect to Code Radio - Check console for details');
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Update audio source when station changes (but don't auto-restart)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSource.url;
    }
  }, [activeStation, currentSource.url]);

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  /**
   * Play the radio stream
   */
  const handlePlay = async () => {
    if (!audioRef.current) return;

    try {
      setError(null);
      setIsLoading(true);
      await audioRef.current.play();
      setToast({ message: "Code Radio is now playing", type: "success" });
    } catch (error) {
      console.error('Failed to play audio:', error);
      setError('Failed to start Code Radio');
      setToast({ message: "Failed to start Code Radio", type: "error" });
      setIsLoading(false);
    }
  };

  /**
   * Pause the radio stream
   */
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setToast({ message: "Code Radio paused", type: "success" });
    }
  };

  /**
   * Stop the radio stream and reset for next play
   */
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Immediately update UI state
      setIsPlaying(false);
      setIsLoading(false);
      setError(null);

      // Reset the audio source to clear any stream state issues
      audioRef.current.src = '';
      audioRef.current.load();

      // Set the source back immediately for next play
      audioRef.current.src = currentSource.url;

      setToast({ message: `${currentSource.name} stopped`, type: "success" });
    }
  };

  /**
   * Switch radio station and stop current playback
   */
  const switchStation = (stationId: RadioStation) => {
    if (audioRef.current) {
      // Stop current audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Update state immediately
      setIsPlaying(false);
      setIsLoading(false);
      setError(null);
      setActiveStation(stationId);

      // Update audio source
      const newSource = radioSources.find(source => source.id === stationId)!;
      audioRef.current.src = newSource.url;

      setToast({ message: `Switched to ${newSource.name}`, type: "success" });
    }
  };

  /**
   * Toggle mute
   */
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      <div className="max-w-4xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1">Code Radio</h1>
              <p className="mt-1 text-body-small text-muted-foreground">
                24/7 coding music from freeCodeCamp
              </p>
            </div>
            <Badge variant="outline" className="gap-2">
              <Waveform className="h-4 w-4" weight="duotone" />
              {isPlaying ? "Live" : "Offline"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <Card className="p-6">
            <div className="space-y-4">
              {/* Station Selector */}
              <div className="flex items-center justify-center gap-2 p-1 bg-muted/30 rounded-lg">
                {radioSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => switchStation(source.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                      activeStation === source.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {source.icon}
                    {source.name}
                  </button>
                ))}
              </div>

              {/* Status */}
              <div className="text-center">
                <h3 className="text-heading-3 mb-2">{currentSource.name}</h3>
                <p className="text-body-small text-muted-foreground mb-4">
                  {isPlaying ? currentSource.description :
                   isLoading ? "Connecting..." :
                   error ? error : "Ready to play"}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStop}
                  disabled={!isPlaying}
                  className="gap-2"
                >
                  <Stop className="h-4 w-4" weight="duotone" />
                  Stop
                </Button>

                <Button
                  size="sm"
                  onClick={isPlaying ? handlePause : handlePlay}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" weight="duotone" />
                      Playing
                    </>
                  ) : isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Radio className="h-4 w-4" weight="duotone" />
                      </motion.div>
                      Connecting
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" weight="duotone" />
                      Play
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMute}
                  className="gap-2"
                >
                  {isMuted ? (
                    <>
                      <SpeakerX className="h-4 w-4" weight="duotone" />
                      Unmute
                    </>
                  ) : (
                    <>
                      <SpeakerHigh className="h-4 w-4" weight="duotone" />
                      Mute
                    </>
                  )}
                </Button>
              </div>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-label">Volume</label>
                  <span className="text-caption text-muted-foreground">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    if (isMuted && newVolume > 0) {
                      setIsMuted(false);
                    }
                  }}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(isMuted ? 0 : volume) * 100}%, var(--color-muted) ${(isMuted ? 0 : volume) * 100}%, var(--color-muted) 100%)`
                  }}
                />
              </div>

              {/* Info */}
              <div className="pt-4 mt-6 border-t border-border text-center">
                <p className="text-caption text-muted-foreground">
                  Music continues playing in background while you code
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </ToastContainer>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
};