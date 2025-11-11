'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SystemStatusProps {
  brainPower: number;
  isPipelineRunning: boolean;
}

export default function SystemStatus({ brainPower, isPipelineRunning }: SystemStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cpuUsage] = useState(Math.round(brainPower * 0.8));
  const [memoryUsage] = useState(Math.round(brainPower * 0.6));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    if (isPipelineRunning) return { text: 'text-yellow-400', dot: 'bg-yellow-400' };
    if (brainPower > 80) return { text: 'text-red-400', dot: 'bg-red-400' };
    if (brainPower > 50) return { text: 'text-emerald-400', dot: 'bg-emerald-400' };
    return { text: 'text-cyan-400', dot: 'bg-cyan-400' };
  };

  const statusColor = getStatusColor();

  return (
    <div className="flex items-center gap-6">
      {/* System Status */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-2 h-2 ${statusColor.dot} rounded-full`}
        />
        <span className={`text-sm font-bold ${statusColor.text}`}>
          {isPipelineRunning ? 'DEPLOYING' : brainPower > 80 ? 'HIGH POWER' : 'OPERATIONAL'}
        </span>
      </div>

      {/* CPU */}
      <div className="hidden sm:block">
        <p className="text-xs text-gray-500">CPU</p>
        <p className="text-sm font-mono text-cyan-400">{cpuUsage}%</p>
      </div>

      {/* Memory */}
      <div className="hidden sm:block">
        <p className="text-xs text-gray-500">MEM</p>
        <p className="text-sm font-mono text-purple-400">{memoryUsage}%</p>
      </div>

      {/* Agents */}
      <div className="hidden md:block">
        <p className="text-xs text-gray-500">AGENTS</p>
        <p className="text-sm font-mono text-emerald-400">{Math.floor(brainPower * 2.5)}</p>
      </div>

      {/* Time */}
      <div className="hidden lg:block">
        <p className="text-xs text-gray-500">TIME</p>
        <p className="text-sm font-mono text-gray-400">
          {currentTime.toLocaleTimeString('en-US', { hour12: false })}
        </p>
      </div>

      {/* Power Indicator */}
      <div className="flex flex-col items-end">
        <p className="text-xs text-gray-500">POWER</p>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-3 rounded-sm ${
                i < Math.floor(brainPower / 20)
                  ? i < 2 ? 'bg-cyan-500' : i < 4 ? 'bg-yellow-500' : 'bg-red-500'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
