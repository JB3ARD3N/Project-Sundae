'use client';

import { useState, useEffect } from 'react';

export default function CompoundMeter() {
  const [growth, setGrowth] = useState(1.0); // Start at 1% daily minimum
  const [streak, setStreak] = useState(1);
  const [totalGrowth, setTotalGrowth] = useState(0);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('compound-growth');
    if (saved) {
      const data = JSON.parse(saved);
      setGrowth(data.growth || 1.0);
      setStreak(data.streak || 1);
      setTotalGrowth(data.totalGrowth || 0);
    }

    // Check if we need to compound today
    const lastCompound = localStorage.getItem('last-compound-date');
    const today = new Date().toDateString();

    if (lastCompound !== today) {
      // New day - compound the growth
      const newTotal = totalGrowth + growth;
      setTotalGrowth(newTotal);
      setStreak(streak + 1);

      // Growth accelerates with streak (but minimum 1%)
      const newGrowth = Math.max(1.0, growth + (streak * 0.1));
      setGrowth(newGrowth);

      // Save
      localStorage.setItem('compound-growth', JSON.stringify({
        growth: newGrowth,
        streak: streak + 1,
        totalGrowth: newTotal
      }));
      localStorage.setItem('last-compound-date', today);
    }
  }, []);

  const getGrowthColor = () => {
    if (growth >= 5) return 'text-eko-purple';
    if (growth >= 3) return 'text-eko-cyan';
    return 'text-eko-gold';
  };

  const getStreakEmoji = () => {
    if (streak >= 30) return '🔥';
    if (streak >= 7) return '⚡';
    return '🌱';
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 border-eko-cyan/30">
      <h2 className="text-xl font-bold text-eko-cyan mb-4">📈 Compound Intelligence</h2>

      <div className="text-center mb-6">
        <div className="text-6xl font-bold mb-2">
          <span className={getGrowthColor()}>{totalGrowth.toFixed(1)}%</span>
        </div>
        <p className="text-sm text-gray-400">Total Growth</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-900/50 p-4 rounded-lg border border-eko-cyan/20 text-center">
          <div className="text-2xl font-bold text-eko-cyan mb-1">
            +{growth.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-400">Daily Growth</p>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-lg border border-eko-gold/20 text-center">
          <div className="text-2xl font-bold text-eko-gold mb-1">
            {getStreakEmoji()} {streak}
          </div>
          <p className="text-xs text-gray-400">Day Streak</p>
        </div>
      </div>

      <div className="bg-eko-cyan/10 border border-eko-cyan/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-eko-cyan">Progress Bar</span>
          <span className="text-xs text-gray-400">{Math.min(totalGrowth, 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-eko-cyan via-eko-purple to-eko-gold rounded-full transition-all duration-1000 bioluminescent-glow"
            style={{ width: `${Math.min(totalGrowth, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-eko-cyan/20 text-center">
        <p className="text-xs text-gray-500 italic">
          "Daily +1% minimum. Never backwards."
        </p>
      </div>
    </div>
  );
}
