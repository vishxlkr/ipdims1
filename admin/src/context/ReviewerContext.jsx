import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const ReviewerContext = createContext();

const ReviewerContextProvider = (props) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
   const [rToken, setRToken] = useState(
      localStorage.getItem("rToken") ? localStorage.getItem("rToken") : ""
   );

   const value = {
      rToken,
      setRToken,
      backendUrl,
   };

   return (
      <ReviewerContext.Provider value={value}>
         {props.children}
      </ReviewerContext.Provider>
   );
};

export default ReviewerContextProvider;
