import React, { useState, useEffect } from 'react';
import { FaMoon, FaArrowRight } from 'react-icons/fa';
import { FiSun } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const AddDetails = () => {
  const [formData, setFormData] = useState({
    date: '',
    id: '',
    name: '',
    age: '',
    gender: 'male',
  });
  const [error, setError] = useState(null); // NEW: For validation errors

  const navigate = useNavigate();
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
    } else {
      element.classList.remove("dark");
    }
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null); // Clear error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.id || !formData.name || !formData.age) {
      setError('Please fill all required fields');
      return;
    }
    console.log('Form Data:', formData);
    navigate('/disease', { state: { formData } });
  };

  return (
    <div className={`min-h-screen flex justify-center items-center p-4 transition-colors duration-300 ${
      theme === "dark" ? "bg-gray-900" : "bg-slate-100"
    }`}>
      <div className="w-full max-w-3xl -mt-30">
        <div className="relative text-center mb-6">
          <h2 className={`text-2xl font-bold ${theme === "dark" ? "text-gray-100" : "text-black"}`}>Add New Patient Record</h2>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-black"}`}>Please fill out the details below.</p>
        </div>
        
        <form onSubmit={handleSubmit} className={`p-8 rounded-xl shadow-lg border transition-colors duration-300 relative
          ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <button 
            type="button" 
            onClick={toggleTheme} 
            className={`absolute top-0 right-0 h-9 w-9 flex items-center justify-center rounded-full shadow-md transition-all 
              ${theme === 'dark' ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FaMoon size={15} /> : <FiSun size={15} />}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="date" className={`block text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-black"}`}>Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`mt-1 py-1.5 px-2 w-full border rounded-md text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors duration-300
                  ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-offset-gray-800" : "bg-white border-gray-300 text-gray-900 focus:ring-offset-white"}`}
                required
              />
            </div>

            <div>
              <label htmlFor="id" className={`block text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-black"}`}>Patient ID</label>
              <input
                id="id"
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g., P101"
                className={`mt-1 py-1.5 px-2 w-full border rounded-md text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors duration-300
                  ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-offset-gray-800" : "bg-white border-gray-300 text-gray-900 focus:ring-offset-white"} `}
                required
              />
            </div>

            <div>
              <label htmlFor="name" className={`block text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-black"}`}>Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                className={`mt-1 py-1.5 px-2 w-full border rounded-md text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors duration-300
                  ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-offset-gray-800" : "bg-white border-gray-300 text-gray-900 focus:ring-offset-white"} `}
                required
              />
            </div>

            <div>
              <label htmlFor="age" className={`block text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-black"}`}>Age</label>
              <input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g., 25"
                className={`mt-1 py-1.5 px-2 w-full border rounded-md text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors duration-300
                  ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-offset-gray-800" : "bg-white border-gray-300 text-gray-900 focus:ring-offset-white"} `}
                min="0"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={`block text-xs font-medium ${theme === "dark" ? "text-gray-300" : "text-black"}`}>Gender</label>
              <div className="mt-2 flex items-center space-x-5">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="form-radio h-3.5 w-3.5 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className={`ml-1.5 text-xs ${theme === "dark" ? "text-gray-100" : "text-black"}`}>Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="form-radio h-3.5 w-3.5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`ml-1.5 text-xs ${theme === "dark" ? "text-gray-100" : "text-black"}`}>Female</span>
                </label>
              </div>
            </div>
          </div>

          {error && <p className={`mt-4 text-center text-red-500`}>{error}</p>}

          <div className="mt-8 pt-4 border-t border-gray-700 dark:border-gray-700 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center bg-blue-600 text-white py-2 px-5 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Next
              <FaArrowRight className="ml-2 h-3 w-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDetails;