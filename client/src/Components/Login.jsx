import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  FaSignInAlt,
  FaMoon,
  FaQuestionCircle,
  FaUserMd,
  FaUserFriends,
} from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { MdLockOutline, MdEmail, MdVisibility, MdVisibilityOff, MdMailOutline } from "react-icons/md"; 

// NEW: Import Redux hooks and actions
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice'; // <-- Adjust path if needed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doctor'); 
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  // NEW: Initialize dispatch
  const dispatch = useDispatch();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let formErrors = {};
    if (!email || !emailRegex.test(email)) {
      formErrors.email = 'A valid email is required';
    }
    if (!password || password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }
    return formErrors;
  };

  // --- ⬇️ (THIS IS THE UPDATED FUNCTION) ⬇️ ---
  const handleLogin = async (e) => {
    e.preventDefault(); 
    const formErrors = validateForm();
    setErrors(formErrors); 

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, role }), 
        });

        if (response.ok) {
          const data = await response.json();
          
          // NEW: Dispatch the login action to update Redux state
          // This tells the Navbar that the user is logged in.
          dispatch(login(data.user)); 
          
          // We can remove this line, as our authSlice already handles localStorage:
          // localStorage.setItem('user', JSON.stringify(data.user)); 
          
          alert('Login successful!');

          // --- ✨ ROLE-BASED REDIRECT LOGIC (FIXED) ---
          const userRole = data.user.role;

          if (userRole === 'doctor') {
            navigate('/doctor-home');
          } else if (userRole === 'receptionist') {
            // NEW: Fixed the navigation path
            navigate('/recep-homepage');
          } else {
            // Fallback for any other case
            navigate('/'); 
          }
          // --- ✨ END OF LOGIC ---

        } else {
          const errorData = await response.json();
          setErrors({ api: errorData.message || 'Invalid email, password, or role' });
        }
      } catch (error) {
        console.error('Error during login:', error);
        setErrors({ api: 'Login failed due to a network error.' });
      }
    }
  };
  // --- ⬆️ (END OF UPDATED FUNCTION) ⬆️ ---
  
  const goToSignup = () => {
    navigate('/signup');
  };

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

  const goToForgotPassword = () => {
    navigate('/forgot-pass'); // <-- Uses your route path
  };

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
            <FaSignInAlt className="text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Login</h2>
          </div>
          <div
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer shadow-md"
          >
            {theme === "dark" ? <FiSun size={15} /> : <FaMoon size={15} />}
          </div>
        </div>
        
        {errors.api && <p className="text-red-500 text-sm text-center mb-4">{errors.api}</p>}

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
            className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                errors.email ? 'border-red-500' : (theme === "dark" ? "border-gray-600 focus:ring-blue-500" : "border-gray-300 focus:ring-blue-500")
            } ${
                theme === "dark"
                ? "bg-gray-800 placeholder-gray-400"
                : "placeholder-gray-600"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4 relative">
          <label className="flex items-center mb-2">
            <MdLockOutline className="mr-2" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border rounded-md pr-10 focus:ring-2 focus:outline-none ${
                errors.password ? 'border-red-500' : (theme === "dark" ? "border-gray-600 focus:ring-blue-500" : "border-gray-300 focus:ring-blue-500")
              } ${
                theme === "dark"
                ? "bg-gray-800 placeholder-gray-400"
                : "placeholder-gray-600"
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            >
              {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div className="mb-6"> 
          <label className="flex items-center mb-3">
            Login as 
          </label>
          <div className="flex justify-around gap-2">
            <label
              className={`flex-1 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                role === 'doctor'
                  ? 'border-blue-500 bg-blue-500/10'
                  : (theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100')
              }`}
            >
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={role === 'doctor'}
                onChange={(e) => setRole(e.target.value)}
                className="hidden"
              />
              <div className="flex items-center justify-center">
                <FaUserMd className={`mr-2 ${role === 'doctor' ? 'text-blue-500' : ''}`} />
                <span className="font-medium">Doctor</span>
              </div>
            </label>

            <label
              className={`flex-1 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                role === 'receptionist'
                  ? 'border-blue-500 bg-blue-500/10'
                  : (theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100')
              }`}
            >
              <input
                type="radio"
                name="role"
                value="receptionist"
                checked={role === 'receptionist'}
                onChange={(e) => setRole(e.target.value)}
                className="hidden"
              />
              <div className="flex items-center justify-center">
                <FaUserFriends className={`mr-2 ${role === 'receptionist' ? 'text-blue-500' : ''}`} />
                <span className="font-medium">Receptionist</span>
              </div>
            </label>
          </div>
        </div>

        <button 
          onClick={handleLogin} 
          className="w-full bg-blue-700 text-white p-2 rounded-md flex items-center justify-center hover:bg-blue-800 shadow-md hover:shadow-lg transition"
        >
          <FaSignInAlt className="mr-2" /> Login
        </button>

        <div className="flex justify-between items-center mt-4">
          <span onClick={goToForgotPassword} className="flex items-center text-sm text-blue-600 hover:underline cursor-pointer">
              <FaQuestionCircle className="mr-1" />
              <span>Forgot password?</span>
          </span>
            <p className="text-sm">
              Don't have an account?{' '}
              <span onClick={goToSignup} className="text-blue-600 cursor-pointer hover:underline">
                  Sign up
              </span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;