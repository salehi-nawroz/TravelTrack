import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import {
  getProfile,
  updateProfile as updateProfileApi,
} from "../services/profileService";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(function () {
    let isMounted = true;
    let initialSessionHandled = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      initialSessionHandled = true;
      setIsLoading(false);
    });

    async function loadInitialSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (!isMounted || initialSessionHandled) return;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Failed to load session:", error.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialSession();

    return function () {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const userId = user?.id;

  useEffect(
    function () {
      let isMounted = true;

      if (!userId) {
        setProfile(null);
        return;
      }

      setProfile(null);

      getProfile()
        .then((data) => {
          if (isMounted) setProfile(data);
        })
        .catch((error) => {
          console.error("Failed to load profile:", error.message);
        });

      return function () {
        isMounted = false;
      };
    },
    [userId],
  );

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function updateProfile(updates) {
    const data = await updateProfileApi(updates);
    setProfile(data);
    return data;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        profile,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
