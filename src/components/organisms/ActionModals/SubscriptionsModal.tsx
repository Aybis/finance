import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/controls';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';

export function SubscriptionsModal() {
  const {
    activeModal,
    openModal,
    state,
    selectedCard,
    toggleSubscription,
    deleteSubscription,
    addSubscription,
  } = useFinance();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const monthlyTotal = state.subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + s.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!name.trim() || !num) return;
    addSubscription({
      name: name.trim(),
      category: 'Software & Media',
      amount: num,
      billingCycle: 'Monthly',
      nextBillingDate: '15 Aug 2026',
      active: true,
      cardId: selectedCard.id,
    });
    setName('');
    setAmount('');
  };

  return (
    <Dialog
      open={activeModal === 'subscriptions'}
      onOpenChange={(o) => !o && openModal(null)}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Subscriptions</DialogTitle>
          <DialogDescription>
            Active recurring spend:{' '}
            <strong className="text-[#18181B]">{formatCurrency(monthlyTotal)} / month</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {state.subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#EAEAEF] bg-[#F9F9FB] px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-semibold text-[#18181B]">
                      {sub.name}
                    </p>
                    <Badge variant={sub.active ? 'positive' : 'default'}>
                      {sub.active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-[#71717A]">
                    {sub.category} · Next: {sub.nextBillingDate}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="tabular-nums text-xs font-semibold text-[#18181B]">
                    {formatCurrency(sub.amount)}
                  </span>
                  <Switch
                    checked={sub.active}
                    onCheckedChange={() => toggleSubscription(sub.id)}
                    aria-label={`Toggle ${sub.name}`}
                  />
                  <button
                    type="button"
                    onClick={() => deleteSubscription(sub.id)}
                    aria-label={`Remove ${sub.name}`}
                    className="text-[#A1A1AA] transition-colors hover:text-[#EF4444] cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAdd} className="flex gap-2 border-t border-[#EAEAEF] pt-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Service name (e.g. Notion)"
              className="flex-1"
            />
            <Input
              type="number"
              step="0.01"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$/mo"
              className="w-24"
            />
            <Button type="submit" size="default">
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
