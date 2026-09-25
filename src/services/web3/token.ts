import type { Address, PublicClient, WalletClient } from 'viem';
import { maxUint256 } from 'viem';
import { minimalErc20Abi } from './erc20';

export function getAllowance(
  client: PublicClient,
  token: Address,
  owner: Address,
  spender: Address,
) {
  return client.readContract({ address: token, abi: minimalErc20Abi, functionName: 'allowance', args: [owner, spender] });
}

export function approve(
  client: WalletClient,
  token: Address,
  account: Address,
  spender: Address,
  amount: bigint,
) {
  return client.writeContract({ account, chain: client.chain, address: token, abi: minimalErc20Abi, functionName: 'approve', args: [spender, amount] });
}

export function approveMax(
  client: WalletClient,
  token: Address,
  account: Address,
  spender: Address,
) {
  return approve(client, token, account, spender, maxUint256);
}
