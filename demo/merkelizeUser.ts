import { Identity } from "@semaphore-protocol/identity";

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

const identity = new Identity(PRIVATE_KEY);
const { privateKey, publicKey, commitment } = identity;

const zkSyncProvider = Provider.getDefaultProvider(types.Network.Sepolia);
const signer = new Wallet(privateKey, zkSyncProvider);

// Contract ABI and Address (Ensure you have the ABI from your compiled contract)
const reclaimAbi = [
  // Your contract ABI here (Example)
  "function initialize(address _semaphoreAddress)",
  "function merkelizeUser(address proof, uint256 _identityCommitment)",
  "function semaphoreAddress() public view returns (address)"
];
const reclaimAddress = "0xd5702d1E08B88d17980EBe3032A47596e8A391aC";

// Create a contract instance
const reclaimContract = new ethers.Contract(reclaimAddress, reclaimAbi, signer);

// Function to initialize the contract with the Semaphore address
async function initializeReclaimContract(semaphoreAddress: string) {
  try {
    const tx = await reclaimContract.initialize(semaphoreAddress);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("Reclaim contract initialized with semaphore address:", semaphoreAddress);
  } catch (error) {
    console.error("Error initializing Reclaim contract:", error);
  }
}

// Function to call the merkelizeUser function
async function merkelizeUser(proof: any, identityCommitment: number) {
  try {
    const tx = await reclaimContract.merkelizeUser(proof, identityCommitment);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("User merkelized successfully!");
  } catch (error) {
    console.error("Error merkelizing user:", error);
  }
}

// Example of how to initialize and merkelize a user (replace with actual proof and identity commitment)
async function main() {
  const semaphoreAddress = "YOUR_SEMAPHORE_CONTRACT_ADDRESS"; // Replace with the Semaphore contract address
  await initializeReclaimContract(semaphoreAddress);

  const proof = {}; // Populate this with the proof object
  const identityCommitment = 1234567890; // Example commitment
  await merkelizeUser(proof, identityCommitment);
}

main().catch((error) => {
  console.error("Error in main function:", error);
});
