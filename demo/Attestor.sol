// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../contracts/Reclaim.sol";
import "../contracts/lib/Addresses.sol";

contract Attestor {
	address public reclaimAddress;

	constructor() {
		// Replace with the network you are deploying on
		reclaimAddress = Addresses.ZKSYNC_SEPOLIA_TESTNET;
	}

    event ProofContext(bytes32 context);

	function verifyProof(Reclaim.Proof memory proof) public view {
		Reclaim(reclaimAddress).verifyProof(proof);
		// Your business logic upon successful verification
		// Example: Verify that proof.context matches your expectations
		//@TODO: implement business logic

		// just print proof.context for now
		// emit ProofContext(proof.context);
	}

    
}
