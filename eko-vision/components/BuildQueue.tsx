'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/config';
import { forgeProcessor } from '@/lib/forge/processor';

interface Capture {
  id: string;
  transcript: string;
  status: string;
  tags: string[];
  created_at: string;
}

export default function BuildQueue() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [building, setBuilding] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadCaptures();

    // Real-time subscription
    const subscription = supabase
      .channel('captures-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'captures'
      }, () => {
        loadCaptures();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadCaptures = async () => {
    const { data, error } = await supabase
      .from('captures')
      .select('*')
      .eq('status', 'new')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setCaptures(data);
    }
  };

  const shipIt = async (capture: Capture) => {
    setBuilding(capture.id);
    setResult(null);

    try {
      // Process with Forge
      const processResult = await forgeProcessor.process(capture.transcript, 'base');

      // Update status
      await supabase
        .from('captures')
        .update({ status: 'shipped' })
        .eq('id', capture.id);

      setResult(processResult);
      loadCaptures();
    } catch (error) {
      console.error('Build failed:', error);
      alert('Build failed. Check console for details.');
    } finally {
      setBuilding(null);
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 border-eko-cyan/30">
      <h2 className="text-xl font-bold text-eko-cyan mb-4">🚀 Build Queue</h2>

      {captures.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No captures in queue</p>
          <p className="text-sm mt-2">Use Voice Capture to add items</p>
        </div>
      ) : (
        <div className="space-y-3">
          {captures.map((capture) => (
            <div
              key={capture.id}
              className="bg-slate-900/50 p-4 rounded-lg border border-eko-cyan/20 hover:border-eko-cyan/40 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-300 text-sm flex-1">{capture.transcript}</p>
                <button
                  onClick={() => shipIt(capture)}
                  disabled={building === capture.id}
                  className={`ml-4 px-4 py-1 rounded-lg font-semibold text-sm transition-all ${
                    building === capture.id
                      ? 'bg-eko-cyan/50 animate-pulse cursor-not-allowed'
                      : 'bg-eko-cyan hover:bg-eko-cyan/80 text-slate-900'
                  }`}
                >
                  {building === capture.id ? '⚡ Building...' : '🚀 Ship It'}
                </button>
              </div>

              {capture.tags && capture.tags.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {capture.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-eko-purple/20 text-eko-purple rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <h3 className="text-green-400 font-semibold mb-2">✅ Build Complete</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Fragments:</strong> {result.fragments.length}</p>
            <p><strong>Cost:</strong> ${result.totalCost.toFixed(4)}</p>
            <p className="text-xs text-gray-500 mt-2">{result.handoff}</p>
          </div>
          <button
            onClick={() => setResult(null)}
            className="mt-3 text-xs text-gray-400 hover:text-gray-300"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
