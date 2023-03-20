const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  // const [_, doctor, patient] = await ethers.getSigners();
  const accounts = await ethers.getSigners();

  // await deployments.fixture(["all"]);
  const contract = await ethers.getContract("Contract");

  // console.log(await contract.getPatGeneralHash(patient.address));
  // console.log(await contract.getPatRecordHash(patient.address));

  console.log(await contract.getDrHash("0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"));

  // for (let i = 1; i < accounts.length; i++) {
  //   const drContract = await ethers.getContract("Contract", accounts[i]);
  //   drContract.registerDr("abc");
  // }
}

main().catch((e) => {
  console.log(e);
});
