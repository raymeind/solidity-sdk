// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IReclaim.sol";

contract ReclaimVerifier {
    address public reclaim;

    constructor(address _reclaim) {
        reclaim = _reclaim;
    }

    function verifyUserProof(IReclaim.Proof memory proof) external returns (bool) {
        return IReclaim(reclaim).verifyProof(proof);
    }
}