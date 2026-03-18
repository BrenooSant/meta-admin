import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface AdminSession {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: { id: string; fullname: string } | null;
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession>({
    isAuthenticated: false,
    isLoading: true,
    admin: null,
  });

  const isFetching = useRef(false);

  const checkAndSetAdmin = async (user: any) => {
    if (!user) {
      setSession({ isAuthenticated: false, isLoading: false, admin: null });
      return;
    }

    if (isFetching.current) {
      return;
    }

    isFetching.current = true;

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id, fullname')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        await supabase.auth.signOut();
        setSession({ isAuthenticated: false, isLoading: false, admin: null });
      } else {
        setSession({
          isAuthenticated: true,
          isLoading: false,
          admin: data,
        });
      }
    } catch (err) {
      setSession({ isAuthenticated: false, isLoading: false, admin: null });
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_, authSession) => {

      const user = authSession?.user ?? null;
      checkAndSetAdmin(user);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkAndSetAdmin(session.user);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return session;
}