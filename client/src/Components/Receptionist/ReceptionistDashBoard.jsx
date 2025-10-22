import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/themeSlice.js'; // Adjust path if needed
import { FaMoon, FaSun, FaSearch, FaUser, FaPhone, FaBirthdayCake, FaVenusMars, FaCalendarAlt, FaTint, FaHeart, FaClipboard } from 'react-icons/fa';

const ReceptionistDashBoard = () => {
  // --- (All your state and functions are correct) ---
  const [formData, setFormData] = useState({
    patientName: '',
    contact: '',
    dob: '',
    age: '',
    gender: '',
    appointmentDate: '',
    sugarLevel: '',
    bp: '',
    status: 'Remain',
    reason: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  // --- (All your useEffects and handlers are correct) ---
  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      element.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prevData => ({ ...prevData, age: age >= 0 ? age.toString() : '' }));
    }
  }, [formData.dob]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`http://localhost:5000/api/patients/search?q=${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    const birthDate = new Date(patient.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    setFormData({
      ...formData,
      patientName: patient.patientName,
      contact: patient.contact,
      dob: new Date(patient.dob).toISOString().split('T')[0],
      gender: patient.gender,
      age: age.toString(),
      reason: 'Follow-up',
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleClearSelection = () => {
    setSelectedPatient(null);
    setFormData({
      patientName: '', contact: '', dob: '', age: '', gender: '',
      appointmentDate: '', sugarLevel: '', bp: '', status: 'Remain', reason: '',
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['patientName', 'contact', 'dob', 'gender', 'appointmentDate', 'sugarLevel', 'bp', 'reason'];
    if (requiredFields.some(field => !formData[field])) {
      alert('Please fill out all required fields.');
      return;
    }
    let submissionData;
    if (selectedPatient) {
      submissionData = { 
        ...formData, 
        patientMongoId: selectedPatient._id,
        patientId: selectedPatient.patientId 
      };
    } else {
      const dobFormatted = formData.dob.replace(/-/g, '');
      const uniqueNumber = Date.now().toString().slice(-6);
      const generatedPatientId = `${uniqueNumber}-${dobFormatted}`;
      submissionData = { ...formData, patientId: generatedPatientId };
    }
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      const result = await response.json();
      if (!response.ok) {
          throw new Error(result.message || 'An unknown error occurred.');
      }
      alert(`Appointment booked successfully! Patient ID: ${result.patientId}`);
      handleClearSelection();
    } catch (error) {
      console.error('Booking error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleViewAllClick = () => navigate('/viewappoint');

  // --- Helper for input styling ---
  const getInputClasses = (isSelected = false, isReadOnly = false, isAge = false) => {
    let base = "w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300";
    let themeClasses = theme === 'dark' 
      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400" 
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";
    if (isSelected || isReadOnly) {
      themeClasses = theme === 'dark' 
        ? "bg-gray-700 border-gray-500 text-gray-300" 
        : "bg-gray-100 border-gray-200 text-gray-500";
      if (isAge) themeClasses = theme === 'dark' ? "bg-gray-700 border-gray-500 text-gray-400" : "bg-gray-200 border-gray-300 text-gray-600";
    }
    return `${base} ${themeClasses} ${isReadOnly ? 'cursor-not-allowed opacity-70' : 'hover:border-blue-400'}`;
  };

  const getLabelClasses = () => `block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* --- Enhanced Header --- */}
        <header className="flex justify-between items-center mb-8 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
          <div>
            <h1 className={`text-4xl lg:text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white drop-shadow-lg' : 'text-gray-800'}`}>
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Reception</span> Dashboard
            </h1>
          </div>
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-yellow-300' : 'bg-gradient-to-r from-white to-gray-100 text-blue-600'}`}
            title="Toggle theme"
          >
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </header>

        {/* --- View All Button --- */}
        <div className="flex justify-end mb-8">
          <button onClick={handleViewAllClick} className={`group relative px-8 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
          }`}>
            <span>View All Appointments</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
        
        {/* --- Enhanced Search Section --- */}
        <div className={`p-8 rounded-3xl shadow-2xl mb-8 backdrop-blur-md border ${
          theme === 'dark' ? 'bg-gradient-to-br from-gray-800/80 to-gray-700/80 border-gray-600' : 'bg-white/80 border-gray-200'
        }`}>
          <h2 className={`text-3xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            <FaSearch className="text-blue-500" /> Find Existing Patient
          </h2>
          <div className="relative">
            <label className={getLabelClasses()}>Search by Name or Contact</label>
            <div className={`relative ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-xl overflow-hidden shadow-md`}>
              <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., John Doe or 9876543210"
                className={`${getInputClasses()} pl-12`}
              />
            </div>
            {isSearching && <p className={`text-sm mt-3 flex items-center gap-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> Searching...
            </p>}
            {searchResults.length > 0 && (
              <ul className={`absolute z-20 w-full mt-2 rounded-2xl shadow-2xl max-h-80 overflow-y-auto border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                {searchResults.map(patient => (
                  <li 
                    key={patient._id} 
                    onClick={() => handleSelectPatient(patient)}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-3 border-b ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                    }`}
                  >
                    <FaUser className={`text-blue-500 flex-shrink-0`} size={20} />
                    <div>
                      <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{patient.patientName}</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>ID: {patient.patientId} • {patient.contact}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* --- Enhanced Main Form --- */}
        <div className={`p-8 rounded-3xl shadow-2xl backdrop-blur-md border ${
          theme === 'dark' ? 'bg-gradient-to-br from-gray-800/80 to-gray-700/80 border-gray-600' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-3xl font-bold flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {selectedPatient ? (
                <>
                  <FaUser className="text-green-500" /> Booking for: {selectedPatient.patientName}
                </>
              ) : (
                <>
                  <FaClipboard className="text-blue-500" /> Book a New Appointment
                </>
              )}
            </h2>
            {selectedPatient && (
              <button onClick={handleClearSelection} className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
              }`}>
                <FaUser className="rotate-180" /> Clear & Book New
              </button>
            )}
          </div>
          
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Patient Info Section */}
            <div className="md:col-span-2 space-y-6">
              <h3 className={`text-xl font-semibold pl-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Patient Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Patient Name */}
                <div className="relative">
                  <label className={getLabelClasses()}>Patient Name</label>
                  <div className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-md`}>
                    <FaUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} readOnly={!!selectedPatient} 
                           className={`${getInputClasses(!!selectedPatient)} pl-12`} required />
                  </div>
                </div>
                {/* Contact */}
                <div className="relative">
                  <label className={getLabelClasses()}>Contact Number</label>
                  <div className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-md`}>
                    <FaPhone className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    <input type="tel" name="contact" value={formData.contact} onChange={handleInputChange} readOnly={!!selectedPatient} 
                           className={`${getInputClasses(!!selectedPatient)} pl-12`} required />
                  </div>
                </div>
                {/* DOB */}
                <div className="relative">
                  <label className={getLabelClasses()}>Date of Birth</label>
                  <div className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-md`}>
                    <FaBirthdayCake className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} readOnly={!!selectedPatient} 
                           className={`${getInputClasses(!!selectedPatient)} pl-12`} required />
                  </div>
                </div>
                {/* Age */}
                <div className="relative">
                  <label className={getLabelClasses()}>Age</label>
                  <div className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-md`}>
                    <FaBirthdayCake className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    <input type="text" name="age" value={formData.age} readOnly 
                           className={`${getInputClasses(false, true, true)} pl-12`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="md:col-span-2 relative">
              <label className={getLabelClasses()}>Gender</label>
              <div className={`grid grid-cols-3 gap-4 p-4 rounded-2xl border-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                {['Male', 'Female', 'Other'].map(gender => (
                  <label key={gender} className={`flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.gender === gender 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : theme === 'dark' 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleInputChange}
                      disabled={!!selectedPatient}
                      className="sr-only"
                    />
                    <FaVenusMars className="mr-2" size={16} />
                    {gender}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Appointment Details Section */}
            <div className="md:col-span-2 space-y-6">
              <h3 className={`text-xl font-semibold pl-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Appointment Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Appointment Date */}
                <div className="relative">
                  <label className={getLabelClasses()}>Appointment Date</label>
                  <div className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-md`}>
                    <FaCalendarAlt className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleInputChange} 
                           className={`${getInputClasses()} pl-12`} required />
                  </div>
                </div>
                {/* Sugar Level */}
                <div className="relative">
                  <label className={getLabelClasses()}>Sugar Level</label>
                  <div className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-md`}>
                    <FaTint className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    <input type="text" name="sugarLevel" value={formData.sugarLevel} onChange={handleInputChange} 
                           className={`${getInputClasses()} pl-12`} required placeholder="e.g., 120 mg/dL" />
                  </div>
                </div>
                {/* BP */}
                <div className="relative">
                  <label className={getLabelClasses()}>Blood Pressure</label>
                  <div className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-md`}>
                    <FaHeart className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    <input type="text" name="bp" value={formData.bp} onChange={handleInputChange} 
                           className={`${getInputClasses()} pl-12`} required placeholder="e.g., 120/80 mmHg" />
                  </div>
                </div>
                {/* Reason */}
                <div className="relative sm:col-span-2">
                  <label className={getLabelClasses()}>Reason for Visit</label>
                  <div className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-md`}>
                    <FaClipboard className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} size={18} />
                    <select name="reason" value={formData.reason} onChange={handleInputChange} 
                            className={`${getInputClasses()} pl-12 appearance-none`} required>
                      <option value="" disabled>Select a reason</option>
                      <option value="New Patient">New Patient</option>
                      <option value="Follow-up">Follow-up</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="md:col-span-2">
              <button type="submit" className={`w-full py-4 px-8 rounded-2xl font-bold text-xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/25' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 hover:shadow-blue-500/25'
              }`}>
                <FaClipboard /> Book Appointment Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashBoard;