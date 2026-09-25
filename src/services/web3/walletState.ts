export type WalletNetworkState = 'DISCONNECTED' | 'WRONG_NETWORK' | 'READY';

export function getWalletNetworkState(
  connected: boolean,
  chainId: number | undefined,
  requiredChainId: number,
): WalletNetworkState {
  if (!connected) return 'DISCONNECTED';
  return chainId === requiredChainId ? 'READY' : 'WRONG_NETWORK';
}
