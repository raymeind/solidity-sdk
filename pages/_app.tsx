import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { WagmiProvider } from 'wagmi';
import { config } from '../utils/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import UserMerkelizer from '../components/merkelize-user';

const queryClient = new QueryClient()

const proofObj = {
  claimInfo: {
    provider: 'uid-dob',
    parameters: '{"dob":"0000-00-00"}',
    context: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8some-application-specific-context"providerHash":"0x3246874620eacad8b93e3e05e5d5bb5877c9bed5ddcaf9b4f6cf291e0fb3c64e"'
  },
  signedClaim: {
    signatures: [
      '0x7fad7ed8a0ac1850f612f5c39f7159433d1944fec0668ade90f2ae00dac6f3036ee001d50017af7da13c934d0bc8b6805c61a9d072963197aeeb3f6b532c9b001c',
      '0x39a35462a1988f261032d49480f42d4a99092be93674e2ebf1e17b33baf926ff22bfa356f14c3b26c2b93a30bda7b8a476b1051f7239b2024c91c981f51678ad1c',
      '0x8eb5f03385ca9fe6e160ffccc40651029a88ab64be8a6aa71d4ac9138546cb0940364d59675c801006fc1ee739b0ad8c755e4a18a4bb59258b904a4e350b799d1b',
      '0x3b5a63dcbf96b9d1e970325ce75ccb2148b795a7cce8ae1eae3f2a7a8d09229409a43812e07a209688e4d5d78b562a97ee2652e0d447f31a12b3b2a4c9c560491b',
      '0xe6def292edfc60a4a6fb7d3834532160c8176acab7a8ee73a33717e868c8da5c1ccea44b287ec6309b8510fb6950a5c9bcd3b22474ef66eddc2be4fd85df40501b'
    ],
    claim: {
      identifier: '0x838b28263de9fc4c7416c14caad8e083013b353fe81b4245faaf1990ee126f94',
      owner: '0x8EF003Dd62c3bbD28FEdedDfd57cd48e169F58f3',
      timestampS: 1743120377,
      epoch: 1
    }
  }
}

// const proofObj = {
//   claimInfo: {
//     provider: "http",
//     context: JSON.stringify({
//       contextAddress: "1742442913057",
//       contextMessage: "",
//       extractedParameters: { username: "ash-jyc" },
//       providerHash: "0xcb4a6b54d59f97b5891cced83e9e909c938bc06149a22f9e76309f2d20300609",
//     }),
//     parameters: JSON.stringify({
//       additionalClientOptions: {},
//       body: "",
//       geoLocation: "",
//       headers: {
//         "Sec-Fetch-Mode": "same-origin",
//         "Sec-Fetch-Site": "same-origin",
//         "User-Agent":
//           "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1",
//       },
//       method: "GET",
//       paramValues: { username: "ash-jyc" },
//       responseMatches: [
//         {
//           invert: false,
//           type: "contains",
//           value: "<span class=\"color-fg-muted\">({{username}})</span>",
//         },
//       ],
//       responseRedactions: [
//         {
//           jsonPath: "",
//           regex: "<span class=\"color-fg-muted\">\\((.*)\\)</span>",
//           xPath: "",
//         },
//       ],
//       url: "https://github.com/settings/profile",
//     }),
//   },
//   signedClaim: {
//     signatures: [
//       "0x5a55184f8717a104bad1d46de0158dc949fdc37db43e9f1e21caef374db8774e63ebfcd545a87429d4aa5fbc99f521e03c120457522947c349db35f19c66fda51b",
//     ],
//     claim: {
//       identifier: "0x7b4eb3fb39f5bd6cd87169155bb19cfe8452e573b3bc2dc2126085843f5bb8ce",
//       owner: "0x047a0d46d17f49105518ed4a3c6a2b0a8315fbad",
//       timestampS: 1742442991,
//       epoch: 1,
//     },
//   },
// };

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <UserMerkelizer proofObj={proofObj} />
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;