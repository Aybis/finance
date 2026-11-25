import { useState } from 'react';
import { Check, Copy, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input, Label } from '@/components/ui/input';
import { useFinance } from '@/store/FinanceContext';

export function ViewPinModal() {
  const { activeModal, openModal, selectedCard, updateCardPin } = useFinance();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState('');

  const handleCopy = () => {
    navigator.clipboard?.writeText(selectedCard.pin).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newPin)) {
      setError('PIN must be exactly 4 digits.');
      return;
    }
    setError('');
    updateCardPin(selectedCard.id, newPin);
    setNewPin('');
    setRevealed(true);
  };

  return (
    <Dialog open={activeModal === 'view-pin'} onOpenChange={(o) => !o && openModal(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Card PIN Management</DialogTitle>
          <DialogDescription>
            View or update the 4-digit ATM &amp; chip PIN for {selectedCard.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl border border-[#EAEAEF] bg-[#F9F9FB] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#232325] text-white">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-[#71717A]">Current PIN</p>
                <p className="font-mono text-2xl font-bold tracking-[0.35em] text-[#18181B]">
                  {revealed ? selectedCard.pin : '••••'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRevealed((v) => !v)}
              >
                {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {revealed ? 'Hide' : 'Reveal'}
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <form onSubmit={handleChangePin} className="space-y-3 border-t border-[#EAEAEF] pt-4">
            <Label htmlFor="new-pin">Change 4-Digit PIN</Label>
            <div className="flex gap-2">
              <Input
                id="new-pin"
                type="password"
                maxLength={4}
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 4 digits"
              />
              <Button type="submit">Update PIN</Button>
            </div>
            {error && <p className="text-[11px] text-[#EF4444]">{error}</p>}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
