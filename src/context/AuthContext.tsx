import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi, logoutApi, type UserDTO } from '../api/auth';

interface AuthContextType {
  user: UserDTO | null;
  token: string | null;
  role: 'GUEST' | 'STAFF' | 'ADMIN';
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserDTO>;
  register: (name: string, email: string, password: string, role?: string) => Promise<UserDTO>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('staysphere_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const role = user?.role || 'GUEST';

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('staysphere_token');
      if (storedToken) {
        try {
          const userData = await getMeApi();
          setUser(userData);
          setToken(storedToken);
        } catch (err) {
          localStorage.removeItem('staysphere_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<UserDTO> => {
    const res = await loginApi(email, password);
    localStorage.setItem('staysphere_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    setShowAuthModal(false);
    return res.user;
  };

  const register = async (name: string, email: string, password: string, role: string = 'GUEST'): Promise<UserDTO> => {
    await registerApi({ full_name: name, email, password, role });
    // Automatically log in after registration
    return await login(email, password);
  };

  const logout = () => {
    logoutApi().catch(() => {});
    localStorage.removeItem('staysphere_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isLoading,
        login,
        register,
        logout,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
