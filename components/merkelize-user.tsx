import { Identity } from '@semaphore-protocol/identity'
import { useAccount, useSimulateContract, useWriteContract, useConnect, useDisconnect } from 'wagmi'
import RECLAIM from '../contract-artifacts/Reclaim.json'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Button, Spinner } from '@chakra-ui/react'

export const ConnectButton = () => {
  const { address } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  
  // Track when the component has mounted
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true) // This ensures we render only on the client
  }, [])

  if (!isClient) return null // Avoid mismatch by not rendering on the server

  return (
    <div>
      {address ? (
        <Button onClick={() => disconnect()}>Disconnect</Button>
      ) : (
        connectors.map((connector) => (
          <Button key={connector.uid} onClick={() => connect({ connector })}>
            {connector.name}
          </Button>
        ))
      )}
    </div>
  )
}

export default function UserMerkelizer({ proofObj }: any) {
  const { address } = useAccount()
  const [identity, setIdentity] = useState<Identity | null>(null)

  useEffect(() => {
    if (address && !identity) {
      const newIdentity = new Identity(address)
      setIdentity(newIdentity)
      console.log('Generated new identity:', newIdentity)
    }
  }, [address, identity])

  /* const proofReq = {
    claimInfo: {
      provider: proofObj.provider,
      context: proofObj.context,
      parameters: proofObj.parameters
    },
    signedClaim: {
      signatures: proofObj.signatures,
      claim: {
        identifier: proofObj.identifier,
        owner: proofObj.owner,
        timestampS: proofObj.timestampS,
        epoch: proofObj.epoch
      }
    }
  }*/

  const { data, isSuccess, isPending, error } = useSimulateContract({
    address: process.env.NEXT_PUBLIC_RECLAIM_CONTRACT_ADDRESS! as `0x${string}`,
    abi: RECLAIM.abi,
    functionName: 'merkelizeUser',
    args: [proofObj, identity?.commitment.toString()],
    chainId: 300,
  })

  useEffect(() => {
    if (data?.request) {
      console.log('Transaction request:', data.request)
    }
  }, [data])

  const { writeContract, isPending: isWriting } = useWriteContract()

  async function handleContractWrite() {
    if (!data?.request) return
    try {
      console.log('Transaction request:', data.request)
      const txHash = await writeContract(data.request)
      console.log('Transaction sent:', txHash)

      // Only proceed if we need additional on-chain interactions
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_JSON_RPC_URL!)
      const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY!, provider)
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_RECLAIM_CONTRACT_ADDRESS!, RECLAIM.abi, signer)

      const tx = await contract.airDrop(txHash)
      await tx.wait()
      console.log('Transaction confirmed:', tx.hash)
    } catch (err) {
      console.error('Error executing contract:', err)
    }
  }

  return (
    <>
      <ConnectButton />
      <Button
        colorScheme='red'
        p='10'
        borderRadius='2xl'
        onClick={handleContractWrite}
        disabled={!isSuccess || !data?.request || isWriting}
      >
        {isWriting ? <Spinner /> : 'Register Identity'}
      </Button>

      {isPending && <p>Simulating contract...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </>
  )
}