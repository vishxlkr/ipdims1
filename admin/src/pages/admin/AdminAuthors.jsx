import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminAuthors = () => {
   const [authors, setAuthors] = useState([]);
   const [loading, setLoading] = useState(false);
   const [selectedAuthor, setSelectedAuthor] = useState(null);
   const [authorSubmissions, setAuthorSubmissions] = useState([]);
   const token = localStorage.getItem("aToken");

   const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api/admin";

   // Fetch all authors
   const fetchAuthors = async () => {
      try {
         setLoading(true);
         const { data } = await axios.get(`${backendUrl}/users`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         if (data.success) setAuthors(data.users);
      } catch (error) {
         console.error("Error fetching authors:", error);
         toast.error("Failed to load authors");
      } finally {
         setLoading(false);
      }
   };

   // Fetch submissions of a specific author
   const fetchAuthorSubmissions = async (authorId) => {
      try {
         const { data } = await axios.get(
            `${backendUrl}/user/${authorId}/submissions`,
            {
               headers: { Authorization: `Bearer ${token}` },
            }
         );
         if (data.success) {
            setAuthorSubmissions(data.submissions);
         } else {
            setAuthorSubmissions([]);
         }
      } catch (error) {
         console.error("Error fetching submissions:", error);
         toast.error("Failed to fetch submissions");
      }
   };

   useEffect(() => {
      fetchAuthors();
   }, []);

   const handleViewSubmissions = (author) => {
      setSelectedAuthor(author);
      fetchAuthorSubmissions(author._id);
   };

   return (
      <div>
         <h2 className="text-2xl font-bold mb-4">Authors</h2>

         {loading ? (
            <p>Loading authors...</p>
         ) : authors.length === 0 ? (
            <p>No authors found.</p>
         ) : (
            <table className="w-full border-collapse border">
               <thead>
                  <tr className="bg-gray-200">
                     <th className="p-3 border">Name</th>
                     <th className="p-3 border">Email</th>
                     <th className="p-3 border">Phone</th>
                     <th className="p-3 border">Organization</th>
                     <th className="p-3 border">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {authors.map((author) => (
                     <tr key={author._id} className="border-b">
                        <td className="p-3">{author.name}</td>
                        <td className="p-3">{author.email}</td>
                        <td className="p-3">{author.phone || "N/A"}</td>
                        <td className="p-3">{author.organization || "N/A"}</td>
                        <td className="p-3">
                           <button
                              className="px-3 py-1 bg-blue-600 text-white rounded"
                              onClick={() => handleViewSubmissions(author)}
                           >
                              View Submissions
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}

         {selectedAuthor && (
            <div className="mt-6">
               <h3 className="text-xl font-semibold mb-2">
                  Submissions of {selectedAuthor.name}
               </h3>
               {authorSubmissions.length === 0 ? (
                  <p>No submissions found.</p>
               ) : (
                  <table className="w-full border-collapse border">
                     <thead>
                        <tr className="bg-gray-200">
                           <th className="p-2 border">Title</th>
                           <th className="p-2 border">Status</th>
                           <th className="p-2 border">Assigned Reviewer</th>
                        </tr>
                     </thead>
                     <tbody>
                        {authorSubmissions.map((sub) => (
                           <tr key={sub._id} className="border-b">
                              <td className="p-2">{sub.title}</td>
                              <td className="p-2">{sub.status}</td>
                              <td className="p-2">
                                 {sub.reviewer?.name || "N/A"}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               )}
            </div>
         )}
      </div>
   );
};

export default AdminAuthors;
