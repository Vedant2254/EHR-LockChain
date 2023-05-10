import { Relayer } from "defender-relay-client";

export default async function handler(req, res) {
  const { txId } = req.query;
  const relayer = new Relayer({
    apiKey: process.env.NEXT_PUBLIC_RELAYER_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_RELAYER_API_SECRET,
  });

  let tx = null;
  if (txId) {
    tx = await relayer.query(txId);
    while (tx.status !== "mined") tx = await relayer.query(txId);
  }

  res.status(200).json(tx);
}
