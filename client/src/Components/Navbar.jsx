import React, { useEffect } from "react";
import { FaMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/themeSlice.js";
import Logo from "./Logo.jsx";
// import Login from "./Login.jsx"; // This import was not being used
import { Link, useNavigate } from "react-router-dom";
// NEW: Import the logout action
import { logout } from "../redux/authSlice.js"; 

const Navbar = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // NEW: Get the authentication state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // NEW: Create a boolean to check if the user is a doctor
  const isDoctor = isAuthenticated && user?.role === 'doctor';

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

  const handleSignup = () => {
    navigate('/login');
  }

  // NEW: Add the logout handler
  const handleLogout = () => {
    dispatch(logout()); // Dispatches the logout action
  }

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 shadow-md px-6 py-4 flex justify-between items-center transition-all duration-300 ${
        theme === "dark" 
          ? "bg-[#0F0233] text-white"   // Dark mode background
          : "bg-[#FFFFFF] text-[#0F0233]" // Light mode background
      }`}
    >
      <h1 className="font-bold text-3xl hover:scale-90 transition-transform duration-300 cursor-pointer">
        <Logo />
      </h1>

      <div className="flex items-center gap-8 font-semibold text-lg mr-5">
        <h2 className="hover:text-blue-500 cursor-pointer">Home</h2>

        {/* --- UPDATED LINK --- */}
        {/* Changed from 'Details' to 'View Records' and updated the path */}
        {isDoctor ? (
          <Link to='/completed-records'> {/* <-- 1. Path updated */}
            <h2 className="hover:text-blue-500 cursor-pointer">View Records</h2> {/* <-- 2. Text updated */}
          </Link>
        ) : (
          <h2 
            className="text-gray-400 cursor-not-allowed" 
            title="Please sign in as a doctor to access"
          >
            View Records {/* <-- 3. Text updated */}
          </h2>
        )}
        {/* --- END OF UPDATE --- */}
        
      </div>

      <div className="flex items-center gap-4">
        <div
          onClick={() => dispatch(toggleTheme())}
          className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer shadow
    ${theme === "light" ? "hover:bg-gray-100" : "dark:hover:bg-gray-700"}`}
        >
          {theme === "dark" ? <FiSun size={15} /> : <FaMoon size={15} />}
        </div>

        {/* NEW: Conditional button for 'LOG OUT' vs 'SIGN UP' */}
        {isAuthenticated ? (
          <button onClick={handleLogout} className="bg-red-500 px-5 py-2 text-white rounded hover:bg-red-600">
            LOG OUT
          </button>
        ) : (
          <button onClick={handleSignup} className="bg-blue-500 px-5 py-2 text-white rounded hover:bg-blue-600">
            SIGN UP
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;