'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Cookies from 'js-cookie'; 

import type {
  AuthData,
  LoginPayload,
} from '@/types/auth';

import {
  loginService,
  logoutService,
} from '@/lib/services/auth.service';

interface AuthContextProps {
  user: AuthData['user'] | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthData['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    const storedUser = Cookies.get('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  async function login(payload: LoginPayload) {
    const response = await loginService(payload);

    setToken(response.data.token);
    setUser(response.data.user);

    Cookies.set('token', response.data.token, { expires: 7 }); 
    Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
  }

  async function logout() {
    if (token) {
      try {
        await logoutService(token);
      } catch {}
    }

    Cookies.remove('token');
    Cookies.remove('user');

    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [user, token, loading] 
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}