
import { describe, it, expect } from 'vitest';
import { calculateReputation } from './reputationEngine';
import { VerifiableCredential } from '../types';

describe('Reputation Engine', () => {
  it('should return base score for empty credentials', () => {
    const result = calculateReputation([]);
    expect(result.score).toBe(10);
    expect(result.sybilRisk).toBe('high');
  });

  it('should calculate weighted score correctly', () => {
    const credentials: VerifiableCredential[] = [
      {
        id: '1',
        type: 'government_id',
        issuer: 'Gov',
        issuanceDate: new Date().toISOString(),
        credentialSubject: { id: 'did:123' },
      }
    ];
    const result = calculateReputation(credentials);
    expect(result.score).toBe(60); // 10 + 50
    expect(result.sybilRisk).toBe('medium');
  });

  it('should apply time decay for old credentials', () => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const credentials: VerifiableCredential[] = [
      {
        id: '1',
        type: 'government_id',
        issuer: 'Gov',
        issuanceDate: twoYearsAgo.toISOString(),
        credentialSubject: { id: 'did:123' },
      }
    ];
    const result = calculateReputation(credentials);
    // 50 * (1 - 0.2) = 40. 10 + 40 = 50.
    expect(result.score).toBe(50);
  });

  it('should identify low sybil risk with multiple strong credentials', () => {
    const credentials: VerifiableCredential[] = [
      { id: '1', type: 'government_id', issuer: 'G', issuanceDate: new Date().toISOString(), credentialSubject: { id: 'd' } },
      { id: '2', type: 'professional', issuer: 'P', issuanceDate: new Date().toISOString(), credentialSubject: { id: 'd' } },
      { id: '3', type: 'education', issuer: 'E', issuanceDate: new Date().toISOString(), credentialSubject: { id: 'd' } },
    ];
    const result = calculateReputation(credentials);
    expect(result.sybilRisk).toBe('low');
  });
});
