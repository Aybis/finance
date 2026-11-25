import { KpiMetricCard } from '@/components/molecules/KpiMetricCard';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';

export function KpiSummaryRow() {
  const { state, setActiveNav } = useFinance();

  const animatedBalance = useAnimatedNumber(state.totalBalanceBase, 550);
  const animatedSpending = useAnimatedNumber(state.cardSpendingBase, 550);
  const animatedRewards = useAnimatedNumber(state.rewardsPoints, 550);
  const animatedCashback = useAnimatedNumber(state.cashbackEarned, 550);

  return (
    <section
      aria-label="Account KPIs"
      className="grid grid-cols-1 gap-2 rounded-[22px] border border-[#EAEAEF]/80 bg-[#F9F9FB]/90 p-2 @sm:grid-cols-2 @4xl:grid-cols-4"
    >
      <KpiMetricCard
        label="Total Balance"
        value={formatCurrency(animatedBalance)}
        delta="+2.3%"
        direction="up"
        tooltip="Combined liquid USD across your Kaza accounts (+2.3% vs. last 30 days). Click to open Home ledger."
        sparkline={[14, 19, 17, 23, 18, 25, 22, 27, 25, 31, 29, 34]}
        onClick={() => setActiveNav('home')}
      />
      <KpiMetricCard
        label="Card Spending"
        value={formatCurrency(animatedSpending)}
        delta="+1.1%"
        direction="up"
        tooltip="Cumulative settled spend across all Kaza cards this billing cycle (+1.1% vs. prior cycle). Click for Analytics."
        sparkline={[20, 16, 22, 18, 25, 21, 27, 24, 29, 26, 30, 28]}
        onClick={() => setActiveNav('analytics')}
      />
      <KpiMetricCard
        label="Rewards Earned"
        value={`${formatNumber(Math.round(animatedRewards))} pts`}
        delta="-3.1%"
        direction="down"
        tooltip="Redeemable Kaza points earned from card purchases (1.5x base, 2x on Pro). -3.1% vs. last month."
        sparkline={[29, 24, 27, 22, 25, 20, 22, 18, 20, 17, 19, 16]}
        onClick={() => setActiveNav('analytics')}
      />
      <KpiMetricCard
        label="Cashback"
        value={formatCurrency(animatedCashback)}
        delta="+5.2%"
        direction="up"
        tooltip="Instant cashback credited from eligible merchant & utility payments (+5.2% this cycle). Click for Payments."
        sparkline={[12, 16, 15, 20, 18, 24, 21, 27, 25, 31, 29, 36]}
        onClick={() => setActiveNav('payments')}
      />
    </section>
  );
}
