// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Roles.sol";
import "./Utility.sol";

error Contract__NotAdmin();
error Contract__NotDoctor();
error Contract__NotPatient();

contract Contract {
    // using methods of Roles for Role struct in Roles
    using Roles for Roles.Role;
    using {Utility.indexOf} for address[];

    // defining roles
    Roles.Role private admin;
    Roles.Role private doctor;
    Roles.Role private patient;

    // This is to store ids (addresses) of admin, doctors and patients
    address private admin_id;
    address[] private dr_ids;
    address[] private pat_ids;

    // This is to store hash of data of doctors and patients
    mapping(address => string) Doctors;
    mapping(address => string) Patients;

    // This is to store access permissions for patient data
    mapping(address => address[]) patToDocAccess;
    mapping(address => address[]) docToPatAccess;

    // Initializing admin
    constructor() {
        admin_id = msg.sender;
        admin.add(msg.sender);
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
        Doctors[_address] = _hash;
    }

    function addDoctor(address _address, string memory _hash) public onlyAdmin {
        doctor.add(_address);
        dr_ids.push(_address);
        setDrHash(_address, _hash);
    }

    function getAllDrs() public view returns (address[] memory) {
        return dr_ids;
    }

    function getDocPats() public view onlyDoctor returns (address[] memory) {
        return docToPatAccess[msg.sender];
    }

    function getDrHash(address _address) public view returns (string memory) {
        if (!isDoctor(_address)) revert Contract__NotDoctor();
        return Doctors[_address];
    }

    // Patient methods
    function isPatient(address _address) public view returns (bool) {
        return patient.has(_address);
    }

    function addPatient() public {
        patient.add(msg.sender);
        pat_ids.push(msg.sender);
    }

    function setPatHash(address _address, string memory _hash) public onlyDoctor {
        if (!isPatient(_address)) revert Contract__NotPatient();
        if (patToDocAccess[_address].indexOf(msg.sender) == -1) revert("Not Allowed!");
        Patients[_address] = _hash;
    }

    function getAllPats() public view returns (address[] memory) {
        return pat_ids;
    }

    function getPatDocs() public view onlyPatient returns (address[] memory) {
        return patToDocAccess[msg.sender];
    }

    function getPatHash(address _address) public view returns (string memory) {
        if (!isPatient(_address)) revert Contract__NotPatient();

        if (msg.sender != _address && patToDocAccess[_address].indexOf(msg.sender) == -1)
            revert("Now Allowed!");

        return Patients[_address];
    }

    function giveAccess(address _address) public onlyPatient {
        if (!isDoctor(_address)) revert Contract__NotDoctor();

        if (patToDocAccess[msg.sender].indexOf(_address) == -1)
            patToDocAccess[msg.sender].push(_address);

        if (docToPatAccess[_address].indexOf(msg.sender) == -1)
            docToPatAccess[_address].push(msg.sender);
    }

    function revokeAccess(address _address) public onlyPatient {
        if (!isDoctor(_address)) revert Contract__NotDoctor();

        int256 i = patToDocAccess[msg.sender].indexOf(_address);
        if (i != -1) {
            address[] memory temp = patToDocAccess[msg.sender];
            patToDocAccess[msg.sender][uint256(i)] = temp[temp.length - 1];
            patToDocAccess[msg.sender].pop();
        }

        i = docToPatAccess[_address].indexOf(msg.sender);
        if (i != -1) {
            address[] memory temp = docToPatAccess[_address];
            docToPatAccess[_address][uint256(i)] = temp[temp.length - 1];
            docToPatAccess[_address].pop();
        }
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
