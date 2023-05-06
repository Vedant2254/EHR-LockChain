const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const [_, doctor, patient] = await ethers.getSigners();
  const accounts = await ethers.getSigners();

  // await deployments.fixture(["all"]);
  const contract = await ethers.getContract("Contract", patient);

  await contract.changeEditorAccess();
}

main().catch((e) => {
  console.log(e);
});
