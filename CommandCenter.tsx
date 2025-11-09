'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CommandCenterProps {
  onCommand: (command: string) => void;
}

const quickCommands = [
  { label: 'System Status', command: 'Get full system status report', icon: '📊' },
  { label: 'Compound Learning', command: 'Trigger compound learning cycle', icon: '🧠' },
  { label: 'Cost Analysis', command: 'Analyze cost optimization opportunities', icon: '💰' },
  { label: 'Security Audit', command: 'Run security and bias audit', icon: '🔒' }
];

export default function CommandCenter({ onCommand }: CommandCenterProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (command: string) => {
    if (!command.trim()) return;

    setLoading(true);
    try {
      await onCommand(command);
      setInput('');
    } catch (error) {
      console.error('Command execution failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(input);
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">Command Center</h3>

      {/* Quick Commands */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {quickCommands.map((cmd, index) => (
          <motion.button
            key={cmd.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSubmit(cmd.command)}
            disabled={loading}
            className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/20 hover:border-purple-500/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xl">{cmd.icon}</span>
            <span className="text-xs font-medium text-white">{cmd.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Custom Command Input */}
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter custom command... (Shift+Enter for new line)"
          disabled={loading}
          className="w-full p-4 bg-slate-700/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none disabled:opacity-50"
          rows={3}
        />

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSubmit(input)}
          disabled={loading || !input.trim()}
          className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="text-white text-xl"
            >
              ⚙️
            </motion.div>
          ) : (
            <span className="text-white text-xl">🚀</span>
          )}
        </motion.button>
      </div>

      {/* Hint */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Powered by your Flo System • Truth above all
      </div>
    </div>
  );
}
