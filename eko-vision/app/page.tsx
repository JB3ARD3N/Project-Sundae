import EkoLogo from '@/components/EkoLogo';
import VoiceCapture from '@/components/VoiceCapture';
import ZipUploader from '@/components/ZipUploader';
import BuildQueue from '@/components/BuildQueue';
import BudgetMonitor from '@/components/BudgetMonitor';
import CompoundMeter from '@/components/CompoundMeter';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-eko-cyan/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-eko-purple/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-eko-gold/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <EkoLogo size={50} />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-eko-cyan via-eko-purple to-eko-gold bg-clip-text text-transparent">
                  eko.vision
                </h1>
                <p className="text-sm text-gray-400">Build Mode: ON • Chimera Powered</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Status: <span className="text-green-400 font-semibold">Operational</span></p>
              <p className="text-xs text-gray-500">v1.0.0-alpha • <span className="text-eko-gold">Pro</span> Ready</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Voice Capture - Full width on mobile, spans 2 columns on xl */}
          <div className="xl:col-span-2">
            <VoiceCapture />
          </div>

          {/* Compound Meter */}
          <div>
            <CompoundMeter />
          </div>

          {/* Build Queue - Spans 2 columns */}
          <div className="lg:col-span-2">
            <BuildQueue />
          </div>

          {/* Zip Uploader */}
          <div>
            <ZipUploader />
          </div>

          {/* Budget Monitor - Spans full width on mobile */}
          <div className="lg:col-span-2 xl:col-span-3">
            <BudgetMonitor />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <h3 className="text-eko-cyan font-bold mb-2">🧠 Intelligence</h3>
              <p className="text-xs text-gray-400">
                Self-improving validation pipeline
              </p>
              <p className="text-xs text-gray-400">
                Pattern extraction & replication
              </p>
            </div>
            <div>
              <h3 className="text-eko-purple font-bold mb-2">⚡ Speed</h3>
              <p className="text-xs text-gray-400">
                100% free-tier AI routing
              </p>
              <p className="text-xs text-gray-400">
                Front-load work, compound speed
              </p>
            </div>
            <div>
              <h3 className="text-eko-gold font-bold mb-2">🔒 Security</h3>
              <p className="text-xs text-gray-400">
                Dual-vault architecture
              </p>
              <p className="text-xs text-gray-400">
                Client-side encryption • NAS backup
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-500 italic">
              "Daily +1% minimum. Everybody Eats. Build don't buy."
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Powered by Chimera Brain • Built with Truth Engine • <span className="text-eko-gold">Prometheus Pro</span> Available
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
