const { ethers } = require("hardhat");
const { signMetaTxRequest } = require("../../src/signer");
const { writeFileSync } = require("fs");

async function main() {
  const forwarder = await ethers.getContract("MinimalForwarder");
  const contract = await ethers.getContract("Contract");

  const { PRIVATE_KEY: signer } = process.env;
  const from = new ethers.Wallet(signer).address;
  const data = contract.interface.encodeFunctionData("setDrHash", ["abc"]);
  const result = await signMetaTxRequest(signer, forwarder, {
    to: contract.address,
    from,
    data,
  });

  writeFileSync("tmp/request.json", JSON.stringify(result, null, 2));
  console.log(`Signature: `, result.signature);
  console.log(`Request: `, result.request);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
