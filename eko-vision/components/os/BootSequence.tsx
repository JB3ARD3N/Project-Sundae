'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_MESSAGES = [
  { text: 'Initializing Chimera Brain...', delay: 0 },
  { text: 'Loading Truth Engine v1.0...', delay: 300 },
  { text: 'Spawning Agent Mesh...', delay: 600 },
  { text: 'Connecting to Data Vault...', delay: 900 },
  { text: 'Activating Cost Optimizer...', delay: 1200 },
  { text: 'Enabling Security Fortress...', delay: 1500 },
  { text: 'Initializing Voice System...', delay: 1800 },
  { text: 'Loading KPI Metrics...', delay: 2100 },
  { text: 'System Ready.', delay: 2400 },
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 27); // 2700ms / 100 = 27ms per tick

    const messageTimers = BOOT_MESSAGES.map((msg, index) =>
      setTimeout(() => {
        setCurrentMessage(index);
      }, msg.delay)
    );

    const completeTimer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(onComplete, 500);
    }, 2900);

    return () => {
      clearInterval(progressInterval);
      messageTimers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(cyan 1px, transparent 1px),
                linear-gradient(90deg, cyan 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }} />
          </div>

          <div className="relative z-10 max-w-2xl w-full px-8">
            {/* Logo / Title */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="relative inline-block">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 via-purple-500 to-emerald-500 rounded-lg animate-pulse-slow mb-4" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-emerald-500 rounded-lg blur-2xl opacity-50" />
              </div>

              <h1 className="text-5xl font-bold tracking-wider mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400">
                  CHIMERA OS
                </span>
              </h1>
              <p className="text-cyan-400/50 text-sm font-mono">
                Personal Command Center v1.0.0
              </p>
            </motion.div>

            {/* Boot Messages */}
            <div className="mb-8 h-32">
              <AnimatePresence mode="wait">
                {BOOT_MESSAGES.slice(0, currentMessage + 1).map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: index === currentMessage ? 1 : 0.3, x: 0 }}
                    exit={{ opacity: 0 }}
                    className={`font-mono text-sm mb-2 ${
                      index === currentMessage
                        ? 'text-cyan-400'
                        : 'text-gray-600'
                    }`}
                  >
                    {index === currentMessage && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="mr-2"
                      >
                        &gt;
                      </motion.span>
                    )}
                    {msg.text}
                    {index < currentMessage && (
                      <span className="text-emerald-400 ml-2">✓</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="flex justify-between text-xs text-gray-600 mb-2 font-mono">
                <span>LOADING SYSTEMS</span>
                <span>{progress}%</span>
              </div>

              <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-cyan-500/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 relative"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              </div>

              {/* Particles */}
              <div className="absolute -top-8 left-0 right-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                    style={{
                      left: `${(i / 20) * 100}%`,
                    }}
                    animate={{
                      y: [-20, -40, -20],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* System Info */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600 mb-1">BRAIN POWER</p>
                <p className="text-lg font-bold text-emerald-400 font-mono">READY</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">AGENTS</p>
                <p className="text-lg font-bold text-purple-400 font-mono">
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {Math.min(Math.floor(progress / 10) * 25, 250)}
                  </motion.span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">STATUS</p>
                <p className="text-lg font-bold text-cyan-400 font-mono">
                  {progress === 100 ? 'ONLINE' : 'LOADING'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
