// UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Adjust path as necessary

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    // Fetch user data and update state
    const fetchUser = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error fetching user', error);
      } finally {
        setLoading(false); // Set loading to false once user data is fetched
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
