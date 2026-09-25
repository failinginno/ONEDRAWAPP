import { useMemo, useState } from 'react';
import { Gift, LoaderCircle, RotateCcw, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOnedraw } from '../../providers/OnedrawContext';
import { useWallet } from '../../providers/wallet/WalletProvider';
import { fmtMoney, fmtTicket } from '../../app/format';

type NoticeKind = 'DRAWING' | 'WON' | 'LOST';

export default function PrizeNotification() {
  const { state, claimPrize } = useOnedraw();
  const wallet = useWallet();
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  const notice = useMemo(() => {
    if (!wallet.address) return undefined;
    const address = wallet.address.toLowerCase();
    const participated = state.order
      .map((id) => state.pools[id])
      .filter((pool) => pool && (state.holdings[pool.id]?.length ?? 0) > 0)
      .sort((a, b) => Number(b.id) - Number(a.id));

    for (const pool of participated) {
      if (pool.status !== 'COMPLETED' || !pool.winner) continue;
      const kind: NoticeKind = pool.winner.toLowerCase() === address ? 'WON' : 'LOST';
      const key = `${pool.id}:${kind}`;
      if (!dismissed[key]) return { pool, kind, key };
    }
    for (const pool of participated) {
      if (!['DRAWING', 'SOLD_OUT'].includes(pool.status)) continue;
      const key = `${pool.id}:DRAWING`;
      if (!dismissed[key]) return { pool, kind: 'DRAWING' as const, key };
    }
    return undefined;
  }, [dismissed, state.holdings, state.order, state.pools, wallet.address]);

  if (!notice) return null;
  const { pool, kind, key } = notice;
  const pending = state.transaction?.type === 'CLAIM_PRIZE'
    && ['AWAITING_SIGNATURE', 'SUBMITTED', 'CONFIRMING'].includes(state.transaction.status);
  const won = kind === 'WON';
  const drawing = kind === 'DRAWING';

  const card = (
    <div className={`relative w-full max-w-[440px] rounded-2xl border p-5 shadow-2xl shadow-black/60 backdrop-blur-xl ${
      won ? 'border-mint/30 bg-[#0A1014]/95' : 'border-azure-cyan/25 bg-[#081018]/95'
    }`}>
      <button
        type="button"
        aria-label="Dismiss draw notification"
        onClick={() => setDismissed((current) => ({ ...current, [key]: true }))}
        className="absolute right-4 top-4 text-white/40 transition-colors hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-4 pr-6">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
          won ? 'border-mint/30 bg-mint/10' : 'border-azure-cyan/25 bg-azure-cyan/10'
        }`}>
          {drawing ? (
            <LoaderCircle className="h-4 w-4 animate-spin text-azure-ice" />
          ) : won ? (
            <Gift className="h-4 w-4 text-mint-soft" />
          ) : (
            <RotateCcw className="h-4 w-4 text-azure-ice" />
          )}
        </div>
        <div>
          <p className={`text-[10px] font-medium uppercase tracking-[0.2em] ${won ? 'text-mint-soft' : 'text-azure-ice'}`}>
            {drawing ? 'Draw in progress' : won ? 'Winning wallet' : 'Draw complete'}
          </p>
          <h2 className="mt-1.5 text-lg font-semibold text-white">
            {drawing
              ? `Pool #${pool.id} is verifying the result`
              : won
                ? `You won Pool #${pool.id}`
                : `Pool #${pool.id} has settled`}
          </h2>
          <p className="mt-1 text-[13px] leading-5 text-white/55">
            {drawing
              ? 'All tickets are sold. Verifiable randomness is being confirmed onchain; this notice will update automatically.'
              : won
                ? `${fmtMoney(pool.claimablePrize ?? pool.prize, pool.currency)} is ready. Winning ticket ${fmtTicket(pool.winningTicket ?? 0)} was selected.`
                : `Your tickets were not selected this time. Winning ticket ${fmtTicket(pool.winningTicket ?? 0)} is recorded onchain.`}
          </p>
        </div>
      </div>

      {drawing ? (
        <Link
          to={`/app/pool/${pool.id}`}
          className="mt-5 block w-full rounded-xl border border-white/[0.1] py-3 text-center text-[13px] font-semibold text-white transition-colors hover:bg-white/[0.05]"
        >
          View live draw
        </Link>
      ) : won && pool.prizeClaimed === false ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => void claimPrize(pool.id)}
          className="mt-5 w-full rounded-xl bg-white py-3 text-[13px] font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-60"
        >
          {pending ? 'Claiming in wallet...' : `Claim ${fmtMoney(pool.prize, pool.currency)} prize`}
        </button>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <Link
            to={`/app/pool/${pool.id}`}
            className="rounded-xl border border-white/[0.1] py-3 text-center text-[13px] font-semibold text-white transition-colors hover:bg-white/[0.05]"
          >
            View result
          </Link>
          <Link
            to="/app"
            className="rounded-xl bg-white py-3 text-center text-[13px] font-semibold text-black transition-colors hover:bg-white/90"
          >
            Try another pool
          </Link>
        </div>
      )}
    </div>
  );

  if (drawing) {
    return (
      <div role="status" aria-live="polite" className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-[440px] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[410px]">
        {card}
      </div>
    );
  }

  return (
    <div role="alert" aria-live="polite" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[3px]">
      {card}
    </div>
  );
}
