import React, { useEffect } from "react";
import { FaMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/themeSlice.js";
import Logo from "../Logo.jsx";
import Login from "../Login.jsx";
import { Link, useNavigate } from "react-router-dom";
// FIXED: Import the 'logout' action from your authSlice
import { logout } from "../../redux/authSlice.js"; 

const Navbar2 = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // This part is correct
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isReceptionist = isAuthenticated && user?.role === 'receptionist';

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

  // FIXED: The handleLogout function now dispatches the action and does not navigate
  const handleLogout = () => {
    dispatch(logout()); // Dispatch your logout action
    // NOTE: We remove navigate('/login') so you stay on the same page.
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
        
        {/* 'Details' link */}
        {isReceptionist ? (
          <Link to='/viewappoint'>
            <h2 className="hover:text-blue-500 cursor-pointer">Details</h2>
          </Link>
        ) : (
          <h2 
            className="text-gray-400 cursor-not-allowed" 
            title="Please sign in as a receptionist to access"
          >
            Details
          </h2>
        )}
        
        {/* 'Add Records' link */}
        {isReceptionist ? (
          <Link to='/reception-dash'>
            <h2 className="hover:text-blue-500 cursor-pointer">Add Records</h2>
          </Link>
        ) : (
          <h2 
            className="text-gray-400 cursor-not-allowed" 
            title="Please sign in as a receptionist to access"
          >
            Add Records
          </h2>
        )}

        {/* --- NEW: 'Archive Record' link --- */}
        {isReceptionist ? (
          <Link to='/archived-records'>
            <h2 className="hover:text-blue-500 cursor-pointer">Archive Record</h2>
          </Link>
        ) : (
          <h2 
            className="text-gray-400 cursor-not-allowed" 
            title="Please sign in as a receptionist to access"
          >
            Archive Record
          </h2>
        )}
        {/* --- END OF NEW LINK --- */}

      </div>

      <div className="flex items-center gap-4">
        <div
          onClick={() => dispatch(toggleTheme())}
          className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer shadow
    ${theme === "light" ? "hover:bg-gray-100" : "dark:hover:bg-gray-700"}`}
        >
          {theme === "dark" ? <FiSun size={15} /> : <FaMoon size={15} />}
        </div>

        {/* This logic is also correct and will now work */}
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

export default Navbar2;