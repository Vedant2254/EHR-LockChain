import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

function generateKey() {
  const key = randomBytes(32);
  const iv = randomBytes(16);

  return { key, iv };
}

function symmetricEncrypt(data, key, iv) {
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const cipherData = cipher.update(data, "utf-8", "hex");

  return cipherData;
}

function symmetricDecrypt(cipherData, key, iv) {
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  const data = decipher.update(cipherData, "hex", "utf-8");

  return data;
}

module.exports = {
  generateKey,
  symmetricEncrypt,
  symmetricDecrypt,
};
