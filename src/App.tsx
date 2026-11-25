import { AnalyticsPage } from '@/components/pages/AnalyticsPage';
import { CardsPage } from '@/components/pages/CardsPage';
import { HomePage } from '@/components/pages/HomePage';
import { PaymentsPage } from '@/components/pages/PaymentsPage';
import { SwapCoinsPage } from '@/components/pages/SwapCoinsPage';
import { TransfersPage } from '@/components/pages/TransfersPage';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FinanceProvider, useFinance } from '@/store/FinanceContext';

function KazaRouter() {
  const { activeNav } = useFinance();

  return (
    <DashboardLayout>
      {activeNav === 'home' && <HomePage />}
      {activeNav === 'cards' && <CardsPage />}
      {activeNav === 'analytics' && <AnalyticsPage />}
      {activeNav === 'transfers' && <TransfersPage />}
      {activeNav === 'swap' && <SwapCoinsPage />}
      {activeNav === 'payments' && <PaymentsPage />}
    </DashboardLayout>
  );
}

export function App() {
  return (
    <TooltipProvider delayDuration={140} skipDelayDuration={100}>
      <FinanceProvider>
        <KazaRouter />
      </FinanceProvider>
    </TooltipProvider>
  );
}

export default App;
