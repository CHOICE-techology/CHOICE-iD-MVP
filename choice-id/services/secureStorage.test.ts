
import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from './secureStorage';

describe('Secure Storage', () => {
  const signature = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  const data = { secret: 'my-identity-data', nested: { val: 42 } };

  it('should encrypt and decrypt data correctly with the same signature', () => {
    const encrypted = encrypt(data, signature);
    expect(typeof encrypted).toBe('string');
    expect(encrypted).not.toBe(JSON.stringify(data));

    const decrypted = decrypt(encrypted, signature);
    expect(decrypted).toEqual(data);
  });

  it('should fail to decrypt with a different signature', () => {
    const encrypted = encrypt(data, signature);
    const wrongSignature = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
    
    expect(() => decrypt(encrypted, wrongSignature)).toThrow();
  });
});
