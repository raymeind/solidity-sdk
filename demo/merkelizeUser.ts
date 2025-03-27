/** SEMAPHORE IMPORTS */
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"

/** ZKSYNC IMPORTS */
import { ethers } from "ethers";
import { Provider, Wallet, types } from "zksync-ethers";

/** ENV IMPORTS */
import { config } from "dotenv";
import { zksync } from "viem/zksync";
config();

const TESTNET_PAYMASTER = '0x3cb2b87d10ac01736a65688f3e0fb1b070b3eea3';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const SENDER_ADDRESS = '0xD23A5c7437Ba94aa3958948DE776051c5F00aF1C';
const SEMAPHORE_CONTRACT_ADDRESS = '0x9E138Ecc8391DCaeD80d45Cc8f020ee77cEBF820';

/** GENERATE PROOF */
// Create a new identity
const identity = new Identity(PRIVATE_KEY);
const { privateKey, publicKey, commitment } = identity;
console.log("Private Key:", privateKey);
console.log("Public Key:", publicKey);
console.log("Commitment:", commitment);

// Create a group (same as before)
const group = new Group();
group.addMember(commitment);
const merkleProof = group.generateMerkleProof(0);
console.log("Merkle Proof:\n", merkleProof);

const scope = group.root;
const message = 1;

const semaphoreProof = await generateProof(identity, merkleProof, message, scope).then((result) => result).catch((error) => {
    console.error("Error generating proof:", error.message);
    throw error;
});
console.log("Semaphore Proof:\n", semaphoreProof);

const genericProof = {
    claimInfo: {
        context: '{"contextAddress":"0x0","contextMessage":"0098967F","providerHash":"0xeda3e4cee88b5cbaec045410a0042f99ab3733a4d5b5eb2da5cecc25aa9e9df1"}',
        provider: 'http',
        parameters: '{"body":"","geoLocation":"in","method":"GET","responseMatches":[{"type":"contains","value":"_steamid\\">Steam ID: 76561198155115943</div>"}],"responseRedactions":[{"jsonPath":"","regex":"_steamid\\">Steam ID: (.*)</div>","xPath":"id(\\"responsive_page_template_content\\")/div[@class=\\"page_header_ctn\\"]/div[@class=\\"page_content\\"]/div[@class=\\"youraccount_steamid\\"]"}],"url":"https://store.steampowered.com/account/"}'
    },
    signedClaim: {
        claim: {
            epoch: 1,
            identifier: '0x930a5687ac463eb8f048bd203659bd8f73119c534969258e5a7c5b8eb0987b16',
            owner: '0xef27fa8830a070aa6e26703be6f17858b61d3fba',
            timestampS: 1712685785
        },
        signatures: [
            '0xb246a05693f3e21a70eab5dfd5edc1d0597a160c82b8bf9e24d1f09f9dde9899154bb1672c1bf38193a7829e96e4ed09bc327657bf266e90451f6a90c8b45dfb1c'
        ]
    }
};
console.log("Generic Proof:\n", genericProof);

/** CONNECT TO NETWORK */
const zkSyncProvider = Provider.getDefaultProvider(types.Network.Sepolia);
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider);
const contractABI = [
    "function merkelizeUser(tuple memory proof, uint256 _identityCommitment) external",
    "function calculateGroupIdFromProvider(string memory provider) public view returns (uint256)",
    "function addMember(uint256 groupId, uint256 identityCommitment) public",
];

// const contract = new ethers.Contract(SEMAPHORE_CONTRACT_ADDRESS, contractABI, wallet);

// // Prepare parameters for the merkelizeUser function
// const proofParams = {
//     claimInfo: {
//         provider: "test1234", // Replace with the actual provider
//         parameters: [] // Include the relevant parameters for the claim
//     },
//     proof: semaphoreProof.proof // The proof generated
// };

// // Identity commitment (the value that needs to be passed as the second parameter)
// const identityCommitment = commitment; // Or use another value if required by the contract

// /** SEND TRANSACTION */
// const merkelizeUserTransaction = async () => {
//     try {
//         // Estimate gas for merkelizeUser function
//         const gasEstimate = await contract.estimateGas.merkelizeUser(proofParams, identityCommitment);
//         console.log(`Estimated Gas: ${gasEstimate.toString()}`);

//         // Send the transaction to merkelize the user
//         const tx = await contract.merkelizeUser(proofParams, identityCommitment, {
//             gasLimit: gasEstimate, // Include gas estimate here
//         });

//         console.log("Transaction sent:", tx);

//         // Wait for the transaction to be mined
//         const receipt = await tx.wait();
//         console.log("Transaction mined:", receipt);
//     } catch (error) {
//         console.error("Error sending transaction:", error);
//     }
// };

// // Call merkelizeUserTransaction to initiate the process
// merkelizeUserTransaction();

const proofProvider = generateProof.claimInfo.provider;
const identityCommitment = ethers.utils.solidityKeccak256(
  ["string"], 
  [genericProof.signedClaim.claim.identifier] // Example of how to generate an identity commitment from the claim identifier
);
const groupId = 1;  // You may need to calculate or retrieve this based on your logic
const userParamsHash = ethers.utils.solidityKeccak256(
  ["string", "string"], 
  [genericProof.claimInfo.provider, genericProof.claimInfo.parameters]
);

// Call contract's `merkelizeUser` function
const contract = new ethers.Contract(SEMAPHORE_CONTRACT_ADDRESS, contractABI, wallet);

async function merkelizeUser() {
  try {
    const tx = await contract.merkelizeUser(
      genericProof,  // You will pass the full proof object here
      identityCommitment
    );
    console.log("Transaction sent:", tx);
    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt);
  } catch (error) {
    console.error("Error merkelizing user:", error);
  }
}

// Call the merkelizeUser function
merkelizeUser();
