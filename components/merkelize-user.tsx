import { Identity } from '@semaphore-protocol/identity';
import { useAccount } from 'wagmi';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import RECLAIM from '../artifacts/contracts/Reclaim.sol/Reclaim.json';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

type ProofObject = {
  provider: string;
  context: string;
  parameters: string[];
  signatures: string[];
  identifier: string;
  ownerPublicKey: string;
  timestampS: number;
  epoch: number;
};

export default function MerkelizeUser({ proofObj }: { proofObj: ProofObject }) {
  const { address } = useAccount();
  const [identity, setIdentity] = useState<Identity | null>(null);

  useEffect(() => {
    if (!identity && address) {
      const newIdentity = new Identity(address);
      setIdentity(newIdentity);
      console.log('Generated new identity: ', newIdentity);
    }
  }, [identity, address]);

  const proofReq = {
    claimInfo: {
      provider: proofObj.provider,
      context: proofObj.context,
      parameters: proofObj.parameters
    },
    signedClaim: {
      signatures: proofObj.signatures,
      claim: {
        identifier: proofObj.identifier,
        owner: ethers.utils.computeAddress(`0x${proofObj.ownerPublicKey}`),
        timestampS: proofObj.timestampS,
        epoch: proofObj.epoch
      }
    }
  };

  const { config } = usePrepareContractWrite({
    enabled: !!identity,
    address: process.env.NEXT_PUBLIC_RECLAIM_CONTRACT_ADDRESS as `0x${string}`,
    abi: RECLAIM.abi,
    functionName: 'merkelizeUser',
    args: [proofReq, identity?.commitment.toString()],
    chainId: 420,
    onSuccess: async (data) => {
      console.log('Successful - register prepare: ', data);
      try {
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_JSON_RPC_URL);
        const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY!, provider);
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, RECLAIM.abi, signer);
        const tx = await contract.airDrop(data);
        await tx.wait();
        console.log('Transaction confirmed:', tx.hash);
      } catch (error) {
        console.error('Error sending data:', error);
      }
    },
    onError(error: Error) {
      if (error.message.includes('AlreadyMerkelized')) {
        console.log('This user is already merkelized!!!!');
      } else {
        console.error(error);
      }
    }
  });

  const contractWrite = useContractWrite(config);

  return (
    <>
      {!contractWrite.isSuccess && (
        <>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              contractWrite.write?.()
            }}
          >
            Register Identity
          </button>
          {contractWrite.isLoading && ( // Only show the spinner when loading
            <div className="inline-block ml-2 animate-spin">
              ⏳
            </div>
          )}
        </>
      )}
    </>
  )

}