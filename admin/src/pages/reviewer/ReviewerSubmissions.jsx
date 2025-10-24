import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
   Eye,
   Search,
   Filter,
   Download,
   X,
   FileText,
   User,
   Mail,
   Building,
   Tag,
   AlignLeft,
   Calendar,
   MessageSquare,
   Send,
} from "lucide-react";

const ReviewerSubmissions = () => {
   const [submissions, setSubmissions] = useState([]);
   const [filteredSubmissions, setFilteredSubmissions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("All");
   const [selectedSubmission, setSelectedSubmission] = useState(null);
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const [showReviewModal, setShowReviewModal] = useState(false);
   const [feedbackText, setFeedbackText] = useState("");
   const [decision, setDecision] = useState("Under Review");
   const [rating, setRating] = useState("");

   const backendUrl = "http://localhost:4000";
   const rtoken = localStorage.getItem("rToken");

   useEffect(() => {
      fetchSubmissions();
   }, []);

   useEffect(() => {
      filterSubmissions();
   }, [searchTerm, statusFilter, submissions]);

   const fetchSubmissions = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(
            `${backendUrl}/api/reviewer/submissions`,
            {
               headers: { rtoken },
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

   const filterSubmissions = () => {
      let filtered = submissions;

      if (statusFilter !== "All") {
         filtered = filtered.filter((sub) => sub.status === statusFilter);
      }

      if (searchTerm) {
         filtered = filtered.filter(
            (sub) =>
               sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               sub.user?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
               sub.author?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
         );
      }

      setFilteredSubmissions(filtered);
   };

   const handleViewDetails = async (submissionId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/api/reviewer/submissions/${submissionId}`,
            {
               headers: { rtoken },
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

   const openReviewModal = (submission) => {
      setSelectedSubmission(submission);
      setFeedbackText(submission.feedback?.text || "");
      setDecision(submission.status || "Under Review");
      setRating(submission.feedback?.rating || "");
      setShowReviewModal(true);
   };

   const handleSubmitReview = async () => {
      if (!feedbackText.trim()) {
         toast.error("Please provide feedback");
         return;
      }

      try {
         const { data } = await axios.post(
            `${backendUrl}/api/reviewer/submissions/${selectedSubmission._id}/review`,
            {
               feedbackText,
               rating: rating || null,
               decision,
            },
            { headers: { rtoken } }
         );

         if (data.success) {
            toast.success("Review submitted successfully!");
            setShowReviewModal(false);
            setFeedbackText("");
            setDecision("Under Review");
            setRating("");
            fetchSubmissions();
         } else {
            toast.error(data.message || "Failed to submit review");
         }
      } catch (error) {
         console.error("Error submitting review:", error);
         toast.error(
            error.response?.data?.message || "Failed to submit review"
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
                  Assigned Submissions
               </h1>
               <p className="text-gray-600 mt-2">
                  Review and provide feedback on assigned manuscripts
               </p>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                     <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search by title or author..."
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
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Revision Requested">
                           Revision Requested
                        </option>
                     </select>
                  </div>
               </div>
            </div>

            {/* Submissions Table */}
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
                              Date Assigned
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
                                       {submission.user?.name ||
                                          submission.author?.name ||
                                          "N/A"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       {submission.user?.email ||
                                          submission.author?.email}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span
                                       className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                                          submission.status === "Accepted"
                                             ? "bg-green-100 text-green-800"
                                             : submission.status === "Rejected"
                                             ? "bg-red-100 text-red-800"
                                             : submission.status ===
                                               "Under Review"
                                             ? "bg-blue-100 text-blue-800"
                                             : submission.status ===
                                               "Revision Requested"
                                             ? "bg-orange-100 text-orange-800"
                                             : "bg-yellow-100 text-yellow-800"
                                       }`}
                                    >
                                       {submission.status}
                                    </span>
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
                                             openReviewModal(submission)
                                          }
                                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                          title="Submit Review"
                                       >
                                          <MessageSquare className="w-5 h-5" />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td
                                 colSpan="5"
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
                                 : selectedSubmission.status ===
                                   "Revision Requested"
                                 ? "bg-orange-100 text-orange-800"
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
                              {selectedSubmission.user?.name ||
                                 selectedSubmission.author?.name ||
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
                              {selectedSubmission.user?.email ||
                                 selectedSubmission.author?.email ||
                                 "N/A"}
                           </p>
                        </div>

                        {(selectedSubmission.user?.affiliation ||
                           selectedSubmission.author?.organization) && (
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
                                 {selectedSubmission.user?.affiliation ||
                                    selectedSubmission.author?.organization}
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

                     {selectedSubmission.feedback && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                           <div className="flex items-center gap-2 mb-3">
                              <MessageSquare
                                 className="text-blue-600"
                                 size={18}
                              />
                              <p className="text-xs text-blue-600 font-semibold">
                                 YOUR FEEDBACK
                              </p>
                           </div>
                           <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                              {selectedSubmission.feedback.text ||
                                 selectedSubmission.feedback}
                           </p>
                        </div>
                     )}
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                     <button
                        onClick={() => {
                           setShowDetailsModal(false);
                           openReviewModal(selectedSubmission);
                        }}
                        className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                     >
                        <MessageSquare size={18} />
                        Submit Review
                     </button>
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

         {/* Review Modal */}
         {showReviewModal && selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                     <h2 className="text-2xl font-bold text-gray-800">
                        Submit Review
                     </h2>
                     <button
                        onClick={() => {
                           setShowReviewModal(false);
                           setFeedbackText("");
                           setDecision("Under Review");
                           setRating("");
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
                           Decision *
                        </label>
                        <select
                           value={decision}
                           onChange={(e) => setDecision(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                           <option value="Under Review">Under Review</option>
                           <option value="Accepted">Accept</option>
                           <option value="Rejected">Reject</option>
                           <option value="Revision Requested">
                              Request Revision
                           </option>
                        </select>
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                           Rating (Optional)
                        </label>
                        <select
                           value={rating}
                           onChange={(e) => setRating(e.target.value)}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                           <option value="">-- Select Rating --</option>
                           <option value="1">1 - Poor</option>
                           <option value="2">2 - Fair</option>
                           <option value="3">3 - Good</option>
                           <option value="4">4 - Very Good</option>
                           <option value="5">5 - Excellent</option>
                        </select>
                     </div>

                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                           Feedback *
                        </label>
                        <textarea
                           value={feedbackText}
                           onChange={(e) => setFeedbackText(e.target.value)}
                           placeholder="Provide detailed feedback for the author..."
                           rows={8}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                     </div>
                  </div>

                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
                     <button
                        onClick={() => {
                           setShowReviewModal(false);
                           setFeedbackText("");
                           setDecision("Under Review");
                           setRating("");
                        }}
                        className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleSubmitReview}
                        disabled={!feedbackText.trim()}
                        className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        <Send size={18} />
                        Submit Review
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ReviewerSubmissions;
