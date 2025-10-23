import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
   const { token, userData, setUserData, backendUrl, getUserData } =
      useContext(AppContext);
   const [isEdit, setIsEdit] = useState(false);
   const [previewImage, setPreviewImage] = useState(userData?.image || "");

   // Update profile function
   const updateProfile = async () => {
      try {
         const formData = new FormData();
         formData.append("name", userData.name);
         formData.append("phone", userData.phone || "");
         formData.append("designation", userData.designation || "");
         formData.append("personalUrl", userData.personalUrl || "");
         formData.append("organization", userData.organization || "");
         formData.append("address", userData.address || "");
         formData.append("bio", userData.bio || "");
         if (userData.image instanceof File)
            formData.append("image", userData.image);

         const { data } = await axios.post(
            `${backendUrl}/api/user/update-profile`,
            formData,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
               },
            }
         );

         if (data.success) {
            toast.success(data.message);
            setIsEdit(false);
            getUserData();
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.message);
         console.error(error);
      }
   };

   useEffect(() => {
      if (token) {
         getUserData();
         setPreviewImage(userData?.image || "");
      }
   }, [token]);

   if (!userData) return null;

   return (
      <div className="flex flex-col md:flex-row gap-6 m-5">
         {/* Image Section */}
         <div className="flex flex-col items-center gap-4">
            <img
               src={previewImage}
               alt="Profile"
               className="w-48 h-48 rounded-full object-cover border border-gray-300"
            />
            {isEdit && (
               <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                     const file = e.target.files[0];
                     setUserData((prev) => ({ ...prev, image: file }));
                     setPreviewImage(URL.createObjectURL(file));
                  }}
               />
            )}
         </div>

         {/* Info Section */}
         <div className="flex-1 border border-gray-700 rounded-xl p-6 bg-white/10 backdrop-blur-md">
            {/* Name */}
            <p className="text-3xl font-semibold text-indigo-400 mb-2">
               {isEdit ? (
                  <input
                     type="text"
                     value={userData.name}
                     onChange={(e) =>
                        setUserData((prev) => ({
                           ...prev,
                           name: e.target.value,
                        }))
                     }
                     className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white"
                  />
               ) : (
                  userData.name
               )}
            </p>

            {/* Email (non-editable) */}
            <p className="text-gray-300 mb-4">{userData.email}</p>

            {/* Other Details */}
            <div className="grid md:grid-cols-2 gap-4">
               {/* Phone */}
               <div>
                  <label className="text-gray-300 font-medium">Phone</label>
                  {isEdit ? (
                     <input
                        type="text"
                        value={userData.phone || ""}
                        onChange={(e) =>
                           setUserData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                           }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white"
                     />
                  ) : (
                     <p className="text-gray-200">
                        {userData.phone || "Not set"}
                     </p>
                  )}
               </div>

               {/* Designation */}
               <div>
                  <label className="text-gray-300 font-medium">
                     Designation
                  </label>
                  {isEdit ? (
                     <input
                        type="text"
                        value={userData.designation || ""}
                        onChange={(e) =>
                           setUserData((prev) => ({
                              ...prev,
                              designation: e.target.value,
                           }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white"
                     />
                  ) : (
                     <p className="text-gray-200">
                        {userData.designation || "Not set"}
                     </p>
                  )}
               </div>

               {/* Personal URL */}
               <div>
                  <label className="text-gray-300 font-medium">
                     Personal URL
                  </label>
                  {isEdit ? (
                     <input
                        type="text"
                        value={userData.personalUrl || ""}
                        onChange={(e) =>
                           setUserData((prev) => ({
                              ...prev,
                              personalUrl: e.target.value,
                           }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white"
                     />
                  ) : (
                     <p className="text-gray-200">
                        {userData.personalUrl || "Not set"}
                     </p>
                  )}
               </div>

               {/* Organization */}
               <div>
                  <label className="text-gray-300 font-medium">
                     Organization
                  </label>
                  {isEdit ? (
                     <input
                        type="text"
                        value={userData.organization || ""}
                        onChange={(e) =>
                           setUserData((prev) => ({
                              ...prev,
                              organization: e.target.value,
                           }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white"
                     />
                  ) : (
                     <p className="text-gray-200">
                        {userData.organization || "Not set"}
                     </p>
                  )}
               </div>

               {/* Address */}
               <div className="md:col-span-2">
                  <label className="text-gray-300 font-medium">Address</label>
                  {isEdit ? (
                     <input
                        type="text"
                        value={userData.address || ""}
                        onChange={(e) =>
                           setUserData((prev) => ({
                              ...prev,
                              address: e.target.value,
                           }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white"
                     />
                  ) : (
                     <p className="text-gray-200">
                        {userData.address || "Not set"}
                     </p>
                  )}
               </div>

               {/* Bio */}
               <div className="md:col-span-2">
                  <label className="text-gray-300 font-medium">Bio</label>
                  {isEdit ? (
                     <textarea
                        value={userData.bio || ""}
                        onChange={(e) =>
                           setUserData((prev) => ({
                              ...prev,
                              bio: e.target.value,
                           }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white"
                     />
                  ) : (
                     <p className="text-gray-200">
                        {userData.bio || "Not set"}
                     </p>
                  )}
               </div>
            </div>

            {/* Buttons */}
            <div className="mt-6">
               {isEdit ? (
                  <button
                     onClick={updateProfile}
                     className="px-5 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all"
                  >
                     Save
                  </button>
               ) : (
                  <button
                     onClick={() => setIsEdit(true)}
                     className="px-5 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all"
                  >
                     Edit Profile
                  </button>
               )}
            </div>
         </div>
      </div>
   );
};

export default UserProfile;
