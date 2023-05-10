// this creates abi.json and contractAddress.json files in frontend/constants

const { ethers, network } = require("hardhat");
const fs = require("fs");

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END_CONSTANTS) {
    console.log("Updating frontend...");
    await updateFrontendConstants();
  }
};

async function updateFrontendConstants() {
  const forwarder = await ethers.getContract("MinimalForwarder");
  const contract = await ethers.getContract("Contract");
  const chainId = network.config.chainId.toString();
  const FILE_PATH = "../frontend/utils/constants.json";

  const constants = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));

  constants.forwarder = constants.forwarder || {};
  constants.contract = constants.contract || {};
  constants.forwarder.addresses = constants.forwarder.addresses || {};
  constants.contract.addresses = constants.contract.addresses || {};

  constants.forwarder.addresses[chainId] = forwarder.address;
  constants.contract.addresses[chainId] = contract.address;
  constants.forwarder.abi = JSON.parse(forwarder.interface.format(ethers.utils.FormatTypes.json));
  constants.contract.abi = JSON.parse(contract.interface.format(ethers.utils.FormatTypes.json));

  fs.writeFileSync(FILE_PATH, JSON.stringify(constants));
}

module.exports.tags = ["all", "frontend"];
