import { useState } from 'react';
import { ColorSwatch } from '@/components/atoms/ColorSwatch';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input, Label } from '@/components/ui/input';
import { CARD_FINISH_ORDER } from '@/design-system/tokens';
import { useFinance } from '@/store/FinanceContext';
import type { CardFinish, CardNetwork, CardTier } from '@/types/finance';

export function AddCardModal() {
  const { activeModal, openModal, addCard } = useFinance();
  const [name, setName] = useState('Studio Virtual Card');
  const [tier, setTier] = useState<CardTier>('Titanium');
  const [network, setNetwork] = useState<CardNetwork>('VISA');
  const [finish, setFinish] = useState<CardFinish>('silver');
  const [limit, setLimit] = useState('5000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericLimit = Math.max(500, Number(limit) || 5000);
    addCard({
      name,
      tier,
      network,
      finish,
      spendingLimit: numericLimit,
    });
    openModal(null);
  };

  return (
    <Dialog open={activeModal === 'add-card'} onOpenChange={(o) => !o && openModal(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Virtual Card</DialogTitle>
          <DialogDescription>
            Issue an instant Kaza card with Google Pay &amp; custom metallic finish.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="card-name">Card Label</Label>
            <Input
              id="card-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Travel Rewards"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tier</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Platinum', 'Silver', 'Obsidian', 'Titanium'] as CardTier[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
                      tier === t
                        ? 'border-[#232325] bg-[#232325] text-white'
                        : 'border-[#EAEAEF] bg-[#F9F9FB] text-[#18181B] hover:bg-[#F4F4F6]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Network</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['VISA', 'Mastercard'] as CardNetwork[]).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNetwork(n)}
                    className={`rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
                      network === n
                        ? 'border-[#232325] bg-[#232325] text-white'
                        : 'border-[#EAEAEF] bg-[#F9F9FB] text-[#18181B] hover:bg-[#F4F4F6]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Metallic Finish</Label>
            <div className="flex items-center gap-3 pt-1">
              {CARD_FINISH_ORDER.map((f) => (
                <ColorSwatch
                  key={f}
                  finish={f}
                  selected={finish === f}
                  onClick={() => setFinish(f)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="card-limit">Monthly Spending Limit ($)</Label>
            <Input
              id="card-limit"
              type="number"
              min={500}
              max={50000}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => openModal(null)}>
              Cancel
            </Button>
            <Button type="submit">Create Card</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
