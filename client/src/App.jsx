import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar.jsx";
import Home from "./Components/DoctorDashBoard.jsx";
import Login from "./Components/Login.jsx"; // example login page
import AddDetails from "./Components/AddDetails.jsx";
import DiseasePage from "./Components/DiseasePage.jsx";
import Recommend from "./Components/Recommend.jsx";
import Signup from "./Components/Signup.jsx";
import VerifyOTP from "./Components/VerifyOTP.jsx";
import Suggestion from "./Components/Suggestions.jsx";
import DoctorAppointmentPage from "./Components/DoctorAppointmentPage.jsx";
import LatestAppointCard from "./Components/LatestAppointCard.jsx";
import AppointmentSlideshowPage from "./Components/AppointmentSlideshowPage.jsx";
import ReceptionistDashBoard from "./Components/Receptionist/ReceptionistDashBoard.jsx";
import RecepHomepage from "./Components/Receptionist/RecepHomepage.jsx";
import ViewAppointments from "./Components/Receptionist/ViewAppointments.jsx";
import PatientDashboard from "./Components/PatientDashboard.jsx";
import BookAppoint from "./Components/Receptionist/BookAppoint.jsx";
import PatientHistory from "./Components/PatientHistory.jsx";
import ArchivedAppointments from "./Components/Receptionist/ArchivedAppointments.jsx";
import ReceptionistHomePage from "./Components/Receptionist/ReceptionistHomePage.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import DoctorDashBoard from "./Components/DoctorDashBoard.jsx";
import ProtectedRoute from './ProtectedRoute';
import CompletedAppointmentsPage from "./Components/CompletedAppointmentsPage.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Navbar */}
        {/* <Navbar /> */}

        {/* Main Content */}
        <main className="">
          <Routes>
            <Route path="/doctor-home" element={<DoctorDashBoard/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/addDetails" element={<AddDetails />} />
            <Route path="/disease" element={<DiseasePage />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/suggestion" element={<Suggestion />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reception-dash" element={<ReceptionistDashBoard />} />
            <Route path="/recephomepage" element={<RecepHomepage />} />
            <Route path="/viewappoint" element={<ViewAppointments />} />
            <Route path="/showappoint" element={<DoctorAppointmentPage />} />
            <Route path="/latestappoint" element={<LatestAppointCard />} />
            <Route
              path="/appoint-slide"
              element={<AppointmentSlideshowPage />}
            />
            <Route
              path="/patient/:patientId/history"
              element={<PatientDashboard />}
            />
            <Route path="/bookappoint" element={<BookAppoint />} />
            <Route path="/pat-history" element={<PatientHistory />} />
            <Route
              path="/archived-appointments"
              element={<ArchivedAppointments />}
            />
            <Route path="/recep-homepage" element={<ReceptionistHomePage />} />
            <Route path="/forgot-pass" element={<ForgotPassword />} />
              <Route path="/" element={<ReceptionistHomePage />} />
              <Route path="/completed-records" element={<CompletedAppointmentsPage />} />
              <Route path="/archived-records" element={<ArchivedAppointments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
