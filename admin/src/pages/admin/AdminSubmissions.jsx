import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
   Eye,
   Trash2,
   Filter,
   Search,
   Download,
   UserPlus,
   X,
   FileText,
   User,
   Mail,
   Building,
   Tag,
   AlignLeft,
   Calendar,
} from "lucide-react";

const AdminSubmissions = () => {
   const [submissions, setSubmissions] = useState([]);
   const [filteredSubmissions, setFilteredSubmissions] = useState([]);
   const [reviewers, setReviewers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("All");
   const [selectedSubmission, setSelectedSubmission] = useState(null);
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const [showAssignModal, setShowAssignModal] = useState(false);
   const [selectedReviewer, setSelectedReviewer] = useState("");

   const backendUrl = "http://localhost:4000";
   const atoken = localStorage.getItem("aToken");

   useEffect(() => {
      fetchSubmissions();
      fetchReviewers();
   }, []);

   useEffect(() => {
      filterSubmissions();
   }, [searchTerm, statusFilter, submissions]);

   const fetchSubmissions = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(
            `${backendUrl}/api/admin/submissions`,
            {
               headers: { atoken },
            }
         );

         if (data.success) {
            setSubmissions(data.submissions || []);
         } else {
            toast.error(data.message || "Failed to fetch submissions");
         }
      } catch (error) {
         console.error("Error fetching submissions:", error);
         toast.error(
            error.response?.data?.message || "Error fetching submissions"
         );
      } finally {
         setLoading(false);
      }
   };

   const fetchReviewers = async () => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/all-reviewer`,
            {
               headers: { atoken },
            }
         );

         if (data.success) {
            setReviewers(data.reviewers || []);
         }
      } catch (error) {
         console.error("Error fetching reviewers:", error);
      }
   };

   const filterSubmissions = () => {
      let filtered = submissions;

      if (statusFilter !== "All") {
         filtered = filtered.filter((sub) => sub.status === statusFilter);
      }

      if (searchTerm) {
         filtered = filtered.filter(
            (sub) =>
               sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               sub.author?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
               sub.author?.email
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
         );
      }

      setFilteredSubmissions(filtered);
   };

   const handleViewDetails = async (submissionId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/admin/submission/${submissionId}`,
            {
               headers: { atoken },
            }
         );

         if (data.success) {
            setSelectedSubmission(data.submission);
            setShowDetailsModal(true);
         }
      } catch (error) {
         console.error("Error fetching submission details:", error);
         toast.error("Failed to load submission details");
      }
   };

   const openAssignModal = (submission) => {
      setSelectedSubmission(submission);
      setSelectedReviewer(submission.reviewer?._id || "");
      setShowAssignModal(true);
   };

   const handleAssignReviewer = async () => {
      if (!selectedReviewer || !selectedSubmission) {
         toast.error("Please select a reviewer");
         return;
      }

      try {
         const { data } = await axios.post(
            `${backendUrl}/api/admin/assign-submission`,
            {
               submissionId: selectedSubmission._id,
               reviewerId: selectedReviewer,
            },
            { headers: { atoken } }
         );

         if (data.success) {
            toast.success("Reviewer assigned successfully!");
            setShowAssignModal(false);
            setSelectedReviewer("");
            fetchSubmissions();
         } else {
            toast.error(data.message || "Failed to assign reviewer");
         }
      } catch (error) {
         console.error("Error assigning reviewer:", error);
         toast.error(
            error.response?.data?.message || "Failed to assign reviewer"
         );
      }
   };

   const handleChangeStatus = async (submissionId, newStatus) => {
      try {
         const { data } = await axios.post(
            `${backendUrl}/api/admin/change-submission-status`,
            {
               submissionId,
               status: newStatus,
            },
            { headers: { atoken } }
         );

         if (data.success) {
            toast.success("Status updated successfully!");
            fetchSubmissions();
         } else {
            toast.error(data.message || "Failed to update status");
         }
      } catch (error) {
         console.error("Error updating status:", error);
         toast.error(
            error.response?.data?.message || "Failed to update status"
         );
      }
   };

   const handleDeleteSubmission = async (submissionId) => {
      if (!window.confirm("Are you sure you want to delete this submission?"))
         return;

      try {
         const { data } = await axios.delete(
            `${backendUrl}/api/admin/submission/${submissionId}`,
            {
               headers: { atoken },
            }
         );

         if (data.success) {
            toast.success("Submission deleted successfully!");
            fetchSubmissions();
         } else {
            toast.error(data.message || "Failed to delete submission");
         }
      } catch (error) {
         console.error("Error deleting submission:", error);
         toast.error(
            error.response?.data?.message || "Failed to delete submission"
         );
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="max-w-7xl mx-auto">
            <div className="mb-8">
               <h1 className="text-4xl font-bold text-gray-800">
                  Manage Submissions
               </h1>
               <p className="text-gray-600 mt-2">
                  View, assign, and manage all manuscript submissions
               </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                     <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search by title, author, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>

                  <div className="relative">
                     <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                     >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                     </select>
                  </div>

                  <div className="text-right flex items-center justify-end">
                     <span className="text-gray-700 font-semibold">
                        Total:{" "}
                        <span className="text-blue-600">
                           {filteredSubmissions.length}
                        </span>{" "}
                        submissions
                     </span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Title
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Author
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Status
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Reviewer
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Date
                           </th>
                           <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubmissions.length > 0 ? (
                           filteredSubmissions.map((submission) => (
                              <tr
                                 key={submission._id}
                                 className="hover:bg-gray-50 transition-colors"
                              >
                                 <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                       {submission.title || "Untitled"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                       {submission.author?.name || "N/A"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       {submission.author?.email}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <select
                                       value={submission.status}
                                       onChange={(e) =>
                                          handleChangeStatus(
                                             submission._id,
                                             e.target.value
                                          )
                                       }
                                       onClick={(e) => e.stopPropagation()}
                                       className={`px-3 py-1.5 text-xs font-semibold rounded-full border-0 cursor-pointer ${
                                          submission.status === "Accepted"
                                             ? "bg-green-100 text-green-800"
                                             : submission.status === "Rejected"
                                             ? "bg-red-100 text-red-800"
                                             : submission.status ===
                                               "Under Review"
                                             ? "bg-blue-100 text-blue-800"
                                             : "bg-yellow-100 text-yellow-800"
                                       }`}
                                    >
                                       <option value="Pending">Pending</option>
                                       <option value="Under Review">
                                          Under Review
                                       </option>
                                       <option value="Accepted">
                                          Accepted
                                       </option>
                                       <option value="Rejected">
                                          Rejected
                                       </option>
                                    </select>
                                 </td>
                                 <td className="px-6 py-4">
                                    {submission.reviewer ? (
                                       <div className="text-sm text-gray-700">
                                          {submission.reviewer.name}
                                       </div>
                                    ) : (
                                       <button
                                          onClick={() =>
                                             openAssignModal(submission)
                                          }
                                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                       >
                                          <UserPlus className="w-4 h-4" />
                                          Assign
                                       </button>
                                    )}
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(
                                       submission.createdAt
                                    ).toLocaleDateString()}
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       <button
                                          onClick={() =>
                                             handleViewDetails(submission._id)
                                          }
                                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="View Details"
                                       >
                                          <Eye className="w-5 h-5" />
                                       </button>
                                       <button
                                          onClick={() =>
                                             handleDeleteSubmission(
                                                submission._id
                                             )
                                          }
                                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Delete"
                                       >
                                          <Trash2 className="w-5 h-5" />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td
                                 colSpan="6"
                                 className="px-6 py-12 text-center text-gray-500"
                              >
                                 No submissions found
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Details Modal */}
         {showDetailsModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                     <h2 className="text-2xl font-bold text-gray-800">
                        Submission Details
                     </h2>
                     <button
                        onClick={() => setShowDetailsModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  <div className="p-6 space-y-6">
                     <div className="flex items-center justify-between">
                        <span
                           className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              selectedSubmission.status === "Accepted"
                                 ? "bg-green-100 text-green-800"
                                 : selectedSubmission.status === "Rejected"
                                 ? "bg-red-100 text-red-800"
                                 : selectedSubmission.status === "Under Review"
                                 ? "bg-blue-100 text-blue-800"
                                 : "bg-yellow-100 text-yellow-800"
                           }`}
                        >
                           {selectedSubmission.status}
                        </span>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                           <Calendar size={16} />
                           {new Date(
                              selectedSubmission.createdAt
                           ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })}
                        </div>
                     </div>

                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                           {selectedSubmission.title || "Untitled"}
                        </h3>
                        {selectedSubmission.eventName && (
                           <p className="text-sm text-gray-600">
                              Event: {selectedSubmission.eventName}
                           </p>
                        )}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-2">
                              <User className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 AUTHOR NAME
                              </p>
                           </div>
                           <p className="text-gray-900 font-medium">
                              {selectedSubmission.author?.name ||
                                 selectedSubmission.authorName ||
                                 "N/A"}
                           </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-2">
                              <Mail className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 AUTHOR EMAIL
                              </p>
                           </div>
                           <p className="text-gray-900 font-medium break-all">
                              {selectedSubmission.author?.email ||
                                 selectedSubmission.authorEmail ||
                                 "N/A"}
                           </p>
                        </div>

                        {(selectedSubmission.author?.organization ||
                           selectedSubmission.authorAffiliation) && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
                              <div className="flex items-center gap-2 mb-2">
                                 <Building
                                    className="text-blue-600"
                                    size={18}
                                 />
                                 <p className="text-xs text-gray-500 font-semibold">
                                    AFFILIATION
                                 </p>
                              </div>
                              <p className="text-gray-900 font-medium">
                                 {selectedSubmission.author?.organization ||
                                    selectedSubmission.authorAffiliation}
                              </p>
                           </div>
                        )}
                     </div>

                     {selectedSubmission.description && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-3">
                              <AlignLeft className="text-blue-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 DESCRIPTION
                              </p>
                           </div>
                           <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                              {selectedSubmission.description}
                           </p>
                        </div>
                     )}

                     {selectedSubmission.keywords &&
                        selectedSubmission.keywords.length > 0 && (
                           <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center gap-2 mb-3">
                                 <Tag className="text-blue-600" size={18} />
                                 <p className="text-xs text-gray-500 font-semibold">
                                    KEYWORDS
                                 </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {selectedSubmission.keywords.map(
                                    (keyword, idx) => (
                                       <span
                                          key={idx}
                                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium"
                                       >
                                          {keyword}
                                       </span>
                                    )
                                 )}
                              </div>
                           </div>
                        )}

                     {selectedSubmission.attachment && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <FileText
                                    className="text-blue-600"
                                    size={20}
                                 />
                                 <div>
                                    <p className="text-xs text-gray-500 font-semibold mb-1">
                                       ATTACHMENT
                                    </p>
                                    <p className="text-gray-900 font-medium text-sm">
                                       Paper Submission
                                    </p>
                                 </div>
                              </div>
                              <a
                                 href={selectedSubmission.attachment}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                              >
                                 <Download size={18} />
                                 Download
                              </a>
                           </div>
                        </div>
                     )}

                     {selectedSubmission.reviewer && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                           <div className="flex items-center gap-2 mb-2">
                              <User className="text-purple-600" size={18} />
                              <p className="text-xs text-gray-500 font-semibold">
                                 ASSIGNED REVIEWER
                              </p>
                           </div>
                           <p className="text-gray-900 font-medium">
                              {selectedSubmission.reviewer.name}
                           </p>
                           <p className="text-sm text-gray-600">
                              {selectedSubmission.reviewer.email}
                           </p>
                        </div>
                     )}
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                     {!selectedSubmission.reviewer && (
                        <button
                           onClick={() => {
                              setShowDetailsModal(false);
                              openAssignModal(selectedSubmission);
                           }}
                           className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                        >
                           <UserPlus size={18} />
                           Assign Reviewer
                        </button>
                     )}
                     <button
                        onClick={() => setShowDetailsModal(false)}
                        className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all"
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Assign Reviewer Modal */}
         {showAssignModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                  <div className="border-b border-gray-200 p-6 flex items-center justify-between">
                     <h2 className="text-2xl font-bold text-gray-800">
                        Assign Reviewer
                     </h2>
                     <button
                        onClick={() => {
                           setShowAssignModal(false);
                           setSelectedReviewer("");
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                     >
                        <X size={24} />
                     </button>
                  </div>

                  <div className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                           Submission Title
                        </label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                           {selectedSubmission.title}
                        </p>
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                           Select Reviewer *
                        </label>
                        <select
                           value={selectedReviewer}
                           onChange={(e) => setSelectedReviewer(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                           <option value="">-- Select a Reviewer --</option>
                           {reviewers
                              .filter((r) => r.isActive)
                              .map((reviewer) => (
                                 <option
                                    key={reviewer._id}
                                    value={reviewer._id}
                                 >
                                    {reviewer.name} - {reviewer.email}
                                 </option>
                              ))}
                        </select>
                     </div>
                  </div>

                  <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
                     <button
                        onClick={() => {
                           setShowAssignModal(false);
                           setSelectedReviewer("");
                        }}
                        className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleAssignReviewer}
                        disabled={!selectedReviewer}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        <UserPlus size={18} />
                        Assign Reviewer
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminSubmissions;
