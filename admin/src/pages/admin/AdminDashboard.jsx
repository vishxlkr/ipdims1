import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
   const [stats, setStats] = useState({
      users: 0,
      reviewers: 0,
      submissions: 0,
   });

   const fetchStats = async () => {
      try {
         const [usersRes, reviewersRes, submissionsRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("aToken")}`,
               },
            }),
            axios.get(
               `${import.meta.env.VITE_BACKEND_URL}/api/admin/all-reviewer`,
               {
                  headers: {
                     Authorization: `Bearer ${localStorage.getItem("aToken")}`,
                  },
               }
            ),
            axios.get(
               `${import.meta.env.VITE_BACKEND_URL}/api/admin/submissions`,
               {
                  headers: {
                     Authorization: `Bearer ${localStorage.getItem("aToken")}`,
                  },
               }
            ),
         ]);

         setStats({
            users: usersRes.data.users.length,
            reviewers: reviewersRes.data.reviewers.length,
            submissions: submissionsRes.data.submissions.length,
         });
      } catch (error) {
         console.error(error);
         toast.error("Failed to fetch dashboard stats");
      }
   };

   useEffect(() => {
      fetchStats();
   }, []);

   return (
      <div>
         <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow">
               <h2 className="text-lg font-semibold">Total Users</h2>
               <p className="text-2xl">{stats.users}</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
               <h2 className="text-lg font-semibold">Total Reviewers</h2>
               <p className="text-2xl">{stats.reviewers}</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
               <h2 className="text-lg font-semibold">Total Submissions</h2>
               <p className="text-2xl">{stats.submissions}</p>
            </div>
         </div>
      </div>
   );
};

export default AdminDashboard;
