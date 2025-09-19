
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
  const [user, setUser] = React.useState<User>(initialUser);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsInitialized(true);
  }, []);

  React.useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user, isInitialized]);

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
