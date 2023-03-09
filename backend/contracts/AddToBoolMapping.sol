// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library AddToBoolMapping {
    // mapping address => bool
    struct Map {
        address[] keys;
        mapping(address => bool) values;
        mapping(address => uint256) indexOf;
    }

    function get(Map storage map, address key) internal view returns (bool) {
        return map.values[key];
    }

    function getKeys(Map storage map) internal view returns (address[] memory) {
        return map.keys;
    }

    function getKeyAtIndex(Map storage map, uint256 index) internal view returns (address) {
        return map.keys[index];
    }

    function size(Map storage map) internal view returns (uint256) {
        return map.keys.length;
    }

    function set(Map storage map, address key) internal {
        if (map.values[key]) return;

        // add address => true mapping to values
        map.values[key] = true;

        // add index of address to indexOf mapping
        map.indexOf[key] = map.keys.length;

        // add address to keys
        map.keys.push(key);
    }

    function unset(Map storage map, address key) internal {
        if (!map.values[key]) return;

        // remove from values
        delete map.values[key];

        // important backups
        uint256 index = map.indexOf[key];
        uint256 lastIndex = map.keys.length - 1;
        address lastKey = map.keys[lastIndex];

        // update indexOf last element
        map.indexOf[lastKey] = index;
        delete map.indexOf[key];

        // remove from keys
        map.keys[index] = lastKey;
        map.keys.pop();
    }
}
