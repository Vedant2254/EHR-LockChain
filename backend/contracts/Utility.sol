// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library Utility {
    function indexOf(address[] memory arr, address key) internal pure returns (int256) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == key) return int256(i);
        }
        return -1;
    }
}
