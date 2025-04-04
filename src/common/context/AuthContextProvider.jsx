import { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [authSession, setAuthSession] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [isLoadingAuthUser, setIsLoadingAuthUser] = useState(true);

  async function getUser(authSession) {
    setIsLoadingAuthUser(true);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authSession.user.id);

    if (error) {
      console.log(error);
      setAuthUser(null);
    } else {
      setAuthUser(data[0]);
    }

    setIsLoadingAuthUser(false);
  }

  useEffect(() => {
    async function getAuthSession() {
      const { data } = await supabase.auth.getSession();

      setAuthSession(data.session);

      if (!data.session) setIsLoadingAuthUser(false);
    }

    getAuthSession();
  }, []);

  useEffect(() => {
    async function getAuthUser() {
      if (authSession) {
        await getUser(authSession);
      } else {
        setAuthUser(null);
      }
    }

    getAuthUser();
  }, [authSession]);

  return (
    <AuthContext.Provider
      value={{
        authSession,
        setAuthSession,
        authUser,
        setAuthUser,
        isLoadingAuthUser,
        setIsLoadingAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
