import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  points: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  sendOtp: (phone: string) => Promise<{ code: string; isNewUser: boolean }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; isNewUser: boolean }>;
  loginWithPassword: (phone: string, password: string) => Promise<boolean>;
  setPassword: (phone: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cs-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('cs-user');
      }
    }
    setIsLoading(false);
  }, []);

  const sendOtp = async (phone: string): Promise<{ code: string; isNewUser: boolean }> => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return { code: data.code, isNewUser: data.isNewUser };
    } catch (error) {
      console.error('OTP Send error:', error);
      throw error;
    }
  };

  const verifyOtp = async (phone: string, otp: string): Promise<{ success: boolean; isNewUser: boolean }> => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await response.json();
      if (data.success) {
        if (!data.isNewUser) {
          setUser(data.user);
          localStorage.setItem('cs-user', JSON.stringify(data.user));
        }
        return { success: true, isNewUser: data.isNewUser };
      }
      return { success: false, isNewUser: false };
    } catch (error) {
      console.error('OTP Verify error:', error);
      return { success: false, isNewUser: false };
    }
  };

  const loginWithPassword = async (phone: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('cs-user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const setPassword = async (phone: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, name }),
      });
      const data = await response.json();
      if (data.success) {
        const newUser = { phone, name, role: 'user' as const, points: 0, id: phone };
        setUser(newUser);
        localStorage.setItem('cs-user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Set password error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cs-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        sendOtp,
        verifyOtp,
        loginWithPassword,
        setPassword,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
