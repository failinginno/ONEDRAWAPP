import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Copy, ExternalLink, LogOut, Wallet } from 'lucide-react';
import { useWallet } from '../../providers/wallet/WalletProvider';
import { getAddressExplorerUrl } from '../../services/web3/explorer';
import { configuredNetworkName } from '../../config/env';

export default function WalletButton() {
  const wallet = useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  if (!wallet.connected) {
    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={wallet.connectWallet}
          disabled={wallet.connecting}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-[12.5px] font-semibold text-black transition-colors hover:bg-white/90 disabled:opacity-70"
        >
          <Wallet className="h-3.5 w-3.5" />
          {wallet.connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
        {wallet.error && (
          <div className="!absolute right-0 top-[calc(100%+8px)] z-[60] w-64 rounded-xl border border-white/[0.12] bg-[#080B12] p-4 text-[11.5px] leading-[1.55] text-white/65 shadow-2xl shadow-black/70">
            {wallet.error.message}
          </div>
        )}
      </div>
    );
  }

  const explorerUrl = wallet.address ? getAddressExplorerUrl(wallet.address) : undefined;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-[12.5px] font-medium text-white/85 transition-colors hover:border-white/25"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${wallet.correctNetwork ? 'bg-mint-soft' : 'bg-amber-300'}`} />
        <span className="tabular font-mono text-[11.5px]">
          {wallet.correctNetwork ? wallet.displayAddress : 'Wrong Network'}
        </span>
        <ChevronDown className={`h-3 w-3 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="!absolute right-0 top-[calc(100%+8px)] z-[60] w-72 rounded-xl border border-white/[0.12] bg-[#080B12] p-4 shadow-2xl shadow-black/70">
          <div className="text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/35">
            Connected wallet
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="font-mono text-[12px] text-white/85">{wallet.displayAddress}</span>
            <button
              type="button"
              onClick={async () => {
                if (!wallet.address) return;
                await navigator.clipboard.writeText(wallet.address);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1400);
              }}
              className="inline-flex items-center gap-1.5 text-[10.5px] text-white/40 transition-colors hover:text-white"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="mt-4 border-t border-white/[0.07] pt-3.5">
            <div className="flex items-center gap-2 text-[11.5px] text-white/45">
              <span className={`h-1.5 w-1.5 rounded-full ${wallet.correctNetwork ? 'bg-mint-soft' : 'bg-amber-300'}`} />
              {wallet.chainName}
            </div>
            {!wallet.correctNetwork && (
              <button
                type="button"
                onClick={wallet.switchToRobinhood}
                className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-[11.5px] font-semibold text-black transition-colors hover:bg-white/90"
              >
                Switch to {configuredNetworkName}
              </button>
            )}
          </div>

          {wallet.correctNetwork && (
            <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/[0.07]">
              <div className="bg-[#08090B] p-3">
                <div className="text-[9px] uppercase tracking-[0.16em] text-white/30">ETH Balance</div>
                <div className="mt-1.5 text-[12px] font-medium text-white">{wallet.ethBalance} ETH</div>
              </div>
              <div className="bg-[#08090B] p-3">
                <div className="text-[9px] uppercase tracking-[0.16em] text-white/30">USDG Balance</div>
                <div className="mt-1.5 text-[12px] font-medium text-white">{wallet.usdgBalance} {wallet.usdgSymbol}</div>
              </div>
            </div>
          )}

          {wallet.error && <p className="mt-3 text-[10.5px] leading-[1.5] text-amber-200/70">{wallet.error.message}</p>}

          <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3.5">
            {explorerUrl ? (
              <a href={explorerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11.5px] text-white/45 transition-colors hover:text-white">
                <ExternalLink className="h-3 w-3" />
                Explorer
              </a>
            ) : <span />}
            <button
              type="button"
              onClick={() => {
                wallet.disconnectWallet();
                setOpen(false);
              }}
              className="inline-flex items-center gap-2 text-[11.5px] text-white/45 transition-colors hover:text-white"
            >
              <LogOut className="h-3 w-3" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
