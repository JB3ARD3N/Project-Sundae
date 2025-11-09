/**
 * Security Fortress Tests
 *
 * Test IP protection and anti-reverse engineering
 */

import { SecurityFortress } from '../lib/security/security-fortress';

describe('Security Fortress - Maximum IP Protection', () => {
  let fortress: SecurityFortress;

  beforeEach(() => {
    fortress = new SecurityFortress({
      watermarkId: 'test-watermark-123'
    });
  });

  describe('Code Obfuscation', () => {
    test('should obfuscate variable names', () => {
      const originalCode = `
        const confidence = 0.95;
        const evidence = getData();
        const result = analyze(evidence);
      `;

      const obfuscated = fortress.obfuscateCode(originalCode);

      // Should not contain original variable names
      expect(obfuscated).not.toContain('confidence');
      expect(obfuscated).not.toContain('evidence');
      expect(obfuscated).not.toContain('result');
    });

    test('should add decoy code when enabled', () => {
      const code = 'function test() { return true; }';
      const obfuscated = fortress.obfuscateCode(code);

      // Should be longer than original (decoys added)
      expect(obfuscated.length).toBeGreaterThan(code.length);
    });
  });

  describe('Algorithm Encryption', () => {
    test('should encrypt algorithm', () => {
      const algorithm = 'const secret = calculateTruth(data);';
      const encrypted = fortress.encryptAlgorithm(algorithm);

      // Should not contain original code
      expect(encrypted).not.toContain('secret');
      expect(encrypted).not.toContain('calculateTruth');

      // Should be different from original
      expect(encrypted).not.toBe(algorithm);
    });

    test('should decrypt algorithm correctly', () => {
      const algorithm = 'const secret = calculateTruth(data);';
      const encrypted = fortress.encryptAlgorithm(algorithm);
      const decrypted = fortress.decryptAlgorithm(encrypted);

      expect(decrypted).toBe(algorithm);
    });

    test('should produce consistent encryption', () => {
      const algorithm = 'function test() {}';
      const encrypted1 = fortress.encryptAlgorithm(algorithm);
      const encrypted2 = fortress.encryptAlgorithm(algorithm);

      // Should produce same result
      expect(encrypted1).toBe(encrypted2);
    });
  });

  describe('Server-Side Proxy', () => {
    test('should generate server proxy function', () => {
      const proxy = fortress.generateServerProxy('verifyTruth');

      expect(proxy).toContain('async function verifyTruth');
      expect(proxy).toContain('/api/secure/verifyTruth');
      expect(proxy).toContain('X-Watermark');
    });

    test('should include watermark in proxy', () => {
      const proxy = fortress.generateServerProxy('test');

      expect(proxy).toContain('test-watermark-123');
    });
  });

  describe('Split Logic', () => {
    test('should split code into multiple parts', () => {
      const code = `
        line1
        line2
        line3
        line4
        line5
        line6
      `;

      const parts = fortress.splitLogic(code, 3);

      expect(parts.length).toBe(3);
      expect(parts.every(part => part.length > 0)).toBe(true);
    });

    test('should preserve all code when split', () => {
      const code = 'line1\nline2\nline3';
      const parts = fortress.splitLogic(code, 2);

      const rejoined = parts.join('\n');
      const originalLines = code.split('\n');
      const rejoinedLines = rejoined.split('\n').filter(l => l.trim());

      expect(rejoinedLines.length).toBeGreaterThanOrEqual(originalLines.length);
    });
  });

  describe('Speed Measurement', () => {
    test('should measure function execution speed', () => {
      const testFn = () => {
        let sum = 0;
        for (let i = 0; i < 100; i++) {
          sum += i;
        }
        return sum;
      };

      const metrics = fortress.measureSpeedAdvantage(testFn, 100);

      expect(metrics.avgTime).toBeGreaterThan(0);
      expect(metrics.totalTime).toBeGreaterThan(0);
      expect(metrics.opsPerSecond).toBeGreaterThan(0);
    });

    test('should calculate operations per second', () => {
      const fastFn = () => 1 + 1;

      const metrics = fortress.measureSpeedAdvantage(fastFn, 1000);

      // Should be able to do many ops per second
      expect(metrics.opsPerSecond).toBeGreaterThan(100);
    });
  });

  describe('Complete Protection', () => {
    test('should protect code with all layers', () => {
      const code = `
        function calculateTruth(claim) {
          const confidence = analyze(claim);
          return confidence > 0.8;
        }
      `;

      const protected_code = fortress.protectCode(code);

      expect(protected_code.obfuscated).toBeDefined();
      expect(protected_code.encrypted).toBeDefined();
      expect(protected_code.decoys).toBeDefined();
      expect(protected_code.watermark).toBeDefined();
    });

    test('should include watermark in protected code', () => {
      const code = 'function test() {}';
      const protected_code = fortress.protectCode(code);

      expect(protected_code.watermark).toContain('test-watermark-123');
    });

    test('should generate decoys when enabled', () => {
      const code = 'function test() {}';
      const protected_code = fortress.protectCode(code);

      expect(protected_code.decoys.length).toBeGreaterThan(0);
    });
  });

  describe('Statistics', () => {
    test('should track security configuration', () => {
      const stats = fortress.getStats();

      expect(stats.watermarkId).toBe('test-watermark-123');
      expect(stats.obfuscationLevel).toBeDefined();
      expect(stats.encryptionEnabled).toBe(true);
      expect(stats.decoysEnabled).toBe(true);
      expect(stats.hasEncryptionKey).toBe(true);
    });
  });

  describe('Configuration', () => {
    test('should allow disabling encryption', () => {
      const noEncryption = new SecurityFortress({ enableEncryption: false });
      const code = 'const test = true;';
      const encrypted = noEncryption.encryptAlgorithm(code);

      // Should return original when encryption disabled
      expect(encrypted).toBe(code);
    });

    test('should allow different obfuscation levels', () => {
      const maxSecurity = new SecurityFortress({ obfuscationLevel: 'maximum' });
      const stats = maxSecurity.getStats();

      expect(stats.obfuscationLevel).toBe('maximum');
    });
  });
});
