import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminSubmissions = () => {
   const [submissions, setSubmissions] = useState([]);
   const [reviewers, setReviewers] = useState([]);
   const [selectedReviewer, setSelectedReviewer] = useState({});
   const [loading, setLoading] = useState(false);

   const token = localStorage.getItem("aToken"); // Admin token

   const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api/admin";

   // Fetch all submissions
   const fetchSubmissions = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(`${backendUrl}/submissions`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         if (data.success) setSubmissions(data.submissions);
      } catch (error) {
         console.error("Error fetching submissions:", error);
         toast.error("Failed to load submissions");
      } finally {
         setLoading(false);
      }
   };

   // Fetch all reviewers
   const fetchReviewers = async () => {
      try {
         const { data } = await axios.get(`${backendUrl}/all-reviewer`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         if (data.success) setReviewers(data.reviewers);
      } catch (error) {
         console.error("Error fetching reviewers:", error);
         toast.error("Failed to load reviewers");
      }
   };

   useEffect(() => {
      fetchSubmissions();
      fetchReviewers();
   }, []);

   // Assign reviewer to a submission
   const assignReviewer = async (submissionId) => {
      const reviewerId = selectedReviewer[submissionId];
      if (!reviewerId) {
         toast.error("Please select a reviewer");
         return;
      }

      try {
         const { data } = await axios.post(
            `${backendUrl}/assign-submission`,
            { submissionId, reviewerId },
            { headers: { Authorization: `Bearer ${token}` } }
         );

         if (data.success) {
            toast.success("Reviewer assigned successfully");
            fetchSubmissions(); // refresh submissions
         }
      } catch (error) {
         console.error("Assignment error:", error);
         toast.error("Failed to assign reviewer");
      }
   };

   // Change submission status
   const changeStatus = async (submissionId, status) => {
      try {
         const { data } = await axios.post(
            `${backendUrl}/change-submission-status`,
            { submissionId, status },
            { headers: { Authorization: `Bearer ${token}` } }
         );

         if (data.success) {
            toast.success(`Submission ${status}`);
            fetchSubmissions(); // refresh submissions
         }
      } catch (error) {
         console.error("Status change error:", error);
         toast.error("Failed to change status");
      }
   };

   return (
      <div>
         <h2 className="text-2xl font-bold mb-4">All Submissions</h2>
         {loading ? (
            <p>Loading submissions...</p>
         ) : submissions.length === 0 ? (
            <p>No submissions found.</p>
         ) : (
            <table className="w-full border-collapse border">
               <thead>
                  <tr className="bg-gray-200">
                     <th className="p-3 border">Title</th>
                     <th className="p-3 border">Author</th>
                     <th className="p-3 border">Status</th>
                     <th className="p-3 border">Assign Reviewer</th>
                     <th className="p-3 border">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {submissions.map((sub) => (
                     <tr key={sub._id} className="border-b">
                        <td className="p-3">{sub.title}</td>
                        <td className="p-3">{sub.author?.name || "N/A"}</td>
                        <td className="p-3">{sub.status}</td>
                        <td className="p-3">
                           <select
                              className="border p-1 rounded"
                              value={selectedReviewer[sub._id] || ""}
                              onChange={(e) =>
                                 setSelectedReviewer((prev) => ({
                                    ...prev,
                                    [sub._id]: e.target.value,
                                 }))
                              }
                           >
                              <option value="">Select Reviewer</option>
                              {reviewers.map((rev) => (
                                 <option key={rev._id} value={rev._id}>
                                    {rev.name}
                                 </option>
                              ))}
                           </select>
                        </td>
                        <td className="p-3 flex gap-2">
                           <button
                              className="bg-blue-600 text-white px-3 py-1 rounded"
                              onClick={() => assignReviewer(sub._id)}
                           >
                              Assign
                           </button>
                           <button
                              className="bg-green-600 text-white px-3 py-1 rounded"
                              onClick={() => changeStatus(sub._id, "Approved")}
                           >
                              Approve
                           </button>
                           <button
                              className="bg-red-600 text-white px-3 py-1 rounded"
                              onClick={() => changeStatus(sub._id, "Rejected")}
                           >
                              Reject
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

export default AdminSubmissions;
