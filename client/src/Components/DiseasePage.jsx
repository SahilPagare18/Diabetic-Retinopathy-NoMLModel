import React, { useState, useEffect } from 'react';
import { FaMoon } from 'react-icons/fa';
import { FiSun } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// An icon component for the file upload area
const UploadIcon = () => (
    <svg className="w-8 h-8 mb-3 text-white dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
    </svg>
);

const DiseasePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const patientData = location.state?.formData || {};

    const [formData, setFormData] = useState({
        image: null,
        diseaseStage: '',
        diseaseProbability: '',
    });
    const [fileName, setFileName] = useState('No file chosen');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [predictionHistory, setPredictionHistory] = useState([]);
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

    useEffect(() => {
        const element = document.documentElement;
        if (theme === "dark") element.classList.add("dark");
        else element.classList.remove("dark");
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setError('Please upload a JPEG or PNG image');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setFormData({
                image: file,
                diseaseStage: '',
                diseaseProbability: '',
            });
            setFileName(file.name);
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setError(null);

            const reader = new FileReader();
            reader.onloadend = () => {
                console.log('Image Base64:', reader.result.substring(0, 50) + '...');
                setImageBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handlePredict = async () => {
        if (!formData.image) {
            setError('Please upload an image first.');
            return;
        }
        setIsLoading(true);
        setError(null);

        const fd = new FormData();
        fd.append('image', formData.image);

        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: fd,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `Prediction failed with status ${response.status}`);
            }

            if (!data.stage || !data.probability) {
                throw new Error('Invalid prediction data received from server');
            }

            setFormData((prevData) => ({
                ...prevData,
                diseaseStage: data.stage,
                diseaseProbability: data.probability,
            }));

            const predictionData = {
                patientData,
                imageUrl: imagePreview,
                diseaseStage: data.stage,
                diseaseProbability: data.probability,
                timestamp: new Date().toISOString(),
            };
            setPredictionHistory((prevHistory) => [...prevHistory, predictionData]);
            console.log('Prediction Data:', predictionData);
        } catch (err) {
            console.error('Error during prediction:', err);
            setError(`Prediction Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetSuggestion = () => {
        if (!formData.diseaseStage) {
            setError('Please get a prediction first.');
            return;
        }
        setError(null);
        navigate('/suggestion', {
            state: {
                stage: formData.diseaseStage,
                patientData,
                imageBase64,
                diseaseProbability: formData.diseaseProbability,
            },
        });
    };

    const handleSave = async () => {
        if (!formData.diseaseStage) {
            setError('Please get a prediction first.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/savePatient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientData,
                    diseaseStage: formData.diseaseStage,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save patient data');
            }
            const result = await response.json();
            console.log('Data saved:', result);
            setError(null); // Clear any previous error
            toast.success('Data saved successfully'); // Using React Toastify
        } catch (err) {
            console.error('Error saving data:', err);
            setError('Error saving patient data');
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-slate-100"}`}>
            <div className="w-full max-w-3xl">
                <div className="text-center mb-8">
                    <h1 className={`text-4xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>Disease Details</h1>
                    <p className={`text-md ${theme === "dark" ? "text-white" : "text-black"}`}>Upload a scan to predict the disease stage.</p>
                </div>
                <div className={`p-8 rounded-xl shadow-lg border transition-colors duration-300 relative ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                    <button type="button" onClick={toggleTheme} className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full shadow-md transition-all dark:bg-gray-300 text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-50" aria-label="Toggle theme">
                        {theme === 'dark' ? <FiSun size={15} /> : <FaMoon size={15} />}
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">
                        <div className="md:col-span-2">
                            <label className={`block text-sm font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>Scan Image</label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="image" className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${theme === "dark" ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-gray-50 border-gray-300 hover:bg-gray-100"}`}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadIcon />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                                        </p>
                                    </div>
                                    <input id="image" type="file" name="image" className="hidden" onChange={handleFileChange} accept="image/*" required />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">{fileName}</p>
                            {imagePreview && (
                                <div className="mt-4 flex justify-center">
                                    <img src={imagePreview} alt="Eye scan preview" className={`max-w-[300px] h-auto max-h-[200px] rounded-lg shadow-md object-contain ${theme === "dark" ? "border border-gray-600" : "border border-gray-200"}`} />
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="diseaseProbability" className={`block text-sm font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>Disease Probability</label>
                            <input
                                id="diseaseProbability"
                                type="text"
                                name="diseaseProbability"
                                value={formData.diseaseProbability}
                                onChange={handleInputChange}
                                placeholder="Prediction appears here"
                                className={`mt-2 block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                                readOnly
                            />
                        </div>
                        <div>
                            <label htmlFor="diseaseStage" className={`block text-sm font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>Disease Stage</label>
                            <input
                                id="diseaseStage"
                                type="text"
                                name="diseaseStage"
                                value={formData.diseaseStage}
                                onChange={handleInputChange}
                                placeholder="Prediction appears here"
                                className={`mt-2 block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!formData.diseaseStage || isLoading}
                            className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:-translate-y-1 transition-all"
                        >
                            Save
                        </button>
                        <div className="flex flex-col sm:flex-row justify-end gap-4">
                            <button
                                type="button"
                                onClick={handlePredict}
                                disabled={!formData.image || isLoading}
                                className="w-full sm:w-auto bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:-translate-y-1 transition-all"
                            >
                                {isLoading ? 'Analyzing...' : 'Get Prediction'}
                            </button>
                            <button
                                type="button"
                                onClick={handleGetSuggestion}
                                disabled={!formData.diseaseStage || isLoading}
                                className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:-translate-y-1 transition-all"
                            >
                                Get Suggestion
                            </button>
                        </div>
                    </div>
                    {error && <p className={`mt-4 text-center text-red-500`}>{error}</p>}
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default DiseasePage;