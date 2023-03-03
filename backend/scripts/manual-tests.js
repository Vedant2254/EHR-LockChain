const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const [_, doctor, patient] = await ethers.getSigners();

  await deployments.fixture(["all"]);
  const contract = await ethers.getContract("Contract");

  console.log(contract.signer.address);
  const newContract = await ethers.getContract("Contract", doctor);
  // await newContract.connect(doctor);
  console.log(newContract.signer.address);

  // console.log("Getting admin...");
  // const admin = await contract.getAdmin();
  // console.log(admin);

  // const txRes = await contract.addDoctor(doctor.address, "Vedant");

  // const docHash = await contract.getDrHash(doctor.address);
  // console.log(docHash);
}

main().catch((e) => {
  console.log(e);
});
