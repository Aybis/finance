import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { INITIAL_FINANCE_STATE, type FinanceState } from '@/data/initialData';
import type {
  BillItem,
  CardFinish,
  CardNetwork,
  CardOrder,
  CardSecuritySettings,
  CardTier,
  CoinSymbol,
  FinanceCard,
  ModalId,
  NavSection,
  RightPanelId,
  SpendingCategoryName,
  Subscription,
  ToastMessage,
  Transaction,
} from '@/types/finance';

const STORAGE_KEY = 'kaza_finance_v1';

interface AddCardInput {
  name: string;
  tier: CardTier;
  network: CardNetwork;
  finish: CardFinish;
  spendingLimit: number;
}

interface OrderCardInput {
  tier: CardTier;
  finish: CardFinish;
  material: CardOrder['material'];
  deliverySpeed: CardOrder['deliverySpeed'];
  address: string;
}

interface TransferInput {
  fromCardId: string;
  recipientName: string;
  recipientHandle: string;
  amount: number;
  note: string;
  scheduled: boolean;
}

interface SwapInput {
  fromSymbol: CoinSymbol;
  toSymbol: CoinSymbol;
  amount: number;
}

interface AddTransactionInput {
  cardId: string;
  title: string;
  merchant: string;
  category: SpendingCategoryName;
  amount: number;
  type: 'expense' | 'income';
}

type Action =
  | { type: 'SELECT_CARD'; cardId: string }
  | { type: 'SET_CARD_FINISH'; cardId: string; finish: CardFinish }
  | { type: 'SET_PRIMARY_CARD'; cardId: string }
  | { type: 'TOGGLE_FREEZE_CARD'; cardId: string }
  | { type: 'UPDATE_SPENDING_LIMIT'; cardId: string; limit: number }
  | { type: 'UPDATE_CARD_PIN'; cardId: string; pin: string }
  | { type: 'TOGGLE_SECURITY'; cardId: string; key: keyof CardSecuritySettings }
  | { type: 'ADD_CARD'; card: FinanceCard }
  | { type: 'ORDER_CARD'; order: CardOrder }
  | { type: 'ADD_TRANSACTION'; tx: Transaction }
  | { type: 'EXECUTE_TRANSFER'; cardId: string; amount: number; tx: Transaction }
  | {
      type: 'EXECUTE_SWAP';
      fromSymbol: CoinSymbol;
      toSymbol: CoinSymbol;
      fromAmount: number;
      toAmount: number;
      feeUsd: number;
    }
  | { type: 'PAY_BILL'; billId: string; cardId: string; tx: Transaction }
  | { type: 'TOGGLE_BILL_AUTOPAY'; billId: string }
  | { type: 'ADD_BILL'; bill: BillItem }
  | { type: 'TOGGLE_SUBSCRIPTION'; subId: string }
  | { type: 'DELETE_SUBSCRIPTION'; subId: string }
  | { type: 'ADD_SUBSCRIPTION'; sub: Subscription }
  | { type: 'UPGRADE_PRO' }
  | { type: 'ADD_CHAT_MESSAGE'; sender: 'user' | 'concierge'; text: string }
  | { type: 'MARK_NOTIFICATION_READ'; id: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'PUSH_NOTIFICATION'; title: string; description: string; notifType: 'card' | 'transfer' | 'security' | 'reward' }
  | { type: 'UPDATE_PROFILE'; userName: string }
  | { type: 'RESET_DEMO' };

function loadInitialState(): FinanceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_FINANCE_STATE;
    const parsed = JSON.parse(raw) as Partial<FinanceState>;
    if (!parsed.cards || parsed.cards.length === 0) return INITIAL_FINANCE_STATE;
    return {
      ...INITIAL_FINANCE_STATE,
      ...parsed,
    };
  } catch {
    return INITIAL_FINANCE_STATE;
  }
}

function nowTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function financeReducer(state: FinanceState, action: Action): FinanceState {
  switch (action.type) {
    case 'SELECT_CARD':
      return { ...state, selectedCardId: action.cardId };

    case 'SET_CARD_FINISH':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId ? { ...c, finish: action.finish } : c
        ),
      };

    case 'SET_PRIMARY_CARD':
      return {
        ...state,
        cards: state.cards.map((c) => ({
          ...c,
          isPrimary: c.id === action.cardId,
        })),
      };

    case 'TOGGLE_FREEZE_CARD':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId ? { ...c, frozen: !c.frozen } : c
        ),
      };

    case 'UPDATE_SPENDING_LIMIT':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId ? { ...c, spendingLimit: action.limit } : c
        ),
      };

    case 'UPDATE_CARD_PIN':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId ? { ...c, pin: action.pin } : c
        ),
      };

    case 'TOGGLE_SECURITY':
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.cardId
            ? {
                ...c,
                security: {
                  ...c.security,
                  [action.key]: !c.security[action.key],
                },
              }
            : c
        ),
      };

    case 'ADD_CARD':
      return {
        ...state,
        cards: [action.card, ...state.cards],
        selectedCardId: action.card.id,
      };

    case 'ORDER_CARD':
      return {
        ...state,
        cardOrders: [action.order, ...state.cardOrders],
      };

    case 'ADD_TRANSACTION': {
      const { tx } = action;
      const isExpense = tx.type === 'expense';
      return {
        ...state,
        totalBalanceBase: isExpense
          ? Math.max(0, Number((state.totalBalanceBase - tx.amount).toFixed(2)))
          : Number((state.totalBalanceBase + tx.amount).toFixed(2)),
        cardSpendingBase: isExpense
          ? Number((state.cardSpendingBase + tx.amount).toFixed(2))
          : state.cardSpendingBase,
        rewardsPoints: isExpense
          ? state.rewardsPoints + Math.round(tx.amount * 1.5)
          : state.rewardsPoints,
        cashbackEarned: isExpense
          ? Number((state.cashbackEarned + tx.amount * 0.02).toFixed(2))
          : state.cashbackEarned,
        cards: state.cards.map((c) =>
          c.id === tx.cardId
            ? {
                ...c,
                balance: isExpense ? Math.max(0, c.balance - tx.amount) : c.balance + tx.amount,
                usedToday: isExpense ? Number((c.usedToday + tx.amount).toFixed(2)) : c.usedToday,
                spentThisMonth: isExpense
                  ? Number((c.spentThisMonth + tx.amount).toFixed(2))
                  : c.spentThisMonth,
                utilizationAmount: isExpense
                  ? Number((c.utilizationAmount + tx.amount).toFixed(2))
                  : c.utilizationAmount,
              }
            : c
        ),
        transactions: [tx, ...state.transactions],
      };
    }

    case 'EXECUTE_TRANSFER': {
      const { cardId, amount, tx } = action;
      const isImmediate = tx.status === 'completed';
      return {
        ...state,
        totalBalanceBase: isImmediate
          ? Math.max(0, Number((state.totalBalanceBase - amount).toFixed(2)))
          : state.totalBalanceBase,
        cards: state.cards.map((c) =>
          c.id === cardId && isImmediate
            ? {
                ...c,
                balance: Math.max(0, Number((c.balance - amount).toFixed(2))),
                utilizationAmount: Number((c.utilizationAmount + amount).toFixed(2)),
              }
            : c
        ),
        transactions: [tx, ...state.transactions],
      };
    }

    case 'EXECUTE_SWAP': {
      const { fromSymbol, toSymbol, fromAmount, toAmount, feeUsd } = action;
      const nextCoins = state.coins.map((coin) => {
        if (coin.symbol === fromSymbol) {
          return { ...coin, balance: Math.max(0, Number((coin.balance - fromAmount).toFixed(6))) };
        }
        if (coin.symbol === toSymbol) {
          return { ...coin, balance: Number((coin.balance + toAmount).toFixed(6)) };
        }
        return coin;
      });
      const usdDelta =
        fromSymbol === 'USD' ? -fromAmount : toSymbol === 'USD' ? toAmount : 0;
      return {
        ...state,
        totalBalanceBase: Math.max(0, Number((state.totalBalanceBase + usdDelta).toFixed(2))),
        coins: nextCoins,
        swaps: [
          {
            id: `sw-${Date.now()}`,
            fromSymbol,
            toSymbol,
            fromAmount,
            toAmount,
            feeUsd,
            timestamp: `15 Jul 2026 · ${nowTime()}`,
          },
          ...state.swaps,
        ],
      };
    }

    case 'PAY_BILL': {
      const { billId, cardId, tx } = action;
      return {
        ...state,
        totalBalanceBase: Math.max(
          0,
          Number((state.totalBalanceBase - tx.amount).toFixed(2))
        ),
        cardSpendingBase: Number((state.cardSpendingBase + tx.amount).toFixed(2)),
        cashbackEarned: Number((state.cashbackEarned + tx.amount * 0.015).toFixed(2)),
        bills: state.bills.map((b) => (b.id === billId ? { ...b, paid: true } : b)),
        cards: state.cards.map((c) =>
          c.id === cardId
            ? {
                ...c,
                balance: Math.max(0, Number((c.balance - tx.amount).toFixed(2))),
                usedToday: Number((c.usedToday + tx.amount).toFixed(2)),
                utilizationAmount: Number((c.utilizationAmount + tx.amount).toFixed(2)),
              }
            : c
        ),
        transactions: [tx, ...state.transactions],
      };
    }

    case 'TOGGLE_BILL_AUTOPAY':
      return {
        ...state,
        bills: state.bills.map((b) =>
          b.id === action.billId ? { ...b, autoPay: !b.autoPay } : b
        ),
      };

    case 'ADD_BILL':
      return {
        ...state,
        bills: [action.bill, ...state.bills],
      };

    case 'TOGGLE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map((s) =>
          s.id === action.subId ? { ...s, active: !s.active } : s
        ),
      };

    case 'DELETE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.filter((s) => s.id !== action.subId),
      };

    case 'ADD_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: [action.sub, ...state.subscriptions],
      };

    case 'UPGRADE_PRO':
      return {
        ...state,
        isPro: true,
        userRole: 'Kaza Pro Member',
        rewardsPoints: state.rewardsPoints + 500,
      };

    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            sender: action.sender,
            text: action.text,
            timestamp: nowTime(),
          },
        ],
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case 'PUSH_NOTIFICATION':
      return {
        ...state,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: action.title,
            description: action.description,
            timestamp: 'Just now',
            read: false,
            type: action.notifType,
          },
          ...state.notifications,
        ],
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        userName: action.userName,
        cards: state.cards.map((c) => ({
          ...c,
          holderName: action.userName.toUpperCase(),
        })),
      };

    case 'RESET_DEMO':
      return INITIAL_FINANCE_STATE;

    default:
      return state;
  }
}

interface FinanceContextValue {
  state: FinanceState;
  selectedCard: FinanceCard;
  activeNav: NavSection;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  activeModal: ModalId;
  activeRightPanel: RightPanelId;
  toasts: ToastMessage[];
  setActiveNav: (nav: NavSection) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  openModal: (modal: ModalId) => void;
  openRightPanel: (panel: RightPanelId) => void;
  toggleRightPanel: (panel: Exclude<RightPanelId, null>) => void;
  dismissToast: (id: string) => void;
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  selectCard: (cardId: string) => void;
  setCardFinish: (cardId: string, finish: CardFinish) => void;
  setPrimaryCard: (cardId: string) => void;
  toggleFreezeCard: (cardId: string) => void;
  updateSpendingLimit: (cardId: string, limit: number) => void;
  updateCardPin: (cardId: string, pin: string) => void;
  toggleSecuritySetting: (cardId: string, key: keyof CardSecuritySettings) => void;
  addCard: (input: AddCardInput) => void;
  orderPhysicalCard: (input: OrderCardInput) => void;
  addTransaction: (input: AddTransactionInput) => boolean;
  executeTransfer: (input: TransferInput) => boolean;
  executeSwap: (input: SwapInput) => boolean;
  payBill: (billId: string, cardId: string) => boolean;
  toggleBillAutopay: (billId: string) => void;
  addBill: (bill: Omit<BillItem, 'id' | 'paid'>) => void;
  toggleSubscription: (subId: string) => void;
  deleteSubscription: (subId: string) => void;
  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  upgradeToPro: () => void;
  sendChatMessage: (text: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateProfile: (userName: string) => void;
  resetDemoData: () => void;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, undefined, loadInitialState);
  const [activeNav, setActiveNav] = useState<NavSection>('cards');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalId>(null);
  const [activeRightPanel, setActiveRightPanel] = useState<RightPanelId>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toggleRightPanel = useCallback((panel: Exclude<RightPanelId, null>) => {
    setActiveRightPanel((prev) => (prev === panel ? null : panel));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !activeModal && activeRightPanel) {
        setActiveRightPanel(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal, activeRightPanel]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota issues
    }
  }, [state]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const selectedCard = useMemo(() => {
    return state.cards.find((c) => c.id === state.selectedCardId) ?? state.cards[0];
  }, [state.cards, state.selectedCardId]);

  const selectCard = useCallback((cardId: string) => {
    dispatch({ type: 'SELECT_CARD', cardId });
  }, []);

  const setCardFinish = useCallback(
    (cardId: string, finish: CardFinish) => {
      dispatch({ type: 'SET_CARD_FINISH', cardId, finish });
      pushToast({
        title: 'Card finish updated',
        description: `Applied ${finish.replace('-', ' ')} metallic finish.`,
      });
    },
    [pushToast]
  );

  const setPrimaryCard = useCallback(
    (cardId: string) => {
      const card = state.cards.find((c) => c.id === cardId);
      dispatch({ type: 'SET_PRIMARY_CARD', cardId });
      dispatch({
        type: 'PUSH_NOTIFICATION',
        title: `${card?.name ?? 'Card'} set as primary`,
        description: 'Default checkout and Google Pay funding source updated.',
        notifType: 'card',
      });
      pushToast({
        title: `${card?.tier ?? 'Card'} selected as active card`,
        description: 'Ready for instant payments and rewards.',
        variant: 'success',
      });
    },
    [state.cards, pushToast]
  );

  const toggleFreezeCard = useCallback(
    (cardId: string) => {
      const card = state.cards.find((c) => c.id === cardId);
      if (!card) return;
      const nextFrozen = !card.frozen;
      dispatch({ type: 'TOGGLE_FREEZE_CARD', cardId });
      dispatch({
        type: 'PUSH_NOTIFICATION',
        title: nextFrozen ? `${card.name} frozen` : `${card.name} unfrozen`,
        description: nextFrozen
          ? 'All new purchases and ATM withdrawals are paused.'
          : 'Card payments have been restored.',
        notifType: 'security',
      });
      pushToast({
        title: nextFrozen ? `${card.name} is now frozen` : `${card.name} unfrozen`,
        description: nextFrozen
          ? 'Outgoing transactions are blocked until you unfreeze.'
          : 'Your card is active again.',
        variant: nextFrozen ? 'warning' : 'success',
      });
    },
    [state.cards, pushToast]
  );

  const updateSpendingLimit = useCallback(
    (cardId: string, limit: number) => {
      dispatch({ type: 'UPDATE_SPENDING_LIMIT', cardId, limit });
      dispatch({
        type: 'PUSH_NOTIFICATION',
        title: 'Spending limit updated',
        description: `Monthly limit adjusted to $${limit.toLocaleString()}.`,
        notifType: 'card',
      });
      pushToast({
        title: 'Spending limit saved',
        description: `New monthly limit: $${limit.toLocaleString()}`,
        variant: 'success',
      });
    },
    [pushToast]
  );

  const updateCardPin = useCallback(
    (cardId: string, pin: string) => {
      dispatch({ type: 'UPDATE_CARD_PIN', cardId, pin });
      dispatch({
        type: 'PUSH_NOTIFICATION',
        title: 'Card PIN changed',
        description: 'Your 4-digit security PIN was updated.',
        notifType: 'security',
      });
      pushToast({
        title: 'Card PIN updated',
        description: 'Your new PIN takes effect immediately.',
        variant: 'success',
      });
    },
    [pushToast]
  );

  const toggleSecuritySetting = useCallback(
    (cardId: string, key: keyof CardSecuritySettings) => {
      dispatch({ type: 'TOGGLE_SECURITY', cardId, key });
      pushToast({
        title: 'Security preference saved',
        description: `Updated ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
      });
    },
    [pushToast]
  );

  const addCard = useCallback(
    (input: AddCardInput) => {
      const lastFour = String(Math.floor(1000 + Math.random() * 9000));
      const newCard: FinanceCard = {
        id: `card-${Date.now()}`,
        name: input.name.trim() || `${input.tier} Card`,
        tier: input.tier,
        annualFee:
          input.tier === 'Obsidian'
            ? 240
            : input.tier === 'Platinum'
              ? 150
              : input.tier === 'Titanium'
                ? 110
                : 80,
        cardNumber: `45328910${Math.floor(1000 + Math.random() * 8999)}${lastFour}`,
        expiry: '07/30',
        cvv: String(Math.floor(100 + Math.random() * 899)),
        pin: lastFour,
        holderName: state.userName.toUpperCase(),
        network: input.network,
        finish: input.finish,
        frozen: false,
        isPrimary: false,
        balance: 2500,
        spentThisMonth: 0,
        usedToday: 0,
        spendingLimit: input.spendingLimit,
        creditLimit: Math.max(input.spendingLimit * 2, 10000),
        utilizationAmount: 0,
        security: {
          contactless: true,
          onlinePayments: true,
          international: true,
          atmWithdrawals: true,
          biometric: true,
          instantAlerts: true,
        },
      };
      dispatch({ type: 'ADD_CARD', card: newCard });
      dispatch({
        type: 'PUSH_NOTIFICATION',
        title: `New ${newCard.name} issued`,
        description: `Virtual card ending •••• ${lastFour} is ready for Google Pay.`,
        notifType: 'card',
      });
      pushToast({
        title: `${newCard.name} created`,
        description: `Virtual card ending •••• ${lastFour} added to your wallet.`,
        variant: 'success',
      });
    },
    [state.userName, pushToast]
  );

  const orderPhysicalCard = useCallback(
    (input: OrderCardInput) => {
      const order: CardOrder = {
        id: `order-${Date.now()}`,
        ...input,
        orderedAt: '15 Jul 2026',
        status: 'Processing',
      };
      dispatch({ type: 'ORDER_CARD', order });
      dispatch({
        type: 'PUSH_NOTIFICATION',
        title: `Physical ${input.tier} card ordered`,
        description: `Shipping via ${input.deliverySpeed} to ${input.address}.`,
        notifType: 'card',
      });
      pushToast({
        title: 'Physical card order confirmed',
        description: `${input.material} card is entering production.`,
        variant: 'success',
      });
    },
    [pushToast]
  );

  const addTransaction = useCallback(
    (input: AddTransactionInput) => {
      const card = state.cards.find((c) => c.id === input.cardId);
      if (!card) return false;
      if (card.frozen && input.type === 'expense') {
        pushToast({
          title: 'Card is frozen',
          description: `Unfreeze ${card.name} before logging a charge.`,
          variant: 'destructive',
        });
        return false;
      }
      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        cardId: input.cardId,
        title: input.title,
        merchant: input.merchant,
        category: input.category,
        amount: input.amount,
        type: input.type,
        date: '15 Jul 2026',
        status: 'completed',
      };
      dispatch({ type: 'ADD_TRANSACTION', tx });
      pushToast({
        title: input.type === 'expense' ? 'Transaction recorded' : 'Deposit added',
        description: `${input.title} · $${input.amount.toFixed(2)}`,
        variant: 'success',
      });
      return true;
    },
    [state.cards, pushToast]
  );

  const executeTransfer = useCallback(
    (input: TransferInput) => {
      const card = state.cards.find((c) => c.id === input.fromCardId);
      if (!card) return false;
      if (card.frozen) {
        pushToast({
          title: 'Card is frozen',
          description: `Unfreeze ${card.name} to send transfers.`,
          variant: 'destructive',
        });
        return false;
      }
      if (input.amount <= 0 || input.amount > state.totalBalanceBase) {
        pushToast({
          title: 'Invalid transfer amount',
          description: 'Please enter an amount within your available balance.',
          variant: 'destructive',
        });
        return false;
      }
      const tx: Transaction = {
        id: `tr-${Date.now()}`,
        cardId: input.fromCardId,
        title: `Transfer to ${input.recipientName}`,
        merchant: input.recipientHandle || input.recipientName,
        category: 'Others',
        amount: input.amount,
        type: 'transfer',
        date: '15 Jul 2026',
        status: input.scheduled ? 'scheduled' : 'completed',
      };
      dispatch({
        type: 'EXECUTE_TRANSFER',
        cardId: input.fromCardId,
        amount: input.amount,
        tx,
      });
      dispatch({
        type: 'PUSH_NOTIFICATION',
        title: input.scheduled
          ? `Scheduled $${input.amount.toFixed(2)} to ${input.recipientName}`
          : `Sent $${input.amount.toFixed(2)} to ${input.recipientName}`,
        description: input.note || `Funded via ${card.name}`,
        notifType: 'transfer',
      });
      pushToast({
        title: input.scheduled ? 'Transfer scheduled' : 'Transfer sent',
        description: `$${input.amount.toFixed(2)} to ${input.recipientName}`,
        variant: 'success',
      });
      return true;
    },
    [state.cards, state.totalBalanceBase, pushToast]
  );

  const executeSwap = useCallback(
    (input: SwapInput) => {
      if (input.fromSymbol === input.toSymbol) return false;
      const fromCoin = state.coins.find((c) => c.symbol === input.fromSymbol);
      const toCoin = state.coins.find((c) => c.symbol === input.toSymbol);
      if (!fromCoin || !toCoin) return false;
      if (input.amount <= 0 || input.amount > fromCoin.balance) {
        pushToast({
          title: 'Insufficient coin balance',
          description: `Available ${fromCoin.symbol}: ${fromCoin.balance}`,
          variant: 'destructive',
        });
        return false;
      }
      const grossUsd = input.amount * fromCoin.usdPrice;
      const feeUsd = Number((grossUsd * 0.0025).toFixed(2));
      const netUsd = grossUsd - feeUsd;
      const toAmount = Number((netUsd / toCoin.usdPrice).toFixed(6));

      dispatch({
        type: 'EXECUTE_SWAP',
        fromSymbol: input.fromSymbol,
        toSymbol: input.toSymbol,
        fromAmount: input.amount,
        toAmount,
        feeUsd,
      });
      dispatch({
        type: 'PUSH_NOTIFICATION',
        title: `Swapped ${input.amount} ${input.fromSymbol} → ${toAmount} ${input.toSymbol}`,
        description: `0.25% network fee ($${feeUsd.toFixed(2)}) applied.`,
        notifType: 'transfer',
      });
      pushToast({
        title: 'Swap completed',
        description: `${input.amount} ${input.fromSymbol} → ${toAmount} ${input.toSymbol}`,
        variant: 'success',
      });
      return true;
    },
    [state.coins, pushToast]
  );

  const payBill = useCallback(
    (billId: string, cardId: string) => {
      const bill = state.bills.find((b) => b.id === billId);
      const card = state.cards.find((c) => c.id === cardId);
      if (!bill || !card || bill.paid) return false;
      if (card.frozen) {
        pushToast({
          title: 'Card is frozen',
          description: `Unfreeze ${card.name} or pick another card to pay ${bill.title}.`,
          variant: 'destructive',
        });
        return false;
      }
      const tx: Transaction = {
        id: `billtx-${Date.now()}`,
        cardId,
        title: bill.title,
        merchant: bill.provider,
        category: 'Others',
        amount: bill.amount,
        type: 'expense',
        date: '15 Jul 2026',
        status: 'completed',
      };
      dispatch({ type: 'PAY_BILL', billId, cardId, tx });
      dispatch({
        type: 'PUSH_NOTIFICATION',
        title: `Paid ${bill.title} ($${bill.amount.toFixed(2)})`,
        description: `Settled with ${card.name}.`,
        notifType: 'transfer',
      });
      pushToast({
        title: 'Bill paid',
        description: `${bill.title} · $${bill.amount.toFixed(2)}`,
        variant: 'success',
      });
      return true;
    },
    [state.bills, state.cards, pushToast]
  );

  const toggleBillAutopay = useCallback(
    (billId: string) => {
      dispatch({ type: 'TOGGLE_BILL_AUTOPAY', billId });
      pushToast({ title: 'Auto-pay preference updated' });
    },
    [pushToast]
  );

  const addBill = useCallback(
    (bill: Omit<BillItem, 'id' | 'paid'>) => {
      dispatch({
        type: 'ADD_BILL',
        bill: { ...bill, id: `bill-${Date.now()}`, paid: false },
      });
      pushToast({
        title: 'Bill added',
        description: `${bill.title} scheduled for ${bill.dueDate}.`,
        variant: 'success',
      });
    },
    [pushToast]
  );

  const toggleSubscription = useCallback(
    (subId: string) => {
      dispatch({ type: 'TOGGLE_SUBSCRIPTION', subId });
      pushToast({ title: 'Subscription status updated' });
    },
    [pushToast]
  );

  const deleteSubscription = useCallback(
    (subId: string) => {
      dispatch({ type: 'DELETE_SUBSCRIPTION', subId });
      pushToast({ title: 'Subscription removed' });
    },
    [pushToast]
  );

  const addSubscription = useCallback(
    (sub: Omit<Subscription, 'id'>) => {
      dispatch({
        type: 'ADD_SUBSCRIPTION',
        sub: { ...sub, id: `sub-${Date.now()}` },
      });
      pushToast({
        title: 'Subscription added',
        description: `${sub.name} ($${sub.amount.toFixed(2)}/mo)`,
        variant: 'success',
      });
    },
    [pushToast]
  );

  const upgradeToPro = useCallback(() => {
    dispatch({ type: 'UPGRADE_PRO' });
    dispatch({
      type: 'PUSH_NOTIFICATION',
      title: 'Welcome to Kaza Pro!',
      description: '2x cashback, unlimited virtual cards, and +500 bonus points unlocked.',
      notifType: 'reward',
    });
    pushToast({
      title: 'Kaza Pro Activated',
      description: '500 bonus points added to your rewards balance.',
      variant: 'success',
    });
  }, [pushToast]);

  const sendChatMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      dispatch({ type: 'ADD_CHAT_MESSAGE', sender: 'user', text: trimmed });

      const lower = trimmed.toLowerCase();
      let reply =
        `Got it! Your ${selectedCard.name} (•••• ${selectedCard.cardNumber.slice(-4)}) currently has $${selectedCard.spendingLimit.toLocaleString()} monthly limit and ${selectedCard.frozen ? 'is frozen' : 'is active'}.`;
      if (lower.includes('freeze')) {
        reply = `You can freeze or unfreeze ${selectedCard.name} anytime from the sidebar quick action "Freeze Card".`;
      } else if (lower.includes('limit') || lower.includes('utilization')) {
        const pct = Math.round(
          (selectedCard.utilizationAmount / Math.max(1, selectedCard.spendingLimit)) * 100
        );
        reply = `Your current credit utilization on ${selectedCard.name} is ${pct}% ($${selectedCard.utilizationAmount.toLocaleString()} of $${selectedCard.spendingLimit.toLocaleString()}). Click "Set Spending Limit" to adjust it instantly.`;
      } else if (lower.includes('pin')) {
        reply = `For security, view or update your 4-digit PIN inside "View Card PIN" in the left menu.`;
      } else if (lower.includes('fee') || lower.includes('pro')) {
        reply = `Kaza Pro unlocks 0% swap fees, 2x rewards, and custom brushed-metal recycled cards for $12/month.`;
      }

      window.setTimeout(() => {
        dispatch({ type: 'ADD_CHAT_MESSAGE', sender: 'concierge', text: reply });
      }, 420);
    },
    [selectedCard]
  );

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', id });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
    pushToast({ title: 'All notifications marked as read' });
  }, [pushToast]);

  const updateProfile = useCallback(
    (userName: string) => {
      const cleaned = userName.trim();
      if (!cleaned) return;
      dispatch({ type: 'UPDATE_PROFILE', userName: cleaned });
      pushToast({ title: 'Profile updated', variant: 'success' });
    },
    [pushToast]
  );

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET_DEMO' });
    pushToast({
      title: 'Demo data restored',
      description: 'All balances, cards, and widgets reset to default.',
    });
  }, [pushToast]);

  const value: FinanceContextValue = {
    state,
    selectedCard,
    activeNav,
    sidebarCollapsed,
    mobileSidebarOpen,
    activeModal,
    activeRightPanel,
    toasts,
    setActiveNav,
    toggleSidebar: () => setSidebarCollapsed((v) => !v),
    setMobileSidebarOpen,
    openModal: setActiveModal,
    openRightPanel: setActiveRightPanel,
    toggleRightPanel,
    dismissToast,
    pushToast,
    selectCard,
    setCardFinish,
    setPrimaryCard,
    toggleFreezeCard,
    updateSpendingLimit,
    updateCardPin,
    toggleSecuritySetting,
    addCard,
    orderPhysicalCard,
    addTransaction,
    executeTransfer,
    executeSwap,
    payBill,
    toggleBillAutopay,
    addBill,
    toggleSubscription,
    deleteSubscription,
    addSubscription,
    upgradeToPro,
    sendChatMessage,
    markNotificationRead,
    markAllNotificationsRead,
    updateProfile,
    resetDemoData,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return ctx;
}
