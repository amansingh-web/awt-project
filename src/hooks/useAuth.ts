import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { supabase, User } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, full_name: string, role?: 'admin' | 'customer') => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', data.session.user.email)
          .maybeSingle();
        if (userData) setUser(userData);
      }
      setLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user?.email) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();
          if (userData) setUser(userData);
        } else {
          setUser(null);
        }
      })();
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (userData) setUser(userData);
  };

  const signup = async (email: string, password: string, full_name: string, role = 'customer') => {
    const { error: signupError } = await supabase.auth.signUp({ email, password });
    if (signupError) throw signupError;

    const { error: insertError } = await supabase.from('users').insert({
      email,
      full_name,
      role,
      password_hash: password,
    });
    if (insertError) throw insertError;

    await login(email, password);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, login, signup, logout } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
