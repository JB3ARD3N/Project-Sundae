'use client';

import { useState, useEffect } from 'react';
import { aiRouter } from '@/lib/forge/ai-router';

export default function BudgetMonitor() {
  const [usage, setUsage] = useState<any>({});
  const [health, setHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    updateUsage();
    const interval = setInterval(updateUsage, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const updateUsage = () => {
    const currentUsage = aiRouter.getCurrentUsage();
    setUsage(currentUsage);

    // Calculate health based on usage
    const maxUsagePercent = Math.max(
      ...Object.values(currentUsage).map((u: any) =>
        u.limit ? (u.used / u.limit) * 100 : 0
      )
    );

    if (maxUsagePercent > 80) setHealth('critical');
    else if (maxUsagePercent > 60) setHealth('warning');
    else setHealth('healthy');
  };

  const getHealthColor = () => {
    switch (health) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
    }
  };

  const getHealthIcon = () => {
    switch (health) {
      case 'healthy': return '💚';
      case 'warning': return '⚠️';
      case 'critical': return '🔴';
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 border-eko-gold/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-eko-gold">💰 Budget Monitor</h2>
        <span className={`text-2xl ${getHealthColor()}`}>
          {getHealthIcon()}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {Object.entries(usage).map(([provider, data]: [string, any]) => {
          const percent = data.limit ? (data.used / data.limit) * 100 : 0;

          return (
            <div key={provider} className="bg-slate-900/50 p-3 rounded-lg border border-eko-gold/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-300 capitalize">
                  {provider}
                </span>
                <span className="text-xs text-gray-500">
                  {data.used.toLocaleString()} / {data.limit.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percent > 80 ? 'bg-red-500' :
                    percent > 60 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-eko-gold/10 border border-eko-gold/30 rounded-lg p-4 text-center">
        <p className="text-eko-gold font-bold text-lg mb-1">🍽️ Everybody Eats</p>
        <p className="text-xs text-gray-400">100% Free Tier • Base Users Always Covered</p>
      </div>

      <div className="mt-4 pt-4 border-t border-eko-gold/20">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>System Health</span>
          <span className={getHealthColor()}>
            {health.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
