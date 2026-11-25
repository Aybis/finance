import { useMemo, useState } from 'react';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { DeltaBadge } from '@/components/atoms/DeltaBadge';
import { InfoBadgeHint, KazaTooltip } from '@/components/atoms/InfoTooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatCurrency } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';
import type { CoinSymbol } from '@/types/finance';

export function SwapCoinsPage() {
  const { state, executeSwap } = useFinance();
  const [fromSymbol, setFromSymbol] = useState<CoinSymbol>('USD');
  const [toSymbol, setToSymbol] = useState<CoinSymbol>('BTC');
  const [amount, setAmount] = useState('500');

  const fromCoin = state.coins.find((c) => c.symbol === fromSymbol) ?? state.coins[0];
  const toCoin = state.coins.find((c) => c.symbol === toSymbol) ?? state.coins[3];

  const quote = useMemo(() => {
    const val = Math.max(0, Number(amount) || 0);
    const grossUsd = val * fromCoin.usdPrice;
    const feeUsd = grossUsd * 0.0025;
    const netUsd = Math.max(0, grossUsd - feeUsd);
    const receive = netUsd / Math.max(0.0001, toCoin.usdPrice);
    return { grossUsd, feeUsd, receive };
  }, [amount, fromCoin.usdPrice, toCoin.usdPrice]);

  const animatedReceive = useAnimatedNumber(quote.receive, 360);

  const handleFlip = () => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
  };

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    executeSwap({
      fromSymbol,
      toSymbol,
      amount: Number(amount) || 0,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 @4xl:grid-cols-12">
      {/* Swap Widget */}
      <Card className="@4xl:col-span-5">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <CardTitle>Swap Coins &amp; FX</CardTitle>
            <InfoBadgeHint
              title="Instant Multi-Asset Conversion"
              content="Convert fiat currencies and crypto at live spot rates. Swapping USD updates your unified balance automatically."
            />
          </div>
          <KazaTooltip
            title="Network Execution Fee"
            content="Flat 0.25% liquidity spread (0% with Kaza Pro up to $25k/month)."
          >
            <span className="text-[11px] text-[#71717A] cursor-help">
              0.25% network fee
            </span>
          </KazaTooltip>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSwap} className="space-y-3">
            <div className="rounded-2xl border border-[#EAEAEF] bg-white p-3.5">
              <div className="flex items-center justify-between">
                <Label>From</Label>
                <KazaTooltip content={`Fill your full available ${fromCoin.symbol} balance`}>
                  <button
                    type="button"
                    onClick={() => setAmount(String(fromCoin.balance))}
                    className="text-[10px] font-semibold text-[#18181B] hover:underline cursor-pointer"
                  >
                    Max: {fromCoin.balance} {fromCoin.symbol}
                  </button>
                </KazaTooltip>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 @xs:flex-nowrap">
                <Select
                  value={fromSymbol}
                  onValueChange={(v) => setFromSymbol(v as CoinSymbol)}
                >
                  <SelectTrigger className="h-9 rounded-xl px-3 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {state.coins.map((c) => (
                      <SelectItem key={c.symbol} value={c.symbol}>
                        {c.symbol} · {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="any"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-right font-mono text-sm font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <KazaTooltip content="Reverse From and To assets">
                <button
                  type="button"
                  onClick={handleFlip}
                  aria-label="Flip swap direction"
                  className="kaza-tactile flex h-9 w-9 items-center justify-center rounded-full border border-[#EAEAEF] bg-white text-[#18181B] shadow-xs transition-transform duration-300 hover:rotate-180 cursor-pointer"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </KazaTooltip>
            </div>

            <div className="rounded-2xl border border-[#EAEAEF] bg-[#F4F4F6]/80 p-3.5">
              <div className="flex items-center justify-between">
                <Label>Receive (Estimated)</Label>
                <span className="text-[10px] text-[#71717A]">
                  Balance: {toCoin.balance} {toCoin.symbol}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 @xs:flex-nowrap">
                <Select
                  value={toSymbol}
                  onValueChange={(v) => setToSymbol(v as CoinSymbol)}
                >
                  <SelectTrigger className="h-9 rounded-xl px-3 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {state.coins.map((c) => (
                      <SelectItem key={c.symbol} value={c.symbol}>
                        {c.symbol} · {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="tabular-nums font-mono text-base font-bold text-[#18181B]">
                  {animatedReceive.toFixed(6)} {toCoin.symbol}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-[11px] text-[#71717A]">
              <span>Estimated Fee (0.25%)</span>
              <span className="tabular-nums font-medium text-[#18181B]">
                {formatCurrency(quote.feeUsd)}
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={fromSymbol === toSymbol}
              className="kaza-tactile w-full"
            >
              <RefreshCw className="h-4 w-4" />
              Swap {fromSymbol} to {toSymbol}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Portfolio + Swap History */}
      <div className="space-y-4 @4xl:col-span-7">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-1.5">
              <CardTitle>Multi-Asset Wallet</CardTitle>
              <InfoBadgeHint
                title="Portfolio Holdings"
                content="Real-time spot valuation and 24-hour market performance across your fiat and crypto balances."
              />
            </div>
            <span className="text-xs text-[#71717A]">Live spot valuation</span>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2.5 @sm:grid-cols-2 @2xl:grid-cols-3">
            {state.coins.map((coin) => (
              <KazaTooltip
                key={coin.symbol}
                title={`${coin.name} (${coin.symbol})`}
                content={`Spot price: ${formatCurrency(coin.usdPrice)} · 24h change: ${coin.change24h >= 0 ? '+' : ''}${coin.change24h}%`}
              >
                <div className="kaza-tactile rounded-2xl border border-[#EAEAEF] bg-white p-3.5 hover:-translate-y-0.5 hover:border-[#DCDCE2] cursor-help">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#18181B]">{coin.symbol}</span>
                    <DeltaBadge
                      value={`${coin.change24h >= 0 ? '+' : ''}${coin.change24h}%`}
                      direction={
                        coin.change24h > 0 ? 'up' : coin.change24h < 0 ? 'down' : 'neutral'
                      }
                    />
                  </div>
                  <p className="mt-1 tabular-nums text-base font-semibold text-[#18181B]">
                    {coin.balance.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-[#71717A]">
                    ≈ {formatCurrency(coin.balance * coin.usdPrice)}
                  </p>
                </div>
              </KazaTooltip>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Swaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {state.swaps.map((sw) => (
              <div
                key={sw.id}
                className="kaza-tactile flex items-center justify-between rounded-2xl border border-[#EAEAEF] bg-white px-3.5 py-2.5 text-xs"
              >
                <div>
                  <p className="font-semibold text-[#18181B]">
                    {sw.fromAmount} {sw.fromSymbol} → {sw.toAmount} {sw.toSymbol}
                  </p>
                  <p className="text-[10px] text-[#71717A]">{sw.timestamp}</p>
                </div>
                <span className="tabular-nums text-[11px] text-[#71717A]">
                  Fee: {formatCurrency(sw.feeUsd)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
