import React, { useState, useEffect } from "react";
import {
  FaSignInAlt,
  FaMoon,
  FaQuestionCircle,
  FaUserMd, // <-- Added icon for Doctor
  FaUserFriends, // <-- Added icon for Receptionist
} from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { MdLockOutline, MdVisibility, MdVisibilityOff, MdMailOutline, MdPersonOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor"); // ✅ NEW: Added role state, default to 'doctor'
  const navigate = useNavigate();

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
    } else {
      element.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const requestData = {
      username,
      email,
      password,
      role, // ✅ NEW: Added role to the request
    };
    console.log(requestData); // This will now log the role as well

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.text();
      if (response.ok) {
        alert("Signup successful! OTP sent.");
        // ✅ NEW: Pass role in navigation state
        navigate("/login", { state: { email, username, password, role } });
      } else {
        alert(`Signup failed: ${data}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed due to a network error.");
    }
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
            <h2 className="text-xl font-semibold">Sign Up</h2>
          </div>
          <div
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer shadow-md"
          >
            {theme === "dark" ? <FiSun size={15} /> : <FaMoon size={15} />}
          </div>
        </div>

        {/* --- Username Input --- */}
        <div className="mb-4">
          <label className="flex items-center mb-2">
            <MdPersonOutline className="mr-2" />
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your Username"
            className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500"
                : "border-gray-300 placeholder-gray-600 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* --- Email Input --- */}
        <div className="mb-4">
          <label className="flex items-center mb-2">
            <MdMailOutline className="mr-2" />
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Email"
            className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500"
                : "border-gray-300 placeholder-gray-600 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* --- Password Input --- */}
        <div className="mb-4 relative">
          <label className="flex items-center mb-2">
            <MdLockOutline className="mr-2" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              className={`w-full p-2 border rounded-md pr-10 focus:ring-2 focus:outline-none ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-600 placeholder-gray-400 focus:ring-blue-500"
                  : "border-gray-300 placeholder-gray-600 focus:ring-blue-500"
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
        </div>

        {/* ✅ --- NEW: Role Selection --- ✅ */}
        <div className="mb-6">
          <label className="flex items-center mb-3">
            Register as
          </label>
          <div className="flex justify-around gap-2">
            {/* --- Doctor Option --- */}
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

            {/* --- Receptionist Option --- */}
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
        {/* ✅ --- End of Role Selection --- ✅ */}


        <button
          className="w-full bg-blue-700 text-white p-2 rounded-md flex items-center justify-center hover:bg-blue-800 shadow-md hover:shadow-lg transition"
          onClick={handleSignup}
        >
          <FaSignInAlt className="mr-2" /> Sign Up
        </button>

        <a
          href="#"
          className="flex items-center justify-end text-blue-600 hover:underline mt-3"
        >
          <FaQuestionCircle className="mr-1" />
          <span>Need help?</span>
        </a>
      </div>
    </div>
  );
};

export default Signup;