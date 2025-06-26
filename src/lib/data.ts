export type User = {
  name: string;
  email: string;
  avatar: string;
  tokenBalance: number;
  totalReferrals: number;
  referralCode: string;
  walletKey: string;
  kycStatus: 'Verified' | 'Pending' | 'Not Submitted' | 'Rejected';
  transactions: Transaction[];
};

export type Transaction = {
  id: string;
  date: string;
  type: 'Purchase' | 'Referral Bonus' | 'Withdrawal' | 'Deposit';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  seller: string;
  aiHint: string;
};

export const user: User = {
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  avatar: 'https://placehold.co/100x100.png',
  tokenBalance: 12580.75,
  totalReferrals: 23,
  referralCode: 'ALEXJ2024',
  walletKey: '0x1A3B5C7D9E1F3G5H7I9J1K3L5M7N9O1P3Q5',
  kycStatus: 'Verified',
  transactions: [
    { id: 'TXN789012', date: '2024-07-29', type: 'Referral Bonus', amount: 50.00, status: 'Completed', description: 'Bonus from user_jane' },
    { id: 'TXN456789', date: '2024-07-28', type: 'Purchase', amount: -200.00, status: 'Completed', description: 'Product Alpha Pack' },
    { id: 'TXN123456', date: '2024-07-25', type: 'Deposit', amount: 1000.00, status: 'Completed', description: 'Initial deposit' },
    { id: 'TXN123457', date: '2024-07-24', type: 'Referral Bonus', amount: 50.00, status: 'Completed', description: 'Bonus from user_john' },
    { id: 'TXN123458', date: '2024-07-22', type: 'Withdrawal', amount: -500.00, status: 'Completed', description: 'Withdrawal to bank account' },
    { id: 'TXN123459', date: '2024-07-21', type: 'Purchase', amount: -150.00, status: 'Completed', description: 'Product Beta Subscription' },
    { id: 'TXN123460', date: '2024-07-20', type: 'Referral Bonus', amount: 25.00, status: 'Completed', description: 'Bonus from user_doe' },
  ],
};

export const allTransactions: Transaction[] = [
    { id: 'TXN789012', date: '2024-07-29', type: 'Referral Bonus', amount: 50.00, status: 'Completed', description: 'Bonus from user_jane' },
    { id: 'TXN456789', date: '2024-07-28', type: 'Purchase', amount: -200.00, status: 'Completed', description: 'Product Alpha Pack' },
    { id: 'TXN123456', date: '2024-07-25', type: 'Deposit', amount: 1000.00, status: 'Completed', description: 'Initial deposit' },
    { id: 'TXN123457', date: '2024-07-24', type: 'Referral Bonus', amount: 50.00, status: 'Completed', description: 'Bonus from user_john' },
    { id: 'TXN123458', date: '2024-07-22', type: 'Withdrawal', amount: -500.00, status: 'Pending', description: 'Withdrawal to bank account' },
    { id: 'TXN123459', date: '2024-07-21', type: 'Purchase', amount: -150.00, status: 'Completed', description: 'Product Beta Subscription' },
    { id: 'TXN123460', date: '2024-07-20', type: 'Referral Bonus', amount: 25.00, status: 'Completed', description: 'Bonus from user_doe' },
    { id: 'TXN123461', date: '2024-07-19', type: 'Deposit', amount: 2000.00, status: 'Completed', description: 'Monthly deposit' },
    { id: 'TXN123462', date: '2024-07-18', type: 'Purchase', amount: -300.00, status: 'Failed', description: 'Product Gamma Pack' },
    { id: 'TXN123463', date: '2024-07-15', type: 'Referral Bonus', amount: 100.00, status: 'Completed', description: 'Bonus from user_emily' },
];

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Token Booster Pack',
    description: 'Get a head start with this exclusive token pack. Includes 500 bonus tokens.',
    price: 50,
    image: 'https://placehold.co/600x400.png',
    seller: 'TokenFlow Official',
    aiHint: 'token pack'
  },
  {
    id: 'prod_2',
    name: 'Advanced Analytics Course',
    description: 'Unlock the secrets of MLM analytics and maximize your downline earnings.',
    price: 120,
    image: 'https://placehold.co/600x400.png',
    seller: 'Alex Johnson',
    aiHint: 'online course'
  },
  {
    id: 'prod_3',
    name: '1-on-1 Coaching Session',
    description: 'Personalized coaching session with a top earner to boost your strategy.',
    price: 250,
    image: 'https://placehold.co/600x400.png',
    seller: 'Jane Doe',
    aiHint: 'coaching session'
  },
  {
    id: 'prod_4',
    name: 'Marketing Material Kit',
    description: 'Professionally designed marketing materials to grow your network.',
    price: 75,
    image: 'https://placehold.co/600x400.png',
    seller: 'TokenFlow Official',
    aiHint: 'marketing kit'
  },
];
