import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import queenBgImage from "../assets/queen-code-bg.jpg";
import openSound from "../assets/opensound.mp3";
import loadingIconSvg from "@/assets/loadingicon.svg";
import type { CSSProperties } from "react";

/**
 * StartupIntro - a stunning startup overlay shown on app launch.
 * - Non-interactive; auto-fades after minimum duration.
 * - Features dramatic reveal animations, floating particles, and pulsing elements.
 */
export function StartupIntro({ visible }: { visible: boolean }) {
  const [showContent, setShowContent] = useState(false);

  // Play sound and auto-hide after 3 seconds
  useEffect(() => {
    if (visible) {
      // Play startup sound
      const audio = new Audio(openSound);
      audio.volume = 0.3; // Gentle volume
      audio.play().catch(console.error);

      // Reveal content after brief delay
      const contentTimer = setTimeout(() => setShowContent(true), 100);

      // Auto-hide after 3 seconds
      const hideTimer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('hide-startup-intro'));
      }, 3000);

      return () => {
        clearTimeout(contentTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setShowContent(false);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background overflow-hidden"
          aria-hidden="true"
        >
          {/* Background Image with zoom effect */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: `url(${queenBgImage})`,
              filter: 'blur(0.5px)'
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />

          {/* Animated gradient orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
            style={{
              background: "radial-gradient(circle, var(--color-primary)/30, transparent 70%)",
              filter: "blur(60px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: [0, 0.8, 0.5],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 2,
              times: [0, 0.5, 1],
              ease: "easeOut"
            }}
          />

          <motion.div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full"
            style={{
              background: "radial-gradient(circle, var(--color-accent)/25, transparent 70%)",
              filter: "blur(50px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.3, 1],
              opacity: [0, 0.6, 0.4],
              x: [0, -40, 0],
              y: [0, 30, 0]
            }}
            transition={{
              duration: 2.2,
              times: [0, 0.6, 1],
              ease: "easeOut",
              delay: 0.1
            }}
          />

          {/* Center glow pulse */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(600px circle at 50% 50%, var(--color-primary)/20, transparent 60%)",
              pointerEvents: "none",
            } as CSSProperties}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 1, 0.7],
              scale: [0.8, 1.2, 1]
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.5, 1],
              ease: "easeOut"
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(1200px circle at 50% 40%, transparent 60%, rgba(0,0,0,0.3))",
            }}
          />

          {/* Floating particles */}
          {showContent && (
            <>
              {Array.from({ length: 12 }).map((_, i) => (
                <FloatingParticle key={i} index={i} />
              ))}
            </>
          )}

          {/* Main Content */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1], // Custom easing curve
                delay: 0.2
              }}
              className="relative flex flex-col items-center justify-center gap-6"
            >
              {/* Rotating icon with glow */}
              <motion.div
                className="relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.3
                }}
              >
                {/* Glow ring behind icon */}
                <motion.div
                  className="absolute inset-0 -m-4"
                  style={{
                    background: "radial-gradient(circle, var(--color-primary)/40, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <motion.img
                  src={loadingIconSvg}
                  alt="Loading"
                  className="w-20 h-20 relative z-10"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>

              {/* Brand text with reveal animation */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center"
              >
                <BrandText />
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-sm text-muted-foreground/60 tracking-wider uppercase"
              >
                Initializing...
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StartupIntro;

function BrandText() {
  return (
    <div className="text-6xl font-bold tracking-tight brand-text" style={{ fontFamily: 'var(--font-display)' }}>
      <span className="brand-text-solid bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        Queen Code
      </span>
      <span aria-hidden="true" className="brand-text-shimmer">Queen Code</span>
    </div>
  );
}

/**
 * FloatingParticle - Animated particle that floats around the screen
 */
function FloatingParticle({ index }: { index: number }) {
  // Generate random positions and delays for variety
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const randomDelay = Math.random() * 0.5;
  const randomDuration = 3 + Math.random() * 2;
  const randomSize = 2 + Math.random() * 4;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        width: randomSize,
        height: randomSize,
        background: index % 3 === 0
          ? "var(--color-primary)"
          : index % 3 === 1
          ? "var(--color-accent)"
          : "rgba(255, 255, 255, 0.5)",
        boxShadow: "0 0 10px currentColor",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0],
        y: [0, -30, -60],
        x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: "easeOut"
      }}
    />
  );
}
