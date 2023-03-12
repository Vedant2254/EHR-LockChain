const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const { developmentChains } = require("../helper-hardhat-config");

// this function is imported when we run `yarn hardhat deploy` from command line
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const contract = await deploy("Contract", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying...");
    await verify(contract.address, []);
  }
};

module.exports.tags = ["all", "contract"];
