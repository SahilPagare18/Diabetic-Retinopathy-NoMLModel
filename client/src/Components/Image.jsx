import React from "react";
import { useSelector } from "react-redux";
import home from '../images/img.jpg';

const Image = () => {
  const theme = useSelector((state) => state.theme.mode);

  const scrollToSection = () => {
    const section = document.getElementById("how-it-works");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full h-[100vh]">
      {/* Background Image */}
      <img
        src={home}
        alt="home page"
        className="w-full h-full object-cover"
      />

      {/* Dark overlay */}
      {theme === "dark" && (
        <div className="absolute inset-0 bg-black opacity-50 z-10" />
      )}

      {/* Text + Buttons */}
<div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 text-center z-20">
  <h1 className="text-white text-5xl font-bold drop-shadow-lg">
    Welcome to Diabetic Retinopathy Detection System
  </h1>
  <p className="text-white text-lg mt-4 drop-shadow-md">
    Empowering early diagnosis through AI-driven retinal image analysis
  </p>

  {/* Buttons */}
  <div className="flex justify-center gap-4 mt-8">
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition">
      Get Started Now
    </button>
    <button
      onClick={scrollToSection}
      className="border border-blue-600 text-blue-600 hover:bg-blue-100 font-medium px-6 py-2 rounded-lg transition"
    >
      How It Works
    </button>
  </div>
</div>

    </div>
  );
};

export default Image;
