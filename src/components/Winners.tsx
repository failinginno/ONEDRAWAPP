import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { createPublicClient, formatUnits, http, type Address } from 'viem';
import { Link } from 'react-router-dom';
import { Eyebrow, SectionHeading } from './primitives';
import { chainConfig } from '../config/env';
import { oneDrawAbi } from '../services/web3/onedrawAbi';

type SettledDraw = {
  id: bigint;
  winner: Address;
  winningTicket: number;
  prize: bigint;
};

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const client = createPublicClient({ transport: http(chainConfig.rpcUrl) });
const manager = chainConfig.poolManagerAddress as Address | undefined;
const shortAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`;

export default function Winners() {
  const [draws, setDraws] = useState<SettledDraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refresh = useCallback(async () => {
    if (!manager || chainConfig.dataMode !== 'onchain') {
      setDraws([]); setLoading(false); return;
    }
    try {
      const nextPoolId = await client.readContract({ address: manager, abi: oneDrawAbi, functionName: 'nextPoolId' });
      const ids = Array.from({ length: Math.max(0, Number(nextPoolId) - 1) }, (_, index) => BigInt(index + 1));
      const pools = await Promise.all(ids.map(async (id) => {
        const pool = await client.readContract({ address: manager, abi: oneDrawAbi, functionName: 'getPool', args: [id] });
        return { id, pool };
      }));
      const completed = pools
        .filter(({ pool }) => pool.status === 3 && pool.winner.toLowerCase() !== ZERO_ADDRESS)
        .map(({ id, pool }) => ({ id, winner: pool.winner, winningTicket: pool.winningTicket, prize: pool.prizeAmount }))
        .sort((a, b) => (a.id > b.id ? -1 : 1))
        .slice(0, 8);
      setDraws(completed);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 12_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return (
    <section id="winners" className="relative z-10 hairline-t">
      <div className="mx-auto max-w-shell px-6 py-24 lg:px-10 lg:py-36">
        <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="flex flex-wrap items-end justify-between gap-6">
          <div><Eyebrow>Recent draws</Eyebrow><SectionHeading className="mt-7">Settled pools.</SectionHeading></div>
          <p className="max-w-sm pb-2 text-[13.5px] leading-[1.65] text-white/45">Real completed draws read directly from Robinhood Chain. Winning wallets and ticket numbers refresh automatically.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="od-glass mt-14 rounded-2xl">
          {draws.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead><tr className="border-b border-white/[0.08]">{['Pool', 'Winner', 'Winning Ticket', 'Prize', 'Verification'].map((heading, index) => <th key={heading} scope="col" className={`px-6 py-5 text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35 ${index === 4 ? 'text-right' : ''}`}>{heading}</th>)}</tr></thead>
                <tbody>{draws.map((row, index) => (
                  <motion.tr key={row.id.toString()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, delay: index * 0.05 }} className="border-b border-white/[0.05] transition-colors last:border-b-0 hover:bg-white/[0.02]">
                    <td className="tabular px-6 py-5 text-[13.5px] text-white/70">Pool #{row.id.toString()}</td>
                    <td className="px-6 py-5 font-mono text-[12.5px] text-white/80" title={row.winner}>{shortAddress(row.winner)}</td>
                    <td className="px-6 py-5 font-mono text-[12.5px] text-azure-ice">#{String(row.winningTicket).padStart(2, '0')}</td>
                    <td className="tabular px-6 py-5 text-[13.5px] font-medium text-white">{formatUnits(row.prize, 6)} USDG</td>
                    <td className="px-6 py-5 text-right"><Link to={`/app/pool/${row.id}`} className="whitespace-nowrap text-[12px] text-white/45 transition-colors hover:text-white">Verify onchain →</Link></td>
                  </motion.tr>
                ))}</tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 py-14 text-center">
              <div className={`h-2 w-2 rounded-full ${error ? 'bg-amber-300' : 'bg-azure-cyan'} ${loading ? 'animate-pulse' : ''}`} />
              <h3 className="mt-5 text-sm font-medium text-white">{loading ? 'Reading Robinhood Chain…' : error ? 'Live results temporarily unavailable' : 'No settled pools yet'}</h3>
              <p className="mt-2 max-w-sm text-[12px] leading-6 text-white/35">{error ? 'The public RPC will be queried again automatically.' : 'The first verified mainnet winner will appear here automatically after settlement.'}</p>
            </div>
          )}
          <div className="border-t border-white/[0.07] px-6 py-4"><p className="text-[10.5px] leading-[1.6] text-white/30">Live contract data · refreshes every 12 seconds · no example wallets</p></div>
        </motion.div>
      </div>
    </section>
  );
}
