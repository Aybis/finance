import { Switch } from '@/components/ui/controls';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFinance } from '@/store/FinanceContext';
import type { CardSecuritySettings } from '@/types/finance';

const SECURITY_ROWS: Array<{
  key: keyof CardSecuritySettings;
  title: string;
  desc: string;
}> = [
  {
    key: 'contactless',
    title: 'Contactless & Tap-to-Pay',
    desc: 'Allow NFC terminal & Google Pay transactions',
  },
  {
    key: 'onlinePayments',
    title: 'Online & In-App Checkout',
    desc: 'Enable card-not-present e-commerce purchases',
  },
  {
    key: 'international',
    title: 'International Travel Spend',
    desc: 'Zero FX markup in 140+ currencies abroad',
  },
  {
    key: 'atmWithdrawals',
    title: 'ATM Cash Withdrawals',
    desc: 'Permit physical cash withdrawals at global ATMs',
  },
  {
    key: 'biometric',
    title: 'Biometric 3DS Approval',
    desc: 'Require Face/Touch verification above $250',
  },
  {
    key: 'instantAlerts',
    title: 'Real-Time Spend Alerts',
    desc: 'Instant push notifications on every authorization',
  },
];

export function SecuritySettingsModal() {
  const { activeModal, openModal, selectedCard, toggleSecuritySetting } = useFinance();

  return (
    <Dialog
      open={activeModal === 'security-settings'}
      onOpenChange={(o) => !o && openModal(null)}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Security Settings</DialogTitle>
          <DialogDescription>
            Per-card controls for {selectedCard.name} (••••{' '}
            {selectedCard.cardNumber.slice(-4)}).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5">
          {SECURITY_ROWS.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between gap-3 rounded-2xl border border-[#EAEAEF] bg-[#F9F9FB] px-3.5 py-2.5"
            >
              <div>
                <p className="text-xs font-semibold text-[#18181B]">{row.title}</p>
                <p className="text-[10px] text-[#71717A]">{row.desc}</p>
              </div>
              <Switch
                checked={selectedCard.security[row.key]}
                onCheckedChange={() => toggleSecuritySetting(selectedCard.id, row.key)}
                aria-label={row.title}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
