import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;

   const [token, setToken] = useState(localStorage.getItem("token") || "");
   const [userData, setUserData] = useState(null);

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
      setToken,
      userData,
      setUserData,
   };

   return (
      <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
   );
};

export default AppContextProvider;
