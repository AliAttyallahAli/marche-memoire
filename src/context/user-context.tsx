

"use client"

import * as React from 'react';
import type { User, Product, Transaction, Post, Notification, Comment } from '@/lib/data';
import { user as initialUser, allUsers as initialUsers, products as initialProducts, allTransactions as initialTransactions, posts as initialPosts, notifications as initialNotifications, allComments as initialComments } from '@/lib/data';

type AppContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  addTokens: (amount: number) => void;
  allUsers: User[];
  addUser: (user: User) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationsAsRead: () => void;
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') {
        return fallback;
    }
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error(`Error parsing localStorage key "${key}":`, e);
            return fallback;
        }
    }
    return fallback;
};


export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [comments, setComments] = React.useState<Comment[]>([]);
  
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    setUser(getInitialState('user', initialUser));
    setAllUsers(getInitialState('allUsers', initialUsers));
    setProducts(getInitialState('products', initialProducts));
    setTransactions(getInitialState('transactions', initialTransactions));
    setPosts(getInitialState('posts', initialPosts));
    setNotifications(getInitialState('notifications', initialNotifications));
    setComments(getInitialState('comments', initialComments));
    setIsInitialized(true);
  }, []);

  React.useEffect(() => {
    if (isInitialized && user) localStorage.setItem('user', JSON.stringify(user));
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


  const addTokens = (amount: number) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        tokenBalance: prevUser.tokenBalance + amount,
      }
    });
  };

  const addUser = (newUser: User) => {
    setAllUsers(prevUsers => [newUser, ...prevUsers]);
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
  
  const addTransaction = (newTransaction: Transaction) => {
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    if(newTransaction.type === 'Withdrawal') {
        addNotification({
            title: "Transfert Envoyé",
            description: `Vous avez envoyé ${Math.abs(newTransaction.amount)} BZD.`
        });
    }
  }
  
  const addPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }

  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  };
  
  const addComment = (commentData: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment${Date.now()}`,
      timestamp: new Date().toISOString(),
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
    <AppContext.Provider value={{ user, setUser, addTokens, allUsers, addUser, products, addProduct, transactions, addTransaction, posts, addPost, updatePost, notifications, addNotification, markNotificationsAsRead, comments, addComment }}>
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

