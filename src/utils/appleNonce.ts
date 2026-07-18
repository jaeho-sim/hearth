import * as Crypto from 'expo-crypto';

/**
 * Generates the raw/hashed nonce pair required for a secure Sign in with
 * Apple flow: the hashed nonce is sent to Apple, the raw nonce is sent to
 * Firebase alongside the identity token so it can verify they match.
 */
export async function createAppleNonce() {
  const rawNonce = Array.from(await Crypto.getRandomBytesAsync(16))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
  return { rawNonce, hashedNonce };
}
