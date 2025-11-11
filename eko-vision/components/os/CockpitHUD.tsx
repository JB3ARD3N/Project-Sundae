'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CockpitHUDProps {
  children: ReactNode;
  brainPower: number;
}

export default function CockpitHUD({ children, brainPower }: CockpitHUDProps) {
  return (
    <div className="relative min-h-screen">
      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-scan" />
      </div>

      {/* Corner Brackets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/50 pointer-events-none z-40"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-500/50 pointer-events-none z-40"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-500/50 pointer-events-none z-40"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-500/50 pointer-events-none z-40"
      />

      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-30 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(cyan 1px, transparent 1px),
            linear-gradient(90deg, cyan 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
