import { useEffect, useState } from 'react';
import {
  Bell,
  CheckCheck,
  CreditCard,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { Avatar } from '@/components/atoms/Avatar';
import { KazaTooltip } from '@/components/atoms/InfoTooltip';
import { NotificationRow } from '@/components/molecules/NotificationRow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { formatCurrency, cn } from '@/lib/utils';
import { useFinance } from '@/store/FinanceContext';
import type { RightPanelId } from '@/types/finance';

export function RightSidebar() {
  const {
    state,
    activeRightPanel,
    openRightPanel,
    openModal,
    sendChatMessage,
    markNotificationRead,
    markAllNotificationsRead,
    updateProfile,
    resetDemoData,
  } = useFinance();

  const [draft, setDraft] = useState('');
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');
  const [profileName, setProfileName] = useState(state.userName);

  useEffect(() => {
    setProfileName(state.userName);
  }, [state.userName]);

  const isOpen = activeRightPanel !== null;
  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const visibleNotifications =
    notifFilter === 'unread'
      ? state.notifications.filter((n) => !n.read)
      : state.notifications;

  const monthlySubscriptions = state.subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + s.amount, 0);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendChatMessage(draft);
    setDraft('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileName);
  };

  const panelTabs: Array<{
    id: Exclude<RightPanelId, null>;
    label: string;
    icon: typeof MessageCircle;
    badge?: number;
  }> = [
    { id: 'messages', label: 'Chat', icon: MessageCircle },
    {
      id: 'notifications',
      label: 'Alerts',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const innerContent = (
    <div
      className={cn(
        'flex h-full w-full flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:w-[344px] xl:w-[376px]',
        isOpen ? 'translate-x-0' : 'translate-x-6'
      )}
      style={{ willChange: 'transform' }}
    >
      {/* Top Panel Switcher + Close */}
      <div className="flex items-center justify-between gap-2 border-b border-[#EAEAEF] bg-white/90 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-1 rounded-full bg-[#F4F4F6] p-1">
          {panelTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeRightPanel === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => openRightPanel(tab.id)}
                className={cn(
                  'kaza-tactile inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium cursor-pointer',
                  active
                    ? 'bg-[#232325] text-white shadow-2xs'
                    : 'text-[#71717A] hover:text-[#18181B]'
                )}
              >
                <Icon className="h-3 w-3" />
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && (
                  <span
                    className={cn(
                      'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold',
                      active ? 'bg-white text-[#18181B]' : 'bg-[#232325] text-white'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <KazaTooltip content="Close right panel (Esc)" side="left">
          <button
            type="button"
            onClick={() => openRightPanel(null)}
            aria-label="Close right sidebar"
            className="kaza-tactile flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F4F6] text-[#71717A] hover:bg-[#EAEAEF] hover:text-[#18181B] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </KazaTooltip>
      </div>

      {/* Panel Body */}
      <div
        key={activeRightPanel ?? 'closed'}
        className="animate-kaza-page flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        {activeRightPanel === 'messages' && (
          <div className="flex min-h-0 flex-1 flex-col p-4">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-[#18181B]">Kaza Concierge</h2>
              <p className="text-[11px] text-[#71717A]">
                Priority card support, limit checks, and reward guidance
              </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto rounded-2xl border border-[#EAEAEF] bg-[#F9F9FB] p-3">
              {state.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed',
                    msg.sender === 'user'
                      ? 'self-end bg-[#232325] text-white'
                      : 'self-start border border-[#EAEAEF] bg-white text-[#18181B]'
                  )}
                >
                  <p>{msg.text}</p>
                  <p
                    className={cn(
                      'mt-1 text-[9px]',
                      msg.sender === 'user' ? 'text-zinc-400' : 'text-[#A1A1AA]'
                    )}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                'Check spending limit',
                'How do I freeze my card?',
                'Tell me about Kaza Pro',
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendChatMessage(prompt)}
                  className="kaza-tactile rounded-full border border-[#EAEAEF] bg-white px-2.5 py-1 text-[10px] text-[#52525B] hover:bg-[#F4F4F6] hover:text-[#18181B] cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="mt-3 flex gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask Kaza Concierge..."
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Send message"
                className="kaza-tactile shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}

        {activeRightPanel === 'notifications' && (
          <div className="flex min-h-0 flex-1 flex-col p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-[#18181B]">Notifications</h2>
                <p className="text-[11px] text-[#71717A]">
                  {unreadCount} unread activity alerts
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="kaza-tactile inline-flex items-center gap-1 rounded-full border border-[#EAEAEF] bg-white px-2.5 py-1 text-[10px] font-medium text-[#18181B] hover:bg-[#F4F4F6] cursor-pointer"
                >
                  <CheckCheck className="h-3 w-3" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="mb-3 flex gap-1.5 rounded-full bg-[#F4F4F6] p-1">
              {(['all', 'unread'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setNotifFilter(tab)}
                  className={cn(
                    'kaza-tactile flex-1 rounded-full py-1 text-[11px] font-medium capitalize cursor-pointer',
                    notifFilter === tab
                      ? 'bg-[#232325] text-white'
                      : 'text-[#71717A] hover:text-[#18181B]'
                  )}
                >
                  {tab === 'all'
                    ? `All (${state.notifications.length})`
                    : `Unread (${unreadCount})`}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
              {visibleNotifications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#DCDCE2] p-6 text-center text-xs text-[#71717A]">
                  You&apos;re all caught up. No unread alerts.
                </div>
              ) : (
                visibleNotifications.map((n) => (
                  <NotificationRow
                    key={n.id}
                    item={n}
                    onRead={markNotificationRead}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeRightPanel === 'profile' && (
          <div className="flex min-h-0 flex-1 flex-col justify-between gap-4 overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-[#EAEAEF] bg-[#F9F9FB] p-3.5">
                <Avatar name={state.userName} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#18181B]">
                    {state.userName}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant={state.isPro ? 'positive' : 'dark'}>
                      {state.userRole}
                    </Badge>
                    <span className="text-[10px] text-[#71717A]">
                      {state.cards.length} cards
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Snapshot */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-[#EAEAEF] bg-white p-3">
                  <p className="text-[10px] text-[#71717A]">Liquid Balance</p>
                  <p className="mt-0.5 tabular-nums text-sm font-semibold text-[#18181B]">
                    {formatCurrency(state.totalBalanceBase)}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#EAEAEF] bg-white p-3">
                  <p className="text-[10px] text-[#71717A]">Monthly Subs</p>
                  <p className="mt-0.5 tabular-nums text-sm font-semibold text-[#18181B]">
                    {formatCurrency(monthlySubscriptions)}
                  </p>
                </div>
              </div>

              {/* Display Name Form */}
              <form
                onSubmit={handleSaveProfile}
                className="space-y-2.5 rounded-2xl border border-[#EAEAEF] bg-white p-3.5"
              >
                <Label htmlFor="sidebar-profile-name">Display Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="sidebar-profile-name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                  />
                  <Button type="submit" size="default" className="kaza-tactile shrink-0">
                    Save
                  </Button>
                </div>
                <p className="text-[10px] text-[#71717A]">
                  Updates your dashboard greeting and embossed cardholder name.
                </p>
              </form>

              {/* Quick Account Shortcuts */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => openModal('add-card')}
                  className="kaza-tactile flex w-full items-center justify-between rounded-2xl border border-[#EAEAEF] bg-white px-3.5 py-2.5 text-xs font-medium text-[#18181B] hover:bg-[#F9F9FB] cursor-pointer"
                >
                  <span className="inline-flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-[#71717A]" />
                    Issue New Virtual Card
                  </span>
                  <span className="text-[10px] text-[#71717A]">Instant</span>
                </button>

                {!state.isPro && (
                  <button
                    type="button"
                    onClick={() => openModal('pro-upgrade')}
                    className="kaza-tactile flex w-full items-center justify-between rounded-2xl border border-[#F0D9C8] bg-gradient-to-r from-[#FFF9F4] to-[#FCEAD9] px-3.5 py-2.5 text-xs font-semibold text-[#18181B] cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      Upgrade to Kaza Pro
                    </span>
                    <span className="text-[10px]">+500 pts</span>
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-[#EAEAEF] pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  resetDemoData();
                  openRightPanel(null);
                }}
                className="kaza-tactile w-full"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Demo Data
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Push Sidebar (slides/resizes main content smoothly) */}
      <aside
        aria-label="Inspector panel"
        aria-hidden={!isOpen}
        className={cn(
          'hidden shrink-0 overflow-hidden bg-[#FBFBFB] transition-[width,opacity,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block',
          isOpen
            ? 'w-[344px] border-l border-[#EAEAEF] opacity-100 xl:w-[376px]'
            : 'pointer-events-none w-0 border-l-0 opacity-0'
        )}
      >
        {innerContent}
      </aside>

      {/* Mobile / Tablet Slide-Over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            className="animate-kaza-overlay fixed inset-0 bg-zinc-950/35 backdrop-blur-[1px]"
            onClick={() => openRightPanel(null)}
          />
          <aside
            aria-label="Inspector drawer"
            className="relative z-10 h-full w-[min(92vw,368px)] border-l border-[#EAEAEF] bg-[#FBFBFB] shadow-2xl"
          >
            {innerContent}
          </aside>
        </div>
      )}
    </>
  );
}
