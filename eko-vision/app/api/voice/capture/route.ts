import { NextRequest, NextResponse } from 'next/server';
import { VoiceSystem } from '@/lib/chimera-core/voice-system';
import { IntentEngine } from '@/lib/chimera-core/intent-engine';

// Singleton instances
let voiceSystemInstance: VoiceSystem | null = null;
let intentEngineInstance: IntentEngine | null = null;

function getVoiceSystem() {
  if (!voiceSystemInstance) {
    voiceSystemInstance = new VoiceSystem({
      primaryEngine: 'webspeech',
      fallbackEngine: 'whisper',
      targetLatency: 115,
      enableGlyphCompression: true,
    });
  }
  return voiceSystemInstance;
}

function getIntentEngine() {
  if (!intentEngineInstance) {
    intentEngineInstance = new IntentEngine();
  }
  return intentEngineInstance;
}

/**
 * POST /api/voice/capture
 * Process voice input and extract intent
 *
 * Body: {
 *   transcript: string,
 *   audioBlob?: string (base64),
 *   useGlyphCompression?: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript, audioBlob, useGlyphCompression = true } = body;

    if (!transcript && !audioBlob) {
      return NextResponse.json({
        success: false,
        error: 'Either transcript or audioBlob is required',
      }, { status: 400 });
    }

    const voice = getVoiceSystem();
    const intent = getIntentEngine();

    let finalTranscript = transcript;

    // If audioBlob provided, transcribe it
    if (audioBlob && !transcript) {
      // In production, this would call Whisper API
      // For now, return error asking for transcript
      return NextResponse.json({
        success: false,
        error: 'Audio transcription not yet implemented. Please provide transcript.',
      }, { status: 501 });
    }

    // Extract intent from transcript
    const intentResult = await intent.parseIntent(finalTranscript);

    // Compress if enabled
    let compressed = null;
    if (useGlyphCompression) {
      compressed = voice.compressToGlyph(finalTranscript);
    }

    return NextResponse.json({
      success: true,
      data: {
        transcript: finalTranscript,
        intent: intentResult,
        compressed,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error: any) {
    console.error('Voice capture error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/voice/spell
 * Execute a pre-defined voice spell
 *
 * Body: {
 *   spellName: string,
 *   params?: Record<string, any>
 * }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { spellName, params = {} } = body;

    if (!spellName) {
      return NextResponse.json({
        success: false,
        error: 'Spell name is required',
      }, { status: 400 });
    }

    const voice = getVoiceSystem();
    const result = await voice.executeSpell(spellName, params);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    console.error('Voice spell error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
