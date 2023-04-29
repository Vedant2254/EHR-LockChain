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
    it("Returns true if user is doctor, approved by admin and doctor has given his public key", async function () {
      await contract.connect(doctor).registerDr("sample-hash");
      await contract.connect(admin).approveDr(doctor.address);
      await contract.connect(doctor).registerDrConfirm("sample-public-key");
      assert(await contract.isDoctor(doctor.address));
    });

    it("Returns false if user is not doctor", async function () {
      assert(!(await contract.isDoctor(patient.address)));
    });
  });

  describe("setDrHash & getDrHash", function () {
    it("Hash for doctor is set and retrieved correctly", async function () {
      await contract.connect(doctor).registerDr("old-hash");
      await contract.approveDr(doctor.address);
      await contract.connect(doctor).registerDrConfirm("sample-public-key");
      await contract.connect(doctor).setDrHash("new-hash");
      assert.equal("new-hash", await contract.getDrHash(doctor.address));
    });
  });

  describe("registerDr", function () {
    const hash = "sample-hash";

    beforeEach(async function () {
      (await contract.connect(doctor).registerDr(hash)).wait(1);
      await contract.approveDr(doctor.address);
      await contract.connect(doctor).registerDrConfirm("sample-public-key");
    });

    it("Address is added to doctor role", async function () {
      const isDoctor = await contract.isDoctor(doctor.address);
      assert(isDoctor);
    });

    it("Address is added to doctors.bearer.keys array", async function () {
      const drs = await contract.getAllDrs();
      assert(drs.includes(doctor.address));
    });

    it("Hash of doctor is added", async function () {
      const drHash = await contract.getDrHash(doctor.address);
      assert.equal(drHash, hash);
    });

    it("Reverts if address is already registered", async function () {
      await expect(contract.connect(doctor).registerDr("sample-hash")).to.be.revertedWith(
        "Roles: account already has role"
      );
    });
  });

  describe("getAllDrs", function () {
    it("All doctors array is returned correctly", async function () {
      await contract.connect(doctor).registerDr("sample-hash");
      await contract.approveDr(doctor.address);
      await contract.connect(doctor).registerDrConfirm("sample-public-key");

      await contract.connect(patient).registerDr("sample-hash");
      await contract.approveDr(patient.address);
      await contract.connect(patient).registerDrConfirm("sample-public-key");

      const drs = await contract.getAllDrs();
      assert(drs[0] == doctor.address && drs[1] == patient.address);
    });
  });

  describe("isPatient", function () {
    it("Returns true if user is patient", async function () {
      await contract.connect(patient).registerPt("sample-hash", "sample-hash");
      assert(await contract.isPatient(patient.address));
    });

    it("Returns false if user is not patient", async function () {
      assert(!(await contract.isPatient(patient.address)));
    });
  });

  describe("registerPt", function () {
    const hash = "sample-hash";

    beforeEach(async function () {
      await contract.connect(patient).registerPt(hash, hash);
    });

    it("Address is added to patient role", async function () {
      assert(await contract.isPatient(patient.address));
    });

    it("Address is added to pat_ids array", async function () {
      const pats = await contract.getAllPts();
      assert(pats.includes(patient.address));
    });

    it("Hash of patient is added", async function () {
      const patHash = await contract.connect(patient).getPtGeneralHash(patient.address);
      assert.equal(patHash, hash);
    });

    it("Reverts if address is already registered", async function () {
      await expect(contract.connect(patient).registerPt(hash, hash)).to.be.revertedWith(
        "Roles: account already has role"
      );
    });
  });

  describe("getAllPts", function () {
    it("All patients array is returned correctly", async function () {
      await contract.registerPt("sample-hash", "sample-hash");
      contract.connect(doctor).registerPt("sample-hash", "sample-hash");
      contract.connect(patient).registerPt("sample-hash", "sample-hash");
      const pats = await contract.getAllPts();
      assert(pats[0] == admin.address, pats[1] == doctor.address, (pats[2] = patient.address));
    });
  });

  describe("setPtGeneralHash & getPtGeneralHash", function () {
    const hash = "new-pat-hash";

    beforeEach(async function () {
      await contract.connect(patient).registerPt("sample-hash", "sample-hash");
    });

    it("General data hash for patient is set and retrieved correctly", async function () {
      await contract.connect(patient).setPtGeneralHash(hash);
      assert.equal(await contract.connect(patient).getPtGeneralHash(patient.address), hash);
    });
  });

  describe("setPtRecordHash & getPtRecordHash", function () {
    const hash = "new-pat-hash";

    it("Medical record hash for patient is set and retrieved correctly", async function () {
      await contract.connect(patient).registerPt("sample-hash", "sample-hash");
      await contract.connect(patient).setPtRecordHash(patient.address, hash);
      assert.equal(await contract.connect(patient).getPtRecordHash(patient.address), hash);
    });
  });

  describe("changeEditorAccess", function () {
    beforeEach(async function () {
      await contract.connect(doctor).registerDr("sample-hash");
      await contract.approveDr(doctor.address);
      await contract.connect(doctor).registerDrConfirm("sample-public-key");

      await contract.connect(patient).registerPt("sample-hash", "sample-hash");
      await contract
        .connect(patient)
        .changeEditorAccess(doctor.address, "sample-hash", "sample-hash");
    });

    it("Doctor address is changed", async function () {
      const contract_doctor = await contract.connect(patient).getDrOfPt();
      assert.equal(doctor.address, contract_doctor);
    });

    it("Patient address is added to docToPatAccess", async function () {
      const patients = await contract.connect(doctor).getPtsOfDr();
      assert(patients.indexOf(patient.address) != -1);
    });
  });

  describe("removeEditorAccess", function () {
    beforeEach(async function () {
      await contract.connect(doctor).registerDr("sample-hash");
      await contract.approveDr(doctor.address);
      await contract.connect(doctor).registerDrConfirm("sample-public-key");

      await contract.connect(patient).registerPt("sample-hash", "sample-hash");
      await contract
        .connect(patient)
        .changeEditorAccess(doctor.address, "sample-hash", "sample-hash");
      await contract.connect(patient).removeEditorAccess("sample-hash", "sample-hash");
    });

    it("Doctor address is removed", async function () {
      const contract_doctor = await contract.connect(patient).getDrOfPt();
      assert.equal(contract_doctor, patient.address);
    });

    it("Patient address is removed from docToPatAccess", async function () {
      const patients = await contract.connect(doctor).getPtsOfDr();
      assert(patients.indexOf(patient.address) == -1);
    });
  });
});
