import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { ReviewerContext } from "../context/ReviewerContext";

const Navbar = () => {
   const { token, setToken } = useContext(AppContext); // Normal user
   const { reviewerToken, setReviewerToken } = useContext(ReviewerContext); // Reviewer
   const navigate = useNavigate();

   const logout = () => {
      if (token) {
         setToken("");
         localStorage.removeItem("token");
      }
      if (reviewerToken) {
         setReviewerToken("");
         localStorage.removeItem("reviewerToken");
      }
      navigate("/");
   };

   return (
      <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white shadow-sm">
         {/* LOGO + ROLE BADGE */}
         <div className="flex items-center gap-2 text-xs">
            <img
               className="w-32 sm:w-36 cursor-pointer"
               src={assets.project_logo} // ✅ Change to your project logo
               alt="Logo"
               onClick={() => navigate("/")}
            />
            <p className="border px-3 py-0.5 rounded-full text-gray-700">
               {token ? "User" : reviewerToken ? "Reviewer" : "Guest"}
            </p>
         </div>

         {/* Logout Button */}
         {(token || reviewerToken) && (
            <button
               onClick={logout}
               className="bg-blue-600 text-white text-sm px-8 py-1.5 rounded-full hover:bg-blue-700 transition"
            >
               Logout
            </button>
         )}
      </div>
   );
};

export default Navbar;
