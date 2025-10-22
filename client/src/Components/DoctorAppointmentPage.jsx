import React from 'react';

// --- MOCK DATA ---
// In a real application, you would fetch this data from an API.
const appointments = [
  {
    id: 1,
    patientName: 'Pratik Khodka',
    age: 19,
    contact: '07023456789',
    appointmentDate: '2025-10-24',
    appointmentTime: '11:30 AM',
    status: 'Upcoming'
  },
  {
    id: 2,
    patientName: 'Sahil Pagare',
    age: 20,
    contact: '07028075513',
    appointmentDate: '2025-10-19',
    appointmentTime: '02:00 PM',
    status: 'Upcoming'
  },
  {
    id: 3,
    patientName: 'Aisha Sharma',
    age: 34,
    contact: '09876543210',
    appointmentDate: '2025-10-12',
    appointmentTime: '09:00 AM',
    status: 'Completed'
  },
];

// --- SVG Icons ---
// Using inline SVGs is efficient and requires no extra imports.
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


// --- Appointment Card Component ---
const AppointmentCard = ({ appointment }) => {
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Card Header */}
      <div className="p-5 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{appointment.patientName}</h3>
          <p className="text-sm text-gray-500">Age: {appointment.age} &bull; Contact: {appointment.contact}</p>
        </div>
        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(appointment.status)}`}>
          {appointment.status}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 bg-gray-50">
        <div className="flex items-center text-gray-700">
          <CalendarIcon />
          <span>{new Date(appointment.appointmentDate).toDateString()} at {appointment.appointmentTime}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-white flex justify-end space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          View History
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Start Consultation
        </button>
      </div>
    </div>
  );
};


// --- Main Page Component ---
const DoctorAppointmentPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Today's Appointments</h1>
          <p className="mt-2 text-lg text-gray-600">A complete record of all patient appointments.</p>
        </header>

        <main>
          <div className="grid grid-cols-1 gap-6">
            {appointments.map(app => (
              <AppointmentCard key={app.id} appointment={app} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorAppointmentPage;