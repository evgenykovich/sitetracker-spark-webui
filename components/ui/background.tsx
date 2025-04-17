'use client'

import { motion } from 'framer-motion'

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/bg-pattern.jpg")',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url("/noise.png")',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Grid pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-grid-pattern"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background/95 via-background/80 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Animated circles */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-secondary/30 to-secondary/5 blur-3xl"
        />
      </div>

      {/* Shine effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.5, 0.3, 0.5], scale: 1 }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] max-h-[800px]"
      >
        <div className="w-full h-full rounded-full bg-gradient-radial from-white/20 via-white/5 to-transparent blur-2xl" />
      </motion.div>
    </div>
  )
}
