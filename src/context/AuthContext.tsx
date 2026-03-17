import React, { createContext, useContext, useEffect, useState } from 'react';

export interface LocalUser {
  name: string;
}

interface AuthContextType {
  user: LocalUser | null;
  loading: boolean;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for an existing user session on load
    const storedName = localStorage.getItem('fintrack_user');
    if (storedName) {
      setUser({ name: storedName });
    }
    setLoading(false);
  }, []);

  const login = (name: string) => {
    localStorage.setItem('fintrack_user', name);
    setUser({ name });
  };

  const logout = () => {
    localStorage.removeItem('fintrack_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
