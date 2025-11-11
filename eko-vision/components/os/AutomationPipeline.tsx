'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AutomationPipelineProps {
  brainPower: number;
  activeMetrics: string[];
  isRunning: boolean;
  onRunningChange: (running: boolean) => void;
}

type Stage = 'research' | 'build' | 'deploy';

interface StageData {
  id: Stage;
  label: string;
  icon: string;
  color: string;
  description: string;
}

const STAGES: StageData[] = [
  {
    id: 'research',
    label: 'Research',
    icon: '🔍',
    color: 'cyan',
    description: 'Analyzing requirements & gathering data',
  },
  {
    id: 'build',
    label: 'Build',
    icon: '🔨',
    color: 'yellow',
    description: 'Generating code & running tests',
  },
  {
    id: 'deploy',
    label: 'Deploy',
    icon: '🚀',
    color: 'emerald',
    description: 'Pushing to production',
  },
];

export default function AutomationPipeline({
  brainPower,
  activeMetrics,
  isRunning,
  onRunningChange,
}: AutomationPipelineProps) {
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runPipeline = async () => {
    onRunningChange(true);
    setCompletedStages([]);
    setProgress(0);
    addLog('🚀 Pipeline initiated');

    // Research Stage
    setCurrentStage('research');
    addLog('🔍 Starting research phase...');
    await simulateStage('research', brainPower);
    setCompletedStages(['research']);
    addLog('✓ Research complete');

    // Build Stage
    setCurrentStage('build');
    addLog('🔨 Starting build phase...');
    await simulateStage('build', brainPower);
    setCompletedStages(['research', 'build']);
    addLog('✓ Build complete');

    // Deploy Stage
    setCurrentStage('deploy');
    addLog('🚀 Starting deployment...');
    await simulateStage('deploy', brainPower);
    setCompletedStages(['research', 'build', 'deploy']);
    addLog('✓ Deployment successful!');

    setCurrentStage(null);
    onRunningChange(false);
    setProgress(100);
    addLog('🎉 Pipeline complete!');
  };

  const simulateStage = async (stage: Stage, power: number) => {
    const duration = Math.max(2000, 5000 - (power * 30)); // Faster with more power
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, duration / steps));
      setProgress((prev) => Math.min(100, prev + (100 / (STAGES.length * steps))));
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
      cyan: { bg: 'bg-cyan-500', text: 'text-cyan-400', glow: 'shadow-cyan-500', border: 'border-cyan-500' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500', border: 'border-yellow-500' },
      emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500', border: 'border-emerald-500' },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-full rounded-xl border border-emerald-500/30 bg-black/60 backdrop-blur-md overflow-hidden"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-emerald-500/10 blur-xl" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-emerald-400 tracking-wider">AUTOMATION PIPELINE</h3>
              <p className="text-xs text-gray-500 mt-1">Research → Build → Deploy</p>
            </div>

            {/* Big Deploy Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runPipeline}
              disabled={isRunning}
              className={`relative px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                isRunning
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70'
              }`}
            >
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  RUNNING...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🚀 DEPLOY NOW
                </span>
              )}
            </motion.button>
          </div>

          {/* Progress Bar */}
          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-yellow-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-500 text-right mt-1 font-mono">{Math.round(progress)}%</p>
            </motion.div>
          )}
        </div>

        {/* Pipeline Stages */}
        <div className="p-6 flex-1 overflow-hidden">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {STAGES.map((stage, index) => {
              const isActive = currentStage === stage.id;
              const isCompleted = completedStages.includes(stage.id);
              const colorClasses = getColorClasses(stage.color);

              return (
                <div key={stage.id} className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-4 rounded-lg border transition-all duration-300 ${
                      isActive
                        ? `${colorClasses.border} bg-black/50 shadow-lg ${colorClasses.glow}/50`
                        : isCompleted
                        ? 'border-emerald-500/50 bg-black/30'
                        : 'border-gray-700 bg-black/20'
                    }`}
                  >
                    {/* Pulse animation for active stage */}
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`absolute inset-0 ${colorClasses.border} rounded-lg`}
                      />
                    )}

                    <div className="relative z-10 text-center">
                      <motion.div
                        animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
                        className="text-4xl mb-2"
                      >
                        {isCompleted ? '✓' : stage.icon}
                      </motion.div>
                      <p className={`font-bold mb-1 ${isActive ? colorClasses.text : isCompleted ? 'text-emerald-400' : 'text-gray-400'}`}>
                        {stage.label}
                      </p>
                      <p className="text-xs text-gray-600">{stage.description}</p>
                    </div>
                  </motion.div>

                  {/* Connector Arrow */}
                  {index < STAGES.length - 1 && (
                    <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 translate-x-full z-20">
                      <motion.div
                        animate={isActive ? { x: [0, 5, 0] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className={`text-2xl ${completedStages.includes(stage.id) ? 'text-emerald-400' : 'text-gray-700'}`}
                      >
                        →
                      </motion.div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Live Logs */}
          <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-xs text-gray-400 font-mono">LIVE LOGS</p>
            </div>

            <div className="space-y-1 font-mono text-xs h-24 overflow-y-auto">
              <AnimatePresence>
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-400"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
              {logs.length === 0 && (
                <p className="text-gray-600 italic">Waiting for pipeline execution...</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Speed</p>
              <p className="text-lg font-bold text-cyan-400 font-mono">
                {Math.max(1, Math.round(brainPower / 10))}x
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Est. Time</p>
              <p className="text-lg font-bold text-yellow-400 font-mono">
                {Math.max(1, 15 - Math.round(brainPower / 10))}m
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Agents</p>
              <p className="text-lg font-bold text-emerald-400 font-mono">
                {Math.floor(brainPower / 20) + 1}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
