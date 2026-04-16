export const decryptQrData = async (
  encryptedBase64: string,
  secretKey: string,
) => {
  const binaryString = atob(encryptedBase64);
  const data = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    data[i] = binaryString.charCodeAt(i);
  }

  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const encryptedText = data.slice(28);

  const ciphertextWithTag = new Uint8Array(encryptedText.length + tag.length);
  ciphertextWithTag.set(encryptedText);
  ciphertextWithTag.set(tag, encryptedText.length);

  const encoder = new TextEncoder();
  const keyBuffer = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(secretKey),
  );

  const aesKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    'AES-GCM',
    false,
    ['decrypt'],
  );

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128,
      },
      aesKey,
      ciphertextWithTag,
    );

    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedBuffer);
    return JSON.parse(decryptedString);
  } catch (err) {
    console.error('[decryptQrData] Web Crypto Decryption Failed:', err);
    throw err;
  }
};
