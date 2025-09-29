

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tokenBalance: number;
  walletKey: string;
  kycStatus: 'Verified' | 'Pending' | 'Rejected' | 'Not Submitted';
  role: 'user' | 'admin' | 'vendor';
  status: 'online' | 'offline';
  stories: Story[];
  cardNumber: string;
};

export type Story = {
    id: string;
    authorName: string;
    authorAvatar: string;
    imageUrl: string;
    timestamp: string;
}

export const stories: Story[] = [
    { id: 'story1', authorName: 'Maria Garcia', authorAvatar: 'https://placehold.co/100x100.png', imageUrl: 'https://placehold.co/300x500.png', timestamp: '2024-07-18T10:00:00Z' },
    { id: 'story2', authorName: 'James Smith', authorAvatar: 'https://placehold.co/100x100.png', imageUrl: 'https://placehold.co/300x500.png', timestamp: '2024-07-18T09:00:00Z' },
    { id: 'story3', authorName: 'Patricia Brown', authorAvatar: 'https://placehold.co/100x100.png', imageUrl: 'https://placehold.co/300x500.png', timestamp: '2024-07-18T08:00:00Z' },
     { id: 'story4', authorName: 'Robert Miller', authorAvatar: 'https://placehold.co/100x100.png', imageUrl: 'https://placehold.co/300x500.png', timestamp: '2024-07-18T07:00:00Z' },
];


export const user: User = {
  id: 'user0',
  name: 'Ali Atty',
  email: 'aliattyallahali@gmail.com',
  avatar: 'https://placehold.co/100x100.png',
  tokenBalance: 1250.75,
  walletKey: '0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b',
  kycStatus: 'Verified',
  role: 'admin',
  status: 'online',
  stories: [],
  cardNumber: '4022123456789012',
};

export const allUsers: User[] = [
    { ...user },
    { id: 'user1', name: 'Maria Garcia', email: 'maria.g@example.com', avatar: 'https://placehold.co/100x100.png', tokenBalance: 850.00, walletKey: '0x...1234', kycStatus: 'Verified', role: 'user', status: 'online', stories: [stories[0]], cardNumber: '4022234567890123' },
    { id: 'user2', name: 'James Smith', email: 'james.s@example.com', avatar: 'https://placehold.co/100x100.png', tokenBalance: 2300.50, walletKey: '0x...5678', kycStatus: 'Pending', role: 'vendor', status: 'offline', stories: [stories[1]], cardNumber: '4022345678901234' },
    { id: 'user3', name: 'Patricia Brown', email: 'patricia.b@example.com', avatar: 'https://placehold.co/100x100.png', tokenBalance: 450.25, walletKey: '0x...9101', kycStatus: 'Rejected', role: 'user', status: 'offline', stories: [stories[2]], cardNumber: '4022456789012345' },
    { id: 'user4', name: 'Robert Miller', email: 'robert.m@example.com', avatar: 'https://placehold.co/100x100.png', tokenBalance: 5000.00, walletKey: '0x...1121', kycStatus: 'Not Submitted', role: 'user', status: 'online', stories: [stories[3]], cardNumber: '4022567890123456' },
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
    { id: 'prod5', name: 'ZOUDOU Premium Membership', description: 'Unlock premium features, early access, and a special badge.', price: 15.00, image: 'https://placehold.co/600x400.png', seller: 'Official', aiHint: 'membership card' },
];

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorStatus: 'online' | 'offline';
  authorRole: 'user' | 'admin' | 'vendor';
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  imageUrl?: string;
  videoUrl?: string;
  sentiment?: string;
  commentsData: Comment[];
};

export const allComments: Comment[] = [
    { id: 'comment1', postId: 'post1', authorId: 'user2', authorName: 'James Smith', authorAvatar: 'https://placehold.co/100x100.png', content: 'Awesome, can\'t wait to check it out!', timestamp: '2024-07-18T10:05:00Z' },
    { id: 'comment2', postId: 'post2', authorId: 'user1', authorName: 'Maria Garcia', authorAvatar: 'https://placehold.co/100x100.png', content: 'I\'d love to see a feature for creating polls.', timestamp: '2024-07-17T15:35:00Z' },
]

export const posts: Post[] = [
  {
    id: 'post1',
    authorId: 'user1',
    authorName: 'Maria Garcia',
    authorHandle: 'maria.g',
    authorAvatar: 'https://placehold.co/100x100.png',
    authorStatus: 'online',
    authorRole: 'user',
    content: 'Just launched a new bundle of exclusive content on the marketplace! Check it out and let me know what you think. #community #tokens',
    timestamp: '2024-07-18T10:00:00Z',
    likes: 42,
    comments: 1,
    shares: 5,
    imageUrl: 'https://placehold.co/600x400.png',
    sentiment: '🎉',
    commentsData: [allComments[0]],
  },
  {
    id: 'post2',
    authorId: 'user2',
    authorName: 'James Smith',
    authorHandle: 'james.s',
    authorAvatar: 'https://placehold.co/100x100.png',
    authorStatus: 'offline',
    authorRole: 'vendor',
    content: 'Excited to see the community growing so quickly! The new P2P transfer feature is a game-changer. What other features would you all like to see?',
    timestamp: '2024-07-17T15:30:00Z',
    likes: 128,
    comments: 1,
    shares: 12,
    sentiment: '🚀',
    commentsData: [allComments[1]],
  },
  {
    id: 'post3',
    authorId: 'user0',
    authorName: 'Ali Atty',
    authorHandle: 'ali.a',
    authorAvatar: 'https://placehold.co/100x100.png',
    authorStatus: 'online',
    authorRole: 'admin',
    content: 'Daily mining session done! ✨ Slowly but surely stacking up those BZD tokens. Consistency is key!',
    timestamp: '2024-07-16T08:00:00Z',
    likes: 77,
    comments: 0,
    shares: 3,
    commentsData: [],
    sentiment: '✨',
  },
];

export type Conversation = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  status: 'online' | 'offline';
  hasStory: boolean;
  role: 'user' | 'admin' | 'vendor';
};

export type Message = {
  id: string;
  conversationId: string;
  sender: 'user' | 'contact';
  type: 'text' | 'audio';
  content: string;
  audioUrl?: string;
  timestamp: string;
};

export const conversations: Conversation[] = [
  { id: 'convo1', name: 'Maria Garcia', avatar: 'https://placehold.co/100x100.png', lastMessage: 'Super ! Merci pour l\'info.', lastMessageTimestamp: '10:42', unreadCount: 0, status: 'online', hasStory: true, role: 'user' },
  { id: 'convo2', name: 'James Smith', avatar: 'https://placehold.co/100x100.png', lastMessage: 'Oui, je serai disponible demain.', lastMessageTimestamp: 'Hier', unreadCount: 2, status: 'offline', hasStory: true, role: 'vendor' },
  { id: 'convo3', name: 'Support ZOUDOU', avatar: 'https://placehold.co/100x100.png', lastMessage: 'Votre ticket a été mis à jour.', lastMessageTimestamp: 'Hier', unreadCount: 0, status: 'online', hasStory: false, role: 'admin' },
];

export const messages: Message[] = [
  { id: 'msg1', conversationId: 'convo1', sender: 'contact', type: 'text', content: 'Hey, tu as vu la nouvelle fonctionnalité sur la marketplace ?', timestamp: '10:40' },
  { id: 'msg2', conversationId: 'convo1', sender: 'user', type: 'text', content: 'Non, pas encore. C\'est quoi ?', timestamp: '10:41' },
  { id: 'msg3', conversationId: 'convo1', sender: 'contact', type: 'text', content: 'On peut maintenant lister des services en plus des produits.', timestamp: '10:41' },
  { id: 'msg4', conversationId: 'convo1', sender: 'user', type: 'text', content: 'Super ! Merci pour l\'info.', timestamp: '10:42' },
  { id: 'msg5', conversationId: 'convo2', sender: 'user', type: 'text', content: 'Salut James, tu es dispo pour un appel rapide ?', timestamp: '15:30' },
  { id: 'msg6', conversationId: 'convo2', sender: 'contact', type: 'text', content: 'Salut Alex, je suis en réunion pour le moment. Demain matin ça te va ?', timestamp: '15:32' },
  { id: 'msg7', conversationId: 'convo2', sender: 'user', type: 'text', content: 'Oui, je serai disponible demain.', timestamp: '15:35' },
];

export type Operator = {
  name: string;
  logo: string;
}

export type CountryOperators = {
  country: string;
  flag: string;
  operators: string[];
};

export const africanMobileOperators: CountryOperators[] = [
    { country: "Bénin", flag: "🇧🇯", operators: ["MTN", "Moov"] },
    { country: "Burkina Faso", flag: "🇧🇫", operators: ["Orange", "Moov", "Telecel"] },
    { country: "Cameroun", flag: "🇨🇲", operators: ["MTN", "Orange", "Nexttel"] },
    { country: "Côte d'Ivoire", flag: "🇨🇮", operators: ["Orange", "MTN", "Moov"] },
    { country: "Gabon", flag: "🇬🇦", operators: ["Airtel", "Moov"] },
    { country: "Guinée", flag: "🇬🇳", operators: ["Orange", "MTN", "Cellcom"] },
    { country: "Mali", flag: "🇲🇱", operators: ["Orange", "Moov", "Telecel"] },
    { country: "Niger", flag: "🇳🇪", operators: ["Airtel", "Moov", "Orange", "Telecel"] },
    { country: "Nigeria", flag: "🇳🇬", operators: ["MTN", "Airtel", "Glo", "9mobile"] },
    { country: "République Centrafricaine", flag: "🇨🇫", operators: ["Orange", "Moov"] },
    { country: "République Démocratique du Congo", flag: "🇨🇩", operators: ["Vodacom", "Airtel", "Orange", "Africell"] },
    { country: "République du Congo", flag: "🇨🇬", operators: ["Airtel", "MTN"] },
    { country: "Sénégal", flag: "🇸🇳", operators: ["Orange", "Free", "Expresso"] },
    { country: "Tchad", flag: "🇹🇩", operators: ["Airtel", "Moov"] },
    { country: "Togo", flag: "🇹🇬", operators: ["Moov", "Togo Cellulaire"] },
];

export type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
};

export const notifications: Notification[] = [
  {
    id: 'notif1',
    title: 'Nouveau J\'aime',
    description: 'James Smith a aimé votre publication.',
    timestamp: '2024-07-19T10:05:00Z',
    read: false,
  },
  {
    id: 'notif2',
    title: 'Transfert Réussi',
    description: 'Vous avez envoyé 75.50 BZD à @alex.j.',
    timestamp: '2024-07-19T09:00:00Z',
    read: false,
  },
  {
    id: 'notif3',
    title: 'Vérification KYC',
    description: 'Vos documents KYC ont été soumis avec succès.',
    timestamp: '2024-07-19T07:00:00Z',
    read: true,
  },
  {
    id: 'notif4',
    title: 'Nouveau Message',
    description: 'Maria Garcia vous a envoyé un message.',
    timestamp: '2024-07-18T15:00:00Z',
    read: true,
  },
];
