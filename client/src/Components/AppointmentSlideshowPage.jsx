import React, { useState, useEffect } from 'react';
import { FaMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

// SwiperJS Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';

// SwiperJS CSS Imports
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

// --- SVG Icons & Helper Functions (No Changes Here) ---
const ClockIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const UserIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const CalendarIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const PhoneIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>);
const StethoscopeIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.276a11.952 11.952 0 01-1.293 2.913M2.388 18.005c.877-1.357 2.057-2.348 3.37-2.704m-.342-1.817a8.6 8.6 0 012.357-4.223M13 16h6M8 20h9a2 2 0 002-2v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>);
const ClipboardIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);
const formatDate = (dateString) => { const options = { year: 'numeric', month: 'short', day: 'numeric' }; return new Date(dateString).toLocaleDateString(undefined, options); };
const calculateDaysLeft = (appointmentDate) => { const today = new Date(); today.setHours(0, 0, 0, 0); const apptDate = new Date(appointmentDate); const diffTime = apptDate.getTime() - today.getTime(); if (isNaN(diffTime)) return 'N/A'; const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); if (diffDays < 0) return 'Past'; if (diffDays === 0) return 'Today'; return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} left`; };
const calculateAge = (dob) => { if (!dob) return 'N/A'; const birthDate = new Date(dob); const today = new Date(); let age = today.getFullYear() - birthDate.getFullYear(); const m = today.getMonth() - birthDate.getMonth(); if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; } return age; };


// --- Appointment Card Component (No Changes) ---
const AppointmentCard = ({ appointment, theme }) => {
    const navigate = useNavigate();
    const isDark = theme === 'dark';
    const iconColor = isDark ? 'text-gray-400' : 'text-gray-500';

    const handleViewDetails = () => {
        if (appointment.patientId) {
            navigate(`/patient/${appointment.patientId}/history`, {
                state: { currentAppointment: appointment } 
            });
        } else {
            console.error("Patient ID is missing, cannot navigate.");
        }
    };

    const patientName = appointment.patient?.patientName || 'Unknown Patient';
    const patientAge = calculateAge(appointment.patient?.dob);
    const patientContact = appointment.patient?.contact || 'N/A';
    const patientGender = appointment.patient?.gender || 'N/A';

    return (
        <div className={`flex flex-col h-full p-6 rounded-2xl shadow-xl border ${isDark ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`flex justify-between items-center mb-4 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                    <StethoscopeIcon className={isDark ? "text-green-400" : "text-green-600"} />
                    <h3 className={`text-2xl font-bold ml-2 capitalize ${isDark ? 'text-green-400' : 'text-black'}`}>
                        {patientName}
                    </h3>
                </div>
                <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
                    <ClockIcon className="mr-1" />
                    <span>
                        {appointment.status === 'Scheduled' ? calculateDaysLeft(appointment.appointmentDate) : 'Completed'}
                    </span>
                </div>
            </div>
            <div className={`grid grid-cols-2 gap-y-4 gap-x-6 text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center"><UserIcon className={iconColor} /><span className="ml-2">Age: {patientAge}</span></div>
                <div className="flex items-center"><PhoneIcon className={iconColor} /><span className="ml-2">{patientContact}</span></div>
                <div className="flex items-center"><CalendarIcon className={iconColor} /><span className="ml-2">Date: {formatDate(appointment.appointmentDate)}</span></div>
                <div className="flex items-center"><UserIcon className={iconColor} /><span className="ml-2">Gender: {patientGender}</span></div>
                <div className="flex items-center col-span-2"><ClipboardIcon className={iconColor} /><span className="ml-2">Reason: {appointment.reason || 'N/A'}</span></div>
            </div>
            <div className="mt-auto">
                <button onClick={handleViewDetails} className="w-full py-3 px-6 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out shadow-lg">View Appointment Details</button>
            </div>
        </div>
    );
};

// --- Main Page Component (UPDATED) ---
const AppointmentSlideshowPage = () => {
    // Initialize theme from localStorage
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NEW: State for stats ---
    const [todayCount, setTodayCount] = useState(0);
    const [newPatientCount, setNewPatientCount] = useState(0);
    // --- END NEW ---

    // --- UPDATED: Sync theme with global changes via MutationObserver ---
    useEffect(() => {
        const updateTheme = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'dark' : 'light');
        };

        // Initial update
        updateTheme();

        // Observe changes to the 'dark' class on documentElement
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });

        return () => observer.disconnect();
    }, []);
    // --- END UPDATED ---

    // --- UPDATED: useEffect to calculate stats ---
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/appointmentdetails');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json(); // This is the FULL list
                
                // --- 1. CALCULATE STATS from the full 'data' list ---
                const today = new Date().toISOString().split('T')[0]; // Gets date as "YYYY-MM-DD"
                
                const appointmentsToday = data.filter(app => {
                    const appDate = new Date(app.appointmentDate).toISOString().split('T')[0];
                    return appDate === today;
                });
                
                // Assumes reason is 'New Patient'. Adjust if your data is different.
                const newPatientsToday = appointmentsToday.filter(
                    app => app.reason && app.reason.toLowerCase() === 'new patient'
                );

                setTodayCount(appointmentsToday.length);
                setNewPatientCount(newPatientsToday.length);

                // --- 2. FILTER for the slideshow (your existing logic) ---
                const activeAppointments = data.filter(app => app.status !== 'Completed');
                setAppointments(activeAppointments);
                // --- END UPDATES ---

            } catch (err){
                setError(err.message);
                console.error("Failed to fetch appointments:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className={`min-h-screen p-4 pb-36 sm:p-6 lg:p-8 font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-[#0F172A] to-[#1E293B]' : 'bg-gray-100'}`}>
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex justify-between items-center">
                    <div className="text-left"><h1 className={`text-5xl font-extrabold mb-3 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Appointments</h1><p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Manage your scheduled consultations.</p></div>
                    {/* REMOVED: Local toggle button - now controlled by Navbar */}
                </header>

                {/* --- NEW: STATS CARDS --- */}
                <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className={`p-6 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-blue-700 to-blue-900' : 'bg-blue-100'}`}>
                        <h3 className={`text-sm font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-blue-200' : 'text-blue-600'}`}>Appointments Today</h3>
                        <p className={`mt-2 text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>{loading ? '...' : todayCount}</p>
                    </div>
                    <div className={`p-6 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-green-700 to-green-900' : 'bg-green-100'}`}>
                        <h3 className={`text-sm font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-green-200' : 'text-green-600'}`}>New Patients Today</h3>
                        <p className={`mt-2 text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>{loading ? '...' : newPatientCount}</p>
                    </div>
                </div>
                {/* --- END NEW --- */}


                <style>{`.swiper-pagination-bullet { width: 8px; height: 8px; background-color: ${theme === 'dark' ? '#4A5568' : '#CBD5E0'}; opacity: 1; transition: background-color 0.3s ease; } .swiper-pagination-bullet-active { background-color: ${theme === 'dark' ? '#4299E1' : '#3182CE'}; }`}</style>

                <main>
                    {/* We can add a title for the slideshow section */}
                    <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Upcoming Appointments</h2>

                    {loading && <p className={`text-center text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Loading appointments...</p>}
                    {error && <p className={`text-center text-xl text-red-500`}>Error: {error}</p>}
                    
                    {!loading && !error && (
                        <>
                            {appointments.length > 0 ? (
                                <Swiper
                                    modules={[Pagination, Autoplay, FreeMode]}
                                    spaceBetween={30}
                                    loop={appointments.length > 2} // Loop if there are more than 2 slides
                                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                                    pagination={{ el: '.swiper-pagination-container', clickable: true }}
                                    breakpoints={{
                                        640: { slidesPerView: 1, spaceBetween: 20 },
                                        768: { slidesPerView: 2, spaceBetween: 30 },
                                        1024: { slidesPerView: 3, spaceBetween: 30 },
                                    }}
                                    className="mySwiper"
                                >
                                    {appointments.map(app => (
                                        <SwiperSlide key={app._id} style={{ height: 'auto', paddingBottom: '1rem' }}>
                                            <AppointmentCard appointment={app} theme={theme} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <p className={`text-center text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>No scheduled appointments found.</p>
                            )}
                            <div className="swiper-pagination-container flex justify-center pt-8"></div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AppointmentSlideshowPage;