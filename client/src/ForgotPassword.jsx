import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaKey, FaEnvelope, FaMoon, FaCheckCircle } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { MdLockOutline, MdVisibility, MdVisibilityOff, MdMailOutline } from "react-icons/md"; 
import { IoIosArrowBack } from "react-icons/io";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // 1 for email, 2 for otp/password
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
    document.body.style.backgroundColor = theme === 'dark' ? '' : '#f8fafc';
  }, [theme]);

  // Step 1: Request OTP
  // In ForgotPassword.js

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        // --- UPDATED MESSAGE ---
        setMessage(`OTP successfully sent to ${email}! Please check your inbox.`);
        setStep(2); // Move to the next step
      } else {
        setErrors({ api: data.message || 'Failed to send OTP.' });
      }
    } catch (error) {
      setErrors({ api: 'Network error. Please try again.' });
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    if (password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Password reset successful! You can now log in.');
        navigate('/login');
      } else {
        setErrors({ api: data.message || 'Failed to reset password. Invalid or expired OTP.' });
      }
    } catch (error) {
      setErrors({ api: 'Network error. Please try again.' });
    }
  };

  const goToLogin = () => navigate('/login');

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
            <FaKey className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Forgot Password</h2>
          </div>
          <div
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer shadow-md"
          >
            {theme === "dark" ? <FiSun size={15} /> : <FaMoon size={15} />}
          </div>
        </div>
        
        {errors.api && <p className="text-red-500 text-sm text-center mb-4">{errors.api}</p>}
        {message && <p className="text-green-500 text-sm text-center mb-4">{message}</p>}

        {step === 1 && (
          <form onSubmit={handleRequestOTP}>
            <p className="text-sm text-center mb-4">Enter your email to receive a One-Time Password (OTP).</p>
            <div className="mb-4">
              <label className="flex items-center mb-2">
                <MdMailOutline className="mr-2" /> 
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                    theme === "dark" ? "bg-gray-800 border-gray-600 placeholder-gray-400" : "border-gray-300 placeholder-gray-600"
                } focus:ring-blue-500`}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-700 text-white p-2 rounded-md flex items-center justify-center hover:bg-blue-800 shadow-md"
            >
              <FaEnvelope className="mr-2" /> Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="flex items-center mb-2">
                <MdLockOutline className="mr-2" /> 
                OTP
              </label>
              <input
                type="text"
                placeholder="Enter the OTP"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                required
                className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                    theme === "dark" ? "bg-gray-800 border-gray-600 placeholder-gray-400" : "border-gray-300 placeholder-gray-600"
                } focus:ring-blue-500`}
              />
            </div>

            <div className="mb-6 relative">
              <label className="flex items-center mb-2">
                <MdLockOutline className="mr-2" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full p-2 border rounded-md pr-10 focus:ring-2 focus:outline-none ${
                    errors.password ? 'border-red-500' : (theme === "dark" ? "border-gray-600" : "border-gray-300")
                  } ${
                    theme === "dark" ? "bg-gray-800 placeholder-gray-400" : "placeholder-gray-600"
                  } focus:ring-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button 
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded-md flex items-center justify-center hover:bg-green-700 shadow-md"
            >
              <FaCheckCircle className="mr-2" /> Reset Password
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
            <span onClick={goToLogin} className="flex items-center justify-center text-sm text-blue-600 hover:underline cursor-pointer">
                <IoIosArrowBack className="mr-1" />
                <span>Back to Login</span>
            </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;