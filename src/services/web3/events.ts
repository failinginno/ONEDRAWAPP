import type { Address, PublicClient } from 'viem';
import { oneDrawAbi } from './onedrawAbi';
import { eventToActivity } from './onedraw';

export async function readOnedrawEvents(client: PublicClient, manager: Address, fromBlock: bigint) {
  const logs = await client.getContractEvents({ address: manager, abi: oneDrawAbi, fromBlock, toBlock: 'latest' });
  return logs.map((log) => ({ log, activity: eventToActivity(log) }));
}
