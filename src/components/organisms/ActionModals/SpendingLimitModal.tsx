import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/controls';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input, Label } from '@/components/ui/input';
import { formatCompactCurrency } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';

export function SpendingLimitModal() {
  const { activeModal, openModal, selectedCard, updateSpendingLimit } = useFinance();
  const [limit, setLimit] = useState(selectedCard.spendingLimit);

  useEffect(() => {
    setLimit(selectedCard.spendingLimit);
  }, [selectedCard.id, selectedCard.spendingLimit]);

  const previewPct = Math.min(
    100,
    Math.round((selectedCard.utilizationAmount / Math.max(1, limit)) * 100)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSpendingLimit(selectedCard.id, Math.max(500, limit));
    openModal(null);
  };

  return (
    <Dialog
      open={activeModal === 'spending-limit'}
      onOpenChange={(o) => !o && openModal(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Spending Limit</DialogTitle>
          <DialogDescription>
            Adjust the monthly spending cap for {selectedCard.name} (••••{' '}
            {selectedCard.cardNumber.slice(-4)}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="rounded-2xl bg-[#F4F4F6] p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#71717A]">Monthly Limit</span>
              <span className="tabular-nums text-2xl font-semibold text-[#18181B]">
                {formatCompactCurrency(limit)}
              </span>
            </div>

            <div className="mt-4">
              <Slider
                value={[limit]}
                min={1000}
                max={20000}
                step={50}
                onValueChange={([v]) => setLimit(v)}
                aria-label="Spending limit slider"
              />
              <div className="mt-2 flex justify-between text-[10px] text-[#71717A]">
                <span>$1,000</span>
                <span>$10,000</span>
                <span>$20,000</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="exact-limit">Exact Amount ($)</Label>
              <Input
                id="exact-limit"
                type="number"
                min={500}
                max={50000}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value) || 0)}
              />
            </div>
            <div className="rounded-xl border border-[#EAEAEF] bg-[#F9F9FB] p-2.5">
              <p className="text-[10px] text-[#71717A]">Projected Utilization</p>
              <p className="tabular-nums text-base font-semibold text-[#18181B]">
                {previewPct}%{' '}
                <span className="text-[10px] font-normal text-[#71717A]">
                  ({formatCompactCurrency(selectedCard.utilizationAmount)} used)
                </span>
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => openModal(null)}>
              Cancel
            </Button>
            <Button type="submit">Save Limit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
