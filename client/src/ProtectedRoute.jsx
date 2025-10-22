import React from 'react';
import { Navigate } from 'react-router-dom';

// 1. We will receive "children" as a prop.
//    (In your case, "children" will be the <DoctorDashBoard /> component)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userDataString = localStorage.getItem('user');
  let user = null;

  if (userDataString) {
    user = JSON.parse(userDataString);
  }

  // Check 1: Is the user logged in at all?
  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Check 2: Does the user have the required role?
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, but wrong role. Redirect to the homepage.
    return <Navigate to="/" replace />;
  }

  // 3. If all checks pass, render the children
  return children;
};

export default ProtectedRoute;