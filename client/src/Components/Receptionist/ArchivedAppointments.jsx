import React, { useState, useEffect } from 'react';
// NEW: Import Redux hooks, theme action, and icons
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice'; // <-- Adjust path if needed
import { FaMoon, FaSun, FaFileArchive } from 'react-icons/fa';

const ArchivedAppointments = () => {
  const [archivedAppointments, setArchivedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW: Get theme state from Redux ---
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  // --- NEW: useEffect to apply theme to the page ---
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const fetchArchived = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments/archived', { cache: 'no-store' });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setArchivedAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArchived();
  }, []);

  // --- Helper functions ---
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  // --- UPDATED: StatusBadge now theme-aware with modern rounded design ---
  const StatusBadge = ({ status, theme }) => {
    const base = "px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-lg shadow-md transition-all duration-200";
    const isDark = theme === 'dark';
    
    // Use gray for archived 'Completed'
    if (status === 'Completed') {
      return <span className={`${base} ${isDark ? 'bg-gray-600/80 text-gray-200 backdrop-blur-sm border border-gray-500/30' : 'bg-gray-300/80 text-gray-700 border border-gray-300/50'}`}>Completed</span>;
    }
    if (status === 'Scheduled') {
      return <span className={`${base} ${isDark ? 'bg-yellow-600/80 text-yellow-100 backdrop-blur-sm border border-yellow-500/30' : 'bg-yellow-100/80 text-yellow-800 border border-yellow-300/50'}`}>Scheduled</span>;
    }
    return <span className={`${base} ${isDark ? 'bg-gray-500/80 text-gray-100 backdrop-blur-sm border border-gray-500/30' : 'bg-gray-100/80 text-gray-800 border border-gray-300/50'}`}>{status}</span>;
  };

  // --- UPDATED: ReasonBadge now theme-aware with modern rounded design ---
  const ReasonBadge = ({ reason, theme }) => {
      const base = "px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-lg capitalize shadow-md transition-all duration-200";
      const isDark = theme === 'dark';
      if (!reason) return null;
      const lowerCaseReason = reason.toLowerCase();

      if (lowerCaseReason.includes('new patient')) {
        return <span className={`${base} ${isDark ? 'bg-purple-700/80 text-purple-100 backdrop-blur-sm border border-purple-500/30' : 'bg-purple-100/80 text-purple-800 border border-purple-300/50'}`}>{reason}</span>;
      }
      if (lowerCaseReason.includes('follow-up')) {
        return <span className={`${base} ${isDark ? 'bg-blue-700/80 text-blue-100 backdrop-blur-sm border border-blue-500/30' : 'bg-blue-100/80 text-blue-800 border border-blue-300/50'}`}>{reason}</span>;
      }
      return <span className={`${base} ${isDark ? 'bg-gray-600/80 text-gray-100 backdrop-blur-sm border border-gray-500/30' : 'bg-gray-100/80 text-gray-800 border border-gray-300/50'}`}>{reason}</span>;
  };
  // --- End Helper Functions ---

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading archived records...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Error: {error}</p>
      </div>
    </div>
  );

  return (
    // UPDATED: Main background with subtle gradient
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* UPDATED: Header with enhanced styling and icon */}
        <header className="mb-12 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <FaFileArchive className={`w-7 h-7 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className={`text-4xl sm:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Archived Appointments</h1>
              <p className={`text-base mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Records that have been completed and archived.</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`p-3 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              theme === 'dark'
                ? 'bg-gray-700/50 text-yellow-400 hover:bg-gray-600/50 backdrop-blur-sm'
                : 'bg-white/50 text-blue-600 hover:bg-gray-200/50'
            }`}
            title="Toggle theme"
            aria-label="Toggle light/dark mode"
          >
            {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
        </header>

        {/* UPDATED: Main content card with enhanced shadow and border */}
        <div className={`rounded-3xl shadow-2xl border border-gray-200/30 overflow-hidden ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50' : 'bg-white/80'}`}>
          <div className="overflow-x-auto">
            {archivedAppointments.length > 0 ? (
              // UPDATED: Table with increased size, zebra striping, better borders, and classy hover effects
              <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700/50' : 'divide-gray-200/50'}`}>
                <thead className={`${theme === 'dark' ? 'bg-gray-700/50 backdrop-blur-sm' : 'bg-gray-50/50'}`}>
                  <tr>
                    <th className={`px-8 py-5 text-left text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Patient ID</th>
                    <th className={`px-8 py-5 text-left text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Patient Name</th>
                    <th className={`px-8 py-5 text-left text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Contact</th>
                    <th className={`px-8 py-5 text-left text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>DOB</th>
                    <th className={`px-8 py-5 text-left text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Gender</th>
                    <th className={`px-8 py-5 text-left text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Appointment Date</th>
                    <th className={`px-8 py-5 text-left text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Reason</th>
                    <th className={`px-8 py-5 text-left text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Sugar Level</th>
                    <th className={`px-8 py-5 text-left text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>BP</th>
                    <th className={`px-8 py-5 text-left text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Stage</th>
                    <th className={`px-8 py-5 text-center text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'bg-transparent divide-gray-700/50' : 'bg-transparent divide-gray-200/50'}`}>
                  {archivedAppointments.map((app, index) => (
                    <tr 
                      key={app._id} 
                      className={`transition-all duration-300 border-b border-gray-200/20 last:border-b-0 ${
                        index % 2 === 0 
                          ? (theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50/50') 
                          : (theme === 'dark' ? 'bg-gray-800/10' : 'bg-white/50')
                      } hover:bg-opacity-90 ${
                        theme === 'dark' 
                          ? 'hover:bg-gray-700/60 hover:shadow-md' 
                          : 'hover:bg-gray-100/90 hover:shadow-lg'
                      }`}
                    >
                      <td className={`px-8 py-5 whitespace-nowrap text-base font-mono font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{app.patientId}</td>
                      <td className={`px-8 py-5 whitespace-nowrap text-base font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{app.patient?.patientName || 'N/A'}</td>
                      <td className={`px-8 py-5 whitespace-nowrap text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{app.patient?.contact || 'N/A'}</td>
                      <td className={`px-8 py-5 whitespace-nowrap text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(app.patient?.dob)}</td>
                      <td className={`px-8 py-5 whitespace-nowrap text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{app.patient?.gender || 'N/A'}</td>
                      <td className={`px-8 py-5 whitespace-nowrap text-base font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(app.appointmentDate)}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-base">
                        {/* UPDATED: Pass theme prop */}
                        <ReasonBadge reason={app.reason} theme={theme} />
                      </td>
                      <td className={`px-8 py-5 whitespace-nowrap text-base font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{app.sugarLevel}</td>
                      <td className={`px-8 py-5 whitespace-nowrap text-base font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{app.bp}</td>
                      <td className={`px-8 py-5 whitespace-nowrap text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{app.diseaseStage || 'N/A'}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-center text-base">
                        {/* UPDATED: Pass theme prop */}
                        <StatusBadge status={app.status} theme={theme} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // UPDATED: Enhanced empty state with icon and better styling
              <div className="text-center py-20">
                <div className={`w-32 h-32 mx-auto mb-8 p-8 rounded-3xl shadow-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'}`}>
                  <FaFileArchive className={`w-full h-full ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>No archived appointments yet</h3>
                <p className={`text-base ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Completed records will appear here once archived.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivedAppointments;