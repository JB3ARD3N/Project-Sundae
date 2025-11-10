'use client';

import { useState, useEffect } from 'react';

export default function CompoundMeter() {
  const [stats, setStats] = useState({
    daysActive: 93,
    dailyGrowth: 0.01,
    baseIntelligence: 100,
    currentIntelligence: 0,
    improvement: 0
  });

  useEffect(() => {
    const current = stats.baseIntelligence * Math.pow(1 + stats.dailyGrowth, stats.daysActive);
    const improvement = ((current / stats.baseIntelligence) - 1) * 100;

    setStats(prev => ({
      ...prev,
      currentIntelligence: current,
      improvement
    }));
  }, [stats.daysActive]);

  return (
    <div className="glass-morphism rounded-2xl p-6 border-eko-cyan/30">
      <h2 className="text-xl font-bold text-eko-cyan mb-4">📈 Intelligence Compound</h2>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-eko-cyan to-eko-purple mb-2">
          {stats.improvement.toFixed(0)}%
        </div>
        <div className="text-gray-400">Growth Since Launch</div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-900/50 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Daily Growth Rate</div>
          <div className="text-2xl font-bold text-green-400">+1% minimum</div>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Active Days</div>
          <div className="text-2xl font-bold text-eko-cyan">{stats.daysActive}</div>
        </div>

        <div className="text-center text-xs text-gray-500">
          Compounding daily • Never plateau
        </div>
      </div>
    </div>
  );
}
