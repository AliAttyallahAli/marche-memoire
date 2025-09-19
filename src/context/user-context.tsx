"use client"

import * as React from 'react';
import type { User } from '@/lib/data';
import { user as initialUser } from '@/lib/data';

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  addTokens: (amount: number) => void;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    }
    return initialUser;
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const addTokens = (amount: number) => {
    setUser((prevUser) => ({
      ...prevUser,
      tokenBalance: prevUser.tokenBalance + amount,
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, addTokens }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
