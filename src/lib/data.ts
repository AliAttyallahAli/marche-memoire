export type User = {
  name: string;
  email: string;
  avatar: string;
  tokenBalance: number;
  walletKey: string;
  kycStatus: 'Verified' | 'Pending' | 'Rejected' | 'Not Submitted';
  role: 'user' | 'admin';
};

export const user: User = {
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  avatar: 'https://placehold.co/100x100.png',
  tokenBalance: 1250.75,
  walletKey: '0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b',
  kycStatus: 'Verified',
  role: 'admin',
};

export const allUsers: User[] = [
    user,
    { name: 'Maria Garcia', email: 'maria.g@example.com', avatar: 'https://placehold.co/100x100.png', tokenBalance: 850.00, walletKey: '0x...1234', kycStatus: 'Verified', role: 'user' },
    { name: 'James Smith', email: 'james.s@example.com', avatar: 'https://placehold.co/100x100.png', tokenBalance: 2300.50, walletKey: '0x...5678', kycStatus: 'Pending', role: 'user' },
    { name: 'Patricia Brown', email: 'patricia.b@example.com', avatar: 'https://placehold.co/100x100.png', tokenBalance: 450.25, walletKey: '0x...9101', kycStatus: 'Rejected', role: 'user' },
    { name: 'Robert Miller', email: 'robert.m@example.com', avatar: 'https://placehold.co/100x100.png', tokenBalance: 5000.00, walletKey: '0x...1121', kycStatus: 'Not Submitted', role: 'user' },
]

export type Transaction = {
  id: string;
  description: string;
  type: 'Purchase' | 'Deposit' | 'Withdrawal' | 'Referral Bonus';
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
  amount: number; // Positive for income, negative for expense
};

export const allTransactions: Transaction[] = [
  { id: 'txn1', description: 'Advanced Training Course', type: 'Purchase', status: 'Completed', date: '2024-07-15', amount: -100.00 },
  { id: 'txn2', description: 'Initial Deposit', type: 'Deposit', status: 'Completed', date: '2024-07-14', amount: 500.00 },
  { id: 'txn3', description: 'Referral Bonus from @mgarcia', type: 'Referral Bonus', status: 'Completed', date: '2024-07-12', amount: 50.00 },
  { id: 'txn4', description: 'Withdrawal to Bank **** 1234', type: 'Withdrawal', status: 'Pending', date: '2024-07-11', amount: -200.00 },
  { id: 'txn5', description: 'Consulting Service', type: 'Purchase', status: 'Completed', date: '2024-07-10', amount: -75.50 },
  { id: 'txn6', description: 'Monthly staking reward', type: 'Deposit', status: 'Completed', date: '2024-07-01', amount: 25.25 },
];


export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    seller: string;
    aiHint: string;
}

export const products: Product[] = [
    { id: 'prod1', name: 'Advanced Training Course', description: 'An in-depth course on community building and tokenomics.', price: 100.00, image: 'https://placehold.co/600x400.png', seller: '@james.s', aiHint: 'online course' },
    { id: 'prod2', name: '1-on-1 Consulting Session', description: 'A one-hour consulting session with a token expert.', price: 75.50, image: 'https://placehold.co/600x400.png', seller: '@alex.j', aiHint: 'consulting business' },
    { id: 'prod3', name: 'Exclusive Content Bundle', description: 'Get access to a bundle of exclusive articles, videos, and tutorials.', price: 45.00, image: 'https://placehold.co/600x400.png', seller: '@maria.g', aiHint: 'digital content' },
    { id: 'prod4', name: 'Community Governance E-book', description: 'A comprehensive guide to setting up and running a DAO.', price: 25.00, image: 'https://placehold.co/600x400.png', seller: '@patricia.b', aiHint: 'book cover' },
    { id: 'prod5', name: 'N+ Premium Membership', description: 'Unlock premium features, early access, and a special badge.', price: 15.00, image: 'https://placehold.co/600x400.png', seller: 'Official', aiHint: 'membership card' },
];
