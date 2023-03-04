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
      await contract.addDoctor(doctor.address, "sample-hash");
      assert(await contract.isDoctor(doctor.address));
    });

    it("Returns false if user is not doctor", async function () {
      assert(!(await contract.isDoctor(patient.address)));
    });
  });

  describe("setDrHash & getDrHash", function () {
    it("Hash for doctor is set and retrieved correctly", async function () {
      await contract.addDoctor(doctor.address, "old-hash");
      await contract.setDrHash(doctor.address, "new-hash");
      assert.equal("new-hash", await contract.getDrHash(doctor.address));
    });
  });

  describe("addDoctor", function () {
    const hash = "sample-hash";

    beforeEach(async function () {
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
      await contract.addDoctor(doctor.address, "");
      await contract.addDoctor(patient.address, "");
      const drs = await contract.getAllDrs();
      assert(drs[0] == doctor.address && drs[1] == patient.address);
    });
  });

  describe("isPatient", function () {
    beforeEach(async function () {
      contract = await ethers.getContract("Contract", patient);
    });

    it("Returns true if user is patient", async function () {
      (await contract.addPatient()).wait(1);
      assert(await contract.isPatient(patient.address));
    });

    it("Returns false if user is not patient", async function () {
      assert(!(await contract.isPatient(patient.address)));
    });
  });

  describe("addPatient", function () {
    beforeEach(async function () {
      contract = await ethers.getContract("Contract", patient);
      await contract.addPatient();
    });

    it("Address is added to patient role", async function () {
      const isPatient = await contract.isPatient(patient.address);
      assert(isPatient);
    });
    it("Address is added to pat_ids array", async function () {
      const pats = await contract.getAllPats();
      assert(pats.includes(patient.address));
    });
    it("Reverts if address is already registered", async function () {
      await expect(contract.addPatient()).to.be.revertedWith("Roles: account already has role");
    });
  });

  describe("getAllPats", function () {
    it("All patients array is returned correctly", async function () {
      await contract.addPatient();
      (await ethers.getContract("Contract", doctor)).addPatient();
      (await ethers.getContract("Contract", patient)).addPatient();
      const pats = await contract.getAllPats();
      assert(pats[0] == admin.address, pats[1] == doctor.address, (pats[2] = patient.address));
    });
  });

  describe("setPatHash & getPatHash", function () {
    const hash = "new-pat-hash";

    beforeEach(async function () {
      await contract.addDoctor(doctor.address, "hash");

      contract = await ethers.getContract("Contract", patient);
      await contract.addPatient();
      await contract.giveAccess(doctor.address);
    });

    it("Hash for patient is set and retrieved correctly", async function () {
      contract = await ethers.getContract("Contract", doctor);
      await contract.setPatHash(patient.address, hash);
      assert.equal(await contract.getPatHash(patient.address), hash);
    });
  });

  describe("grantAccess", function () {
    beforeEach(async function () {
      await contract.addDoctor(doctor.address, "vedant");

      contract = await ethers.getContract("Contract", patient);
      await contract.addPatient();

      await contract.giveAccess(doctor.address);
    });

    it("Doctor address is added to patToDocAccess", async function () {
      const doctors = await contract.getPatDocs();
      assert(doctors.indexOf(doctor.address) != -1);
    });

    it("Patient address is added to docToPatAccess", async function () {
      const patients = await (await ethers.getContract("Contract", doctor)).getDocPats();
      assert(patients.indexOf(patient.address) != -1);
    });
  });

  describe("revokeAccess", function () {
    beforeEach(async function () {
      await contract.addDoctor(doctor.address, "vedant");

      contract = await ethers.getContract("Contract", patient);
      await contract.addPatient();

      await contract.giveAccess(doctor.address);
    });

    it("Doctor address is removed from patToDocAccess", async function () {
      await contract.revokeAccess(doctor.address);
      const doctors = await contract.getPatDocs();
      assert(doctors.indexOf(doctor.address) == -1);
    });

    it("Patient address is removed from docToPatAccess", async function () {
      await contract.revokeAccess(doctor.address);
      const patients = await (await ethers.getContract("Contract", doctor)).getDocPats();
      assert(patients.indexOf(patient.address) == -1);
    });
  });
});
