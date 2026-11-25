import type {
  BillItem,
  CardOrder,
  CategoryTimeframe,
  ChatMessage,
  CoinAsset,
  ContactRecipient,
  FinanceCard,
  NotificationItem,
  SpendingCategoryName,
  Subscription,
  SwapRecord,
  Transaction,
} from '@/types/finance';

export interface FinanceState {
  userName: string;
  userRole: string;
  dateLabel: string;
  isPro: boolean;
  totalBalanceBase: number;
  cardSpendingBase: number;
  rewardsPoints: number;
  cashbackEarned: number;
  cards: FinanceCard[];
  selectedCardId: string;
  transactions: Transaction[];
  subscriptions: Subscription[];
  coins: CoinAsset[];
  swaps: SwapRecord[];
  bills: BillItem[];
  contacts: ContactRecipient[];
  notifications: NotificationItem[];
  messages: ChatMessage[];
  cardOrders: CardOrder[];
}

export const INITIAL_CARDS: FinanceCard[] = [
  {
    id: 'card-platinum',
    name: 'Platinum card',
    tier: 'Platinum',
    annualFee: 150,
    cardNumber: '4532891044216050',
    expiry: '08/29',
    cvv: '492',
    pin: '6050',
    holderName: 'ALVIE',
    network: 'VISA',
    finish: 'champagne',
    frozen: false,
    isPrimary: true,
    balance: 5465.0,
    spentThisMonth: 5150.99,
    usedToday: 5150.99,
    spendingLimit: 4445,
    creditLimit: 12000,
    utilizationAmount: 3200,
    security: {
      contactless: true,
      onlinePayments: true,
      international: true,
      atmWithdrawals: false,
      biometric: true,
      instantAlerts: true,
    },
  },
  {
    id: 'card-silver',
    name: 'Silver Card',
    tier: 'Silver',
    annualFee: 80,
    cardNumber: '5412758890128842',
    expiry: '11/28',
    cvv: '714',
    pin: '8842',
    holderName: 'ALVIE',
    network: 'Mastercard',
    finish: 'silver',
    frozen: false,
    isPrimary: false,
    balance: 2890.0,
    spentThisMonth: 1240.5,
    usedToday: 1240.5,
    spendingLimit: 4000,
    creditLimit: 8000,
    utilizationAmount: 1450,
    security: {
      contactless: true,
      onlinePayments: true,
      international: false,
      atmWithdrawals: true,
      biometric: true,
      instantAlerts: true,
    },
  },
  {
    id: 'card-obsidian',
    name: 'Obsidian Card',
    tier: 'Obsidian',
    annualFee: 240,
    cardNumber: '4916330187443109',
    expiry: '04/30',
    cvv: '835',
    pin: '3109',
    holderName: 'ALVIE',
    network: 'VISA',
    finish: 'obsidian',
    frozen: false,
    isPrimary: false,
    balance: 8120.0,
    spentThisMonth: 2003.51,
    usedToday: 2003.51,
    spendingLimit: 6000,
    creditLimit: 20000,
    utilizationAmount: 2100,
    security: {
      contactless: true,
      onlinePayments: true,
      international: true,
      atmWithdrawals: true,
      biometric: true,
      instantAlerts: true,
    },
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    cardId: 'card-platinum',
    title: 'Aesop Flagship Store',
    merchant: 'Aesop',
    category: 'Shopping',
    amount: 420.0,
    type: 'expense',
    date: '15 Jul 2026',
    status: 'completed',
  },
  {
    id: 'tx-2',
    cardId: 'card-platinum',
    title: 'Delta Air Lines JFK → LHR',
    merchant: 'Delta Air Lines',
    category: 'Travel',
    amount: 520.0,
    type: 'expense',
    date: '14 Jul 2026',
    status: 'completed',
  },
  {
    id: 'tx-3',
    cardId: 'card-platinum',
    title: 'Osteria Mozza Dinner',
    merchant: 'Osteria Mozza',
    category: 'Dining',
    amount: 340.0,
    type: 'expense',
    date: '13 Jul 2026',
    status: 'completed',
  },
  {
    id: 'tx-4',
    cardId: 'card-platinum',
    title: 'Apple Store Fifth Ave',
    merchant: 'Apple',
    category: 'Shopping',
    amount: 820.0,
    type: 'expense',
    date: '11 Jul 2026',
    status: 'completed',
  },
  {
    id: 'tx-5',
    cardId: 'card-silver',
    title: 'Studio Equipment Lease',
    merchant: 'B&H Photo',
    category: 'Others',
    amount: 180.0,
    type: 'expense',
    date: '10 Jul 2026',
    status: 'completed',
  },
  {
    id: 'tx-6',
    cardId: 'card-platinum',
    title: 'Design Retainer Deposit',
    merchant: 'Atelier North',
    category: 'Others',
    amount: 2450.0,
    type: 'income',
    date: '09 Jul 2026',
    status: 'completed',
  },
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Figma Pro',
    category: 'Design Software',
    amount: 15.0,
    billingCycle: 'Monthly',
    nextBillingDate: '01 Aug 2026',
    active: true,
    cardId: 'card-platinum',
  },
  {
    id: 'sub-2',
    name: 'Spotify Duo',
    category: 'Music & Media',
    amount: 14.99,
    billingCycle: 'Monthly',
    nextBillingDate: '04 Aug 2026',
    active: true,
    cardId: 'card-platinum',
  },
  {
    id: 'sub-3',
    name: 'Netflix 4K Ultra',
    category: 'Streaming',
    amount: 22.99,
    billingCycle: 'Monthly',
    nextBillingDate: '12 Aug 2026',
    active: true,
    cardId: 'card-silver',
  },
  {
    id: 'sub-4',
    name: 'iCloud+ 2TB',
    category: 'Cloud Storage',
    amount: 9.99,
    billingCycle: 'Monthly',
    nextBillingDate: '18 Jul 2026',
    active: true,
    cardId: 'card-platinum',
  },
  {
    id: 'sub-5',
    name: 'Equinox All-Access',
    category: 'Wellness',
    amount: 39.99,
    billingCycle: 'Monthly',
    nextBillingDate: '22 Jul 2026',
    active: false,
    cardId: 'card-obsidian',
  },
];

export const INITIAL_COINS: CoinAsset[] = [
  { symbol: 'USD', name: 'US Dollar', balance: 5465.0, usdPrice: 1, change24h: 0.0 },
  { symbol: 'EUR', name: 'Euro', balance: 1840.0, usdPrice: 1.09, change24h: 0.24 },
  { symbol: 'USDC', name: 'USD Coin', balance: 2150.0, usdPrice: 1.0, change24h: 0.01 },
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.145, usdPrice: 94200, change24h: 2.84 },
  { symbol: 'ETH', name: 'Ethereum', balance: 1.85, usdPrice: 3420, change24h: 1.92 },
  { symbol: 'SOL', name: 'Solana', balance: 18.4, usdPrice: 182.5, change24h: -1.15 },
];

export const INITIAL_SWAPS: SwapRecord[] = [
  {
    id: 'sw-1',
    fromSymbol: 'USD',
    toSymbol: 'BTC',
    fromAmount: 1200,
    toAmount: 0.0127,
    feeUsd: 3.0,
    timestamp: '14 Jul 2026 · 14:22',
  },
  {
    id: 'sw-2',
    fromSymbol: 'USDC',
    toSymbol: 'ETH',
    fromAmount: 650,
    toAmount: 0.1895,
    feeUsd: 1.62,
    timestamp: '10 Jul 2026 · 09:40',
  },
];

export const INITIAL_BILLS: BillItem[] = [
  {
    id: 'bill-1',
    title: 'ConEd Clean Energy',
    provider: 'Consolidated Edison',
    dueDate: '19 Jul 2026',
    amount: 148.4,
    autoPay: true,
    paid: false,
    category: 'Utilities',
  },
  {
    id: 'bill-2',
    title: 'Fiber 2Gbps Internet',
    provider: 'Sonic Fiber',
    dueDate: '21 Jul 2026',
    amount: 79.0,
    autoPay: true,
    paid: false,
    category: 'Connectivity',
  },
  {
    id: 'bill-3',
    title: 'SoHo Studio Lease',
    provider: 'Mercer Holdings LLC',
    dueDate: '01 Aug 2026',
    amount: 1850.0,
    autoPay: false,
    paid: false,
    category: 'Housing',
  },
  {
    id: 'bill-4',
    title: 'Cloud Infrastructure',
    provider: 'Vercel & AWS',
    dueDate: '25 Jul 2026',
    amount: 94.5,
    autoPay: false,
    paid: false,
    category: 'Cloud',
  },
  {
    id: 'bill-5',
    title: 'Mobile Wireless Plan',
    provider: 'Verizon Business',
    dueDate: '12 Jul 2026',
    amount: 65.0,
    autoPay: true,
    paid: true,
    category: 'Connectivity',
  },
];

export const INITIAL_CONTACTS: ContactRecipient[] = [
  { id: 'c-1', name: 'Maya Lin', handle: '@mayalin', initials: 'ML', bank: 'Kaza Instant' },
  { id: 'c-2', name: 'Julian Vance', handle: '@jvance', initials: 'JV', bank: 'Mercury' },
  { id: 'c-3', name: 'Sora Takahashi', handle: '@sora.t', initials: 'ST', bank: 'Kaza Instant' },
  { id: 'c-4', name: 'Elena Rostova', handle: '@elena', initials: 'ER', bank: 'Chase Private' },
  { id: 'c-5', name: 'Marcus Reed', handle: '@mreed', initials: 'MR', bank: 'Wise USD' },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Platinum card utilization at 72%',
    description: 'Used $3,200 of your $4,445 spending limit for this cycle.',
    timestamp: '12m ago',
    read: false,
    type: 'card',
  },
  {
    id: 'n-2',
    title: 'Cashback milestone unlocked',
    description: 'You earned $24.50 cashback from Aesop & Delta Air Lines.',
    timestamp: '2h ago',
    read: false,
    type: 'reward',
  },
  {
    id: 'n-3',
    title: 'Google Pay token active',
    description: 'Platinum •••• 6050 is ready for contactless tap-to-pay.',
    timestamp: 'Yesterday',
    read: true,
    type: 'security',
  },
  {
    id: 'n-4',
    title: 'Deposit received: +$2,450.00',
    description: 'Atelier North retainer settled into your primary balance.',
    timestamp: '09 Jul',
    read: true,
    type: 'transfer',
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'concierge',
    text: 'Good morning, Alvie! Your Kaza Platinum card (•••• 6050) is active with 0% foreign transaction fees today.',
    timestamp: '09:15 AM',
  },
  {
    id: 'm-2',
    sender: 'concierge',
    text: 'Ask me anything about spending limits, card freeze, recycled metal replacements, or rewards.',
    timestamp: '09:16 AM',
  },
];

export const CATEGORY_PRESETS: Record<
  CategoryTimeframe,
  Record<SpendingCategoryName, number>
> = {
  'This Month': {
    Shopping: 1240,
    Dining: 340,
    Travel: 520,
    Others: 180,
  },
  'Last Month': {
    Shopping: 980,
    Dining: 460,
    Travel: 740,
    Others: 220,
  },
  'This Quarter': {
    Shopping: 3420,
    Dining: 1180,
    Travel: 1940,
    Others: 610,
  },
  'This Year': {
    Shopping: 12840,
    Dining: 4290,
    Travel: 6720,
    Others: 1950,
  },
};

export const MONTHLY_ACTIVITY_SERIES = [
  { month: 'Jan', amount: 6420, heightPct: 48 },
  { month: 'Feb', amount: 8140, heightPct: 62 },
  { month: 'Mar', amount: 9650, heightPct: 74 },
  { month: 'Apr', amount: 12058, heightPct: 92 },
  { month: 'May', amount: 9120, heightPct: 70 },
  { month: 'Jun', amount: 7480, heightPct: 56 },
  { month: 'Jul', amount: 6890, heightPct: 50 },
];

export const MONTHLY_SPENDING_BARS = [
  24, 30, 18, 22, 34, 28, 19, 25, 42, 36, 30, 48, 52, 64, 58, 44, 72, 86, 68, 76, 94, 82, 62, 54,
  78, 90, 64, 46, 38, 30,
];

export const CARD_USAGE_COLUMNS = [
  { label: '09h', pct: 28, amount: 420 },
  { label: '11h', pct: 44, amount: 810 },
  { label: '13h', pct: 36, amount: 640 },
  { label: '15h', pct: 62, amount: 1240 },
  { label: '17h', pct: 84, amount: 2040.99, active: true },
  { label: '19h', pct: 52, amount: 980 },
];

export const INITIAL_FINANCE_STATE: FinanceState = {
  userName: 'Alvie',
  userRole: 'Platinum Member',
  dateLabel: 'Friday, 15 July 2026',
  isPro: false,
  totalBalanceBase: 5465.0,
  cardSpendingBase: 8395.0,
  rewardsPoints: 2450,
  cashbackEarned: 425.0,
  cards: INITIAL_CARDS,
  selectedCardId: 'card-platinum',
  transactions: INITIAL_TRANSACTIONS,
  subscriptions: INITIAL_SUBSCRIPTIONS,
  coins: INITIAL_COINS,
  swaps: INITIAL_SWAPS,
  bills: INITIAL_BILLS,
  contacts: INITIAL_CONTACTS,
  notifications: INITIAL_NOTIFICATIONS,
  messages: INITIAL_MESSAGES,
  cardOrders: [],
};
