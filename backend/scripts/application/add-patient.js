const { ethers } = require("hardhat");

async function main() {
  const [deployer, doctor, patient] = await ethers.getSigners();
  const contract = await ethers.getContract("Contract");

  await (
    await contract
      .connect(patient)
      .registerPt(
        "bafkreidnt5hk6s3ebmppnjokzqjfjyplyutr4abxethex54c2kgexzq4xi",
        "bafkreidniv7d2epuwzopa3c3645x3o4h4c4wn4f65v4u4xxwz62ajiclva"
      )
  ).wait(1);
}

main()
  .then(() => console.log("Done"))
  .catch((err) => console.log(err));
