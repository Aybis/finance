import { Bell, Menu, MessageCircle, PanelLeft, Plus } from 'lucide-react';
import { Avatar } from '@/components/atoms/Avatar';
import { IconButton } from '@/components/atoms/IconButton';
import { KazaTooltip } from '@/components/atoms/InfoTooltip';
import { cn } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';

export function TopHeader() {
  const {
    state,
    activeRightPanel,
    openModal,
    toggleRightPanel,
    toggleSidebar,
    setMobileSidebarOpen,
  } = useFinance();

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <header className="@container flex flex-wrap items-center justify-between gap-2.5 border-b border-[#EAEAEF]/80 bg-[#F9F9FB]/85 px-3.5 py-3 backdrop-blur-sm sm:px-6 lg:px-7">
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        {/* Mobile drawer toggle */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Open navigation menu"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#EAEAEF] bg-white text-[#52525B] lg:hidden cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Subtle header layout toggle */}
        <KazaTooltip content="Toggle compact sidebar rail" side="bottom">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar rail"
            className="kaza-tactile hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#71717A] hover:bg-white hover:text-[#18181B] lg:inline-flex cursor-pointer"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </KazaTooltip>

        <div className="min-w-0">
          <h1 className="truncate text-[16px] font-semibold tracking-tight text-[#18181B] sm:text-[19px]">
            Good Morning, {state.userName}
          </h1>
          <KazaTooltip
            title="Current Statement Cycle"
            content="All balances, daily usage, and rewards reflect activity through Friday, 15 July 2026."
            side="bottom"
          >
            <p className="inline-block truncate text-[10px] text-[#71717A] sm:text-[11px] cursor-help">
              {state.dateLabel}
            </p>
          </KazaTooltip>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <KazaTooltip
          title="Issue Virtual Card"
          content="Create a new virtual card instantly with custom metallic finish and spending cap."
          side="bottom"
        >
          <button
            type="button"
            onClick={() => openModal('add-card')}
            className="kaza-tactile inline-flex h-8 items-center gap-1.5 rounded-full border border-[#EAEAEF] bg-white pl-1 pr-2.5 text-[11px] font-medium text-[#18181B] shadow-2xs hover:bg-[#F4F4F6] sm:h-9 sm:gap-2 sm:pl-1.5 sm:pr-3.5 cursor-pointer"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#232325] text-white">
              <Plus className="h-3.5 w-3.5" />
            </span>
            <span className="hidden @md:inline">Add Card</span>
          </button>
        </KazaTooltip>

        <KazaTooltip
          title="Order Physical Card"
          content="Request a physical card made from recycled ocean polymer or brushed aluminum."
          side="bottom"
        >
          <button
            type="button"
            onClick={() => openModal('order-card')}
            className="kaza-tactile hidden h-9 items-center rounded-full border border-[#EAEAEF] bg-white px-4 text-[11px] font-medium text-[#18181B] shadow-2xs hover:bg-[#F4F4F6] @xl:inline-flex cursor-pointer"
          >
            Order a Card
          </button>
        </KazaTooltip>

        <KazaTooltip
          title="Kaza Concierge"
          content="Open the right concierge chat panel without covering your workspace."
          side="bottom"
        >
          <IconButton
            variant={activeRightPanel === 'messages' ? 'dark' : 'light'}
            aria-label="Open concierge messages"
            aria-pressed={activeRightPanel === 'messages'}
            dot={activeRightPanel !== 'messages'}
            onClick={() => toggleRightPanel('messages')}
            className="kaza-tactile"
          >
            <MessageCircle className="h-4 w-4" />
          </IconButton>
        </KazaTooltip>

        <KazaTooltip
          title="Activity Alerts"
          content={`${unreadCount} unread notifications. Opens the right alerts panel.`}
          side="bottom"
        >
          <IconButton
            variant={activeRightPanel === 'notifications' ? 'dark' : 'light'}
            aria-label="Notifications"
            aria-pressed={activeRightPanel === 'notifications'}
            badgeCount={activeRightPanel === 'notifications' ? undefined : unreadCount}
            onClick={() => toggleRightPanel('notifications')}
            className="kaza-tactile"
          >
            <Bell className="h-4 w-4" />
          </IconButton>
        </KazaTooltip>

        <KazaTooltip
          title={`${state.userName} · ${state.userRole}`}
          content="Open profile & account panel on the right."
          side="bottom"
        >
          <button
            type="button"
            onClick={() => toggleRightPanel('profile')}
            aria-label="Open profile panel"
            aria-pressed={activeRightPanel === 'profile'}
            className={cn(
              'kaza-tactile rounded-full transition-all hover:scale-105 cursor-pointer',
              activeRightPanel === 'profile' &&
                'ring-2 ring-[#232325] ring-offset-2 ring-offset-[#F9F9FB]'
            )}
          >
            <Avatar name={state.userName} />
          </button>
        </KazaTooltip>
      </div>
    </header>
  );
}
