const { assert, expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe("Contract", function () {
  let contract, admin, doctor, patient;

  beforeEach(async function () {
    [admin, doctor, patient] = await ethers.getSigners();
    await deployments.fixture(["all"]);
    contract = await ethers.getContract("Contract");
  });

  describe("getAdmin", function () {
    it("Returns correct admin", async function () {
      await contract.connect(admin);
      const contractAdmin = await contract.getAdmin();
      assert.equal(contractAdmin, admin.address);
    });
  });

  describe("isAdmin", function () {
    it("Returns true if user is admin", async function () {
      assert(await contract.isAdmin(admin.address));
    });

    it("Returns false if user is not admin", async function () {
      assert(!(await contract.isAdmin(doctor.address)));
    });
  });

  describe("isDoctor", function () {
    it("Returns true if user is doctor", async function () {
      await contract.connect(admin);
      await contract.addDoctor(doctor.address, "sample-hash");
      assert(await contract.isDoctor(doctor.address));
    });

    it("Returns false if user is not doctor", async function () {
      assert(!(await contract.isDoctor(patient.address)));
    });
  });

  describe("setDrHash", function () {
    it("Hash is set correctly", async function () {
      await contract.connect(admin);
      await contract.addDoctor(doctor.address, "old-hash");
      await contract.setDrHash(doctor.address, "new-hash");
      assert.equal("new-hash", await contract.getDrHash(doctor.address));
    });
  });

  describe("addDoctor", function () {
    const hash = "sample-hash";

    beforeEach(async function () {
      await contract.connect(admin);
      (await contract.addDoctor(doctor.address, hash)).wait(1);
    });

    it("Address is added to doctor role", async function () {
      const isDoctor = await contract.isDoctor(doctor.address);
      assert(isDoctor);
    });

    it("Address is added to dr_ids array", async function () {
      const drs = await contract.getAllDrs();
      assert(drs.includes(doctor.address));
    });

    it("Hash of doctor is added to Doctors array", async function () {
      const drHash = await contract.getDrHash(doctor.address);
      assert.equal(drHash, hash);
    });

    it("Reverts if address is already registered", async function () {
      await expect(contract.addDoctor(doctor.address, hash)).to.be.revertedWith(
        "Roles: account already has role"
      );
    });
  });

  describe("getAllDrs", function () {
    it("All doctors array is returned correctly", async function () {
      await contract.connect(admin);
      await contract.addDoctor(doctor.address, "");
      await contract.addDoctor(patient.address, "");
      const drs = await contract.getAllDrs();
      assert(drs[0] == doctor.address && drs[1] == patient.address);
    });
  });

  describe("isPatient", function () {});

  describe("addPatient", function () {});

  describe("setPatHash", function () {});

  describe("getAllPats", function () {});

  describe("getPatHash", function () {});

  describe("giveAndRevokeAccess", function () {
    beforeEach(async function () {
      await contract.connect(admin);
      (await contract.addDoctor(doctor.address, "vedant")).wait(1);

      await contract.connect(patient);
      (await contract.addPatient()).wait(1);

      (await contract.giveAccess(doctor.address)).wait(1);
    });

    it("Doctor address is added to patToDocAccess", async function () {
      const doctors = await contract.getPatDocs();
      assert(doctors.indexOf(doctor.address) != -1);
    });

    it("Doctor address is removed from patToDocAccess", async function () {
      (await contract.revokeAccess(doctor.address)).wait(1);
      const doctors = await contract.getPatDocs();
      assert(doctors.indexOf(doctor.address) == -1);
    });
  });

  describe("revokeAccess", function () {});
});
