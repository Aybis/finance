import { useMemo, useState } from 'react';
import { ArrowRight, CreditCard, Search, Sliders, X } from 'lucide-react';
import type { FinanceCard, ModalId, NavSection, Transaction } from '@/types/finance';

interface SearchBarProps {
  cards: FinanceCard[];
  transactions: Transaction[];
  onNavigate: (nav: NavSection) => void;
  onSelectCard: (cardId: string) => void;
  onOpenModal: (modal: ModalId) => void;
}

export function SearchBar({
  cards,
  transactions,
  onNavigate,
  onSelectCard,
  onOpenModal,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: Array<{
      id: string;
      label: string;
      sublabel: string;
      kind: 'Menu' | 'Card' | 'Action' | 'Tx';
      run: () => void;
    }> = [];

    const menus: Array<{ id: NavSection; label: string }> = [
      { id: 'home', label: 'Home Overview' },
      { id: 'cards', label: 'Cards Studio' },
      { id: 'analytics', label: 'Analytics & Reports' },
      { id: 'transfers', label: 'Transfers & Contacts' },
      { id: 'swap', label: 'Swap Coins & FX' },
      { id: 'payments', label: 'Payments & Bills' },
    ];
    menus.forEach((m) => {
      if (m.label.toLowerCase().includes(q)) {
        items.push({
          id: `menu-${m.id}`,
          label: m.label,
          sublabel: 'Navigate to section',
          kind: 'Menu',
          run: () => onNavigate(m.id),
        });
      }
    });

    cards.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.cardNumber.slice(-4).includes(q) ||
        c.tier.toLowerCase().includes(q)
      ) {
        items.push({
          id: `card-${c.id}`,
          label: c.name,
          sublabel: `•••• ${c.cardNumber.slice(-4)} · $${c.spendingLimit.toLocaleString()} limit`,
          kind: 'Card',
          run: () => {
            onSelectCard(c.id);
            onNavigate('cards');
          },
        });
      }
    });

    const quickActions: Array<{ modal: ModalId; label: string }> = [
      { modal: 'spending-limit', label: 'Set Spending Limit' },
      { modal: 'view-pin', label: 'View Card PIN' },
      { modal: 'subscriptions', label: 'Manage Subscriptions' },
      { modal: 'security-settings', label: 'Security Settings' },
      { modal: 'add-card', label: 'Add New Card' },
      { modal: 'order-card', label: 'Order Physical Card' },
    ];
    quickActions.forEach((a) => {
      if (a.label.toLowerCase().includes(q)) {
        items.push({
          id: `act-${a.modal}`,
          label: a.label,
          sublabel: 'Quick action',
          kind: 'Action',
          run: () => onOpenModal(a.modal),
        });
      }
    });

    transactions.forEach((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      ) {
        items.push({
          id: `tx-${t.id}`,
          label: t.title,
          sublabel: `${t.category} · $${t.amount.toFixed(2)}`,
          kind: 'Tx',
          run: () => onNavigate('home'),
        });
      }
    });

    return items.slice(0, 6);
  }, [query, cards, transactions, onNavigate, onSelectCard, onOpenModal]);

  return (
    <div className="relative">
      <div className="flex h-8 items-center gap-2 rounded-xl border border-[#EAEAEF] bg-[#FBFBFB] px-2.5 transition-colors focus-within:border-[#232325] focus-within:bg-white">
        <Search className="h-3.5 w-3.5 shrink-0 text-[#A1A1AA]" />
        <input
          type="text"
          value={query}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 160)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          aria-label="Search menus, cards, and transactions"
          className="w-full bg-transparent text-[11px] text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="text-[#A1A1AA] hover:text-[#18181B] cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {focused && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-9 z-40 rounded-2xl border border-[#EAEAEF] bg-white p-1.5 shadow-xl">
          {results.length === 0 ? (
            <p className="px-2.5 py-2 text-[11px] text-[#71717A]">
              No matches for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div className="space-y-0.5">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    item.run();
                    setQuery('');
                    setFocused(false);
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-left transition-colors hover:bg-[#F4F4F6] cursor-pointer"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {item.kind === 'Card' ? (
                      <CreditCard className="h-3.5 w-3.5 shrink-0 text-[#71717A]" />
                    ) : (
                      <Sliders className="h-3.5 w-3.5 shrink-0 text-[#71717A]" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-medium text-[#18181B]">
                        {item.label}
                      </p>
                      <p className="truncate text-[9px] text-[#71717A]">{item.sublabel}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3 w-3 shrink-0 text-[#A1A1AA]" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
