import { useMemo } from 'react';
import type { Participant } from '../../app/store';
import { fmtOdds } from '../../app/format';
import { useWallet } from '../../providers/wallet/WalletProvider';

/**
 * Explorer-style ownership table. No avatars — just the numbers a
 * participant would actually want to verify.
 */
export default function ParticipantTable({
  participants,
  capacity,
}: {
  participants: Participant[];
  capacity: number;
}) {
  const wallet = useWallet();
  // Stable sort: equal ticket counts keep their original order.
  const rows = useMemo(
    () => [...participants].sort((a, b) => b.tickets - a.tickets),
    [participants],
  );

  if (rows.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-[13px] text-white/35">
        No tickets have been purchased yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/[0.07]">
            {['Wallet', 'Tickets', 'Odds'].map((h) => (
              <th
                key={h}
                scope="col"
                className={`px-5 py-3.5 text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35 ${
                  h === 'Tickets' || h === 'Odds' ? 'text-right' : ''
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const isUser = Boolean(wallet.address && p.wallet.toLowerCase() === wallet.address.toLowerCase());
            return (
              <tr
                key={p.wallet}
                className={`border-b border-white/[0.04] last:border-b-0 ${
                  isUser ? 'bg-azure-cyan/[0.035]' : ''
                }`}
              >
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`font-mono text-[12px] ${
                        isUser ? 'text-azure-ice' : 'text-white/75'
                      }`}
                    >
                      {p.wallet}
                    </span>
                    {isUser && (
                      <span className="rounded-full border border-azure-cyan/25 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-azure-ice">
                        You
                      </span>
                    )}
                  </span>
                </td>
                <td className="tabular px-5 py-3.5 text-right text-[12.5px] text-white/80">
                  {p.tickets}
                </td>
                <td className="tabular px-5 py-3.5 text-right text-[12.5px] text-white/60">
                  {fmtOdds(p.tickets, capacity)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
