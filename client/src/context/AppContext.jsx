import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;

   const [token, setToken] = useState(localStorage.getItem("token") || "");
   const [userData, setUserData] = useState(null);
   const [loading, setLoading] = useState(false);

   // ---------- AUTH FUNCTIONS ----------

   const signup = async (name, email, password) => {
      try {
         setLoading(true);
         const { data } = await axios.post(`${backendUrl}/api/user/signup`, {
            name,
            email,
            password,
         });
         if (data.success) {
            toast.success("OTP sent to your email!");
            return { success: true };
         }
         toast.error(data.message);
         return { success: false };
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const verifyOtp = async (email, otp) => {
      try {
         setLoading(true);
         const { data } = await axios.post(
            `${backendUrl}/api/user/verify-otp`,
            {
               email,
               otp,
            }
         );

         // FIX: some backends return token inside user object
         const tokenValue = data.token || data.user?.token;

         if (data.success && tokenValue) {
            localStorage.setItem("token", tokenValue);
            setToken(tokenValue);
            toast.success("Account verified!");
            return { success: true, user: data.user };
         }

         toast.error(data.message || "Verification failed");
         return { success: false };
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const login = async (email, password) => {
      try {
         setLoading(true);
         const { data } = await axios.post(`${backendUrl}/api/user/login`, {
            email,
            password,
         });

         // FIX: token is inside data.user.token
         const tokenValue = data.token || data.user?.token;

         if (data.success && tokenValue) {
            localStorage.setItem("token", tokenValue);
            setToken(tokenValue);
            toast.success("Login successful!");
            return { success: true, user: data.user };
         }

         toast.error(data.message || "Login failed");
         return { success: false };
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const forgotPassword = async (email) => {
      try {
         setLoading(true);
         const { data } = await axios.post(
            `${backendUrl}/api/user/forgot-password`,
            { email }
         );
         if (data.success) {
            toast.success("OTP sent for password reset!");
            return { success: true };
         }
         toast.error(data.message);
         return { success: false };
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const resetPassword = async (email, otp, newPassword) => {
      try {
         setLoading(true);
         const { data } = await axios.post(
            `${backendUrl}/api/user/reset-password`,
            {
               email,
               otp,
               newPassword,
            }
         );
         if (data.success) {
            toast.success("Password updated successfully!");
            return { success: true };
         }
         toast.error(data.message);
         return { success: false };
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
         return { success: false };
      } finally {
         setLoading(false);
      }
   };

   const logout = () => {
      setToken("");
      setUserData(null);
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
   };

   // ---------- LOAD PROFILE ----------
   const loadUserProfile = async () => {
      if (!token) return;
      try {
         const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Correct format
         });
         if (data.success) {
            setUserData(data.user);
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         if (
            error.response?.status === 401 ||
            error.response?.data?.message?.includes("Not authorized")
         ) {
            toast.error("Session expired. Please login again.");
            logout();
         } else {
            toast.error(error.response?.data?.message || error.message);
         }
      }
   };

   useEffect(() => {
      if (token) loadUserProfile();
   }, [token]);

   const value = {
      backendUrl,
      token,
      userData,
      loading,
      signup,
      verifyOtp,
      login,
      forgotPassword,
      resetPassword,
      logout,
      setUserData,
   };

   return (
      <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
   );
};

export default AppContextProvider;
