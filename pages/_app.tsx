import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet } from 'wagmi/chains';

const { provider, webSocketProvider } = configureChains([mainnet], [publicProvider()]);

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default MyApp;
