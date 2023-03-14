import { Web3Storage } from "web3.storage";

async function makeStorageClient() {
  const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  return new Web3Storage({ token });
}

async function makeFileObjects(objects, filenames) {
  let files = [];

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const filename = filenames[i];
    const blob =
      typeof object === "string"
        ? new Blob([object], { type: "application/json" })
        : new Blob([JSON.stringify(object)], { type: "application/json" });
    files.push(new File([blob], filename));
  }

  return files;
}

async function storeIPFS(files, options) {
  const client = await makeStorageClient();
  const cid = await client.put(files, options);
  return cid;
}

async function retrieveIPFS(cid) {
  const client = await makeStorageClient();
  const res = await client.get(cid);
  return res.ok ? await res.files() : null;
}

module.exports = { makeFileObjects, storeIPFS, retrieveIPFS };
