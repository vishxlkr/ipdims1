import React from "react";
import {
   BrowserRouter as Router,
   Routes,
   Route,
   Navigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pre-login pages
import Home from "./pages/prelogin/Home";
import Submission from "./pages/prelogin/Submission";
import Registration from "./pages/prelogin/Registration";
import ImportantDates from "./pages/prelogin/ImportantDates";
import Committee from "./pages/prelogin/Committee";
import Venue from "./pages/prelogin/Venue";
import ContactUs from "./pages/prelogin/ContactUs";
import Login from "./pages/prelogin/Login";
import AddSubmission from "./pages/postlogin/AddSubmission";

export default function App() {
   return (
      <div className="pt-16 bg-black">
         <ToastContainer />
         <Navbar />

         <Routes>
            {/* ------------------ Pre-login pages ------------------ */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/submission" element={<Submission />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/important-dates" element={<ImportantDates />} />
            <Route path="/committee" element={<Committee />} />
            <Route path="/venue" element={<Venue />} />
            <Route path="/contact-us" element={<ContactUs />} />
            {/* ---------------post login pages ------------- */}
            {/* <Route path="/my-profile" element={<MyProfile />} /> */}
            {/* <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/appointment/:docId" element={<Appointment />} /> */}

            {/* /new button */}
            <Route path="/add-submission" element={<AddSubmission />} />
         </Routes>

         <Footer />
      </div>
   );
}
