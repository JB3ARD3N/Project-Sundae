'use client';

import { motion } from 'framer-motion';

interface KPIMetricsSwitchesProps {
  activeMetrics: string[];
  onToggle: (metric: string) => void;
}

const METRICS = [
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: '🧠',
    color: 'cyan',
    description: 'AI learning rate & pattern extraction',
  },
  {
    id: 'speed',
    label: 'Speed',
    icon: '⚡',
    color: 'yellow',
    description: 'Response time & throughput',
  },
  {
    id: 'cost',
    label: 'Cost',
    icon: '💰',
    color: 'emerald',
    description: 'Budget tracking & optimization',
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: '🤖',
    color: 'purple',
    description: 'Active agent count & utilization',
  },
  {
    id: 'memory',
    label: 'Memory',
    icon: '🧬',
    color: 'pink',
    description: 'Knowledge base & recall accuracy',
  },
  {
    id: 'security',
    label: 'Security',
    icon: '🔒',
    color: 'red',
    description: 'Threat detection & encryption',
  },
  {
    id: 'build',
    label: 'Build Queue',
    icon: '🔨',
    color: 'orange',
    description: 'Active builds & deployment status',
  },
  {
    id: 'truth',
    label: 'Truth Score',
    icon: '✓',
    color: 'blue',
    description: 'Verification confidence levels',
  },
];

export default function KPIMetricsSwitches({ activeMetrics, onToggle }: KPIMetricsSwitchesProps) {
  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: Record<string, any> = {
      cyan: { border: 'border-cyan-500', bg: 'bg-cyan-500', text: 'text-cyan-400', glow: 'shadow-cyan-500' },
      yellow: { border: 'border-yellow-500', bg: 'bg-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500' },
      emerald: { border: 'border-emerald-500', bg: 'bg-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500' },
      purple: { border: 'border-purple-500', bg: 'bg-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500' },
      pink: { border: 'border-pink-500', bg: 'bg-pink-500', text: 'text-pink-400', glow: 'shadow-pink-500' },
      red: { border: 'border-red-500', bg: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500' },
      orange: { border: 'border-orange-500', bg: 'bg-orange-500', text: 'text-orange-400', glow: 'shadow-orange-500' },
      blue: { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500' },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="relative p-6 rounded-xl border border-purple-500/30 bg-black/60 backdrop-blur-md"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-purple-500/10 rounded-xl blur-xl" />

      <div className="relative z-10">
        <h3 className="text-lg font-bold text-purple-400 tracking-wider mb-4">KPI METRICS</h3>
        <p className="text-xs text-gray-500 mb-6">Toggle to monitor specific metrics</p>

        <div className="space-y-3">
          {METRICS.map((metric, index) => {
            const isActive = activeMetrics.includes(metric.id);
            const colorClasses = getColorClasses(metric.color, isActive);

            return (
              <motion.button
                key={metric.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onToggle(metric.id)}
                className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                  isActive
                    ? `${colorClasses.border} bg-black/50`
                    : 'border-gray-700 bg-black/30'
                } hover:scale-105 active:scale-95 group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{metric.icon}</span>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${isActive ? colorClasses.text : 'text-gray-400'}`}>
                        {metric.label}
                      </p>
                      <p className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors">
                        {metric.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      isActive ? colorClasses.bg : 'bg-gray-700'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isActive ? 24 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full ${
                        isActive ? `shadow-lg ${colorClasses.glow}/50` : ''
                      }`}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-purple-500/20">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Active Metrics</span>
            <span className="font-mono font-bold text-purple-400">
              {activeMetrics.length} / {METRICS.length}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
