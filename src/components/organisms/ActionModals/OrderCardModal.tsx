import { useState } from 'react';
import { Leaf, Truck } from 'lucide-react';
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
import type { CardFinish, CardOrder, CardTier } from '@/types/finance';

export function OrderCardModal() {
  const { activeModal, openModal, orderPhysicalCard, selectedCard, state } = useFinance();
  const [tier, setTier] = useState<CardTier>(selectedCard.tier);
  const [finish, setFinish] = useState<CardFinish>(selectedCard.finish);
  const [material, setMaterial] = useState<CardOrder['material']>(
    'Recycled Ocean Polymer'
  );
  const [deliverySpeed, setDeliverySpeed] = useState<CardOrder['deliverySpeed']>(
    'Express (48h)'
  );
  const [address, setAddress] = useState('412 Mercer St, Apt 4B, New York, NY 10013');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    orderPhysicalCard({
      tier,
      finish,
      material,
      deliverySpeed,
      address,
    });
    openModal(null);
  };

  return (
    <Dialog open={activeModal === 'order-card'} onOpenChange={(o) => !o && openModal(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Order Physical Recycled Card</DialogTitle>
          <DialogDescription>
            Crafted from verified recycled ocean polymer or brushed recycled aluminum.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Card Edition</Label>
              <div className="flex flex-wrap gap-1.5">
                {(['Platinum', 'Silver', 'Obsidian'] as CardTier[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium cursor-pointer ${
                      tier === t
                        ? 'border-[#232325] bg-[#232325] text-white'
                        : 'border-[#EAEAEF] bg-[#F9F9FB] text-[#18181B]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Finish Color</Label>
              <div className="flex items-center gap-2.5 pt-1">
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
          </div>

          <div className="space-y-1.5">
            <Label>Eco Material</Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  'Recycled Ocean Polymer',
                  'Brushed Recycled Aluminum',
                ] as CardOrder['material'][]
              ).map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => setMaterial(mat)}
                  className={`flex items-center gap-2 rounded-2xl border p-2.5 text-left text-[11px] font-medium cursor-pointer ${
                    material === mat
                      ? 'border-[#232325] bg-[#232325] text-white'
                      : 'border-[#EAEAEF] bg-[#F9F9FB] text-[#18181B]'
                  }`}
                >
                  <Leaf className="h-3.5 w-3.5 shrink-0" />
                  <span>{mat}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Delivery Speed</Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                ['Standard (5-7 days)', 'Express (48h)'] as CardOrder['deliverySpeed'][]
              ).map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setDeliverySpeed(speed)}
                  className={`flex items-center gap-2 rounded-2xl border p-2.5 text-left text-[11px] font-medium cursor-pointer ${
                    deliverySpeed === speed
                      ? 'border-[#232325] bg-[#232325] text-white'
                      : 'border-[#EAEAEF] bg-[#F9F9FB] text-[#18181B]'
                  }`}
                >
                  <Truck className="h-3.5 w-3.5 shrink-0" />
                  <span>{speed}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="shipping-address">Shipping Address</Label>
            <Input
              id="shipping-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {state.cardOrders.length > 0 && (
            <div className="rounded-2xl bg-[#F4F4F6] p-3 text-[11px]">
              <p className="font-semibold text-[#18181B]">
                Recent Orders ({state.cardOrders.length})
              </p>
              <p className="mt-0.5 text-[#71717A]">
                Latest: {state.cardOrders[0].tier} ({state.cardOrders[0].material}) ·{' '}
                {state.cardOrders[0].status}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => openModal(null)}>
              Cancel
            </Button>
            <Button type="submit">Place Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
