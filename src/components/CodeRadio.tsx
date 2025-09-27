import React, { useEffect } from "react";
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
import { useRadioStore } from "@/stores/radioStore";

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
  const {
    isPlaying,
    isLoading,
    volume,
    isMuted,
    activeStation,
    setVolume,
    setIsMuted,
    initAudio,
    play,
    pause,
    stop,
    switchStation: switchStationInStore
  } = useRadioStore();

  const [error, setError] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

  // Initialize global audio on component mount
  useEffect(() => {
    initAudio();
  }, [initAudio]);

  const handlePlay = async () => {
    try {
      setError(null);
      await play();
      setToast({ message: `${currentSource.name} is now playing`, type: "success" });
    } catch (error) {
      console.error('Failed to play audio:', error);
      setError('Failed to start radio');
      setToast({ message: "Failed to start radio", type: "error" });
    }
  };

  const handlePause = () => {
    pause();
    setToast({ message: "Radio paused", type: "success" });
  };

  const handleStop = () => {
    stop();
    setError(null);
    setToast({ message: `${currentSource.name} stopped`, type: "success" });
  };

  const switchStation = (stationId: RadioStation) => {
    switchStationInStore(stationId);
    setError(null);
    const newSource = radioSources.find(source => source.id === stationId)!;
    setToast({ message: `Switched to ${newSource.name}`, type: "success" });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1">Code Radio</h1>
              <p className="mt-1 text-body-small text-muted-foreground">
                24/7 music to help you code better
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
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 p-1 bg-muted/30 rounded-lg">
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
              </div>

              {/* Status */}
              <div className="text-center">
                <h3 className="text-heading-3 mb-2">{currentSource.name}</h3>
                <p className="text-body-small text-muted-foreground mb-4">
                  {error ? error : currentSource.description}
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
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-1 h-1 rounded-full bg-current"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-1 h-1 rounded-full bg-current"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-1 h-1 rounded-full bg-current"
                        />
                      </div>
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
    </div>
  );
};