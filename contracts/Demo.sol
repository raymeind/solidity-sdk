// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Reclaim.sol";
import "./lib/Claims.sol";

contract Demo {
    Reclaim reclaim;
    /**
     * example proof
     */
    // make sigs contain this: 0xb246a05693f3e21a70eab5dfd5edc1d0597a160c82b8bf9e24d1f09f9dde9899154bb1672c1bf38193a7829e96e4ed09bc327657bf266e90451f6a90c8b45dfb1c"
    bytes[] sigs = [bytes(hex"b246a05693f3e21a70eab5dfd5edc1d0597a160c82b8bf9e24d1f09f9dde9899154bb1672c1bf38193a7829e96e4ed09bc327657bf266e90451f6a90c8b45dfb1c")];
    Reclaim.Proof proof = Reclaim.Proof({
        claimInfo: Claims.ClaimInfo({
            provider: "http",
            parameters: '{"body":"","geoLocation":"in","method":"GET","responseMatches":[{"type":"contains","value":"_steamid\\">Steam ID: 76561198155115943</div>"}],"responseRedactions":[{"jsonPath":"","regex":"_steamid\\">Steam ID: (.*)</div>","xPath":"id(\\"responsive_page_template_content\\")/div[@class=\\"page_header_ctn\\"]/div[@class=\\"page_content\\"]/div[@class=\\"youraccount_steamid\\"]"}],"url":"https://store.steampowered.com/account/"}',
            context: "steam"
        }),
        signedClaim: Claims.SignedClaim({
            claim: Claims.CompleteClaimData({
                epoch: 1,
                identifier: 0x930a5687ac463eb8f048bd203659bd8f73119c534969258e5a7c5b8eb0987b16,
                owner: 0xef27FA8830a070AA6e26703be6f17858B61d3Fba,
                timestampS: 1712685785
            }),
            signatures: sigs
        })
    });

    /**
     * constructor
     */
    constructor() {
        reclaim = new Reclaim();
        reclaim.initialize(0x9E138Ecc8391DCaeD80d45Cc8f020ee77cEBF820);
    }

    /**
     * call createGroup
     */
    function createGroup(
		string memory provider,
		uint256 merkleTreeDepth
	) public {
        reclaim.createGroup(provider, merkleTreeDepth);
    }

    /**
     * call merkelizeUser
     */
    function merkelizeUser(
        uint256 _identityCommitment
    ) public {
        reclaim.merkelizeUser(proof, _identityCommitment);
    }
}