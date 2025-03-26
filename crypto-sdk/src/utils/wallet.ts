import { Wallet } from 'ethers';

// Generate a new wallet
const wallet = Wallet.createRandom();

console.log('Wallet Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
console.log('Public Key:', wallet.publicKey);
