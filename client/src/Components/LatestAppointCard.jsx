import React, { useState, useEffect } from 'react';
import { FaMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";


// --- MOCK DATA ---
const appointments = [
  {
    id: 1,
    patientName: 'Pratik Khodka',
    age: 19,
    contact: '07023456789',
    appointmentDate: '2025-10-24',
    appointmentTime: '11:30 AM',
    status: 'Upcoming',
    reason: 'Routine Check-up',
    doctor: 'Dr. Emily White'
  },
  {
    id: 2,
    patientName: 'Sahil Pagare',
    age: 20,
    contact: '07028075513',
    appointmentDate: '2025-10-19',
    appointmentTime: '02:00 PM',
    status: 'Upcoming',
    reason: 'Follow-up for Flu',
    doctor: 'Dr. John Smith'
  },
  {
    id: 3,
    patientName: 'Aisha Sharma',
    age: 34,
    contact: '09876543210',
    appointmentDate: '2025-10-12',
    appointmentTime: '09:00 AM',
    status: 'Completed',
    reason: 'Annual Physical',
    doctor: 'Dr. Emily White'
  },
  {
    id: 4,
    patientName: 'Rahul Verma',
    age: 28,
    contact: '08877665544',
    appointmentDate: '2025-10-28',
    appointmentTime: '04:00 PM',
    status: 'Upcoming',
    reason: 'Allergy Consultation',
    doctor: 'Dr. Sarah Lee'
  },
];

// --- SVG Icons (can be used by any theme) ---
const ClockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
  
const UserIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
  
const CalendarIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
  
const PhoneIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
  
const StethoscopeIcon = ({ className }) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.276a11.952 11.952 0 01-1.293 2.913M2.388 18.005c.877-1.357 2.057-2.348 3.37-2.704m-.342-1.817a8.6 8.6 0 012.357-4.223M13 16h6M8 20h9a2 2 0 002-2v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2z" />
      </svg>
);
  
const ClipboardIcon = ({ className }) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
);

// --- Helper Functions ---
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const calculateDaysLeft = (appointmentDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
    const apptDate = new Date(appointmentDate);
    const diffTime = apptDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} left`;
};

// --- Appointment Card Component (Theme-Aware) ---
const AppointmentCard = ({ appointment, theme }) => {
  const isDark = theme === 'dark';
  
  const iconColor = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`
      p-6 rounded-2xl shadow-xl border 
      hover:shadow-2xl hover:scale-[1.01] transition-all duration-300
      ${isDark 
        ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-gray-700' 
        : 'bg-white border-gray-200'
      }
    `}>
      {/* Header */}
      <div className={`flex justify-between items-center mb-4 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center">
          <StethoscopeIcon className={isDark ? "text-green-400" : "text-green-600"} />
          <h3 className={`text-2xl font-bold ml-2 ${isDark ? 'text-green-400' : 'text-green'}`}>{appointment.patientName}</h3>
        </div>
        <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
          <ClockIcon className="mr-1" />
          <span>{appointment.status === 'Upcoming' ? calculateDaysLeft(appointment.appointmentDate) : appointment.status}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className={`grid grid-cols-2 gap-y-4 gap-x-6 text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="flex items-center"><UserIcon className={iconColor} /><span className="ml-2">Age: {appointment.age}</span></div>
        <div className="flex items-center"><PhoneIcon className={iconColor} /><span className="ml-2">Contact: {appointment.contact}</span></div>
        <div className="flex items-center"><CalendarIcon className={iconColor} /><span className="ml-2">Date: {formatDate(appointment.appointmentDate)}</span></div>
        <div className="flex items-center"><ClockIcon className={iconColor} /><span className="ml-2">Time: {appointment.appointmentTime}</span></div>
        <div className="flex items-center col-span-2"><ClipboardIcon className={iconColor} /><span className="ml-2">Reason: {appointment.reason}</span></div>
      </div>

      {/* CTA Button */}
      <button
        className="w-full py-3 px-6 rounded-xl text-lg font-semibold text-white
                   bg-gradient-to-r from-green-500 to-emerald-600 
                   hover:from-green-600 hover:to-emerald-700
                   focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50
                   transition-all duration-300 ease-in-out shadow-lg"
      >
        View Appointment Details
      </button>
    </div>
  );
};

// --- Main Page Component ---
const LatestAppointCard = () => {
  // --- THEME LOGIC ---
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className={`
      min-h-screen p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300
      ${theme === 'dark' 
        ? 'bg-gradient-to-br from-[#0F172A] to-[#1E293B]' 
        : 'bg-gray-100'
      }
    `}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div className="text-left">
            <h1 className={`text-5xl font-extrabold mb-3 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Appointments
            </h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your scheduled consultations.
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={20} /> : <FaMoon size={20} />}
          </button>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appointments.map(app => (
              <AppointmentCard key={app.id} appointment={app} theme={theme} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LatestAppointCard;