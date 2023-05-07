// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/MinimalForwarderUpgradeable.sol";

import "./Roles.sol";
import "./AddressArrayUtils.sol";
import "./AddToBoolMapping.sol";

error Contract__NotAdmin();
error Contract__NotDoctor();
error Contract__NotPatient();
error Contract__PendingDoctorApproval();
error Contract__DoctorPublicKeyMissing();

contract Contract is ERC2771ContextUpgradeable {
    // using methods of Roles for Role struct in Roles
    using Roles for Roles.Role;
    using AddToBoolMapping for AddToBoolMapping.Map;
    using AddressArrayUtils for address[];

    struct MedicalRecord {
        address editor;
        address[] viewers;
        string key_data_hash;
    }

    struct Admin {
        address user;
        string public_key;
        AddToBoolMapping.Map pending_doctors;
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
    Admin private admin;
    Doctors private doctors;
    Patients private patients;

    bool initialized;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(
        MinimalForwarderUpgradeable forwarder // Initialize trusted forwarder
    ) ERC2771ContextUpgradeable(address(forwarder)) {}

    function initialize() public {
        require(!initialized, "Contract already initialized!");
        admin.user = _msgSender();
        initialized = true;
    }

    // Admin methods
    function isAdmin(address _address) public view returns (bool) {
        if (admin.user == _address) return true;
        return false;
    }

    function getAdmin() public view returns (address) {
        return admin.user;
    }

    function setAdminPubKey(string memory _public_key) public onlyAdmin {
        admin.public_key = _public_key;
    }

    function getAdminPubKey() public view returns (string memory) {
        return admin.public_key;
    }

    // Doctor methods
    function isDrRegistered(address _address) public view returns (bool) {
        return doctors.users.has(_address);
    }

    function isDrPending(address _address) public view returns (bool) {
        return admin.pending_doctors.get(_address);
    }

    function isDoctor(address _address) public view returns (bool) {
        if (!doctors.users.has(_address)) return false;
        if (admin.pending_doctors.get(_address)) return false;
        if (bytes(doctors.public_keys[_address]).length == 0) return false;
        return true;
    }

    function registerDr(string memory _hash) public {
        if (isPatient(_msgSender())) revert("Contract: Address already registered as patient");
        if (bytes(_hash).length == 0) revert("Contract: Empty hash is not allowed");
        doctors.users.add(_msgSender(), _hash);
        admin.pending_doctors.set(_msgSender());
    }

    function approveDr(address _address) public onlyAdmin {
        if (isDoctor(_address)) return;
        if (!doctors.users.has(_address)) return;
        admin.pending_doctors.unset(_address);
    }

    function disapproveDr(address _address) public onlyAdmin {
        if (!isDrPending(_address)) revert("Contract: Doctor not registered");
        doctors.users.remove(_address);
        admin.pending_doctors.unset(_address);
    }

    function registerDrConfirm(string memory _public_key) public {
        if (bytes(_public_key).length == 0) revert("Contract: Empty public key is not allowed!");
        if (!doctors.users.has(_msgSender())) revert Contract__NotDoctor();
        if (admin.pending_doctors.get(_msgSender())) revert Contract__PendingDoctorApproval();
        doctors.public_keys[_msgSender()] = _public_key;
    }

    function setDrHash(string memory _hash) public onlyDoctor {
        if (bytes(_hash).length == 0) revert("Contract: Empty hash is not allowed!");
        doctors.users.setHash(_msgSender(), _hash);
    }

    function getDrHash(address _address) public view returns (string memory) {
        if (!isDrRegistered(_address)) revert Contract__NotDoctor();
        return doctors.users.getHash(_address);
    }

    function getDrPubKey(address _address) public view returns (string memory) {
        return doctors.public_keys[_address];
    }

    function getAllDrs() public view returns (address[] memory) {
        return doctors.users.getMembers();
    }

    function getPendingDrs() public view returns (address[] memory) {
        return admin.pending_doctors.keys;
    }

    function getPtsOfDr() public view onlyDoctor returns (address[] memory) {
        return doctors.docToPatAccess[_msgSender()].keys;
    }

    // Patient methods
    function isPatient(address _address) public view returns (bool) {
        return patients.users.has(_address);
    }

    function registerPt(string memory _hash, string memory _key_data_hash) public {
        if (isDrRegistered(_msgSender()) || isDoctor(_msgSender()))
            revert("Contract: Address already registered as doctor");
        if (bytes(_hash).length == 0) revert("Contract: Empty hash is not allowed");
        patients.users.add(_msgSender(), _hash);
        patients.records[_msgSender()].editor = _msgSender();
        patients.records[_msgSender()].key_data_hash = _key_data_hash;
    }

    function setPtGeneralHash(string memory _hash) public onlyPatient {
        patients.users.setHash(_msgSender(), _hash);
    }

    function getPtGeneralHash(address _address) public view returns (string memory) {
        if (!isPatient(_address)) revert Contract__NotPatient();

        if (
            _msgSender() == _address ||
            patients.records[_address].editor == _msgSender() ||
            patients.records[_address].viewers.indexOf(_msgSender()) != -1
        ) return patients.users.getHash(_address);

        revert("Not Allowed");
    }

    function setPtRecordHash(address _address, string memory _hash) public {
        if (!isPatient(_address)) revert Contract__NotPatient();
        if (!(patients.records[_address].editor == _msgSender())) revert("Not Allowed");
        patients.records[_address].key_data_hash = _hash;
    }

    function getPtRecordHash(address _address) public view returns (string memory) {
        if (!isPatient(_address)) revert Contract__NotPatient();

        if (
            _msgSender() == _address ||
            patients.records[_address].editor == _msgSender() ||
            patients.records[_address].viewers.indexOf(_msgSender()) != -1
        ) return patients.records[_address].key_data_hash;

        revert("Not Allowed");
    }

    function getAllPts() public view returns (address[] memory) {
        return patients.users.getMembers();
    }

    function changeEditorAccess(
        address _address,
        string memory _general_hash,
        string memory _key_hash
    ) public onlyPatient {
        // pending update - when user changes access, symmetric key S must be changed
        if (!isDoctor(_address)) revert Contract__NotDoctor();

        // remove old editor access
        removeEditorAccess(_general_hash, _key_hash);

        // add new editor access
        patients.records[_msgSender()].editor = _address;
        doctors.docToPatAccess[_address].set(_msgSender());
    }

    function removeEditorAccess(
        string memory _general_hash,
        string memory _key_hash
    ) public onlyPatient {
        address old_editor = patients.records[_msgSender()].editor;
        patients.records[_msgSender()].editor = _msgSender();
        doctors.docToPatAccess[old_editor].unset(_msgSender());

        patients.users.setHash(_msgSender(), _general_hash);
        patients.records[_msgSender()].key_data_hash = _key_hash;
    }

    function getDrOfPt() public view onlyPatient returns (address) {
        return patients.records[_msgSender()].editor;
    }

    function grantViewerAccess(address _address) public onlyPatient {
        if (!isDoctor(_address)) revert Contract__NotDoctor();

        if (!patients.records[_msgSender()].viewers.contains(_address)) {
            patients.records[_msgSender()].viewers.push(_address);
        }
    }

    function revokeViewerAccess(address _address) public onlyPatient {
        // pending update - when user revokes access, symmetric key S must be changed
        if (!isDoctor(_address)) revert Contract__NotDoctor();

        patients.records[_msgSender()].viewers.remove(_address);
    }

    function getPatViewers() public view onlyPatient returns (address[] memory) {
        return patients.records[_msgSender()].viewers;
    }

    // modifiers
    modifier onlyAdmin() {
        if (!isAdmin(_msgSender())) revert Contract__NotAdmin();
        _;
    }

    modifier onlyDoctor() {
        if (!doctors.users.has(_msgSender())) revert Contract__NotDoctor();
        if (admin.pending_doctors.get(_msgSender())) revert Contract__PendingDoctorApproval();
        if (bytes(doctors.public_keys[_msgSender()]).length == 0)
            revert Contract__DoctorPublicKeyMissing();
        _;
    }

    modifier onlyPatient() {
        if (!isPatient(_msgSender())) revert Contract__NotPatient();
        _;
    }
}
