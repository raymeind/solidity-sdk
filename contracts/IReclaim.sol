// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IReclaim {
    struct Claim {
        bytes32 identifier;
        uint32 epoch;
        uint32 timestampS;
    }

    struct SignedClaim {
        Claim claim;
        bytes[] signatures;
    }

    struct ClaimInfo {
        string provider;
        string parameters;
    }

    struct Proof {
        ClaimInfo claimInfo;
        SignedClaim signedClaim;
    }

    function verifyProof(Proof memory proof) external returns (bool);
}