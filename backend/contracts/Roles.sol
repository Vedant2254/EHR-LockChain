// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./AddToStrMapping.sol";

library Roles {
    using AddToStrMapping for AddToStrMapping.Map;

    // This is to keep track of roles
    // Reduces searching cost
    struct Role {
        AddToStrMapping.Map bearer;
    }

    function add(Role storage role, address account, string memory hash) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer.set(account, hash);
    }

    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer.remove(account);
    }

    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return bytes(role.bearer.get(account)).length != 0;
    }

    function setHash(Role storage role, address account, string memory _hash) internal {
        role.bearer.set(account, _hash);
    }

    function getHash(Role storage role, address account) internal view returns (string memory) {
        return role.bearer.get(account);
    }

    function getMembers(Role storage role) internal view returns (address[] memory) {
        return role.bearer.keys;
    }
}
