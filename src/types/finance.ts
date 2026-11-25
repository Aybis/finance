export type NavSection =
  | 'home'
  | 'cards'
  | 'analytics'
  | 'transfers'
  | 'swap'
  | 'payments';

export type CardFinish =
  | 'champagne'
  | 'silver'
  | 'obsidian'
  | 'rose-pearl'
  | 'frost-sage';

export type CardTier = 'Platinum' | 'Silver' | 'Obsidian' | 'Titanium';

export type CardNetwork = 'VISA' | 'Mastercard';

export type SpendingCategoryName = 'Shopping' | 'Dining' | 'Travel' | 'Others';

export type CategoryTimeframe =
  | 'This Month'
  | 'Last Month'
  | 'This Quarter'
  | 'This Year';

export interface CardSecuritySettings {
  contactless: boolean;
  onlinePayments: boolean;
  international: boolean;
  atmWithdrawals: boolean;
  biometric: boolean;
  instantAlerts: boolean;
}

export interface FinanceCard {
  id: string;
  name: string;
  tier: CardTier;
  annualFee: number;
  cardNumber: string;
  expiry: string;
  cvv: string;
  pin: string;
  holderName: string;
  network: CardNetwork;
  finish: CardFinish;
  frozen: boolean;
  isPrimary: boolean;
  balance: number;
  spentThisMonth: number;
  usedToday: number;
  spendingLimit: number;
  creditLimit: number;
  utilizationAmount: number;
  security: CardSecuritySettings;
}

export interface Transaction {
  id: string;
  cardId: string;
  title: string;
  merchant: string;
  category: SpendingCategoryName;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  date: string;
  status: 'completed' | 'pending' | 'scheduled';
}

export interface Subscription {
  id: string;
  name: string;
  category: string;
  amount: number;
  billingCycle: 'Monthly' | 'Annual';
  nextBillingDate: string;
  active: boolean;
  cardId: string;
}

export type CoinSymbol = 'USD' | 'EUR' | 'BTC' | 'ETH' | 'SOL' | 'USDC';

export interface CoinAsset {
  symbol: CoinSymbol;
  name: string;
  balance: number;
  usdPrice: number;
  change24h: number;
}

export interface SwapRecord {
  id: string;
  fromSymbol: CoinSymbol;
  toSymbol: CoinSymbol;
  fromAmount: number;
  toAmount: number;
  feeUsd: number;
  timestamp: string;
}

export interface BillItem {
  id: string;
  title: string;
  provider: string;
  dueDate: string;
  amount: number;
  autoPay: boolean;
  paid: boolean;
  category: 'Utilities' | 'Housing' | 'Connectivity' | 'Cloud';
}

export interface ContactRecipient {
  id: string;
  name: string;
  handle: string;
  initials: string;
  bank: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'card' | 'transfer' | 'security' | 'reward';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  timestamp: string;
}

export interface CardOrder {
  id: string;
  tier: CardTier;
  finish: CardFinish;
  material: 'Recycled Ocean Polymer' | 'Brushed Recycled Aluminum';
  deliverySpeed: 'Standard (5-7 days)' | 'Express (48h)';
  address: string;
  orderedAt: string;
  status: 'Processing';
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export type RightPanelId = null | 'messages' | 'notifications' | 'profile';

export type ModalId =
  | null
  | 'add-card'
  | 'order-card'
  | 'spending-limit'
  | 'view-pin'
  | 'subscriptions'
  | 'security-settings'
  | 'pro-upgrade';
