import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Make sure useNavigate is imported

const BookAppoint = () => {
  const [allAppointments, setAllAppointments] = useState([]); // <-- Holds the original full list
  const [filteredAppointments, setFilteredAppointments] = useState([]); // <-- Holds the list to be displayed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // <-- NEW: State for the search input
  const navigate = useNavigate(); // <-- NEW: Hook for navigation

  // Fetch data on initial load
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/viewappoint');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setAllAppointments(data); // <-- Store the full list
        setFilteredAppointments(data); // <-- Initialize the displayed list
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // <-- NEW: Effect to handle filtering when searchTerm changes
  useEffect(() => {
    const results = allAppointments.filter(app =>
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contact.includes(searchTerm) ||
      app.patientId.includes(searchTerm)
    );
    setFilteredAppointments(results);
  }, [searchTerm, allAppointments]);

  // --- NEW: Handlers for the buttons ---
  const handleViewHistory = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const handleBookFollowUp = (patientRecord) => {
    // Navigate to the booking page and pass the patient's data
    // This allows the receptionist page to pre-fill the form
    navigate('/reception-dashboard', { state: { existingPatient: patientRecord } });
  };

  const formatDate = (dateString) => { /* ... no changes ... */ };
  const StatusBadge = ({ status }) => { /* ... no changes ... */ };

  if (loading) return <div className="text-center p-10">Loading appointments...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">All Appointments</h1>
          <p className="text-md text-gray-500 mt-2">A complete record of all patient appointments.</p>
        </header>
        
        {/* --- NEW: Search Bar --- */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name, contact, or Patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            {filteredAppointments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Date</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> {/* <-- NEW */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{app.patientName}</div>
                        <div className="text-sm text-gray-500 font-mono">{app.patientId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(app.appointmentDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm"><StatusBadge status={app.status} /></td>
                      {/* --- NEW: Action Buttons --- */}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                        <button onClick={() => handleBookFollowUp(app)} className="text-indigo-600 hover:text-indigo-900">Book Follow-up</button>
                        <button onClick={() => handleViewHistory(app.patientId)} className="text-green-600 hover:text-green-900">View History</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 py-10">No appointments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppoint;