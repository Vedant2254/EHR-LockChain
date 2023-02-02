// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Roles.sol";

error Contract__NotAdmin();
error Contract__NotDoctor();
error Contract__NotPatient();

contract Contract {
    // using methods of Roles for Role struct in Roles
    using Roles for Roles.Role;

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
    mapping(address => mapping(address => bool)) Access;

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
        if (Access[_address][msg.sender]) revert("Not Allowed!");
        Patients[_address] = _hash;
    }

    function getAllPats() public view returns (address[] memory) {
        return pat_ids;
    }

    function getPatHash(address _address) public view returns (string memory) {
        if (!isPatient(_address)) revert Contract__NotPatient();

        if (msg.sender != _address && Access[_address][msg.sender]) revert("Now Allowed!");

        return Patients[_address];
    }

    function giveAccess(address _address) public onlyPatient {
        if (!isDoctor(_address)) revert Contract__NotDoctor();
        Access[msg.sender][_address] = true;
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
