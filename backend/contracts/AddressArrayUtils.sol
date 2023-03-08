// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library AddressArrayUtils {
    function indexOf(address[] memory arr, address key) internal pure returns (int256) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == key) return int256(i);
        }
        return -1;
    }

    function contains(address[] memory arr, address key) internal pure returns (bool) {
        return indexOf(arr, key) != -1;
    }

    function remove(address[] storage arr, address key) internal returns (bool) {
        int256 i = indexOf(arr, key);

        if (i == -1) return false;

        address[] memory temp = arr;
        arr[uint256(i)] = temp[temp.length - 1];
        arr.pop();

        return true;
    }
}
