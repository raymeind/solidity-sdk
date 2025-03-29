import { createConfig, http } from 'wagmi'
import { zksyncSepoliaTestnet } from 'wagmi/chains'
import { metaMask } from '@wagmi/connectors'

export const config = createConfig({
  chains: [zksyncSepoliaTestnet], 
  connectors: [metaMask()],
  transports: { 
    [zksyncSepoliaTestnet.id]: http(), 
  }, 
})
