// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library Roles {
    // This is to keep track of roles
    // Reduces searching cost
    struct Role {
        mapping(address => string) bearer;
    }

    function add(Role storage role, address account, string memory hash) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = hash;
    }

    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = "";
    }

    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return bytes(role.bearer[account]).length != 0;
    }

    function set(Role storage role, address account, string memory _hash) internal {
        role.bearer[account] = _hash;
    }

    function get(Role storage role, address account) internal view returns (string memory) {
        return role.bearer[account];
    }
}
