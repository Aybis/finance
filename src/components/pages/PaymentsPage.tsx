import { useState } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { InfoBadgeHint, KazaTooltip } from '@/components/atoms/InfoTooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/controls';
import { Input, Label } from '@/components/ui/input';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatCurrency } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';
import type { BillItem } from '@/types/finance';

export function PaymentsPage() {
  const { state, selectedCard, payBill, toggleBillAutopay, addBill } = useFinance();
  const [payCardId, setPayCardId] = useState(selectedCard.id);
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(amount);
    if (!title.trim() || !numeric) return;
    addBill({
      title: title.trim(),
      provider: provider.trim() || 'Utility Provider',
      dueDate: '30 Jul 2026',
      amount: numeric,
      autoPay: false,
      category: 'Utilities' as BillItem['category'],
    });
    setTitle('');
    setProvider('');
    setAmount('');
  };

  const upcomingTotal = state.bills
    .filter((b) => !b.paid)
    .reduce((sum, b) => sum + b.amount, 0);
  const animatedDue = useAnimatedNumber(upcomingTotal, 500);

  return (
    <div className="grid grid-cols-1 gap-4 @4xl:grid-cols-12">
      {/* Bills List */}
      <Card className="@4xl:col-span-8">
        <CardHeader className="flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <CardTitle>Bills &amp; Scheduled Payments</CardTitle>
              <InfoBadgeHint
                title="Bill Settlement & Cashback"
                content="Pay bills directly from any active card to earn 1.5% instant cashback. Toggle Auto-Pay to settle recurring invoices automatically."
              />
            </div>
            <p className="text-xs text-[#71717A]">
              Total due:{' '}
              <strong className="tabular-nums text-[#18181B]">
                {formatCurrency(animatedDue)}
              </strong>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {state.cards.map((c) => (
              <KazaTooltip
                key={c.id}
                content={`Select ${c.name} as funding card for bill payments`}
              >
                <button
                  type="button"
                  onClick={() => setPayCardId(c.id)}
                  className={`kaza-tactile rounded-full px-3 py-1 text-[10px] font-medium cursor-pointer ${
                    payCardId === c.id
                      ? 'bg-[#232325] text-white'
                      : 'border border-[#EAEAEF] bg-white text-[#71717A]'
                  }`}
                >
                  {c.tier} ••{c.cardNumber.slice(-4)}
                </button>
              </KazaTooltip>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-2.5 pt-2">
          {state.bills.map((bill) => (
            <div
              key={bill.id}
              className="kaza-tactile flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EAEAEF] bg-white p-3.5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-[#18181B]">{bill.title}</p>
                  <Badge variant={bill.paid ? 'positive' : 'outline'}>
                    {bill.paid ? 'Paid' : `Due ${bill.dueDate}`}
                  </Badge>
                </div>
                <p className="text-[10px] text-[#71717A]">
                  {bill.provider} · {bill.category}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <KazaTooltip
                  title="Auto-Pay"
                  content={
                    bill.autoPay
                      ? 'Automatically settles on the due date.'
                      : 'Manual approval required before payment.'
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#71717A]">Auto-Pay</span>
                    <Switch
                      checked={bill.autoPay}
                      onCheckedChange={() => toggleBillAutopay(bill.id)}
                      aria-label={`Auto-pay ${bill.title}`}
                    />
                  </div>
                </KazaTooltip>

                <span className="tabular-nums text-xs font-bold text-[#18181B]">
                  {formatCurrency(bill.amount)}
                </span>

                {bill.paid ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16A34A]">
                    <CheckCircle2 className="h-4 w-4" />
                    Settled
                  </span>
                ) : (
                  <KazaTooltip
                    title="Pay Bill Now"
                    content={`Pay ${formatCurrency(bill.amount)} and earn ${formatCurrency(bill.amount * 0.015)} cashback.`}
                  >
                    <Button
                      size="sm"
                      onClick={() => payBill(bill.id, payCardId)}
                      className="kaza-tactile"
                    >
                      Pay Now
                    </Button>
                  </KazaTooltip>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add New Bill */}
      <Card className="@4xl:col-span-4">
        <CardHeader>
          <CardTitle>Add Recurring Bill</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddBill} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="bill-title">Bill Name</Label>
              <Input
                id="bill-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Water & Municipal"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bill-provider">Biller / Provider</Label>
              <Input
                id="bill-provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="NYC Water Board"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bill-amount">Amount ($)</Label>
              <Input
                id="bill-amount"
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="85.00"
                required
              />
            </div>
            <Button type="submit" className="kaza-tactile w-full">
              <Plus className="h-3.5 w-3.5" />
              Save Biller
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
