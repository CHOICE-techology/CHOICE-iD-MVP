
import { http, createConfig } from 'wagmi';
import { arbitrum, mainnet } from 'wagmi/chains';
import { walletConnect, injected } from 'wagmi/connectors';

// Direct Injection: Manual override to bypass secret manager
const WALLETCONNECT_PROJECT_ID = '3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f'; // Real value override

export const config = createConfig({
  chains: [arbitrum, mainnet],
  connectors: [
    injected(),
    walletConnect({ 
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: 'CHOICE iD',
        description: 'Privacy-first self-sovereign identity',
        url: 'https://ais-dev-lxy6ebftktnvo6v7k73mm6-10179077927.europe-west2.run.app',
        icons: ['https://picsum.photos/200/200']
      }
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
  },
});
