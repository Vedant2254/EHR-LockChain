// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Roles.sol";
import "./AddressArrayUtils.sol";

error Contract__NotAdmin();
error Contract__NotDoctor();
error Contract__NotPatient();

contract Contract {
    // using methods of Roles for Role struct in Roles
    using Roles for Roles.Role;
    using AddressArrayUtils for address[];

    struct MedicalRecord {
        address editor;
        address[] viewers;
        string data_hash;
    }

    // defining roles - contains hashes
    Roles.Role private admin;
    Roles.Role private doctor;
    Roles.Role private patient;

    // persists - important for getting all doctors and all patients
    // This is to store ids (addresses) of admin, doctors and patients
    address private admin_id;
    address[] private dr_ids;
    address[] private pat_ids;

    // persists - stores medical records its editors also helps access tracking
    mapping(address => MedicalRecord) records;

    // persists - important for getting patients of doctor and doctors of patient
    // This is to store access permissions for patient data
    mapping(address => address[]) docToPatAccess;

    // Initializing admin
    constructor() {
        admin.add(msg.sender, "null");
        admin_id = msg.sender;
    }

    // Admin methods
    function getAdmin() public view returns (address) {
        return admin_id;
    }

    function isAdmin(address _address) public view returns (bool) {
        return admin.has(_address);
    }

    // Doctor methods
    function isDoctor(address _address) public view returns (bool) {
        return doctor.has(_address);
    }

    function setDrHash(address _address, string memory _hash) public onlyAdmin {
        doctor.set(_address, _hash);
    }

    function addDoctor(address _address, string memory _hash) public onlyAdmin {
        doctor.add(_address, _hash);
        dr_ids.push(_address);
    }

    function getAllDrs() public view returns (address[] memory) {
        return dr_ids;
    }

    function getDocPats() public view onlyDoctor returns (address[] memory) {
        return docToPatAccess[msg.sender];
    }

    function getDrHash(address _address) public view returns (string memory) {
        if (!isDoctor(_address)) revert Contract__NotDoctor();
        return doctor.get(_address);
    }

    // Patient methods
    function isPatient(address _address) public view returns (bool) {
        return patient.has(_address);
    }

    function addPatient(string memory _hash) public {
        patient.add(msg.sender, _hash);
        pat_ids.push(msg.sender);
    }

    function setPatGeneralHash(string memory _hash) public onlyPatient {
        patient.set(msg.sender, _hash);
    }

    function getPatGeneralHash() public view returns (string memory) {
        return patient.get(msg.sender);
    }

    function setPatRecordHash(address _address, string memory _hash) public onlyDoctor {
        if (!isPatient(_address)) revert Contract__NotPatient();
        if (records[_address].editor != msg.sender) revert("Not Allowed");
        records[_address].data_hash = _hash;
    }

    function getPatRecordHash(address _address) public view returns (string memory) {
        if (!isPatient(_address)) revert Contract__NotPatient();

        if (
            msg.sender == _address ||
            records[_address].editor == msg.sender ||
            records[_address].viewers.indexOf(msg.sender) != -1
        ) return records[_address].data_hash;

        revert("Not Allowed");
    }

    function getAllPats() public view returns (address[] memory) {
        return pat_ids;
    }

    function getPatDr() public view onlyPatient returns (address) {
        return records[msg.sender].editor;
    }

    function getPatViewers() public view onlyPatient returns (address[] memory) {
        return records[msg.sender].viewers;
    }

    function changeEditorAccess(address _address) public onlyPatient {
        // pending update - when user changes access, symmetric key S must be changed
        if (!isDoctor(_address)) revert Contract__NotDoctor();

        removeEditorAccess();

        // add new editor access
        records[msg.sender].editor = _address;

        if (!docToPatAccess[_address].contains(msg.sender))
            docToPatAccess[_address].push(msg.sender);
    }

    function removeEditorAccess() public onlyPatient {
        address old_editor = records[msg.sender].editor;
        records[msg.sender].editor = address(0);
        docToPatAccess[old_editor].remove(msg.sender);
    }

    function grantViewerAccess(address _address) public onlyPatient {
        if (!isDoctor(_address)) revert Contract__NotDoctor();

        if (!records[msg.sender].viewers.contains(_address)) {
            records[msg.sender].viewers.push(_address);
        }
    }

    function revokeViewerAccess(address _address) public onlyPatient {
        // pending update - when user revokes access, symmetric key S must be changed
        if (!isDoctor(_address)) revert Contract__NotDoctor();

        records[msg.sender].viewers.remove(_address);
    }

    // modifiers
    modifier onlyAdmin() {
        if (!admin.has(msg.sender)) revert Contract__NotAdmin();
        _;
    }

    modifier onlyDoctor() {
        if (!doctor.has(msg.sender)) revert Contract__NotDoctor();
        _;
    }

    modifier onlyPatient() {
        if (!patient.has(msg.sender)) revert Contract__NotPatient();
        _;
    }
}
