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

async function sign(address, message) {
  console.log(address);
  console.log(message);

  window.ethereum
    .request({
      method: "eth_signTypedData_v4",
      params: [address, JSON.stringify(message)],
    })
    .then((retVal) => {
      console.log(retVal);
    })
    .catch((err) => {
      console.log(err);
    });

  // return signature;
}

module.exports = { getPublicKey, encryptData, decryptData, sign };
