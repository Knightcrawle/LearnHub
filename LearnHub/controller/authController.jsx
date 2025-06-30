// src/controller/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [curUser, setCurUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (curUser) {
      localStorage.setItem('user', JSON.stringify(curUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [curUser]);

  const login = (user) => {
    setCurUser(user);

  };

  const logout = () => {
    setCurUser(null);
  };

  return (
    <AuthContext.Provider value={{ curUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


//used for athuntication 

/* import React from 'react'
import { useContext,useState,createContext } from 'react'

const AuthContext = createContext();

export function AuthProvider({children}) {
   
    const [curUser,setCurUser]=useState(null);

    const login = (userData) => setCurUser(userData);
    const logout = () => setCurUser(null);

    const isloggedin = !!curUser;

  return (
    <AuthContext.Provider value={{isloggedin,login,logout,curUser}}>
        {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
} */