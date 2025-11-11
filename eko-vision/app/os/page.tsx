'use client';

import { useState } from 'react';
import CockpitHUD from '@/components/os/CockpitHUD';
import BrainPowerLever from '@/components/os/BrainPowerLever';
import KPIMetricsSwitches from '@/components/os/KPIMetricsSwitches';
import DevToolsPanel from '@/components/os/DevToolsPanel';
import AutomationPipeline from '@/components/os/AutomationPipeline';
import SystemStatus from '@/components/os/SystemStatus';
import BootSequence from '@/components/os/BootSequence';

export default function ChimeraOS() {
  const [brainPower, setBrainPower] = useState(50); // 0-100 scale
  const [activeMetrics, setActiveMetrics] = useState<string[]>(['intelligence', 'speed', 'cost']);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  // Show boot sequence on first load
  if (isBooting) {
    return <BootSequence onComplete={() => setIsBooting(false)} />;
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Starfield Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main Cockpit HUD */}
      <CockpitHUD brainPower={brainPower}>
        {/* Top Bar - System Status */}
        <div className="relative z-20 border-b border-cyan-500/30 bg-black/80 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-purple-500 to-emerald-500 rounded-lg animate-pulse-slow" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-emerald-500 rounded-lg blur-lg opacity-50" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-wider">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400">
                      CHIMERA OS
                    </span>
                  </h1>
                  <p className="text-xs text-cyan-400/70 font-mono">Personal Command Center</p>
                </div>
              </div>

              <SystemStatus brainPower={brainPower} isPipelineRunning={isPipelineRunning} />
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="relative z-10 container mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">

            {/* Left Column - Brain Power Lever & KPI Switches */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <BrainPowerLever
                value={brainPower}
                onChange={setBrainPower}
              />
              <KPIMetricsSwitches
                activeMetrics={activeMetrics}
                onToggle={(metric) => {
                  setActiveMetrics(prev =>
                    prev.includes(metric)
                      ? prev.filter(m => m !== metric)
                      : [...prev, metric]
                  );
                }}
              />
            </div>

            {/* Center Column - Automation Pipeline */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <AutomationPipeline
                brainPower={brainPower}
                activeMetrics={activeMetrics}
                isRunning={isPipelineRunning}
                onRunningChange={setIsPipelineRunning}
              />
            </div>

            {/* Right Column - Dev Tools */}
            <div className="col-span-12 lg:col-span-3">
              <DevToolsPanel brainPower={brainPower} />
            </div>
          </div>
        </div>
      </CockpitHUD>
    </main>
  );
}
