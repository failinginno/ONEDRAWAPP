export type ChainConfig = {
  chainId?: number;
  rpcUrl?: string;
  explorerUrl?: string;
  usdgAddress?: string;
  poolFactoryAddress?: string;
  poolManagerAddress?: string;
  feeVaultAddress?: string;
  randomnessProvider?: string;
  deploymentBlock?: bigint;
  dataMode: 'demo' | 'onchain';
};

export const ROBINHOOD_TESTNET_DEFAULTS = Object.freeze({
  chainId: 46630,
  rpcUrl: 'https://rpc.testnet.chain.robinhood.com',
  explorerUrl: 'https://explorer.testnet.chain.robinhood.com',
  usdgAddress: '0x7E955252E15c84f5768B83c41a71F9eba181802F',
});

export const ROBINHOOD_MAINNET = Object.freeze({
  chainId: 4663,
  explorerUrl: 'https://robinhoodchain.blockscout.com',
  usdgAddress: '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168',
});

const optional = (value: string | undefined) => value?.trim() || undefined;
const optionalNumber = (value: string | undefined) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/** Environment-only blockchain configuration. Import this in adapters, not UI components. */
export function resolveChainConfig(env: Record<string, string | undefined>): ChainConfig {
  return {
    chainId: optionalNumber(env.VITE_CHAIN_ID) ?? ROBINHOOD_TESTNET_DEFAULTS.chainId,
    rpcUrl: optional(env.VITE_RPC_URL) ?? ROBINHOOD_TESTNET_DEFAULTS.rpcUrl,
    explorerUrl: optional(env.VITE_EXPLORER_URL) ?? ROBINHOOD_TESTNET_DEFAULTS.explorerUrl,
    usdgAddress: optional(env.VITE_USDG_ADDRESS) ?? ROBINHOOD_TESTNET_DEFAULTS.usdgAddress,
    poolFactoryAddress: optional(env.VITE_POOL_FACTORY_ADDRESS),
    poolManagerAddress: optional(env.VITE_POOL_MANAGER_ADDRESS),
    feeVaultAddress: optional(env.VITE_FEE_VAULT_ADDRESS),
    randomnessProvider: optional(env.VITE_RANDOMNESS_PROVIDER_ADDRESS),
    deploymentBlock: optional(env.VITE_DEPLOYMENT_BLOCK)
      ? BigInt(env.VITE_DEPLOYMENT_BLOCK!)
      : undefined,
    dataMode: env.VITE_DATA_MODE === 'onchain' ? 'onchain' : 'demo',
  };
}

export const chainConfig: ChainConfig = Object.freeze(resolveChainConfig(import.meta.env));
export const showDemoIndicator = import.meta.env.VITE_SHOW_DEMO_INDICATOR !== 'false';
export const isMainnet = chainConfig.chainId === ROBINHOOD_MAINNET.chainId;
export const configuredNetworkName = isMainnet ? 'Robinhood Chain' : 'Robinhood Chain Testnet';

export const isWalletConfigured = () =>
  Boolean(chainConfig.chainId && chainConfig.rpcUrl && chainConfig.explorerUrl && chainConfig.usdgAddress);

export const isOnchainConfigured = () =>
  Boolean(isWalletConfigured() && chainConfig.poolManagerAddress);
