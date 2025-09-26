import { AnimatePresence, motion } from "framer-motion";
import { Crown } from "@phosphor-icons/react";
import queenBgImage from "../assets/queen-code-bg.jpg";
import type { CSSProperties } from "react";

/**
 * StartupIntro - a lightweight startup overlay shown on app launch.
 * - Non-interactive; auto-fades after parent hides it via the `visible` prop.
 * - Uses existing shimmer/rotating-symbol styles from shimmer.css.
 */
export function StartupIntro({ visible }: { visible: boolean }) {
  // Simple entrance animations only
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background overflow-hidden"
          aria-hidden="true"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: `url(${queenBgImage})`,
              filter: 'blur(0.5px)'
            }}
          />
          {/* Ambient radial glow */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              background:
                "radial-gradient(800px circle at 50% 55%, var(--color-primary)/12, transparent 65%)",
              pointerEvents: "none",
            } as CSSProperties}
          />

          {/* Subtle vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(1200px circle at 50% 40%, transparent 60%, rgba(0,0,0,0.25))",
            }}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="relative flex flex-col items-center justify-center gap-1"
          >

            {/* opcode logo slides left; brand text reveals to the right */}
            <div className="relative flex items-center justify-center">
              {/* Logo wrapper that gently slides left */}
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, scale: 0.8, x: 0 }}
                animate={{ opacity: 1, scale: 1, x: -14 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.8] }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <Crown
                  className="h-20 w-20 text-primary drop-shadow-lg"
                  weight="duotone"
                />
              </motion.div>

              {/* Brand text reveals left-to-right in the freed space */}
              <motion.div
                initial={{ x: -35, opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                animate={{ x: 2, opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.0, ease: "easeOut", delay: 0.5 }}
                style={{ willChange: "transform, opacity, clip-path" }}
              >
                <BrandText />
              </motion.div>
            </div>


          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StartupIntro;

function BrandText() {
  return (
    <div className="text-5xl font-medium tracking-tighter brand-text" style={{ fontFamily: 'var(--font-display)' }}>
      <span className="brand-text-solid bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        Queen Code
      </span>
      <span aria-hidden="true" className="brand-text-shimmer">Queen Code</span>
    </div>
  );
}
