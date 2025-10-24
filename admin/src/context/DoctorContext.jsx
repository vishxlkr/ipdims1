import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
   const [dToken, setDToken] = useState(
      localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
   );

   const value = {
      dToken,
      setDToken,
      backendUrl,
      getAppointments,
      appointments,
      setAppointments,
      completeAppointment,
      cancelAppointment,
      getDashData,
      dashData,
      setDashData,
      profileData,
      setProfileData,
      getProfileData,
   };

   return (
      <DoctorContext.Provider value={value}>
         {props.children}
      </DoctorContext.Provider>
   );
};

export default DoctorContextProvider;
