import React, { useState, useEffect } from 'react';
// Import useLocation to read navigation state
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- UPDATED IMPORTS FOR THEME ---
import { 
    FaUser, FaIdCard, FaBirthdayCake, FaVenusMars, FaPhone, FaSave, FaLightbulb, 
    FaHistory, FaCheckCircle, FaExclamationCircle, FaHeartbeat, FaTint, FaMoon 
} from 'react-icons/fa';
import { FiUploadCloud, FiCpu, FiEye, FiSun } from 'react-icons/fi';

// --- Helper Function ---
const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// --- Sub-Components ---

const PatientProfileCard = ({ patient, age, theme }) => (
    <div className={`p-7 rounded-3xl shadow-2xl ring-1 sticky top-8 flex flex-col items-center transform transition-all duration-300 hover:scale-[1.01] ${
        theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 ring-slate-700/50 hover:shadow-emerald-500/10' 
            : 'bg-gradient-to-br from-gray-100/80 to-white/80 ring-gray-300/50 hover:shadow-emerald-200/20'
    }`}>
        <div className={`flex items-center justify-center h-28 w-28 rounded-full text-5xl font-extrabold mb-5 shadow-lg ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white' 
                : 'bg-gradient-to-br from-emerald-400 to-green-500 text-white'
        }`}>
            {patient.patientName.charAt(0)}
        </div>
        <h2 className={`text-4xl font-extrabold mb-2 tracking-wide ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>{patient.patientName}</h2>
        <p className={`font-mono text-lg mb-7 ${
            theme === 'dark' ? 'text-emerald-300 opacity-80' : 'text-emerald-600 font-semibold'
        }`}>ID: {patient.patientId}</p>
        <div className={`w-full space-y-5 ${theme === 'dark' ? 'border-t border-slate-700/70 pt-7 text-slate-200' : 'border-t border-gray-200 pt-7 text-gray-700'}`}>
            <div className="flex items-center text-lg"><FaIdCard size={18} className={`${theme === 'dark' ? 'text-emerald-400 opacity-80 mr-4' : 'text-emerald-500 mr-4'}`} /><span>Age: <span className="font-semibold">{age}</span></span></div>
            <div className="flex items-center text-lg"><FaVenusMars size={18} className={`${theme === 'dark' ? 'text-emerald-400 opacity-80 mr-4' : 'text-emerald-500 mr-4'}`} /><span>Gender: <span className="font-semibold">{patient.gender}</span></span></div>
            <div className="flex items-center text-lg"><FaBirthdayCake size={18} className={`${theme === 'dark' ? 'text-emerald-400 opacity-80 mr-4' : 'text-emerald-500 mr-4'}`} /><span>DOB: <span className="font-semibold">{new Date(patient.dob).toLocaleDateString()}</span></span></div>
            <div className="flex items-center text-lg"><FaPhone size={18} className={`${theme === 'dark' ? 'text-emerald-400 opacity-80 mr-4' : 'text-emerald-500 mr-4'}`} /><span>Contact: <span className="font-semibold">{patient.contact}</span></span></div>
        </div>
    </div>
);

// --- UPDATED TimelineItem COMPONENT ---
const TimelineItem = ({ record, isLast, theme }) => { 
    const getStageColorClass = (stage) => { 
        if (!stage) return 'bg-gray-500 ring-gray-400'; 
        if (stage.includes('Mild') || stage.includes('Moderate')) return 'bg-yellow-500 ring-yellow-400'; 
        if (stage.includes('Severe') || stage.includes('PDR')) return 'bg-red-500 ring-red-400'; 
        return 'bg-green-500 ring-green-400'; 
    }; 
    
    return ( 
        <div className="relative pl-12 pb-10 group"> 
            <div className={`absolute left-0 top-1 w-5 h-5 rounded-full ring-4 ${getStageColorClass(record.diseaseStage)} flex items-center justify-center ${theme === 'dark' ? 'ring-slate-800' : 'ring-white'}`}> 
                {record.status === 'Completed' ? <FaCheckCircle size={10} className="text-white" /> : <FaExclamationCircle size={10} className="text-white" />} 
            </div> 
            {!isLast && <div className={`absolute left-[9px] top-6 h-full w-0.5 ${theme === 'dark' ? 'bg-slate-700/70' : 'bg-gray-300/50'}`}></div>} 
            <div className={`p-6 rounded-xl shadow-lg ring-1 transform transition-all duration-300 group-hover:scale-[1.02] ${
                theme === 'dark' 
                    ? 'bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm ring-slate-700/50 group-hover:shadow-emerald-500/10' 
                    : 'bg-white/80 ring-gray-200 group-hover:shadow-emerald-200/20'
            }`}> 
                
                {/* Header with Date */}
                <div className={`flex items-center justify-between mb-3 border-b pb-3 ${
                    theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'
                }`}> 
                    <p className={`font-extrabold text-xl tracking-tight ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{new Date(record.appointmentDate).toDateString()}</p> 
                    <FiEye size={24} className={`${theme === 'dark' ? 'text-emerald-400 opacity-60 group-hover:opacity-100' : 'text-emerald-600 opacity-70 group-hover:opacity-100'} transition-opacity`} /> 
                </div> 
                
                {/* Main Diagnosis Info */}
                <div className="space-y-2">
                    <p className={`text-lg ${
                        theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                    }`}>
                        <strong>Stage Diagnosed:</strong> <span className="font-semibold">{record.diseaseStage || 'Diagnosis Pending'}</span>
                    </p> 
                    <p className={`text-sm ${
                        theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                        <strong>Status:</strong> <span className="font-medium">{record.status}</span>
                    </p>
                </div>
                
                {/* Vitals Info (BP and Sugar) */}
                <div className={`mt-4 pt-4 border-t flex items-center space-x-6 text-sm ${
                    theme === 'dark' 
                        ? 'border-slate-700/50 text-slate-400' 
                        : 'border-gray-200 text-gray-500'
                }`}>
                    <span className="flex items-center">
                        <FaHeartbeat className="mr-2 text-red-400" />
                        BP: <strong className={`ml-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-800'}`}>{record.bp}</strong>
                    </span>
                    <span className="flex items-center">
                        <FaTint className="mr-2 text-blue-400" />
                        Sugar: <strong className={`ml-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-800'}`}>{record.sugarLevel}</strong>
                    </span>
                </div>
            </div> 
        </div> 
    ); 
};
// --- END OF UPDATED COMPONENT ---

const NewDiagnosis = ({
    handleFileChange,
    handleGetPrediction,
    handleGetSuggestion,
    handleSave,
    fileName,
    imagePreview,
    isPredicting,
    prediction,
    predictionError,
    theme
}) => {
    const [isDragOver, setIsDragOver] = useState(false);

    return (
        <div className={`p-9 rounded-3xl shadow-2xl ring-1 transform transition-all duration-300 hover:scale-[1.005] ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md ring-slate-700/50 hover:shadow-blue-500/10' 
                : 'bg-gradient-to-br from-gray-50/80 to-white/80 ring-gray-300/50 hover:shadow-blue-200/20'
        }`}>
            <h3 className={`text-3xl font-extrabold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>New Diagnosis</h3>
            <p className={`text-lg mb-7 ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
            }`}>Upload today's retinal scan for an AI-powered analysis.</p>

            <label htmlFor="file-upload" onDragEnter={() => setIsDragOver(true)} onDragLeave={() => setIsDragOver(false)} onDrop={() => setIsDragOver(false)} className={`border-2 border-dashed rounded-xl p-8 text-center block cursor-pointer transition-all duration-300 ${
                isDragOver 
                    ? 'border-emerald-400 bg-slate-700/40 dark:bg-slate-700/40' 
                    : theme === 'dark' 
                        ? 'border-slate-600 bg-slate-900/30 hover:border-slate-500' 
                        : 'border-gray-300 bg-gray-50/50 hover:border-gray-400'
            }`}>
                <FiUploadCloud className={`mx-auto h-12 w-12 mb-4 ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'
                }`} />
                <span className={`font-bold text-lg ${
                    theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'
                }`}>Click to upload or drag & drop scan</span>
                <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/jpeg, image/png" />
            </label>

            {imagePreview ? (
                <div className="mt-4 flex justify-center">
                    <img src={imagePreview} alt="Scan preview" className="max-w-[300px] h-auto max-h-[200px] rounded-lg shadow-lg object-contain ring-1 ring-slate-600 dark:ring-gray-300" />
                </div>
            ) : (
                fileName && <p className={`text-center text-sm mt-3 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                }`}>{fileName}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 my-8">
                <div>
                    <label className={`block text-sm font-medium mb-3 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                    }`}>Disease Probability</label>
                    <div className={`rounded-xl p-4 h-14 flex items-center text-lg font-semibold transition-all duration-500 ring-2 ring-transparent ${
                        prediction.stage 
                            ? 'text-emerald-300 ring-emerald-500 dark:text-emerald-400' 
                            : theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                    } ${theme === 'dark' ? 'bg-slate-700/70' : 'bg-gray-100/70'}`}>
                        {isPredicting ? 'Analyzing...' : prediction.probability || 'Awaiting prediction...'}
                    </div>
                </div>
                <div>
                    <label className={`block text-sm font-medium mb-3 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                    }`}>Disease Stage</label>
                    <div className={`rounded-xl p-4 h-14 flex items-center text-lg font-semibold transition-all duration-500 ring-2 ring-transparent ${
                        prediction.stage 
                            ? 'text-emerald-300 ring-emerald-500 dark:text-emerald-400' 
                            : theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                    } ${theme === 'dark' ? 'bg-slate-700/70' : 'bg-gray-100/70'}`}>
                        {isPredicting ? 'Analyzing...' : prediction.stage || 'Awaiting prediction...'}
                    </div>
                </div>
            </div>
            {predictionError && <p className={`text-center mb-4 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-500'
            }`}>{predictionError}</p>}

            <div className={`flex justify-end space-x-4 pt-4 border-t ${
                theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'
            }`}>
                <button onClick={handleGetPrediction} disabled={isPredicting || !fileName} className={`flex items-center gap-2 font-semibold py-3 px-6 rounded-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === 'dark' 
                        ? 'bg-slate-700 text-white hover:bg-slate-600' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}>
                    <FiCpu size={18} /> {isPredicting ? 'Predicting...' : 'Get Prediction'}
                </button>
                <button onClick={handleGetSuggestion} disabled={!prediction.stage} className={`flex items-center gap-2 font-semibold py-3 px-6 rounded-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 ${
                    theme === 'dark' 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}>
                    <FaLightbulb size={18} /> Suggestion
                </button>
                <button onClick={handleSave} disabled={!prediction.stage} className={`flex items-center gap-2 font-semibold py-3 px-6 rounded-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 ${
                    theme === 'dark' 
                        ? 'bg-blue-600 text-white hover:bg-blue-500' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}>
                    <FaSave size={18} /> Save
                </button>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const PatientDashboardPage = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    
    // Get state passed from navigation
    const { state } = useLocation();
    const passedAppointment = state?.currentAppointment;
    
    // State from main page
    const [patient, setPatient] = useState(passedAppointment?.patient || null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);

    // State to hold the *specific* appointment we are diagnosing
    const [currentAppointmentToUpdate, setCurrentAppointmentToUpdate] = useState(passedAppointment || null);

    // State for the diagnosis component
    const [scanFile, setScanFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [prediction, setPrediction] = useState({ probability: '', stage: '' });
    const [predictionError, setPredictionError] = useState(null);

    // --- THEME STATE (ADDED FROM LOGIN) ---
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        const element = document.documentElement;
        if (theme === "dark") {
            element.classList.add("dark");
            document.body.classList.add("dark");
            document.body.style.backgroundColor = ''; 
        } else {
            element.classList.remove("dark");
            document.body.classList.remove("dark");
            document.body.style.backgroundColor = '#f8fafc'; 
        }
    }, [theme]);
    // --- END OF THEME LOGIC ---

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // We always fetch history and patient data to ensure it's fresh
                
                // --- FIX #1: Add { cache: 'no-store' } to all fetches ---
                const [patientResponse, historyResponse] = await Promise.all([
                    fetch(`http://localhost:5000/api/patient/${patientId}`, { cache: 'no-store' }),
                    fetch(`http://localhost:5000/api/patient/${patientId}/history`, { cache: 'no-store' })
                ]);
                // --- END OF FIX #1 ---

                if (!patientResponse.ok) throw new Error('Could not find patient details.');

                const patientData = await patientResponse.json();
                const historyData = historyResponse.ok ? await historyResponse.json() : [];

                setPatient(patientData);
                setHistory(historyData);

                // Logic to set the appointment-to-be-updated
                if (passedAppointment) {
                    // 1. Best case: We got the appointment from the previous page
                    setCurrentAppointmentToUpdate(passedAppointment);
                } else if (historyData.length > 0) {
                    // 2. Fallback: Find the most recent "Scheduled" appointment
                    const latestScheduled = [...historyData]
                        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                        .find(app => app.status === 'Scheduled');
                    
                    if (latestScheduled) {
                        setCurrentAppointmentToUpdate(latestScheduled);
                    } else {
                        console.warn("No 'Scheduled' appointment found to update.");
                    }
                }
            } catch (err) {
                setPageError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [patientId, passedAppointment]);

    // --- Handlers for the NewDiagnosis component ---

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setPredictionError('Please upload a JPEG or PNG image');
                return;
            }
            setScanFile(file);
            setFileName(file.name);
            setImagePreview(URL.createObjectURL(file));
            setPrediction({ probability: '', stage: '' });
            setPredictionError(null);
        }
    };

    const handleGetPrediction = async () => {
        if (!scanFile) {
            setPredictionError('Please upload an image first.');
            return;
        }
        setIsPredicting(true);
        setPredictionError(null);

        const fd = new FormData();
        fd.append('image', scanFile);

        try {
            // NOTE: Make sure your prediction server is running
            const response = await fetch('http://localhost:5000/predict', { method: 'POST', body: fd });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Prediction failed.');

            setPrediction({ stage: data.stage, probability: data.probability });
            toast.info(`Prediction successful: ${data.stage}`);
        } catch (err) {
            setPredictionError(`Prediction Error: ${err.message}`);
            toast.error(`Prediction Error: ${err.message}`);
        } finally {
            setIsPredicting(false);
        }
    };

    // --- THIS IS THE KEY FUNCTION FOR DYNAMIC UPDATES ---
    const handleSave = async () => {
        if (!prediction.stage) {
            setPredictionError('Please get a prediction before saving.');
            return;
        }
        
        // Check if we have an appointment to update
        if (!currentAppointmentToUpdate || !currentAppointmentToUpdate._id) {
             toast.error('Error: No active appointment found to save this diagnosis to.');
             setPredictionError('Error: No active appointment found to save this diagnosis to.');
             return;
        }

        try {
            // STEP 1: Update the appointment with status "Completed"
            const response = await fetch(`http://localhost:5000/api/appointment/${currentAppointmentToUpdate._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    diseaseStage: prediction.stage,
                    diseaseProbability: prediction.probability,
                    // --- FIX #3: Match schema enum ('Completed') ---
                    status: 'Completed' 
                }),
            });
            if (!response.ok) throw new Error('Failed to save diagnosis');

            toast.success('Diagnosis saved successfully!');
            
            // --- FIX #2: Add { cache: 'no-store' } here too ---
            const historyResponse = await fetch(`http://localhost:5000/api/patient/${patientId}/history`, { cache: 'no-store' });
            // --- END OF FIX #2 ---
            
            const updatedHistory = await historyResponse.json();
            setHistory(updatedHistory); // This re-renders the page
            
            // Clear the diagnosis form
            setScanFile(null);
            setFileName('');
            setImagePreview(null);
            setPrediction({ probability: '', stage: '' });
            
            // --- FIX #4: Find the next appointment to update ---
            const nextScheduled = [...updatedHistory]
                .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                .find(app => app.status === 'Scheduled');
            setCurrentAppointmentToUpdate(nextScheduled || null);
            // --- END OF FIX #4 ---


        } catch (err) {
            setPredictionError('Error saving diagnosis.');
            toast.error('Error saving diagnosis.');
        }
    };

    const handleGetSuggestion = () => {
        if (!prediction.stage) {
            setPredictionError('Please get a prediction first.');
            return;
        }
        navigate('/suggestion', {
            state: {
                stage: prediction.stage,
                patientData: patient,
            }
        });
    };


    // --- Render Logic ---

    if (loading) return <div className={`text-center text-2xl p-20 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
    }`}>Loading Patient Dashboard...</div>;
    if (pageError) return <div className={`text-center text-2xl p-20 ${
        theme === 'dark' ? 'text-red-400' : 'text-red-600'
    }`}>Error: {pageError}</div>;
    if (!patient) return <div className={`text-center text-2xl p-20 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
    }`}>No patient data found.</div>;

    // Calculate age to pass to profile card
    const patientAge = calculateAge(patient.dob);

    return (
        <div className={`relative ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'} min-h-screen p-4 sm:p-8 font-sans`}>
            {/* --- THEME TOGGLE BUTTON (ADDED FROM LOGIN) --- */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={toggleTheme}
                    className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer shadow-md transition-all ${
                        theme === 'dark'
                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                    {theme === "dark" ? <FiSun size={16} /> : <FaMoon size={16} />}
                </button>
            </div>
            {/* --- END OF THEME TOGGLE --- */}

            <ToastContainer theme={theme} position="bottom-right" />
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                <div className="lg:col-span-1">
                    <PatientProfileCard patient={patient} age={patientAge} theme={theme} />
                </div>
                <div className="lg:col-span-2">
                    <NewDiagnosis
                        handleFileChange={handleFileChange}
                        handleGetPrediction={handleGetPrediction}
                        handleGetSuggestion={handleGetSuggestion}
                        handleSave={handleSave}
                        fileName={fileName}
                        imagePreview={imagePreview}
                        isPredicting={isPredicting}
                        prediction={prediction}
                        predictionError={predictionError}
                        theme={theme}
                    />
                    {/* This section will now update dynamically after saving */}
                    <div className="mt-12">
                        <h3 className={`text-3xl font-extrabold mb-8 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Visit History <FaHistory className={`inline ml-3 ${
                                theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                            }`} />
                        </h3>
                        {history.length > 0 ? (
                            <div className="space-y-8">
                                {history.map((record, index) => (
                                    <TimelineItem key={record._id} record={record} isLast={index === history.length - 1} theme={theme} />
                                ))}
                            </div>
                        ) : (
                            <div className={`p-8 rounded-2xl text-center ${
                                theme === 'dark' 
                                    ? 'bg-gradient-to-br from-slate-800/70 to-slate-900/70' 
                                    : 'bg-white/80 ring-1 ring-gray-200'
                            }`}>
                                <FaUser size={40} className={`mx-auto mb-4 ${
                                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-500'
                                }`} />
                                <h4 className={`text-2xl font-bold ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>First Visit!</h4>
                                <p className={`mt-2 ${
                                    theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                                }`}>No previous medical history found for this patient.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboardPage;