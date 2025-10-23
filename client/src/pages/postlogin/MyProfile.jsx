// import React, { useState, useContext, useEffect } from "react";
// import { AppContext } from "../../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ProfilePage = () => {
//    const { token, userData, setUserData, backendUrl, getUserData, loading } =
//       useContext(AppContext);

//    const [formData, setFormData] = useState({
//       name: "",
//       phone: "",
//       gender: "",
//       designation: "",
//       personalUrl: "",
//       organization: "",
//       address: "",
//       bio: "",
//       image: "",
//    });
//    const [imageFile, setImageFile] = useState(null);

//    useEffect(() => {
//       if (userData) {
//          setFormData({
//             name: userData.name || "",
//             phone: userData.phone || "",
//             gender: userData.gender || "Not Selected",
//             designation: userData.designation || "",
//             personalUrl: userData.personalUrl || "",
//             organization: userData.organization || "",
//             address: userData.address || "",
//             bio: userData.bio || "",
//             image: userData.image || "",
//          });
//       }
//    }, [userData]);

//    const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData({ ...formData, [name]: value });
//    };

//    const handleImageChange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//          setImageFile(file);
//          const reader = new FileReader();
//          reader.onloadend = () => {
//             setFormData({ ...formData, image: reader.result });
//          };
//          reader.readAsDataURL(file);
//       }
//    };

//    const handleSubmit = async (e) => {
//       e.preventDefault();
//       try {
//          const payload = new FormData();

//          // Append only non-empty text fields
//          for (let key of [
//             "name",
//             "phone",
//             "gender",
//             "designation",
//             "personalUrl",
//             "organization",
//             "address",
//             "bio",
//          ]) {
//             if (formData[key] && formData[key].length > 0) {
//                payload.append(key, formData[key]);
//             }
//          }

//          // Append image file only if user selected a new file
//          if (imageFile) {
//             payload.append("image", imageFile);
//          }

//          const { data } = await axios.post(
//             `${backendUrl}/api/user/update-profile`,
//             payload,
//             {
//                headers: {
//                   Authorization: `Bearer ${token}`,
//                   "Content-Type": "multipart/form-data",
//                },
//             }
//          );

//          if (data.success) {
//             toast.success("Profile updated successfully!");
//             setImageFile(null);
//             getUserData(); // refresh context data
//          } else {
//             toast.error(data.message);
//          }
//       } catch (error) {
//          toast.error(error.response?.data?.message || error.message);
//       }
//    };

//    if (loading) return <p>Loading...</p>;

//    return (
//       <div className="max-w-3xl mx-auto p-4">
//          <h2 className="text-2xl font-bold mb-4">My Profile</h2>
//          <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="flex items-center space-x-4">
//                <img
//                   src={formData.image}
//                   alt="Profile"
//                   className="w-24 h-24 rounded-full object-cover"
//                />
//                <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                />
//             </div>

//             <input
//                type="text"
//                name="name"
//                placeholder="Name"
//                value={formData.name}
//                onChange={handleChange}
//                className="w-full p-2 border rounded"
//             />
//             <input
//                type="email"
//                value={userData?.email}
//                disabled
//                className="w-full p-2 border rounded bg-gray-200"
//             />
//             <input
//                type="text"
//                name="phone"
//                placeholder="Phone"
//                value={formData.phone}
//                onChange={handleChange}
//                className="w-full p-2 border rounded"
//             />
//             <select
//                name="gender"
//                value={formData.gender}
//                onChange={handleChange}
//                className="w-full p-2 border rounded"
//             >
//                <option>Not Selected</option>
//                <option>Male</option>
//                <option>Female</option>
//                <option>Other</option>
//             </select>
//             <input
//                type="text"
//                name="designation"
//                placeholder="Designation"
//                value={formData.designation}
//                onChange={handleChange}
//                className="w-full p-2 border rounded"
//             />
//             <input
//                type="text"
//                name="personalUrl"
//                placeholder="Personal URL"
//                value={formData.personalUrl}
//                onChange={handleChange}
//                className="w-full p-2 border rounded"
//             />
//             <input
//                type="text"
//                name="organization"
//                placeholder="Organization"
//                value={formData.organization}
//                onChange={handleChange}
//                className="w-full p-2 border rounded"
//             />
//             <input
//                type="text"
//                name="address"
//                placeholder="Address"
//                value={formData.address}
//                onChange={handleChange}
//                className="w-full p-2 border rounded"
//             />
//             <textarea
//                name="bio"
//                placeholder="Bio"
//                value={formData.bio}
//                onChange={handleChange}
//                className="w-full p-2 border rounded"
//             />

//             <button
//                type="submit"
//                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//                Update Profile
//             </button>
//          </form>
//       </div>
//    );
// };

// export default ProfilePage;
import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
   Edit2,
   Save,
   X,
   Mail,
   Phone,
   Briefcase,
   Link2,
   Building,
   MapPin,
   User,
} from "lucide-react";

const ProfilePage = () => {
   const { token, userData, setUserData, backendUrl, getUserData, loading } =
      useContext(AppContext);

   const [isEditing, setIsEditing] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [formData, setFormData] = useState({
      name: "",
      phone: "",
      gender: "",
      designation: "",
      personalUrl: "",
      organization: "",
      address: "",
      bio: "",
      image: "",
   });
   const [imageFile, setImageFile] = useState(null);

   useEffect(() => {
      if (userData) {
         setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
            gender: userData.gender || "Not Selected",
            designation: userData.designation || "",
            personalUrl: userData.personalUrl || "",
            organization: userData.organization || "",
            address: userData.address || "",
            bio: userData.bio || "",
            image: userData.image || "",
         });
      }
   }, [userData]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setImageFile(file);
         const reader = new FileReader();
         reader.onloadend = () => {
            setFormData({ ...formData, image: reader.result });
         };
         reader.readAsDataURL(file);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSaving(true);
      try {
         const payload = new FormData();

         // Append only non-empty text fields
         for (let key of [
            "name",
            "phone",
            "gender",
            "designation",
            "personalUrl",
            "organization",
            "address",
            "bio",
         ]) {
            if (formData[key] && formData[key].length > 0) {
               payload.append(key, formData[key]);
            }
         }

         // Append image file only if user selected a new file
         if (imageFile) {
            payload.append("image", imageFile);
         }

         const { data } = await axios.post(
            `${backendUrl}/api/user/update-profile`,
            payload,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
               },
            }
         );

         if (data.success) {
            toast.success("Profile updated successfully!");
            setImageFile(null);
            setIsEditing(false);
            getUserData(); // refresh context data
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
      } finally {
         setIsSaving(false);
      }
   };

   const handleCancel = () => {
      setIsEditing(false);
      setImageFile(null);
      // Reset form to original userData
      if (userData) {
         setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
            gender: userData.gender || "Not Selected",
            designation: userData.designation || "",
            personalUrl: userData.personalUrl || "",
            organization: userData.organization || "",
            address: userData.address || "",
            bio: userData.bio || "",
            image: userData.image || "",
         });
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
         </div>
      );
   }

   return (
      <div className="max-w-4xl mx-auto p-6">
         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-l-to-r from-blue-600 to-blue-800 h-32"></div>

            <div className="px-8 pb-8">
               {/* Profile Image and Actions */}
               <div className="flex justify-between items-start -mt-16 mb-6">
                  <div className="relative">
                     <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg">
                        <img
                           src={
                              formData.image ||
                              "https://via.placeholder.com/150"
                           }
                           alt="Profile"
                           className="w-full h-full object-cover"
                        />
                     </div>
                     {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition-colors">
                           <Edit2 size={16} />
                           <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                           />
                        </label>
                     )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4">
                     {!isEditing ? (
                        <button
                           onClick={() => setIsEditing(true)}
                           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                           <Edit2 size={18} />
                           Edit Profile
                        </button>
                     ) : (
                        <div className="flex gap-2">
                           <button
                              onClick={handleSubmit}
                              disabled={isSaving}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              {isSaving ? (
                                 <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                 </>
                              ) : (
                                 <>
                                    <Save size={18} />
                                    Save Changes
                                 </>
                              )}
                           </button>
                           <button
                              onClick={handleCancel}
                              disabled={isSaving}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              <X size={18} />
                              Cancel
                           </button>
                        </div>
                     )}
                  </div>
               </div>

               {/* Profile Information */}
               <div className="space-y-6">
                  {/* Name Section */}
                  <div>
                     {isEditing ? (
                        <input
                           type="text"
                           name="name"
                           placeholder="Your Name"
                           value={formData.name}
                           onChange={handleChange}
                           className="text-3xl font-bold w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none pb-2 transition-colors"
                        />
                     ) : (
                        <h1 className="text-3xl font-bold text-gray-900">
                           {formData.name || "Your Name"}
                        </h1>
                     )}
                  </div>

                  {/* Grid Layout for Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Email (Read-only) */}
                     <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <Mail
                           className="text-gray-500 mt-1 shrink-0"
                           size={20}
                        />
                        <div className="flex-1">
                           <label className="text-sm font-medium text-gray-600 block mb-1">
                              Email
                           </label>
                           <p className="text-gray-900">
                              {userData?.email || "Not provided"}
                           </p>
                        </div>
                     </div>

                     {/* Phone */}
                     <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <Phone
                           className="text-gray-500 mt-1 shrink-0"
                           size={20}
                        />
                        <div className="flex-1">
                           <label className="text-sm font-medium text-gray-600 block mb-1">
                              Phone
                           </label>
                           {isEditing ? (
                              <input
                                 type="text"
                                 name="phone"
                                 placeholder="Your phone number"
                                 value={formData.phone}
                                 onChange={handleChange}
                                 className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                           ) : (
                              <p className="text-gray-900">
                                 {formData.phone || "Not provided"}
                              </p>
                           )}
                        </div>
                     </div>

                     {/* Gender */}
                     <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <User
                           className="text-gray-500 mt-1 shrink-0"
                           size={20}
                        />
                        <div className="flex-1">
                           <label className="text-sm font-medium text-gray-600 block mb-1">
                              Gender
                           </label>
                           {isEditing ? (
                              <select
                                 name="gender"
                                 value={formData.gender}
                                 onChange={handleChange}
                                 className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                 <option>Not Selected</option>
                                 <option>Male</option>
                                 <option>Female</option>
                                 <option>Other</option>
                              </select>
                           ) : (
                              <p className="text-gray-900">
                                 {formData.gender || "Not Selected"}
                              </p>
                           )}
                        </div>
                     </div>

                     {/* Designation */}
                     <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <Briefcase
                           className="text-gray-500 mt-1 shrink-0"
                           size={20}
                        />
                        <div className="flex-1">
                           <label className="text-sm font-medium text-gray-600 block mb-1">
                              Designation
                           </label>
                           {isEditing ? (
                              <input
                                 type="text"
                                 name="designation"
                                 placeholder="Your designation"
                                 value={formData.designation}
                                 onChange={handleChange}
                                 className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                           ) : (
                              <p className="text-gray-900">
                                 {formData.designation || "Not provided"}
                              </p>
                           )}
                        </div>
                     </div>

                     {/* Organization */}
                     <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <Building
                           className="text-gray-500 mt-1 shrink-0"
                           size={20}
                        />
                        <div className="flex-1">
                           <label className="text-sm font-medium text-gray-600 block mb-1">
                              Organization
                           </label>
                           {isEditing ? (
                              <input
                                 type="text"
                                 name="organization"
                                 placeholder="Your organization"
                                 value={formData.organization}
                                 onChange={handleChange}
                                 className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                           ) : (
                              <p className="text-gray-900">
                                 {formData.organization || "Not provided"}
                              </p>
                           )}
                        </div>
                     </div>

                     {/* Personal URL */}
                     <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <Link2
                           className="text-gray-500 mt-1 shrink-0"
                           size={20}
                        />
                        <div className="flex-1">
                           <label className="text-sm font-medium text-gray-600 block mb-1">
                              Personal URL
                           </label>
                           {isEditing ? (
                              <input
                                 type="text"
                                 name="personalUrl"
                                 placeholder="Your website or portfolio"
                                 value={formData.personalUrl}
                                 onChange={handleChange}
                                 className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                           ) : (
                              <p className="text-gray-900 break-all">
                                 {formData.personalUrl ? (
                                    <a
                                       href={formData.personalUrl}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-blue-600 hover:underline"
                                    >
                                       {formData.personalUrl}
                                    </a>
                                 ) : (
                                    "Not provided"
                                 )}
                              </p>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Address - Full Width */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                     <MapPin
                        className="text-gray-500 mt-1 shrink-0"
                        size={20}
                     />
                     <div className="flex-1">
                        <label className="text-sm font-medium text-gray-600 block mb-1">
                           Address
                        </label>
                        {isEditing ? (
                           <input
                              type="text"
                              name="address"
                              placeholder="Your address"
                              value={formData.address}
                              onChange={handleChange}
                              className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                        ) : (
                           <p className="text-gray-900">
                              {formData.address || "Not provided"}
                           </p>
                        )}
                     </div>
                  </div>

                  {/* Bio - Full Width */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                     <label className="text-sm font-medium text-gray-600 block mb-2">
                        Bio
                     </label>
                     {isEditing ? (
                        <textarea
                           name="bio"
                           placeholder="Tell us about yourself..."
                           value={formData.bio}
                           onChange={handleChange}
                           rows="4"
                           className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                     ) : (
                        <p className="text-gray-900 whitespace-pre-wrap">
                           {formData.bio || "No bio provided"}
                        </p>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProfilePage;
