import React, { useState } from 'react';

// You can use an icon library like react-icons for better UI
// import { FaCheckCircle } from 'react-icons/fa';

const RecepHomepage = () => {
  // Sample initial data to show how the lists work
  const initialAppointments = [
    { id: 1, patientName: 'Ravi Sharma', age: '58', contact: '9876543210', appointmentDate: '2025-10-13', status: 'Upcoming' },
    { id: 2, patientName: 'Priya Patel', age: '65', contact: '9876543211', appointmentDate: '2025-10-12', status: 'Completed' },
  ];

  // State to hold all appointments
  const [appointments, setAppointments] = useState(initialAppointments);

  // State for the form inputs
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    contact: '',
    appointmentDate: '',
  });

  // Handle changes in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission to add a new appointment
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.age || !formData.contact || !formData.appointmentDate) {
      alert('Please fill out all fields.');
      return;
    }

    const newAppointment = {
      id: Date.now(),
      ...formData,
      status: 'Upcoming', // New appointments are always 'Upcoming'
    };

    setAppointments([newAppointment, ...appointments]); // Add new appointment to the top of the list
    setFormData({ patientName: '', age: '', contact: '', appointmentDate: '' }); // Reset form
  };

  // Function to move an appointment from 'Upcoming' to 'Completed'
  const markAsCompleted = (appointmentId) => {
    setAppointments(appointments.map(app =>
      app.id === appointmentId ? { ...app, status: 'Completed' } : app
    ));
  };

  // Filter appointments into two lists
  const upcomingAppointments = appointments.filter(app => app.status === 'Upcoming');
  const completedAppointments = appointments.filter(app => app.status === 'Completed');

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Receptionist Homepage</h1>
          <p className="text-md text-gray-500 mt-2">Manage patient appointments and records.</p>
        </header>

        {/* Section 1: Appointment Booking Form */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-indigo-500 pb-3 mb-6">
            Book a New Appointment
          </h2>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-1">
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
              <input type="text" id="patientName" name="patientName" value={formData.patientName} onChange={handleInputChange} placeholder="e.g., Anjali Mehta" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} placeholder="e.g., 55" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="e.g., 9123456789" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" id="appointmentDate" name="appointmentDate" value={formData.appointmentDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300">
              Book
            </button>
          </form>
        </div>

        {/* Section 2: Upcoming Appointments */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-amber-500 pb-3 mb-6">
            Upcoming Appointments
          </h2>
          <div className="overflow-x-auto">
            {upcomingAppointments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{app.patientName}</div><div className="text-sm text-gray-500">Age: {app.age}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.appointmentDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button onClick={() => markAsCompleted(app.id)} className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full hover:bg-green-200">
                          Mark as Completed
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-center text-gray-500 py-4">No upcoming appointments.</p>}
          </div>
        </div>

        {/* Section 3: Completed Patient Records */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-green-500 pb-3 mb-6">
            Completed Appointments (Patient Records)
          </h2>
          <div className="overflow-x-auto">
            {completedAppointments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{app.patientName}</div><div className="text-sm text-gray-500">Age: {app.age}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.contact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.appointmentDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-center text-gray-500 py-4">No completed appointments to show.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecepHomepage;