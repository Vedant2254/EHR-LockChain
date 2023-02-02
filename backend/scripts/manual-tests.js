const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const contract = await ethers.getContract("Contract", deployer);
  const [_, doctor, patient] = await ethers.getSigners();

  console.log("Getting admin...");
  const admin = await contract.getAdmin();
  console.log(admin);

  // const txRes = await contract.addDoctor(doctor.address, "Vedant");

  // const docHash = await contract.getDrHash(doctor.address);
  // console.log(docHash);
}

main().catch((e) => {
  console.log(e);
});
