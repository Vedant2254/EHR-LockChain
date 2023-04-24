const { ethers } = require("hardhat");

async function main() {
  const [deployer, doctor, patient] = await ethers.getSigners();
  const contract = await ethers.getContract("Contract");

  await (
    await contract
      .connect(doctor)
      .registerDr("bafkreih3wlpnofosnhnp2mbwkzsgdjrygszi7xc4hsqnowrd4lpjncoywq")
  ).wait(1);
  await (await contract.connect(deployer).approveDr(doctor.address)).wait(1);
  await (
    await contract.connect(doctor).registerDrConfirm("EHMC7qhPP3XFAYTfQQKGK/UPb7zuiL+dfTOFKrkPMC0=")
  ).wait(1);
}

main()
  .then(() => {
    console.log("Done");
  })
  .catch((err) => {
    console.log(err);
  });
