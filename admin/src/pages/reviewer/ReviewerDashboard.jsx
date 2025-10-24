import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ReviewerContext } from "../../context/ReviewerContext";

const ReviewerDashboard = () => {
   const { rToken, backendUrl } = useContext(ReviewerContext);

   const [stats, setStats] = useState(null);
   const [submissions, setSubmissions] = useState([]);
   const [loadingStats, setLoadingStats] = useState(false);
   const [loadingSubs, setLoadingSubs] = useState(false);

   // Fetch dashboard stats
   const fetchDashboardStats = async () => {
      try {
         setLoadingStats(true);
         const res = await axios.get(backendUrl + "/api/reviewer/dashboard", {
            headers: { Authorization: `Bearer ${rToken}` },
         });
         setStats(res.data);
         setLoadingStats(false);
      } catch (err) {
         console.error(err);
         toast.error("Failed to fetch dashboard stats");
         setLoadingStats(false);
      }
   };

   // Fetch assigned submissions
   const fetchAssignedSubmissions = async () => {
      try {
         setLoadingSubs(true);
         const res = await axios.get(`${backendUrl}/reviewer/submissions`, {
            headers: { Authorization: `Bearer ${rToken}` },
         });
         setSubmissions(res.data);
         setLoadingSubs(false);
      } catch (err) {
         console.error(err);
         toast.error("Failed to fetch assigned submissions");
         setLoadingSubs(false);
      }
   };

   useEffect(() => {
      fetchDashboardStats();
      fetchAssignedSubmissions();
   }, []);

   return (
      <div>
         <h1 className="text-2xl font-bold mb-6">Reviewer Dashboard</h1>

         {/* Stats */}
         {loadingStats ? (
            <p>Loading stats...</p>
         ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
               <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="font-semibold">Total Assigned</h2>
                  <p className="text-2xl mt-2">{stats.totalAssigned || 0}</p>
               </div>
               <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="font-semibold">Pending Reviews</h2>
                  <p className="text-2xl mt-2">{stats.pendingReviews || 0}</p>
               </div>
               <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="font-semibold">Completed Reviews</h2>
                  <p className="text-2xl mt-2">{stats.completedReviews || 0}</p>
               </div>
            </div>
         ) : (
            <p>No stats available.</p>
         )}

         {/* Assigned Submissions */}
         <h2 className="text-xl font-bold mb-4">Assigned Submissions</h2>
         {loadingSubs ? (
            <p>Loading submissions...</p>
         ) : submissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {submissions.map((sub) => (
                  <div
                     key={sub._id}
                     className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                  >
                     <h3 className="font-semibold text-lg">{sub.title}</h3>
                     <p className="text-gray-500 mt-1">
                        Author: {sub.authorName}
                     </p>
                     <p className="text-gray-500 mt-1">
                        Status: {sub.status || "Pending Review"}
                     </p>
                     <p className="text-gray-500 mt-1">
                        Assigned on:{" "}
                        {new Date(sub.assignedAt).toLocaleDateString()}
                     </p>
                     <a
                        href={sub.fileUrl}
                        target="_blank"
                        className="text-blue-600 mt-2 inline-block hover:underline"
                     >
                        View Submission
                     </a>
                  </div>
               ))}
            </div>
         ) : (
            <p>No submissions assigned to you.</p>
         )}
      </div>
   );
};

export default ReviewerDashboard;
