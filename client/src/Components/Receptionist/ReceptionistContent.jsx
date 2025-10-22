import React from "react";
// Updated icons to match the new receptionist workflow
import { FaCalendarCheck, FaUsers, FaArchive } from "react-icons/fa"; 
import { useSelector } from "react-redux";

const ReceptionistContent = () => {
  const theme = useSelector((state) => state.theme.mode);

  return (
    <div id="how-it-works"
      className={`py-10 px-4 min-h-screen transition-all duration-300 ${
        theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <h2 className="text-4xl font-bold text-center mt-16 mb-10">
        How Your Dashboard{" "}
        <span className="text-blue-500">Works?</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      
        {/* Card 1: Book Appointments */}
        <div
          className={`rounded-2xl p-6 shadow hover:shadow-lg transition ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-blue-500">
            <FaCalendarCheck size={30}/>
            <h3 className="text-xl font-bold">Book New Appointments</h3>
          </div>
          <p
            className={`mb-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Efficiently book new appointments for patients. You can search for existing patients or add a new patient record, including their vitals and reason for visit.
          </p>
          <div className="flex justify-between text-sm text-blue-400 font-medium">
            <a href="#" className="hover:underline flex items-center gap-1">
              Book Appointment<span>&rarr;</span>
            </a>
          </div>
        </div>

        
        {/* Card 2: View All Records */}
        <div
          className={`rounded-2xl p-6 shadow hover:shadow-lg transition ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-blue-500">
            <FaUsers size={30}/>
            <h3 className="text-xl font-bold">View All Appointments</h3>
          </div>
          <p
            className={`mb-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Access a complete record of all patient appointments, including completed and upcoming ones. Quickly view patient details, contact info, and appointment status.
          </p>
          <div className="flex justify-between text-sm text-blue-400 font-medium">
            <a href="#" className="hover:underline flex items-center gap-1">
              View All Records<span>&rarr;</span>
            </a>
          </div>
        </div>

        
        {/* Card 3: Archive Records */}
        <div
          className={`rounded-2xl p-6 shadow hover:shadow-lg transition ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-green-500">
            <FaArchive size={30}/>
            <h3 className="text-xl font-bold">Update & Archive Records</h3>
          </div>
          <p
            className={`mb-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Keep the appointment list clean by managing its status. After a visit, mark the appointment as 'Completed' to archive it from the main list.
          </p>
          <div className="flex justify-between text-sm text-blue-400 font-medium">
            <a href="#" className="hover:underline flex items-center gap-1">
              Manage Records<span>&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistContent;