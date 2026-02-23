
import CryptoJS from 'crypto-js';
import { get, set, del } from 'idb-keyval';

/**
 * Secure storage service using IndexedDB and AES encryption.
 * Data is encrypted using a key derived from the user's wallet signature.
 */

const STORAGE_KEY = 'choice_id_vault';

/**
 * Encrypts data using a signature-derived key.
 */
export const encrypt = (data: unknown, signature: string): string => {
  const secretKey = signature.slice(0, 32); // Use first 32 chars of signature as key
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

/**
 * Decrypts data using a signature-derived key.
 */
export const decrypt = (encryptedData: string, signature: string): unknown => {
  const secretKey = signature.slice(0, 32);
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  if (!decryptedText) throw new Error('Failed to decrypt data. Invalid signature?');
  return JSON.parse(decryptedText);
};

/**
 * Saves encrypted identity to IndexedDB.
 */
export const saveSecureIdentity = async (identity: UserIdentity, signature: string): Promise<void> => {
  const encrypted = encrypt(identity, signature);
  await set(STORAGE_KEY, encrypted);
};

/**
 * Loads and decrypts identity from IndexedDB.
 */
export const loadSecureIdentity = async (signature: string): Promise<UserIdentity | null> => {
  const encrypted = await get(STORAGE_KEY);
  if (!encrypted) return null;
  try {
    return decrypt(encrypted, signature) as UserIdentity;
  } catch (e) {
    console.error('Secure storage decryption failed:', e);
    return null;
  }
};

/**
 * Clears the secure storage.
 */
export const clearSecureStorage = async (): Promise<void> => {
  await del(STORAGE_KEY);
};
