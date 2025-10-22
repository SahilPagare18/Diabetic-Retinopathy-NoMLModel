import React from 'react'; // <-- No useEffect needed
import { useSelector } from 'react-redux'; // <-- 1. Import useSelector
import Navbar from './Navbar';
import Image from './Image';
import Footer from './Footer';
import MainContent from './MainContent';
import AppointmentSlideshowPage from './AppointmentSlideshowPage';

const DoctorDashBoard = () => {
  // 2. Get the auth state from the Redux store
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // 3. Create a boolean variable to check the role
  const isDoctor = isAuthenticated && user?.role === 'doctor';

  // We removed your useEffect because this Redux way is instant
  // and syncs with your whole app (like the navbar).

  return (
    <div>
      <Navbar />
      <Image />
      <MainContent />

      {/* 4. This is the logic: */}
      {/* It reads: "IF isDoctor is true, THEN render this component" */}
      {isDoctor && <AppointmentSlideshowPage />}

      <Footer />
    </div>
  );
}

export default DoctorDashBoard;