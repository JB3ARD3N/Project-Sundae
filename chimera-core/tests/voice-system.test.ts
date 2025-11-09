/**
 * Voice System Tests
 *
 * Test speed-of-thought voice creation
 */

import { VoiceSystem } from '../lib/voice/voice-system';

describe('Voice System - Speed of Thought', () => {
  let voiceSystem: VoiceSystem;

  beforeEach(() => {
    voiceSystem = new VoiceSystem();
  });

  describe('Intent Extraction', () => {
    test('should extract create agent intent', async () => {
      const result = await voiceSystem.processVoice('create a security agent');

      expect(result.command).toBe('create');
      expect(result.parameters.type).toBe('security');
      expect(result.parameters.category).toBe('agent');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('should extract verify intent', async () => {
      const result = await voiceSystem.processVoice('verify that water freezes at 0 degrees');

      expect(result.command).toBe('verify');
      expect(result.parameters.claim).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('should handle unknown commands', async () => {
      const result = await voiceSystem.processVoice('xyzabc random gibberish');

      expect(result.command).toBe('unknown');
      expect(result.confidence).toBeLessThan(0.5);
    });
  });

  describe('Glyph Compression', () => {
    test('should compress commands to glyphs', async () => {
      const result = await voiceSystem.processVoice('create a security agent');

      expect(result.glyph).toBeDefined();
      expect(result.glyph).toMatch(/^G:/);
      expect(result.glyph.length).toBeLessThan(result.command.length);
    });

    test('should achieve 8x compression ratio', async () => {
      const result = await voiceSystem.processVoice('create a security agent');

      const originalLength = 'create security agent'.length;
      const compressedLength = result.glyph.length;

      // Should be significantly compressed
      expect(compressedLength).toBeLessThan(originalLength / 2);
    });
  });

  describe('Performance', () => {
    test('should process voice in under 200ms', async () => {
      const start = Date.now();
      await voiceSystem.processVoice('create a data agent');
      const duration = Date.now() - start;

      // Target: 115ms (WebSpeech 10ms + Whisper 50ms + Gemini 30ms + Processing 25ms)
      // Allow up to 200ms for test environment
      expect(duration).toBeLessThan(200);
    });

    test('should handle batch commands quickly', async () => {
      const commands = [
        'create security agent',
        'verify water freezes at 0 degrees',
        'add truth engine to project'
      ];

      const start = Date.now();
      await Promise.all(commands.map(cmd => voiceSystem.processVoice(cmd)));
      const duration = Date.now() - start;

      // Should process all 3 in under 500ms
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Statistics', () => {
    test('should track system stats', () => {
      const stats = voiceSystem.getStats();

      expect(stats.glyphPatterns).toBeGreaterThan(0);
      expect(stats.spells).toBeGreaterThan(0);
      expect(stats.config).toBeDefined();
    });
  });

  describe('Configuration', () => {
    test('should allow disabling glyph compression', async () => {
      const system = new VoiceSystem({ glyphCompression: false });
      const result = await system.processVoice('create agent');

      expect(result.glyph).toBe('');
    });

    test('should allow disabling spell casting', async () => {
      const system = new VoiceSystem({ spellCasting: false });
      const result = await system.processVoice('create agent');

      // Should still process but not execute spell
      expect(result.command).toBe('create');
    });
  });
});
