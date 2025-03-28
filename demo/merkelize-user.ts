/** ZKSYNC IMPORTS */
import { Provider, Wallet, types } from "zksync-ethers";
import { ethers, upgrades } from 'hardhat'

/** ENV IMPORTS */
import { config } from "dotenv";
config();

/** RECLAIM */
import { Reclaim } from "../src/types";
import {
  deployReclaimContract,
} from './utils'

const SEMAPHORE_CONTRACT_ADDRESS = '0x9E138Ecc8391DCaeD80d45Cc8f020ee77cEBF820';
const zkSyncProvider = Provider.getDefaultProvider(types.Network.Sepolia);
const wallet = new Wallet(process.env.PRIVATE_KEY, zkSyncProvider);

// Create a contract instance
contract = await deployReclaimContract(SEMAPHORE_CONTRACT_ADDRESS, ethers, upgrades)

// Function to call the merkelizeUser function
async () => {
  try {
    const tx = await contract.merkelizeUser(proof, identityCommitment);
    await tx.wait(); // Wait for the transaction to be mined
    console.log("User merkelized successfully!");
  } catch (error) {
    console.error("Error merkelizing user:", error);
  }
}