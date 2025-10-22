import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
   const currencySymbol = "$";

   const [token, setToken] = useState(
      localStorage.getItem("token") ? localStorage.getItem("token") : false
   );
   const [userData, setUserData] = useState(false);
   const [otpSent, setOtpSent] = useState(false);
   const [loading, setLoading] = useState(false);

   // ------------------ AUTH FUNCTIONS ------------------

   const signup = async (name, email, password) => {
      try {
         setLoading(true);
         const { data } = await axios.post(`${backendUrl}/api/user/signup`, {
            name,
            email,
            password,
         });
         setLoading(false);
         if (data.success) {
            setOtpSent(true);
            toast.success("OTP sent to your email");
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         setLoading(false);
         toast.error(error.response?.data?.message || error.message);
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
         setLoading(false);
         if (data.success) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            toast.success("Signup successful!");
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         setLoading(false);
         toast.error(error.response?.data?.message || error.message);
      }
   };

   const login = async (email, password) => {
      try {
         setLoading(true);
         const { data } = await axios.post(`${backendUrl}/api/user/login`, {
            email,
            password,
         });
         setLoading(false);
         if (data.success) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            toast.success("Login successful!");
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         setLoading(false);
         toast.error(error.response?.data?.message || error.message);
      }
   };

   const forgotPassword = async (email) => {
      try {
         const { data } = await axios.post(
            `${backendUrl}/api/user/forgot-password`,
            { email }
         );
         if (data.success) {
            toast.success("OTP sent to your email for password reset");
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
      }
   };

   const resetPassword = async (email, otp, newPassword) => {
      try {
         const { data } = await axios.post(
            `${backendUrl}/api/user/reset-password`,
            {
               email,
               otp,
               newPassword,
            }
         );
         if (data.success) {
            toast.success("Password reset successful!");
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
      }
   };

   const logout = () => {
      setToken(false);
      setUserData(false);
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
   };

   // ------------------ PROFILE LOADING ------------------

   const loadUserProfileData = async () => {
      if (!token) return;
      try {
         const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
            headers: { token },
         });
         if (data.success) {
            setUserData(data.user);
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
      }
   };

   // ------------------ AUTO LOAD PROFILE ------------------

   useEffect(() => {
      if (token) {
         loadUserProfileData();
      } else {
         setUserData(false);
      }
   }, [token]);

   // ------------------ CONTEXT VALUE ------------------

   const value = {
      backendUrl,
      currencySymbol,
      token,
      setToken,
      userData,
      setUserData,
      signup,
      verifyOtp,
      login,
      forgotPassword,
      resetPassword,
      logout,
      loadUserProfileData,
      otpSent,
      setOtpSent,
      loading,
   };

   return (
      <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
   );
};

export default AppContextProvider;
