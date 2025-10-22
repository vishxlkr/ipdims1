// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AppContext = createContext(null);

export function useAuth() {
   return useContext(AuthContext);
}

export function AuthProvider({ children }) {
   const API_BASE =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api/users";
   const [user, setUser] = useState(null);
   const [token, setToken] = useState(() => localStorage.getItem("token"));

   const api = axios.create({
      baseURL: API_BASE,
      headers: {
         "Content-Type": "application/json",
      },
   });

   useEffect(() => {
      if (token) {
         api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
         localStorage.setItem("token", token);
      } else {
         delete api.defaults.headers.common["Authorization"];
         localStorage.removeItem("token");
      }
   }, [token]);

   // --- Auth functions ---
   const signup = async (name, email, password) => {
      const res = await api.post("/signup", { name, email, password });
      return res.data; // only OTP sent
   };

   const verifyOtp = async (email, otp) => {
      const res = await api.post("/verify-otp", { email, otp });
      if (res.data?.token) {
         setToken(res.data.token);
         setUser(res.data);
      }
      return res.data;
   };

   const login = async (email, password) => {
      const res = await api.post("/login", { email, password });
      if (res.data?.token) {
         setToken(res.data.token);
         setUser(res.data);
      }
      return res.data;
   };

   const forgotPassword = async (email) => {
      const res = await api.post("/forgot-password", { email });
      return res.data;
   };

   const resetPassword = async (email, otp, newPassword) => {
      const res = await api.post("/reset-password", {
         email,
         otp,
         newPassword,
      });
      return res.data;
   };

   const logout = () => {
      setToken(null);
      setUser(null);
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            token,
            signup,
            verifyOtp,
            login,
            forgotPassword,
            resetPassword,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}
