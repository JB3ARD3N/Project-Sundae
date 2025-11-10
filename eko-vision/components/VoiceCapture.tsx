'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/config';

export default function VoiceCapture() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript);
          }
        };
      }
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
      setIsSaved(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveCapture = async () => {
    if (!transcript) return;

    try {
      const { error } = await supabase.from('captures').insert({
        transcript,
        status: 'new',
        tags: ['urgent', 'api', 'dashboard'].filter(k => transcript.toLowerCase().includes(k))
      });

      if (error) throw error;

      setIsSaved(true);
      setTimeout(() => {
        setTranscript('');
        setIsSaved(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 border-eko-cyan/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-eko-cyan">🎤 Voice Capture</h2>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-eko-cyan hover:bg-eko-cyan/80 text-slate-900'
          }`}
        >
          {isRecording ? '⏹️ Stop' : '🎤 Record'}
        </button>
      </div>

      {transcript && (
        <div className="mt-4">
          <div className="bg-slate-900/50 p-4 rounded-lg mb-4 min-h-[100px] border border-eko-cyan/20">
            <p className="text-gray-300">{transcript}</p>
          </div>
          <button onClick={saveCapture} className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition-all">
            {isSaved ? '✅ Saved!' : '💾 Save to Queue'}
          </button>
        </div>
      )}
    </div>
  );
}
