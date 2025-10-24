import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
   const { aToken, setAToken } = useContext(AdminContext);
   const { rToken, setRToken } = useContext(ReviewerContext);
   const navigate = useNavigate();

   const logout = () => {
      if (aToken) {
         setAToken("");
         localStorage.removeItem("aToken");
      }
      if (rToken) {
         setRToken("");
         localStorage.removeItem("rToken");
      }
      navigate("/");
   };

   return (
      <div className="flex justify-between items-center px-6 py-3 bg-gray-900 text-white">
         {/* ✅ Project title */}
         <h1
            className="text-2xl font-bold tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
         >
            IPDIMS
         </h1>

         {/* ✅ Role Display */}
         <span className="px-3 py-1 bg-gray-700 rounded-full text-sm font-medium">
            {aToken ? "Admin" : rToken ? "Reviewer" : "Guest"}
         </span>

         <button
            onClick={logout}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full text-sm font-semibold transition"
         >
            Logout
         </button>
      </div>
   );
};

export default Navbar;
