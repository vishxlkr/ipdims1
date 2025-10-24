import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { ReviewerContext } from "../context/ReviewerContext";
import { Home, FileText, Users, User } from "lucide-react";

const DashboardLayout = () => {
   const { aToken } = useContext(AdminContext);
   const { rToken } = useContext(ReviewerContext);

   const linkClasses = ({ isActive }) =>
      `flex items-center gap-3 py-3.5 px-3 md:px-6 cursor-pointer rounded transition ${
         isActive
            ? "bg-[#f2f3ff] border-r-4 border-blue-600"
            : "hover:bg-gray-100"
      }`;

   return (
      <div className="flex min-h-screen">
         {/* Sidebar */}
         <aside className="w-64 bg-white border-r p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>

            {/* Admin Sidebar */}
            {aToken ? (
               <>
                  <NavLink to="/admin/dashboard" className={linkClasses}>
                     <Home size={20} />
                     <p className="hidden md:block">Dashboard</p>
                  </NavLink>

                  <NavLink to="/admin/submissions" className={linkClasses}>
                     <FileText size={20} />
                     <p className="hidden md:block">All Submissions</p>
                  </NavLink>

                  <NavLink to="/admin/reviewers" className={linkClasses}>
                     <Users size={20} />
                     <p className="hidden md:block">Manage Reviewers</p>
                  </NavLink>

                  <NavLink to="/admin/authors" className={linkClasses}>
                     <User size={20} />
                     <p className="hidden md:block">Authors</p>
                  </NavLink>
               </>
            ) : rToken ? (
               /* Reviewer Sidebar */
               <>
                  <NavLink to="/reviewer/dashboard" className={linkClasses}>
                     <Home size={20} />
                     <p className="hidden md:block">Dashboard</p>
                  </NavLink>

                  <NavLink to="/reviewer/submissions" className={linkClasses}>
                     <FileText size={20} />
                     <p className="hidden md:block">Assigned Submissions</p>
                  </NavLink>

                  <NavLink to="/reviewer/profile" className={linkClasses}>
                     <User size={20} />
                     <p className="hidden md:block">My Profile</p>
                  </NavLink>
               </>
            ) : (
               <p className="text-gray-500">No access token found.</p>
            )}
         </aside>

         {/* Main Content */}
         <main className="flex-1 bg-gray-100 p-8">
            <Outlet />
         </main>
      </div>
   );
};

export default DashboardLayout;
