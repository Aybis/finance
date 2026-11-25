import { AddCardModal } from './AddCardModal';
import { OrderCardModal } from './OrderCardModal';
import { ProUpgradeModal } from './ProUpgradeModal';
import { SecuritySettingsModal } from './SecuritySettingsModal';
import { SpendingLimitModal } from './SpendingLimitModal';
import { SubscriptionsModal } from './SubscriptionsModal';
import { ViewPinModal } from './ViewPinModal';

export function ActionModals() {
  return (
    <>
      <AddCardModal />
      <OrderCardModal />
      <SpendingLimitModal />
      <ViewPinModal />
      <SubscriptionsModal />
      <SecuritySettingsModal />
      <ProUpgradeModal />
    </>
  );
}
