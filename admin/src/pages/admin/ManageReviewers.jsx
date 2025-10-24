import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageReviewers = () => {
   const [reviewers, setReviewers] = useState([]);
   const [loading, setLoading] = useState(false);
   const token = localStorage.getItem("aToken");

   const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api/admin";

   // Fetch all reviewers
   const fetchReviewers = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(`${backendUrl}/all-reviewer`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         if (data.success) setReviewers(data.reviewers);
      } catch (error) {
         console.error("Error fetching reviewers:", error);
         toast.error("Failed to load reviewers");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchReviewers();
   }, []);

   // Toggle reviewer active status
   const toggleStatus = async (reviewerId, currentStatus) => {
      try {
         const { data } = await axios.post(
            `${backendUrl}/change-availability/${reviewerId}`,
            { isActive: !currentStatus },
            { headers: { Authorization: `Bearer ${token}` } }
         );

         if (data.success) {
            toast.success(data.message);
            fetchReviewers(); // refresh reviewers
         }
      } catch (error) {
         console.error("Error updating reviewer status:", error);
         toast.error("Failed to update reviewer status");
      }
   };

   return (
      <div>
         <h2 className="text-2xl font-bold mb-4">Manage Reviewers</h2>
         {loading ? (
            <p>Loading reviewers...</p>
         ) : reviewers.length === 0 ? (
            <p>No reviewers found.</p>
         ) : (
            <table className="w-full border-collapse border">
               <thead>
                  <tr className="bg-gray-200">
                     <th className="p-3 border">Name</th>
                     <th className="p-3 border">Email</th>
                     <th className="p-3 border">Phone</th>
                     <th className="p-3 border">Organization</th>
                     <th className="p-3 border">Specialization</th>
                     <th className="p-3 border">Status</th>
                     <th className="p-3 border">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {reviewers.map((rev) => (
                     <tr key={rev._id} className="border-b">
                        <td className="p-3">{rev.name}</td>
                        <td className="p-3">{rev.email}</td>
                        <td className="p-3">{rev.phone || "N/A"}</td>
                        <td className="p-3">{rev.organization || "N/A"}</td>
                        <td className="p-3">
                           {rev.specialization?.join(", ") || "N/A"}
                        </td>
                        <td className="p-3">
                           {rev.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="p-3 flex gap-2">
                           <button
                              className={`px-3 py-1 rounded text-white ${
                                 rev.isActive ? "bg-red-600" : "bg-green-600"
                              }`}
                              onClick={() =>
                                 toggleStatus(rev._id, rev.isActive)
                              }
                           >
                              {rev.isActive ? "Deactivate" : "Activate"}
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   );
};

export default ManageReviewers;
