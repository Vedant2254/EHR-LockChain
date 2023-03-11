// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Roles.sol";
import "./AddressArrayUtils.sol";
import "./AddToBoolMapping.sol";

error Contract__NotAdmin();
error Contract__NotDoctor();
error Contract__NotPatient();

contract Contract {
    // using methods of Roles for Role struct in Roles
    using Roles for Roles.Role;
    using AddToBoolMapping for AddToBoolMapping.Map;
    using AddressArrayUtils for address[];

    struct MedicalRecord {
        address editor;
        address[] viewers;
        string key_data_hash;
    }

    struct Patients {
        Roles.Role users;
        mapping(address => MedicalRecord) records;
    }

    struct Doctors {
        Roles.Role users;
        mapping(address => string) public_keys;
        mapping(address => AddToBoolMapping.Map) docToPatAccess;
    }

    // defining roles - contains hashes
    Roles.Role private admin;
    Doctors private doctors;
    Patients private patients;

    // Initializing admin
    constructor() {
        admin.add(msg.sender, "null");
    }

    // Admin methods
    function getAdmin() public view returns (address) {
        address admin_id = admin.getMembers()[0];
        return admin_id;
    }

    function isAdmin(address _address) public view returns (bool) {
        return admin.has(_address);
    }

    // Doctor methods
    function isDoctor(address _address) public view returns (bool) {
        return doctors.users.has(_address) && bytes(doctors.public_keys[_address]).length != 0;
    }

    function addDoctor(address _address, string memory _hash) public onlyAdmin {
        if (bytes(_hash).length == 0) revert("Contract: Empty hash is not allowed!");
        doctors.users.add(_address, _hash);
    }

    function confirmAddDr(string memory _public_key) public onlyDoctor {
        if (bytes(_public_key).length == 0) revert("Contract: Empty public key is not allowed!");
        doctors.public_keys[msg.sender] = _public_key;
    }

    function setDrHash(address _address, string memory _hash) public onlyAdmin {
        doctors.users.setHash(_address, _hash);
    }

    function getDrHash(address _address) public view returns (string memory) {
        if (!isDoctor(_address)) revert Contract__NotDoctor();
        return doctors.users.getHash(_address);
    }

    function getDrPubKey(address _address) public view returns (string memory) {
        return doctors.public_keys[_address];
    }

    function getAllDrs() public view returns (address[] memory) {
        return doctors.users.getMembers();
    }

    function getDocPats() public view onlyDoctor returns (address[] memory) {
        return doctors.docToPatAccess[msg.sender].keys;
    }

    // Patient methods
    function isPatient(address _address) public view returns (bool) {
        return patients.users.has(_address);
    }

    function addPatient(string memory _hash) public {
        if (bytes(_hash).length == 0) revert("Contract: Empty hash is not allowed");
        patients.users.add(msg.sender, _hash);
    }

    function setPatGeneralHash(string memory _hash) public onlyPatient {
        patients.users.setHash(msg.sender, _hash);
    }

    function getPatGeneralHash() public view returns (string memory) {
        return patients.users.getHash(msg.sender);
    }

    function setPatRecordHash(address _address, string memory _hash) public onlyDoctor {
        if (!isPatient(_address)) revert Contract__NotPatient();
        if (patients.records[_address].editor != msg.sender) revert("Not Allowed");
        patients.records[_address].key_data_hash = _hash;
    }

    function getPatRecordHash(address _address) public view returns (string memory) {
        if (!isPatient(_address)) revert Contract__NotPatient();

        if (
            msg.sender == _address ||
            patients.records[_address].editor == msg.sender ||
            patients.records[_address].viewers.indexOf(msg.sender) != -1
        ) return patients.records[_address].key_data_hash;

        revert("Not Allowed");
    }

    function getAllPats() public view returns (address[] memory) {
        return patients.users.getMembers();
    }

    function changeEditorAccess(address _address) public onlyPatient {
        // pending update - when user changes access, symmetric key S must be changed
        if (!isDoctor(_address)) revert Contract__NotDoctor();

        // remove old editor access
        address old_editor = patients.records[msg.sender].editor;
        doctors.docToPatAccess[old_editor].unset(msg.sender);

        // add new editor access
        patients.records[msg.sender].editor = _address;
        doctors.docToPatAccess[_address].set(msg.sender);
    }

    function removeEditorAccess() public onlyPatient {
        address old_editor = patients.records[msg.sender].editor;
        patients.records[msg.sender].editor = address(0);
        doctors.docToPatAccess[old_editor].unset(msg.sender);
    }

    function getPatDr() public view onlyPatient returns (address) {
        return patients.records[msg.sender].editor;
    }

    function grantViewerAccess(address _address) public onlyPatient {
        if (!isDoctor(_address)) revert Contract__NotDoctor();

        if (!patients.records[msg.sender].viewers.contains(_address)) {
            patients.records[msg.sender].viewers.push(_address);
        }
    }

    function revokeViewerAccess(address _address) public onlyPatient {
        // pending update - when user revokes access, symmetric key S must be changed
        if (!isDoctor(_address)) revert Contract__NotDoctor();

        patients.records[msg.sender].viewers.remove(_address);
    }

    function getPatViewers() public view onlyPatient returns (address[] memory) {
        return patients.records[msg.sender].viewers;
    }

    // modifiers
    modifier onlyAdmin() {
        if (!admin.has(msg.sender)) revert Contract__NotAdmin();
        _;
    }

    modifier onlyDoctor() {
        if (!doctors.users.has(msg.sender)) revert Contract__NotDoctor();
        _;
    }

    modifier onlyPatient() {
        if (!patients.users.has(msg.sender)) revert Contract__NotPatient();
        _;
    }
}
