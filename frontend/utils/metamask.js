import { encrypt } from "@metamask/eth-sig-util";

async function getPublicKey(address) {
  return await window.ethereum.request({
    method: "eth_getEncryptionPublicKey",
    params: [address],
  });
}

async function encryptData(address, data, publicKey) {
  const enc = encrypt({
    publicKey: publicKey || (await getPublicKey(address)),
    data: data,
    version: "x25519-xsalsa20-poly1305",
  });

  return enc;
}

async function decryptData(address, data) {
  const decrypt = await window.ethereum.request({
    method: "eth_decrypt",
    params: [data, address],
  });

  return decrypt;
}

module.exports = { encryptData, decryptData };
