'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/config';
import { forgeProcessor } from '@/lib/forge/processor';
import type { QueueItem } from '@/lib/supabase/config';

export default function BuildQueue() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    const { data } = await supabase
      .from('captures')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const shipIt = async (item: QueueItem) => {
    setProcessing(item.id);
    try {
      const result = await forgeProcessor.process(item.transcript || 'Unnamed', 'base');
      await supabase
        .from('captures')
        .update({ status: 'shipped', cost: result.totalCost })
        .eq('id', item.id);
      alert(`🎉 Shipped! Cost: $${result.totalCost.toFixed(4)}`);
      loadQueue();
    } catch (err) {
      alert('Failed: ' + (err as Error).message);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-400">Loading...</div>;

  return (
    <div className="glass-morphism rounded-2xl p-6 border-eko-cyan/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-eko-cyan">📋 Build Queue</h2>
        <button
          onClick={loadQueue}
          className="px-4 py-2 bg-eko-cyan/20 hover:bg-eko-cyan/30 rounded-lg text-sm transition-all"
        >
          🔄 Refresh
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-eko-cyan/50 transition-all"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <span className="text-gray-400 text-sm">#{i + 1}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === 'new'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.tags && item.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm">{item.transcript || 'Untitled'}</p>
                {item.cost && (
                  <p className="text-xs text-gray-500 mt-2">Cost: ${item.cost.toFixed(4)}</p>
                )}
              </div>
              <button
                onClick={() => shipIt(item)}
                disabled={processing === item.id || item.status === 'shipped'}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  processing === item.id
                    ? 'bg-yellow-500 animate-pulse'
                    : item.status === 'shipped'
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {processing === item.id ? '⏳ Building...' : item.status === 'shipped' ? '✅ Shipped' : '🚀 Ship It'}
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="mb-2">No items in queue</p>
            <p className="text-sm">Record a voice note to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
