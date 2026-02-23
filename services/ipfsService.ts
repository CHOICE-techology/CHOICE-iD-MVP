
import { VerifiableCredential } from '../types';

/**
 * IPFS Service for CHOICE iD.
 * Uses Pinata as a reliable Web3 storage provider.
 * Note: In a production app, the API key should be handled server-side.
 */

const PINATA_API_KEY = process.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.VITE_PINATA_SECRET_KEY;

/**
 * Uploads a Verifiable Credential to IPFS.
 * Returns the CID.
 */
export const uploadVC = async (vc: VerifiableCredential): Promise<string> => {
  // If no keys are provided, we simulate a CID for demo purposes
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    console.warn('IPFS: No Pinata keys found. Returning mock CID.');
    return `mock-cid-${Math.random().toString(36).substring(7)}`;
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: JSON.stringify({
        pinataContent: vc,
        pinataMetadata: {
          name: `VC-${vc.id}`,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.IpfsHash;
  } catch (error) {
    console.error('IPFS Upload Error:', error);
    throw error;
  }
};

/**
 * Fetches a Verifiable Credential from IPFS by CID.
 */
export const fetchVC = async (cid: string): Promise<VerifiableCredential> => {
  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('IPFS Fetch Error:', error);
    throw error;
  }
};
