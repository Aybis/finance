import { Check, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFinance } from '@/store/FinanceContext';

const PERKS = [
  '2x Cashback (up to 4% on Travel & Dining)',
  '0% Fee Crypto & FX Swaps up to $25k/mo',
  'Unlimited Disposable Virtual Cards',
  'Complimentary Brushed Titanium Physical Card',
  '24/7 Priority Concierge & Airport Lounge Pass',
];

export function ProUpgradeModal() {
  const { activeModal, openModal, state, upgradeToPro } = useFinance();

  return (
    <Dialog
      open={activeModal === 'pro-upgrade'}
      onOpenChange={(o) => !o && openModal(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {state.isPro ? (
              <Sparkles className="h-4 w-4 text-emerald-600" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}
            {state.isPro ? 'Kaza Pro Membership Active' : 'Upgrade to Kaza Pro'}
          </DialogTitle>
          <DialogDescription>
            Everything you need for smart personal finance, multi-currency wealth, and rewards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#F0D9C8] bg-gradient-to-br from-[#FFF9F4] via-white to-[#FCEAD9] p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-[#18181B]">Kaza Pro Plan</span>
              <span className="tabular-nums text-xl font-bold text-[#18181B]">
                $12<span className="text-xs font-normal text-[#71717A]"> / month</span>
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-xs text-[#18181B]">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#232325] text-white">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => openModal(null)}>
              Close
            </Button>
            {!state.isPro && (
              <Button
                type="button"
                onClick={() => {
                  upgradeToPro();
                  openModal(null);
                }}
              >
                Activate Kaza Pro (+500 pts)
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
