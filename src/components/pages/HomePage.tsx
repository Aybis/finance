import { useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  CreditCard,
  Plus,
  ReceiptText,
  Send,
} from 'lucide-react';
import { InfoBadgeHint, KazaTooltip } from '@/components/atoms/InfoTooltip';
import { KpiSummaryRow } from '@/components/organisms/KpiSummaryRow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { CARD_FINISHES } from '@/design-system/tokens';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatCurrency } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';
import type { SpendingCategoryName } from '@/types/finance';

export function HomePage() {
  const {
    state,
    selectedCard,
    setActiveNav,
    selectCard,
    addTransaction,
  } = useFinance();

  const [categoryFilter, setCategoryFilter] = useState<'All' | SpendingCategoryName>('All');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<SpendingCategoryName>('Shopping');
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');

  const animatedBalance = useAnimatedNumber(state.totalBalanceBase, 550);

  const filteredTxs = useMemo(() => {
    return state.transactions.filter((tx) =>
      categoryFilter === 'All' ? true : tx.category === categoryFilter
    );
  }, [state.transactions, categoryFilter]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(amount);
    if (!title.trim() || !numeric || numeric <= 0) return;
    const ok = addTransaction({
      cardId: selectedCard.id,
      title: title.trim(),
      merchant: title.trim(),
      category,
      amount: numeric,
      type: txType,
    });
    if (ok) {
      setTitle('');
      setAmount('');
    }
  };

  return (
    <div className="space-y-4">
      <KpiSummaryRow />

      <div className="grid grid-cols-1 gap-4 @4xl:grid-cols-12">
        {/* Left: Balance & Quick Actions + Active Cards Strip */}
        <div className="space-y-4 @4xl:col-span-5">
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium text-[#71717A]">Unified Cash Balance</p>
                  <InfoBadgeHint
                    title="Unified Cash Balance"
                    content="Available USD liquidity across your Kaza cards and cash vault."
                  />
                </div>
                <p className="mt-1 tabular-nums text-3xl font-bold tracking-tight text-[#18181B]">
                  {formatCurrency(animatedBalance)}
                </p>
              </div>
              <KazaTooltip
                title="Membership Tier"
                content={
                  state.isPro
                    ? 'Kaza Pro active: 2x rewards and 0% swap fees.'
                    : 'Standard Platinum membership. Upgrade to Pro in the sidebar for 2x cashback.'
                }
              >
                <span>
                  <Badge variant={state.isPro ? 'positive' : 'dark'}>
                    {state.isPro ? 'Kaza Pro' : 'Platinum'}
                  </Badge>
                </span>
              </KazaTooltip>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 @xs:grid-cols-4">
              <KazaTooltip content="Send an instant or scheduled transfer">
                <button
                  type="button"
                  onClick={() => setActiveNav('transfers')}
                  className="kaza-tactile flex flex-col items-center gap-1.5 rounded-2xl border border-[#EAEAEF] bg-white py-3 text-[11px] font-medium text-[#18181B] hover:-translate-y-0.5 hover:bg-[#F4F4F6] cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </KazaTooltip>
              <KazaTooltip content="Swap USD, EUR, USDC, BTC, ETH, or SOL">
                <button
                  type="button"
                  onClick={() => setActiveNav('swap')}
                  className="kaza-tactile flex flex-col items-center gap-1.5 rounded-2xl border border-[#EAEAEF] bg-white py-3 text-[11px] font-medium text-[#18181B] hover:-translate-y-0.5 hover:bg-[#F4F4F6] cursor-pointer"
                >
                  <Coins className="h-4 w-4" />
                  <span>Swap</span>
                </button>
              </KazaTooltip>
              <KazaTooltip content="Pay utility, rent, and cloud bills">
                <button
                  type="button"
                  onClick={() => setActiveNav('payments')}
                  className="kaza-tactile flex flex-col items-center gap-1.5 rounded-2xl border border-[#EAEAEF] bg-white py-3 text-[11px] font-medium text-[#18181B] hover:-translate-y-0.5 hover:bg-[#F4F4F6] cursor-pointer"
                >
                  <ReceiptText className="h-4 w-4" />
                  <span>Pay Bill</span>
                </button>
              </KazaTooltip>
              <KazaTooltip content="Open Card Studio to customize & manage cards">
                <button
                  type="button"
                  onClick={() => setActiveNav('cards')}
                  className="kaza-tactile flex flex-col items-center gap-1.5 rounded-2xl border border-[#EAEAEF] bg-[#232325] py-3 text-[11px] font-medium text-white hover:-translate-y-0.5 hover:bg-[#18181B] cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Cards</span>
                </button>
              </KazaTooltip>
            </div>
          </Card>

          {/* Quick-Add Transaction */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-1.5">
                <CardTitle>Log Quick Transaction</CardTitle>
                <InfoBadgeHint
                  title="Live Ledger Entry"
                  content="Record an expense or deposit on your active card. Expenses respect frozen card protection and immediately update all dashboard charts."
                />
              </div>
              <span className="text-[11px] text-[#71717A]">{selectedCard.name}</span>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleQuickAdd} className="space-y-3">
                <div className="flex gap-1.5 rounded-full bg-[#F4F4F6] p-1">
                  {(['expense', 'income'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTxType(t)}
                      className={`kaza-tactile flex-1 rounded-full py-1 text-xs font-medium capitalize cursor-pointer ${
                        txType === t ? 'bg-[#232325] text-white' : 'text-[#71717A]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-2.5 @sm:grid-cols-2">
                  <div>
                    <Label htmlFor="quick-title">Merchant / Title</Label>
                    <Input
                      id="quick-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Blue Bottle Coffee"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quick-amount">Amount ($)</Label>
                    <Input
                      id="quick-amount"
                      type="number"
                      step="0.01"
                      min="0.5"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="24.50"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {(['Shopping', 'Dining', 'Travel', 'Others'] as SpendingCategoryName[]).map(
                      (cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`kaza-tactile rounded-full px-2.5 py-1 text-[10px] font-medium cursor-pointer ${
                            category === cat
                              ? 'bg-[#232325] text-white'
                              : 'bg-[#F4F4F6] text-[#71717A]'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                  <Button type="submit" size="sm" className="kaza-tactile">
                    <Plus className="h-3.5 w-3.5" />
                    Record
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Cards Strip */}
          <Card>
            <CardHeader>
              <CardTitle>Your Cards</CardTitle>
              <button
                type="button"
                onClick={() => setActiveNav('cards')}
                className="text-[11px] font-medium text-[#71717A] hover:text-[#18181B] cursor-pointer"
              >
                Manage
              </button>
            </CardHeader>
            <CardContent className="space-y-2">
              {state.cards.map((c) => {
                const finish = CARD_FINISHES[c.finish];
                return (
                  <KazaTooltip
                    key={c.id}
                    title={c.name}
                    content={`Click to focus ${c.name} (•••• ${c.cardNumber.slice(-4)}) in Card Studio.`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        selectCard(c.id);
                        setActiveNav('cards');
                      }}
                      className="kaza-tactile flex w-full items-center justify-between rounded-2xl border border-[#EAEAEF] bg-white p-2.5 text-left hover:-translate-y-0.5 hover:bg-[#F9F9FB] cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-8 w-12 rounded-lg border"
                          style={{
                            background: finish.cardBackground,
                            borderColor: finish.borderColor,
                          }}
                        />
                        <div>
                          <p className="text-xs font-semibold text-[#18181B]">{c.name}</p>
                          <p className="font-mono text-[10px] text-[#71717A]">
                            •••• {c.cardNumber.slice(-4)} {c.frozen ? '· Frozen' : ''}
                          </p>
                        </div>
                      </div>
                      <span className="tabular-nums text-xs font-semibold text-[#18181B]">
                        {formatCurrency(c.balance)}
                      </span>
                    </button>
                  </KazaTooltip>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right: Recent Activity Feed */}
        <Card className="@4xl:col-span-7">
          <CardHeader className="flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <CardTitle>Recent Activity ({filteredTxs.length})</CardTitle>
              <InfoBadgeHint
                title="Activity Ledger"
                content="Chronological log of all settled expenses, deposits, transfers, and bill payments across your Kaza cards."
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {(['All', 'Shopping', 'Dining', 'Travel', 'Others'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`kaza-tactile rounded-full px-2.5 py-1 text-[10px] font-medium cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-[#232325] text-white'
                      : 'bg-[#F4F4F6] text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-3">
            {filteredTxs.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="kaza-tactile flex items-center justify-between rounded-2xl border border-[#EAEAEF]/80 bg-white px-3.5 py-2.5 hover:border-[#DCDCE2]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-[#F4F4F6] text-[#18181B]'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#18181B]">{tx.title}</p>
                      <p className="text-[10px] text-[#71717A]">
                        {tx.category} · {tx.date} · {tx.status}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`tabular-nums text-xs font-semibold ${
                      isIncome ? 'text-[#16A34A]' : 'text-[#18181B]'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
