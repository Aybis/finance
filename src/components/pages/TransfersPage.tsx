import { useState } from 'react';
import { CalendarClock, Send } from 'lucide-react';
import { InfoBadgeHint, KazaTooltip } from '@/components/atoms/InfoTooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/controls';
import { Input, Label } from '@/components/ui/input';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatCurrency } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';

export function TransfersPage() {
  const { state, selectedCard, executeTransfer } = useFinance();
  const [fromCardId, setFromCardId] = useState(selectedCard.id);
  const [recipientName, setRecipientName] = useState(state.contacts[0].name);
  const [recipientHandle, setRecipientHandle] = useState(state.contacts[0].handle);
  const [amount, setAmount] = useState('125');
  const [note, setNote] = useState('Studio split');
  const [scheduled, setScheduled] = useState(false);

  const animatedAvailable = useAnimatedNumber(state.totalBalanceBase, 500);
  const transferLogs = state.transactions.filter((t) => t.type === 'transfer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(amount);
    if (!recipientName.trim() || !numeric) return;
    const ok = executeTransfer({
      fromCardId,
      recipientName: recipientName.trim(),
      recipientHandle,
      amount: numeric,
      note,
      scheduled,
    });
    if (ok) {
      setNote('');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 @4xl:grid-cols-12">
      {/* Send Money Form */}
      <Card className="@4xl:col-span-6">
        <CardHeader>
          <div className="flex items-center gap-1.5">
            <CardTitle>Send &amp; Schedule Transfers</CardTitle>
            <InfoBadgeHint
              title="Instant & Scheduled Payouts"
              content="Instant transfers settle immediately from your selected card balance; scheduled transfers queue for 01 Aug 2026 without deducting funds today."
            />
          </div>
          <span className="tabular-nums text-xs text-[#71717A]">
            Available: {formatCurrency(animatedAvailable)}
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Recipients */}
          <div className="space-y-2">
            <Label>Quick Contacts</Label>
            <div className="flex flex-wrap gap-2">
              {state.contacts.map((c) => {
                const active = recipientName === c.name;
                return (
                  <KazaTooltip key={c.id} title={c.name} content={`${c.handle} · ${c.bank}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientName(c.name);
                        setRecipientHandle(c.handle);
                      }}
                      className={`kaza-tactile flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs cursor-pointer ${
                        active
                          ? 'border-[#232325] bg-[#232325] text-white'
                          : 'border-[#EAEAEF] bg-white text-[#18181B] hover:bg-[#F4F4F6]'
                      }`}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-[9px] font-bold text-[#18181B]">
                        {c.initials}
                      </span>
                      <span>{c.name}</span>
                    </button>
                  </KazaTooltip>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label>Funding Card</Label>
              <div className="grid grid-cols-1 gap-2 @sm:grid-cols-3">
                {state.cards.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFromCardId(c.id)}
                    className={`kaza-tactile rounded-2xl border p-2.5 text-left text-xs cursor-pointer ${
                      fromCardId === c.id
                        ? 'border-[#232325] bg-[#232325] text-white'
                        : 'border-[#EAEAEF] bg-white text-[#18181B]'
                    }`}
                  >
                    <p className="truncate font-semibold">{c.name}</p>
                    <p className="font-mono text-[10px] opacity-75">
                      •••• {c.cardNumber.slice(-4)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="recipient-name">Recipient</Label>
                <Input
                  id="recipient-name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="transfer-amount">Amount ($)</Label>
                <Input
                  id="transfer-amount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="transfer-note">Reference Note</Label>
              <Input
                id="transfer-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Invoice #402 or split dinner"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-[#EAEAEF] bg-white px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-[#71717A]" />
                <div>
                  <p className="text-xs font-medium text-[#18181B]">Schedule for next cycle</p>
                  <p className="text-[10px] text-[#71717A]">
                    Hold funds until 01 Aug 2026
                  </p>
                </div>
              </div>
              <KazaTooltip content="Toggle between instant settlement and scheduled future payout">
                <span>
                  <Switch
                    checked={scheduled}
                    onCheckedChange={setScheduled}
                    aria-label="Schedule transfer"
                  />
                </span>
              </KazaTooltip>
            </div>

            <Button type="submit" size="lg" className="kaza-tactile w-full">
              <Send className="h-4 w-4" />
              {scheduled ? 'Schedule Transfer' : 'Send Transfer Now'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Transfer Log */}
      <Card className="@4xl:col-span-6">
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <span className="text-xs text-[#71717A]">{transferLogs.length} transfers</span>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-2">
          {transferLogs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DCDCE2] p-8 text-center text-xs text-[#71717A]">
              No outgoing transfers yet. Use the form on the left to send instant funds.
            </div>
          ) : (
            transferLogs.map((tx) => (
              <div
                key={tx.id}
                className="kaza-tactile flex items-center justify-between rounded-2xl border border-[#EAEAEF] bg-white px-4 py-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-[#18181B]">{tx.title}</p>
                    <Badge variant={tx.status === 'scheduled' ? 'warning' : 'positive'}>
                      {tx.status}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-[#71717A]">
                    {tx.merchant} · {tx.date}
                  </p>
                </div>
                <span className="tabular-nums text-xs font-semibold text-[#18181B]">
                  -{formatCurrency(tx.amount)}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
