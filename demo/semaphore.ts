import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"

// create new identity
const { privateKey, publicKey, commitment } = new Identity()
const identity = new Identity(privateKey)
console.log("Private Key:", privateKey)
console.log("Public Key:", publicKey)
console.log("Commitment:", commitment)

// create group
const group = new Group()
group.addMember(commitment)
const merkleProof = group.generateMerkleProof(0)
console.log("Merkle Proof:\n", merkleProof)

const scope = group.root
const message = 1

async function main() {
    const proof = await generateProof(identity, merkleProof, message, scope)
    console.log("Proof:\n", proof)
}
main()
