'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  type: string;
  message: string;
  timestamp: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
}

interface ActivityFeedProps {
  events: Event[];
}

const getEventIcon = (type: string) => {
  const icons: Record<string, string> = {
    query: '🔍',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    agent: '🤖',
    cost: '💰',
    security: '🔒',
    learning: '🧠'
  };
  return icons[type] || '📌';
};

const getSeverityColor = (severity?: string) => {
  const colors: Record<string, string> = {
    info: 'text-cyan-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  };
  return colors[severity || 'info'] || 'text-gray-400';
};

export default function ActivityFeed({ events }: ActivityFeedProps) {
  const displayEvents = events.slice(-10).reverse(); // Show last 10, newest first

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">Live Intelligence Feed</h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {displayEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">🌊</div>
              <div className="text-sm">Awaiting neural activity...</div>
            </div>
          ) : (
            displayEvents.map((event, index) => (
              <motion.div
                key={`${event.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
              >
                <span className="text-2xl">{getEventIcon(event.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${getSeverityColor(event.severity)}`}>
                    {event.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Real-time indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-cyan-400"
        />
        <span>Live monitoring active</span>
      </div>
    </div>
  );
}
