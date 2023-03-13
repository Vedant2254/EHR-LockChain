import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

function symmetricEncrypt(data) {
  const key = randomBytes(32);
  const iv = randomBytes(16);

  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const cipherData = cipher.update(data, "utf-8", "hex");

  return { key, iv, cipherData };
}

function symmetricDecrypt(cipherData, key, iv) {
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  const data = decipher.update(cipherData, "hex", "utf-8");

  return data;
}

module.exports = {
  symmetricEncrypt,
  symmetricDecrypt,
};
