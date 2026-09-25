import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Address } from 'viem';
import {
  WagmiProvider,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useReadContracts,
  useSwitchChain,
} from 'wagmi';
import { chainConfig, isMainnet } from '../../config/env';
import { minimalErc20Abi } from '../../services/web3/erc20';
import { formatAddress, formatTokenBalance } from '../../services/web3/format';
import { robinhoodTestnet, wagmiConfig } from '../../services/web3/chain';

type WalletErrorCode =
  | 'WALLET_NOT_INSTALLED'
  | 'CONNECTION_REJECTED'
  | 'SWITCH_REJECTED'
  | 'RPC_UNAVAILABLE'
  | 'TOKEN_READ_FAILED';

type WalletValue = {
  address?: Address;
  displayAddress: string;
  connected: boolean;
  connecting: boolean;
  correctNetwork: boolean;
  chainId?: number;
  chainName: string;
  ethBalance: string;
  usdgBalance: string;
  usdgName?: string;
  usdgSymbol: string;
  usdgDecimals?: number;
  balancesLoading: boolean;
  error?: { code: WalletErrorCode; message: string };
  connectWallet: () => void;
  disconnectWallet: () => void;
  switchToRobinhood: () => void;
  clearError: () => void;
};

const WalletContext = createContext<WalletValue | null>(null);
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10_000, refetchOnWindowFocus: true, retry: 1 } },
});

const tokenAddress = chainConfig.usdgAddress as Address;

function WalletState({ children }: { children: ReactNode }) {
  const account = useAccount();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  const [localError, setLocalError] = useState<WalletValue['error']>();
  const correctNetwork = account.chainId === robinhoodTestnet.id;

  const eth = useBalance({
    address: account.address,
    chainId: robinhoodTestnet.id,
    query: { enabled: Boolean(account.address && correctNetwork) },
  });

  const token = useReadContracts({
    allowFailure: true,
    contracts: [
      { address: tokenAddress, abi: minimalErc20Abi, functionName: 'name', chainId: robinhoodTestnet.id },
      { address: tokenAddress, abi: minimalErc20Abi, functionName: 'symbol', chainId: robinhoodTestnet.id },
      { address: tokenAddress, abi: minimalErc20Abi, functionName: 'decimals', chainId: robinhoodTestnet.id },
      {
        address: tokenAddress,
        abi: minimalErc20Abi,
        functionName: 'balanceOf',
        args: account.address ? [account.address] : undefined,
        chainId: robinhoodTestnet.id,
      },
    ],
    query: { enabled: Boolean(account.address && correctNetwork) },
  });

  const name = token.data?.[0]?.status === 'success' ? String(token.data[0].result) : undefined;
  const symbol = token.data?.[1]?.status === 'success' ? String(token.data[1].result) : 'USDG';
  const decimals = token.data?.[2]?.status === 'success' ? Number(token.data[2].result) : undefined;
  const balance = token.data?.[3]?.status === 'success' ? (token.data[3].result as bigint) : undefined;

  const value = useMemo<WalletValue>(
    () => ({
      address: account.address,
      displayAddress: account.address ? formatAddress(account.address) : 'Connect Wallet',
      connected: account.isConnected,
      connecting: account.isConnecting || connect.isPending,
      correctNetwork,
      chainId: account.chainId,
      chainName: correctNetwork ? robinhoodTestnet.name : (account.chain?.name ?? 'Unsupported network'),
      ethBalance: eth.data ? formatTokenBalance(eth.data.value, eth.data.decimals, 6) : '—',
      usdgBalance: formatTokenBalance(balance, decimals, 2),
      usdgName: name,
      usdgSymbol: symbol,
      usdgDecimals: decimals,
      balancesLoading: eth.isLoading || token.isLoading,
      error:
        localError ??
        (eth.error
          ? { code: 'RPC_UNAVAILABLE', message: `Unable to read the ${isMainnet ? 'mainnet' : 'testnet'} ETH balance.` }
          : token.error
            ? { code: 'TOKEN_READ_FAILED', message: `Unable to read the USDG ${isMainnet ? 'token' : 'test token'}.` }
            : undefined),
      connectWallet: () => {
        setLocalError(undefined);
        const connector = connect.connectors[0];
        if (!connector || typeof window === 'undefined' || !window.ethereum) {
          setLocalError({ code: 'WALLET_NOT_INSTALLED', message: 'Install an EVM browser wallet to connect.' });
          return;
        }
        connect.connect(
          { connector },
          {
            onError: (error) =>
              setLocalError({ code: 'CONNECTION_REJECTED', message: error.message }),
          },
        );
      },
      disconnectWallet: () => {
        disconnect.disconnect();
        setLocalError(undefined);
      },
      switchToRobinhood: () => {
        setLocalError(undefined);
        switchChain.switchChain(
          { chainId: robinhoodTestnet.id },
          {
            onError: (error) =>
              setLocalError({ code: 'SWITCH_REJECTED', message: error.message }),
          },
        );
      },
      clearError: () => setLocalError(undefined),
    }),
    [account, balance, connect, correctNetwork, decimals, disconnect, eth, localError, name, switchChain, symbol, token],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount>
      <QueryClientProvider client={queryClient}>
        <WalletState>{children}</WalletState>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useWallet(): WalletValue {
  const value = useContext(WalletContext);
  if (!value) throw new Error('useWallet must be used inside WalletProvider');
  return value;
}

declare global {
  interface Window {
    ethereum?: unknown;
  }
}
