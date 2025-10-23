import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;

   const [token, setToken] = useState(localStorage.getItem("token") || "");
   const [userData, setUserData] = useState(null);
   const [loading, setLoading] = useState(false);

   const getUserData = async () => {
      if (!token) return;
      try {
         setLoading(true);
         const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         if (data.success) {
            setUserData(data.user);
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      getUserData();
   }, [token]);

   return (
      <AppContext.Provider
         value={{
            backendUrl,
            token,
            setToken,
            userData,
            setUserData,
            getUserData,
            loading,
            setLoading,
         }}
      >
         {children}
      </AppContext.Provider>
   );
};

export default AppContextProvider;
