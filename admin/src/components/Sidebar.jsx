import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { ReviewerContext } from "../context/ReviewerContext";

const Sidebar = () => {
   const { aToken } = useContext(AdminContext);
   const { rToken } = useContext(ReviewerContext);

   const isAdmin = Boolean(aToken);
   const isReviewer = !aToken && Boolean(rToken); // ✅ Admin priority

   return (
      <div className="min-h-screen bg-white border-r">
         {/* ✅ Admin Sidebar */}
         {isAdmin && (
            <ul className="text-[#515151] mt-5">
               <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                     `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                        isActive ? "bg-[#f2f3ff] border-r-4 border-primary" : ""
                     }`
                  }
               >
                  <img src={assets.home_icon} alt="" />
                  <p className="hidden md:block">Dashboard</p>
               </NavLink>

               <NavLink
                  to="/admin/submissions"
                  className={({ isActive }) =>
                     `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${
                        isActive ? "bg-[#f2f3ff] border-r-4 border-primary" : ""
                     }`
                  }
               >
                  <img src={assets.document_icon} alt="" />
                  <p className="hidden md:block">All Submissions</p>
               </NavLink>

               <NavLink
                  to="/admin/reviewers"
                  className={({ isActive }) =>
                     `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${
                        isActive ? "bg-[#f2f3ff] border-r-4 border-primary" : ""
                     }`
                  }
               >
                  <img src={assets.people_icon} alt="" />
                  <p className="hidden md:block">Manage Reviewers</p>
               </NavLink>

               <NavLink
                  to="/admin/authors"
                  className={({ isActive }) =>
                     `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${
                        isActive ? "bg-[#f2f3ff] border-r-4 border-primary" : ""
                     }`
                  }
               >
                  <img src={assets.user_icon} alt="" />
                  <p className="hidden md:block">Authors</p>
               </NavLink>
            </ul>
         )}

         {/* ✅ Reviewer Sidebar */}
         {isReviewer && (
            <ul className="text-[#515151] mt-5">
               <NavLink
                  to="/reviewer/dashboard"
                  className={({ isActive }) =>
                     `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                        isActive ? "bg-[#f2f3ff] border-r-4 border-primary" : ""
                     }`
                  }
               >
                  <img src={assets.home_icon} alt="" />
                  <p className="hidden md:block">Dashboard</p>
               </NavLink>

               <NavLink
                  to="/reviewer/submissions"
                  className={({ isActive }) =>
                     `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${
                        isActive ? "bg-[#f2f3ff] border-r-4 border-primary" : ""
                     }`
                  }
               >
                  <img src={assets.document_icon} alt="" />
                  <p className="hidden md:block">Assigned Submissions</p>
               </NavLink>

               <NavLink
                  to="/reviewer/profile"
                  className={({ isActive }) =>
                     `flex items-center gap-3 py-3.5 px-3 md:px-9 cursor-pointer ${
                        isActive ? "bg-[#f2f3ff] border-r-4 border-primary" : ""
                     }`
                  }
               >
                  <img src={assets.user_icon} alt="" />
                  <p className="hidden md:block">My Profile</p>
               </NavLink>
            </ul>
         )}
      </div>
   );
};

export default Sidebar;
