const ethers = require("ethers");
const { DefenderRelayProvider, DefenderRelaySigner } = require("defender-relay-client/lib/ethers");

const {
  address: ForwarderAddress,
  abi: ForwarderAbi,
} = require("../../deployments/polygon_mumbai/MinimalForwarderUpgradeable.json");

// this function actually relays the transaction request to relayer
async function relay(forwarder, request, signature, whitelist) {
  // Decide if we want to relay this request based on a whitelist
  const accepts = !whitelist || whitelist.includes(request.to);
  if (!accepts) throw new Error(`Rejected request to ${request.to}`);

  console.log(request);
  console.log(signature);

  // Validate request on the forwarder contract
  const valid = await forwarder.verify(request, signature);
  if (!valid) throw new Error(`Invalid request`);

  // Send meta-tx through relayer to the forwarder contract
  return await forwarder.execute(request, signature);
}

// this function is the HTTP request handler
// it gets the event containing the incoming request as parameter
// body of request contains the transaction request and signature
async function handler(event) {
  // Parse webhook payload
  if (!event.request || !event.request.body) throw new Error(`Missing payload`);
  const { request, signature } = event.request.body;
  console.log(`Relaying`, request);

  // Initialize Relayer provider and signer, and forwarder contract
  const credentials = { ...event };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, {
    speed: "fast",
  });
  const forwarder = new ethers.Contract(ForwarderAddress, ForwarderAbi, signer);

  // Relay transaction!
  const tx = await relay(forwarder, request, signature);
  console.log(`Sent meta-tx: ${tx.hash}`);
  return { txHash: tx.hash };
}

module.exports = {
  handler,
  relay,
};
