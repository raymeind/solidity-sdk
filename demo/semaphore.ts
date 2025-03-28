/** SEMAPHORE IMPORTS */
import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof } from "@semaphore-protocol/proof";

/** ZKSYNC IMPORTS */
import { ethers } from "ethers";
import { Provider, Wallet, types } from "zksync-ethers";

/** ENV IMPORTS */
import { config } from "dotenv";
config();

const TESTNET_PAYMASTER = '0x3cb2b87d10ac01736a65688f3e0fb1b070b3eea3';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const SENDER_ADDRESS = '0xD23A5c7437Ba94aa3958948DE776051c5F00aF1C';
const SEMAPHORE_CONTRACT_ADDRESS = '0x9E138Ecc8391DCaeD80d45Cc8f020ee77cEBF820';
// const RECLAIM_CONTRACT_ADDRESS = '0x17d8BAAB2e6E7eeA709e5a06037b2bAB12C8B6ED'; // given
const RECLAIM_CONTRACT_ADDRESS = '0xd5702d1E08B88d17980EBe3032A47596e8A391aC'; // deployed by me

/** GENERATE PROOF */
// Create a new identity
const identity = new Identity(PRIVATE_KEY);
const { privateKey, publicKey, commitment } = identity;

/** CONNECT TO NETWORK */
const zkSyncProvider = Provider.getDefaultProvider(types.Network.Sepolia);
const wallet = new Wallet(PRIVATE_KEY, zkSyncProvider);
const contractABI = [
  "function merkelizeUser(tuple(tuple(string provider, string parameters, string context) claimInfo, tuple(bytes32 identifier, address owner, uint32 timestampS, uint32 epoch) claim, bytes[] signatures) proof, uint256 _identityCommitment)"
];

const RECLAIM_CONTRACT = new ethers.Contract(RECLAIM_CONTRACT_ADDRESS, contractABI, wallet);

const proof = {
  proof: {
    claimInfo: {
      provider: "test123",
      parameters: '{"body":"","geoLocation":"in","method":"GET","responseMatches":[{"type":"contains","value":"_steamid\\">Steam ID: 76561198155115943</div>"}],"responseRedactions":[{"jsonPath":"","regex":"_steamid\\">Steam ID: (.*)</div>","xPath":"id(\\"responsive_page_template_content\\")/div[@class=\\"page_header_ctn\\"]/div[@class=\\"page_content\\"]/div[@class=\\"youraccount_steamid\\"]"}],"url":"https://store.steampowered.com/account/"}',
      context: '{"contextAddress":"0x0","contextMessage":"0098967F","providerHash":"0xeda3e4cee88b5cbaec045410a0042f99ab3733a4d5b5eb2da5cecc25aa9e9df1"}',
    },
    claim: {
      identifier: "0x930a5687ac463eb8f048bd203659bd8f73119c534969258e5a7c5b8eb0987b16",
      owner: "0xef27fa8830a070aa6e26703be6f17858b61d3fba",
      timestampS: 1712685785,
      epoch: 1,
    },
    signatures: [
      "0xb246a05693f3e21a70eab5dfd5edc1d0597a160c82b8bf9e24d1f09f9dde9899154bb1672c1bf38193a7829e96e4ed09bc327657bf266e90451f6a90c8b45dfb1c"
    ],
  },
  // _identityCommitment: ethers.BigNumber.from(commitment),
};

async function merkelizeUser(proof: any) {
  try {
    // Estimate the gas cost
    const gasEstimate = await RECLAIM_CONTRACT.estimateGas.merkelizeUser(
      proof.proof,
      ethers.BigNumber.from(commitment)
    );
    console.log(`Estimated Gas: ${gasEstimate.toString()}`);

    // Send the transaction
    const tx = await RECLAIM_CONTRACT.merkelizeUser(
      proof.proof,
      commitment.toString()
    );
    await tx.wait(); // Wait for the transaction to be mined
    console.log("User merkelized successfully!");
  } catch (error) {
    console.error("Error merkelizing user:", error);
  }
}

// Example usage
merkelizeUser(proof);
