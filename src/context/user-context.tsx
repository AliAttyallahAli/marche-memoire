
"use client"

import * as React from 'react';
import type { User, Product, Transaction, Post } from '@/lib/data';
import { user as initialUser, allUsers as initialUsers, products as initialProducts, allTransactions as initialTransactions, posts as initialPosts } from '@/lib/data';

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
  
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    setUser(getInitialState('user', initialUser));
    setAllUsers(getInitialState('allUsers', initialUsers));
    setProducts(getInitialState('products', initialProducts));
    setTransactions(getInitialState('transactions', initialTransactions));
    setPosts(getInitialState('posts', initialPosts));
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
  }

  const addProduct = (newProduct: Product) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  }
  
  const addTransaction = (newTransaction: Transaction) => {
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  }
  
  const addPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }


  return (
    <AppContext.Provider value={{ user, setUser, addTokens, allUsers, addUser, products, addProduct, transactions, addTransaction, posts, addPost }}>
      {children}
    </AppContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a AppProvider');
  }
  return context;
};
