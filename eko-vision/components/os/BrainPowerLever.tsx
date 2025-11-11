'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface BrainPowerLeverProps {
  value: number;
  onChange: (value: number) => void;
}

export default function BrainPowerLever({ value, onChange }: BrainPowerLeverProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getPowerLevel = () => {
    if (value < 20) return { label: 'IDLE', color: 'text-blue-400', glow: 'bg-blue-500' };
    if (value < 40) return { label: 'LOW', color: 'text-cyan-400', glow: 'bg-cyan-500' };
    if (value < 60) return { label: 'MEDIUM', color: 'text-emerald-400', glow: 'bg-emerald-500' };
    if (value < 80) return { label: 'HIGH', color: 'text-yellow-400', glow: 'bg-yellow-500' };
    return { label: 'MAXIMUM', color: 'text-red-400', glow: 'bg-red-500' };
  };

  const powerLevel = getPowerLevel();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative p-6 rounded-xl border border-cyan-500/30 bg-black/60 backdrop-blur-md"
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 ${powerLevel.glow}/10 rounded-xl blur-xl transition-all duration-300`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-cyan-400 tracking-wider">BRAIN POWER</h3>
          <div className={`px-3 py-1 rounded-lg border ${powerLevel.color} border-current bg-black/50 font-mono text-sm font-bold`}>
            {powerLevel.label}
          </div>
        </div>

        {/* Power Display */}
        <div className="text-center mb-6">
          <motion.div
            animate={{
              scale: isDragging ? 1.1 : 1,
              textShadow: isDragging ? '0 0 20px currentColor' : '0 0 10px currentColor',
            }}
            className={`text-6xl font-bold ${powerLevel.color} font-mono tabular-nums`}
          >
            {value}
            <span className="text-2xl">%</span>
          </motion.div>
          <p className="text-xs text-gray-500 mt-2 font-mono">AI Processing Intensity</p>
        </div>

        {/* Vertical Lever */}
        <div className="relative h-64 mx-auto w-16">
          {/* Track Background */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-red-500 via-yellow-500 via-emerald-500 via-cyan-500 to-blue-500 rounded-full opacity-20" />

          {/* Active Track */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-2 rounded-full transition-all duration-300"
            style={{
              height: `${value}%`,
              bottom: 0,
              background: `linear-gradient(to top,
                ${value < 20 ? '#3b82f6' :
                  value < 40 ? '#06b6d4' :
                  value < 60 ? '#10b981' :
                  value < 80 ? '#eab308' : '#ef4444'})`,
              boxShadow: `0 0 20px ${value < 20 ? '#3b82f6' :
                value < 40 ? '#06b6d4' :
                value < 60 ? '#10b981' :
                value < 80 ? '#eab308' : '#ef4444'}`,
            }}
          />

          {/* Draggable Handle */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 256 }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={(_, info) => {
              setIsDragging(true);
              const newValue = Math.max(0, Math.min(100, 100 - (info.point.y / 256) * 100));
              onChange(Math.round(newValue));
            }}
            onDragEnd={() => setIsDragging(false)}
            animate={{
              y: (100 - value) * 2.56,
              scale: isDragging ? 1.2 : 1,
            }}
            className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full ${powerLevel.glow} cursor-grab active:cursor-grabbing shadow-lg`}
            style={{
              boxShadow: `0 0 30px currentColor, inset 0 2px 10px rgba(255,255,255,0.3)`,
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-2 bg-white/30 rounded-full" />
            <div className="absolute inset-3 bg-white/50 rounded-full animate-pulse" />
          </motion.div>

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className="absolute right-full mr-2 text-xs text-gray-600 font-mono"
              style={{ bottom: `${tick}%`, transform: 'translateY(50%)' }}
            >
              {tick}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 pt-4 border-t border-cyan-500/20">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-500">Agents Active</p>
              <p className={`font-mono font-bold ${powerLevel.color}`}>
                {Math.floor(value * 2.5)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Est. Cost/hr</p>
              <p className={`font-mono font-bold ${powerLevel.color}`}>
                ${(value * 0.05).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
