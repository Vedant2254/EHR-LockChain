// creates a transaction to send to the relayer

const { ethers } = require("hardhat");
const { writeFileSync } = require("fs");
const { signMetaTxRequest } = require("../../src/signer");

async function main() {
  const forwarder = await ethers.getContract("MinimalForwarderUpgradeable");
  const contract = await ethers.getContract("Contract");

  const { PRIVATE_KEY: signer } = process.env;
  const from = new ethers.Wallet(signer).address;
  const data = contract.interface.encodeFunctionData("registerDr", [
    "bafkreih3wlpnofosnhnp2mbwkzsgdjrygszi7xc4hsqnowrd4lpjncoywq",
  ]);
  const result = await signMetaTxRequest(signer, forwarder, {
    to: contract.address,
    from,
    data,
  });

  writeFileSync("tmp/request.json", JSON.stringify(result, null, 2));
}

main().then(() => console.log("Done!"));
