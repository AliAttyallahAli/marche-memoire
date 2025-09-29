

"use client"

import * as React from 'react';
import type { User, Product, Transaction, Post, Notification, Comment } from '@/lib/data';
import { user as initialUser, allUsers as initialUsers, products as initialProducts, allTransactions as initialTransactions, posts as initialPosts, notifications as initialNotifications, allComments as initialComments } from '@/lib/data';

const TRANSACTION_FEE = 1; // 1 BZD fee per transaction

type AppContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  addTokens: (amount: number) => void;
  allUsers: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'authorId'>) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationsAsRead: () => void;
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'timestamp' | 'authorId'>) => void;
  adminWalletBalance: number;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') {
        return fallback;
    }
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            // Special handling for the 'user' key to allow for null
            if (key === 'user' && saved === 'null') {
                return null as T;
            }
            return JSON.parse(saved);
        } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
            return fallback;
        }
    }
    return fallback;
};


export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(() => getInitialState('user', initialUser));
  const [allUsers, setAllUsers] = React.useState<User[]>(() => getInitialState('allUsers', initialUsers));
  const [products, setProducts] = React.useState<Product[]>(() => getInitialState('products', initialProducts));
  const [transactions, setTransactions] = React.useState<Transaction[]>(() => getInitialState('transactions', initialTransactions));
  const [posts, setPosts] = React.useState<Post[]>(() => getInitialState('posts', initialPosts));
  const [notifications, setNotifications] = React.useState<Notification[]>(() => getInitialState('notifications', initialNotifications));
  const [comments, setComments] = React.useState<Comment[]>(() => getInitialState('comments', initialComments));
  const [adminWalletBalance, setAdminWalletBalance] = React.useState<number>(() => getInitialState('adminWalletBalance', 10000));
  
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    // This effect ensures that the state is re-hydrated on the client side
    // after the initial server render.
    setUser(getInitialState('user', null));
    setAllUsers(getInitialState('allUsers', initialUsers));
    setProducts(getInitialState('products', initialProducts));
    setTransactions(getInitialState('transactions', initialTransactions));
    setPosts(getInitialState('posts', initialPosts));
    setNotifications(getInitialState('notifications', initialNotifications));
    setComments(getInitialState('comments', initialComments));
    setAdminWalletBalance(getInitialState('adminWalletBalance', 10000));
    setIsInitialized(true);
  }, []);

  React.useEffect(() => {
    if (isInitialized) localStorage.setItem('user', user ? JSON.stringify(user) : 'null');
  }, [user, isInitialized]);
  
  React.useEffect(() => {
    if (isInitialized) localStorage.setItem('allUsers', JSON.stringify(allUsers));
  }, [allUsers, isInitialized]);
  
  React.useEffect(() => {
    if (isInitialized) localStorage.setItem('products', JSON.stringify(products));
  }, [products, isInitialized]);
  
  React.useEffect(() => {
    if (isInitialized) localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions, isInitialized]);

  React.useEffect(() => {
    if (isInitialized) localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts, isInitialized]);
  
  React.useEffect(() => {
    if (isInitialized) localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications, isInitialized]);

  React.useEffect(() => {
    if (isInitialized) localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments, isInitialized]);
  
  React.useEffect(() => {
    if (isInitialized) localStorage.setItem('adminWalletBalance', JSON.stringify(adminWalletBalance));
  }, [adminWalletBalance, isInitialized]);


  const addTokens = (amount: number) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        tokenBalance: prevUser.tokenBalance + amount,
      }
    });
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const userWithId = { ...newUser, id: `user${Date.now()}` };
    setAllUsers(prevUsers => [userWithId, ...prevUsers]);
    addNotification({
        title: "Nouvel Utilisateur Ajouté",
        description: `${newUser.name} a été ajouté à la plateforme.`
    });
  }

  const addProduct = (newProduct: Product) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    addNotification({
        title: "Nouveau Produit Listé",
        description: `${newProduct.name} est maintenant disponible sur la marketplace.`
    });
  }
  
  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    const isFeeApplicable = transactionData.type === 'Purchase' || transactionData.type === 'Withdrawal';
    const totalAmount = isFeeApplicable ? transactionData.amount - TRANSACTION_FEE : transactionData.amount;
    
    setUser(prevUser => {
        if (!prevUser) return null;
        return {
            ...prevUser,
            tokenBalance: prevUser.tokenBalance + totalAmount
        }
    });

    const newTransaction: Transaction = {
        ...transactionData,
        id: `txn${Date.now()}`,
        date: new Date().toISOString(),
        amount: totalAmount, // The amount for the user's transaction list
    };
    
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    
    if (isFeeApplicable) {
        setAdminWalletBalance(prev => prev + TRANSACTION_FEE);
        
        const feeTransaction: Transaction = {
            id: `fee${Date.now()}`,
            description: `Frais pour la transaction ${newTransaction.id}`,
            type: 'Deposit',
            status: 'Completed',
            date: new Date().toISOString(),
            amount: TRANSACTION_FEE,
        };
        // Maybe add to a separate admin transaction list in future?
        // For now, it just increases the admin wallet balance.
    }
  }
  
  const addPost = (postData: Omit<Post, 'id' | 'authorId'>) => {
    if (!user) return;
    const newPost: Post = {
      ...postData,
      id: `post${Date.now()}`,
      authorId: user.id,
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }

  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  };
  
  const addComment = (commentData: Omit<Comment, 'id' | 'timestamp' | 'authorId'>) => {
    if (!user) return;
    const newComment: Comment = {
      ...commentData,
      id: `comment${Date.now()}`,
      timestamp: new Date().toISOString(),
      authorId: user.id,
    };
    setComments(prev => [newComment, ...prev]);

    // Update the post with the new comment
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === newComment.postId
          ? {
              ...post,
              comments: post.comments + 1,
              commentsData: [newComment, ...(post.commentsData || [])],
            }
          : post
      )
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };


  return (
    <AppContext.Provider value={{ user, setUser, addTokens, allUsers, addUser, products, addProduct, transactions, addTransaction, posts, addPost, updatePost, notifications, addNotification, markNotificationsAsRead, comments, addComment, adminWalletBalance }}>
      {children}
    </AppContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a AppProvider');
  }
  // This is a hack to deal with hydration issues
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return { ...context, isMounted };
};
