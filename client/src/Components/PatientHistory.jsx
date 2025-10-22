import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PatientHistory = () => {
  const { patientId } = useParams(); // This is the patient's Mongo ID (e.g., 60f...abc)
  const navigate = useNavigate();
  
  const [history, setHistory] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [humanReadableId, setHumanReadableId] = useState(''); // <-- ADDED state for the ID
  const [loading, setLoading] = useState(true);
  
  // State for the diagnosis form
  const [diagnosis, setDiagnosis] = useState('');
  const [diseaseStage, setDiseaseStage] = useState('');
  
  const activeAppointment = history.find(app => app.status === 'Remain');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      // This fetch correctly uses the Mongo ID from the URL
      const response = await fetch(`http://localhost:5000/api/patients/${patientId}/history`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient history');
      }

      const data = await response.json();
      setHistory(data);
      
      // ✅ FIX: Check if data exists and get details from the correct fields
      if (data && data.length > 0) {
        // 1. Get name from the populated 'patient' object
        if (data[0].patient) {
          setPatientName(data[0].patient.patientName);
        } else {
          setPatientName('Patient Details'); // Fallback
        }
        
        // 2. Get the human-readable ID from the appointment record itself
        if (data[0].patientId) {
          setHumanReadableId(data[0].patientId);
        } else {
          setHumanReadableId(patientId); // Fallback to Mongo ID
        }
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [patientId]); // This is correct

  const handleDiagnosisSubmit = async (e) => {
    e.preventDefault();
    if (!activeAppointment) {
      alert("No active appointment to diagnose.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/appointment/${activeAppointment._id}/diagnose`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosis, diseaseStage }),
      });

      if (!response.ok) throw new Error('Failed to submit diagnosis.');
      
      alert('Diagnosis submitted successfully!');
      setDiagnosis('');
      setDiseaseStage('');
      fetchHistory(); 
    } catch (error) {
      alert(error.message);
    }
  };
  
  if (loading) return <div className="p-10 text-center">Loading patient history...</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 text-blue-500 hover:underline">
          &larr; Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold text-gray-800">{patientName}</h1>
        
        {/* ✅ FIX: Display the human-readable ID from our state variable */}
        <p className="text-gray-500">Patient ID: {humanReadableId}</p>

        {/* Diagnosis Form for Active Appointment (Unchanged) */}
        {activeAppointment && (
          <div className="my-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add Diagnosis for Appointment on {new Date(activeAppointment.appointmentDate).toLocaleDateString()}</h2>
            <form onSubmit={handleDiagnosisSubmit}>
              <div className="mb-4">
                <label htmlFor="diseaseStage" className="block text-sm font-medium text-gray-700">Disease Stage</label>
                <input
                  type="text"
                  id="diseaseStage"
                  value={diseaseStage}
                  onChange={(e) => setDiseaseStage(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="e.g., Stage 2, NPDR Mild"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">Diagnosis Notes</label>
                <textarea
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="Enter detailed notes here..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">
                Submit Diagnosis & Complete Appointment
              </button>
            </form>
          </div>
        )}

        {/* Patient History Timeline (Unchanged) */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Visit History</h2>
          <div className="space-y-6">
            {history.map(record => (
              <div key={record._id} className={`p-5 rounded-lg shadow ${record.status === 'Remain' ? 'bg-yellow-100 border-l-4 border-yellow-500' : 'bg-white'}`}>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-800">{new Date(record.appointmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${record.status === 'Remain' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                    {record.status}
                  </span>
                </div>
                <div className="mt-3 border-t pt-3 text-gray-600">
                  <p><strong className="font-medium text-gray-800">Reason for Visit:</strong> {record.reason}</p>
                  {record.status === 'Complete' ? (
                    <>
                      <p><strong className="font-medium text-gray-800">Detected Stage:</strong> {record.diseaseStage}</p>
                      <p className="mt-2"><strong className="font-medium text-gray-800">Doctor's Notes:</strong> {record.diagnosis}</p>
                    </>
                  ) : (
                    <p className="text-sm text-yellow-700">Awaiting diagnosis from the doctor.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;