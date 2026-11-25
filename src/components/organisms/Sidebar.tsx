import {
  ArrowLeftRight,
  BarChart3,
  Coins,
  CreditCard,
  Gauge,
  Home,
  ListChecks,
  Lock,
  PanelLeft,
  PlusCircle,
  ReceiptText,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { BrandLogo } from '@/components/atoms/BrandLogo';
import { KazaTooltip } from '@/components/atoms/InfoTooltip';
import { NavGridTile } from '@/components/molecules/NavGridTile';
import { ProUpgradeCard } from '@/components/molecules/ProUpgradeCard';
import { QuickActionRow } from '@/components/molecules/QuickActionRow';
import { SearchBar } from '@/components/molecules/SearchBar';
import { useFinance } from '@/store/FinanceContext';
import { cn } from '@/lib/utils';
import type { NavSection } from '@/types/finance';

const NAV_ITEMS: Array<{
  id: NavSection;
  label: string;
  tooltip: string;
  icon: typeof Home;
}> = [
  {
    id: 'home',
    label: 'Home',
    tooltip: 'Unified cash balance, quick expense logger, and recent ledger activity.',
    icon: Home,
  },
  {
    id: 'cards',
    label: 'Cards',
    tooltip: 'Customize card finishes, manage limits, inspect utilization, and view daily spend.',
    icon: CreditCard,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    tooltip: 'Compare income vs. card spending, category shares, and export CSV reports.',
    icon: BarChart3,
  },
  {
    id: 'transfers',
    label: 'Transfers',
    tooltip: 'Send instant or scheduled peer & bank transfers from any active card.',
    icon: ArrowLeftRight,
  },
  {
    id: 'swap',
    label: 'Swap Coins',
    tooltip: 'Convert between USD, EUR, USDC, BTC, ETH, and SOL with live spot quotes.',
    icon: Coins,
  },
  {
    id: 'payments',
    label: 'Payments',
    tooltip: 'Settle upcoming bills, toggle Auto-Pay, and track recurring utilities.',
    icon: ReceiptText,
  },
];

export function Sidebar() {
  const {
    state,
    selectedCard,
    activeNav,
    sidebarCollapsed,
    mobileSidebarOpen,
    setActiveNav,
    toggleSidebar,
    setMobileSidebarOpen,
    openModal,
    selectCard,
    toggleFreezeCard,
  } = useFinance();

  const handleNav = (id: NavSection) => {
    setActiveNav(id);
    setMobileSidebarOpen(false);
  };

  const sidebarContent = (compact: boolean) => (
    <div className="flex h-full flex-col justify-between gap-4 p-3.5">
      <div className="space-y-4">
        {/* Top brand + collapse */}
        <div
          className={cn(
            'flex items-center px-1 pt-0.5',
            compact ? 'justify-center' : 'justify-between'
          )}
        >
          <KazaTooltip
            title="Kaza Finance"
            content="Return to your primary Card Studio overview."
            side="right"
          >
            <button
              type="button"
              onClick={() => handleNav('cards')}
              className="kaza-tactile cursor-pointer focus:outline-none"
              aria-label="Kaza Home"
            >
              <BrandLogo compact={compact} />
            </button>
          </KazaTooltip>

          {!compact && (
            <KazaTooltip content="Collapse navigation rail" side="right">
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Collapse sidebar"
                className="kaza-tactile hidden h-7 w-7 items-center justify-center rounded-lg text-[#71717A] hover:bg-white hover:text-[#18181B] lg:inline-flex cursor-pointer"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            </KazaTooltip>
          )}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close navigation menu"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[#71717A] hover:bg-white lg:hidden cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Expand button when collapsed */}
        {compact && (
          <KazaTooltip content="Expand navigation rail" side="right">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              className="kaza-tactile mx-auto flex h-8 w-8 items-center justify-center rounded-xl border border-[#EAEAEF] bg-white text-[#71717A] hover:text-[#18181B] cursor-pointer"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </KazaTooltip>
        )}

        {/* Search */}
        {!compact && (
          <SearchBar
            cards={state.cards}
            transactions={state.transactions}
            onNavigate={handleNav}
            onSelectCard={selectCard}
            onOpenModal={(m) => {
              setMobileSidebarOpen(false);
              openModal(m);
            }}
          />
        )}

        {/* 2x3 Nav Grid */}
        <nav
          aria-label="Main navigation"
          className={cn(compact ? 'flex flex-col items-center gap-2' : 'grid grid-cols-2 gap-2')}
        >
          {NAV_ITEMS.map((item) => (
            <NavGridTile
              key={item.id}
              label={item.label}
              tooltip={item.tooltip}
              icon={item.icon}
              active={activeNav === item.id}
              compact={compact}
              onClick={() => handleNav(item.id)}
            />
          ))}
        </nav>

        {/* Quick Actions List */}
        <div className="space-y-0.5 pt-1">
          <QuickActionRow
            label={selectedCard.frozen ? 'Unfreeze Card' : 'Freeze Card'}
            tooltip={
              selectedCard.frozen
                ? `Restore all payments and tap-to-pay on ${selectedCard.name}.`
                : `Temporarily pause all new charges on ${selectedCard.name}.`
            }
            icon={selectedCard.frozen ? Lock : PlusCircle}
            active={selectedCard.frozen}
            badgeText={selectedCard.frozen ? 'Frozen' : undefined}
            compact={compact}
            onClick={() => toggleFreezeCard(selectedCard.id)}
          />
          <QuickActionRow
            label="Set Spending Limit"
            tooltip={`Adjust the monthly spending cap (currently $${selectedCard.spendingLimit.toLocaleString()}) for ${selectedCard.name}.`}
            icon={Gauge}
            compact={compact}
            onClick={() => openModal('spending-limit')}
          />
          <QuickActionRow
            label="View Card PIN"
            tooltip="Securely reveal, copy, or update your 4-digit chip & ATM PIN."
            icon={ShieldCheck}
            compact={compact}
            onClick={() => openModal('view-pin')}
          />
          <QuickActionRow
            label="Manage Subscriptions"
            tooltip="Pause, remove, or add recurring software and media memberships."
            icon={ListChecks}
            compact={compact}
            onClick={() => openModal('subscriptions')}
          />
          <QuickActionRow
            label="Security Settings"
            tooltip="Toggle contactless NFC, online checkout, international spend, and biometric 3DS."
            icon={Settings}
            compact={compact}
            onClick={() => openModal('security-settings')}
          />
        </div>
      </div>

      {/* Bottom Pro Card */}
      <ProUpgradeCard
        isPro={state.isPro}
        compact={compact}
        onClick={() => openModal('pro-upgrade')}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Rail */}
      <aside
        className={cn(
          'hidden shrink-0 border-r border-[#EAEAEF] bg-[#F5F5F7] transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block',
          sidebarCollapsed ? 'w-[74px]' : 'w-[228px]'
        )}
      >
        {sidebarContent(sidebarCollapsed)}
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="animate-kaza-overlay fixed inset-0 bg-zinc-950/35 backdrop-blur-[1px]"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative z-10 h-full w-[250px] border-r border-[#EAEAEF] bg-[#F5F5F7] shadow-2xl">
            {sidebarContent(false)}
          </aside>
        </div>
      )}
    </>
  );
}
