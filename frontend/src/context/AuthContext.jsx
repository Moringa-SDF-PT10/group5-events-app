import React, { createContext, useState, useEffect } from "react";

// ✅ Create Context
export const AuthContext = createContext();

// ✅ Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token"); // ✅ now consistent with MyTickets

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);

    setLoading(false);
  }, []);

  // Login
  const login = (userData, tokenData, remember = false) => {
    setUser(userData);
    setToken(tokenData);

    if (remember) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", tokenData); // ✅ use token everywhere
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // ✅ clear correct key
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
