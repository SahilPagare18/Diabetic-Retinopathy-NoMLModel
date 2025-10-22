import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaMoon, FaQuestionCircle } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { MdOutlinePin } from "react-icons/md";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data passed from the signup page (category removed)
  const { email, username, password } = location.state || {};
  
  const [error, setError] = useState('');
  
  // Redirect to signup if the page is accessed directly without necessary state
  useEffect(() => {
    if (!email || !username || !password) {
      // console.warn("Required data not found, redirecting to signup.");
      // navigate('/signup'); 
    }
  }, [email, username, password, navigate]);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  const fullOtp = otp.join(""); // Combine the OTP array into a single string

  const handleVerify = async () => {
    if (fullOtp.length !== 6 || !email) return; 
    
    setError(''); // Clear previous errors
    
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: fullOtp, username, password }),
      });

      if (response.ok) {
        alert("Verification successful! You can now log in.");
        navigate('/'); // Redirect to login or dashboard
      } else {
        const message = await response.text();
        setError(message || "Invalid or expired OTP.");
      }
    } catch (err) {
      console.error("Verification API call failed:", err);
      setError("Verification failed due to a network error. Please try again.");
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);
    
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, "").slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(""));
    setOtp(newOtp);
    if (pastedData.length < 6) {
      document.getElementById(`otp-input-${pastedData.length}`).focus();
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.getElementById(`otp-input-0`)?.focus();
  }, []);

  return (
    <div
      className={`flex mt-0 justify-center items-center min-h-screen p-5 transition-colors duration-500 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`p-6 rounded-2xl w-[420px] transition-all duration-500 ${
          theme === "dark"
            ? "bg-gray-900 text-white shadow-2xl shadow-purple-900/40"
            : "bg-white text-black shadow-2xl shadow-gray-400/40 ring-1 ring-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaCheckCircle className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Verify OTP</h2>
          </div>
          <div
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer shadow-md"
          >
            {theme === "dark" ? <FiSun size={15} /> : <FaMoon size={15} />}
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center mb-4">
            <MdOutlinePin className="mr-2" />
            <span className="font-medium">Enter OTP sent to {email}</span>
          </label>
          <div 
            className={`flex gap-3 justify-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  digit 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                    : theme === "dark" 
                      ? "border-gray-600 bg-gray-800" 
                      : "border-gray-300 bg-white"
                }`}
                style={{ 
                  boxShadow: digit ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none"
                }}
              />
            ))}
          </div>
          
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
          
        </div>

        <button
          onClick={handleVerify}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center font-medium transition-all duration-200 ${
            fullOtp.length === 6 
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform hover:scale-[1.02]" 
              : "bg-gray-400 text-gray-100 cursor-not-allowed"
          }`}
          disabled={fullOtp.length !== 6}
        >
          <FaCheckCircle className="mr-2" />
          Verify OTP
        </button>

        <div className="mt-4 text-center">
          <a
            href="#"
            className="inline-flex items-center text-blue-600 hover:underline transition-colors duration-200"
          >
            <FaQuestionCircle className="mr-1" />
            <span>Resend OTP?</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;