'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface DevToolsPanelProps {
  brainPower: number;
}

type Tab = 'terminal' | 'logs' | 'env' | 'git';

export default function DevToolsPanel({ brainPower }: DevToolsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('terminal');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    '$ Welcome to Chimera Terminal',
    '$ Brain Power: ' + brainPower + '%',
    '$ Type "help" for available commands',
  ]);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'terminal', label: 'Terminal', icon: '⌨️' },
    { id: 'logs', label: 'Logs', icon: '📋' },
    { id: 'env', label: 'Env', icon: '🔐' },
    { id: 'git', label: 'Git', icon: '🌿' },
  ];

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    setTerminalHistory(prev => [
      ...prev,
      `$ ${terminalInput}`,
      `> Executing with ${brainPower}% brain power...`,
      `> [Simulated output]`,
    ]);
    setTerminalInput('');
  };

  const envVars = [
    { key: 'BRAIN_POWER', value: `${brainPower}%`, status: 'active' },
    { key: 'NODE_ENV', value: 'production', status: 'active' },
    { key: 'CHIMERA_VERSION', value: 'v1.0.0', status: 'active' },
    { key: 'AGENT_COUNT', value: Math.floor(brainPower * 2.5).toString(), status: 'active' },
  ];

  const gitStatus = [
    { file: 'chimera-core/lib/brain/chimera-brain.ts', status: 'modified', color: 'text-yellow-400' },
    { file: 'eko-vision/components/os/DevTools.tsx', status: 'new', color: 'text-emerald-400' },
    { file: 'chimera-core/lib/agents/agent-mesh.ts', status: 'modified', color: 'text-yellow-400' },
  ];

  const logs = [
    { time: '14:23:42', level: 'INFO', message: 'Agent Apollo initialized' },
    { time: '14:23:43', level: 'INFO', message: 'Truth Engine operational' },
    { time: '14:23:44', level: 'WARN', message: 'High brain power detected' },
    { time: '14:23:45', level: 'INFO', message: 'Memory sync complete' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative h-full rounded-xl border border-yellow-500/30 bg-black/60 backdrop-blur-md overflow-hidden flex flex-col"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-yellow-500/10 blur-xl" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header with Tabs */}
        <div className="border-b border-yellow-500/20">
          <div className="p-4">
            <h3 className="text-lg font-bold text-yellow-400 tracking-wider mb-3">DEV TOOLS</h3>
          </div>

          <div className="flex border-t border-yellow-500/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2 text-xs font-mono transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-yellow-500/20 text-yellow-400 border-b-2 border-yellow-500'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Terminal Tab */}
          {activeTab === 'terminal' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1 bg-black/30">
                {terminalHistory.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={line.startsWith('$') ? 'text-emerald-400' : 'text-gray-400'}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>

              <form onSubmit={handleTerminalSubmit} className="p-3 border-t border-yellow-500/20 bg-black/50">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-mono text-sm">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Enter command..."
                    className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder-gray-600"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="h-full p-4 overflow-y-auto">
              <div className="space-y-2 font-mono text-xs">
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-2 rounded bg-black/30"
                  >
                    <span className="text-gray-600">{log.time}</span>
                    <span className={`font-bold ${
                      log.level === 'ERROR' ? 'text-red-400' :
                      log.level === 'WARN' ? 'text-yellow-400' :
                      'text-emerald-400'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-gray-400 flex-1">{log.message}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Environment Tab */}
          {activeTab === 'env' && (
            <div className="h-full p-4 overflow-y-auto">
              <div className="space-y-3">
                {envVars.map((env, index) => (
                  <motion.div
                    key={env.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg bg-black/30 border border-emerald-500/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-emerald-400">{env.key}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {env.status}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-white">{env.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Git Tab */}
          {activeTab === 'git' && (
            <div className="h-full p-4 overflow-y-auto">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-sm text-emerald-400 font-mono">Branch: main</span>
                </div>
                <p className="text-xs text-gray-500">3 files changed</p>
              </div>

              <div className="space-y-2">
                {gitStatus.map((file, index) => (
                  <motion.div
                    key={file.file}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg bg-black/30 border border-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-400 truncate flex-1">{file.file}</span>
                      <span className={`text-xs font-bold ${file.color} ml-2`}>{file.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <button className="w-full px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30 hover:bg-emerald-500/30 transition-all">
                  Commit & Push
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
