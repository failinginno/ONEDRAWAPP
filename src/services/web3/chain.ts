import { defineChain } from 'viem';
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { chainConfig, configuredNetworkName, isMainnet } from '../../config/env';

if (!chainConfig.chainId || !chainConfig.rpcUrl || !chainConfig.explorerUrl) {
  throw new Error('Robinhood Chain public configuration is incomplete');
}

export const robinhoodChain = defineChain({
  id: chainConfig.chainId,
  name: configuredNetworkName,
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [chainConfig.rpcUrl] },
  },
  blockExplorers: {
    default: { name: `${configuredNetworkName} Explorer`, url: chainConfig.explorerUrl },
  },
  testnet: !isMainnet,
});

/** @deprecated Use robinhoodChain; retained for compatibility with existing imports. */
export const robinhoodTestnet = robinhoodChain;

export const wagmiConfig = createConfig({
  chains: [robinhoodChain],
  connectors: [injected({ shimDisconnect: true })],
  transports: { [robinhoodChain.id]: http(chainConfig.rpcUrl) },
  multiInjectedProviderDiscovery: true,
});
