import React from "react";
import { FaUserGraduate, FaBriefcase, FaUserShield } from "react-icons/fa";
import { useSelector } from "react-redux";
import { LuScanEye } from "react-icons/lu";
import { LuHeartPulse } from "react-icons/lu";
import { TbReport } from "react-icons/tb";

const MainContent = () => {
  const theme = useSelector((state) => state.theme.mode);

  return (
    <div id="how-it-works"
      className={`pt-10 pb-36 px-4 transition-all duration-300  ${
        theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <h2 className="text-4xl font-bold text-center mt-16 mb-10">
        How DeepVision{" "}
        <span className="text-blue-500">Works?</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      
        <div
          className={`rounded-2xl p-6 shadow hover:shadow-lg transition ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-blue-500">
             <LuScanEye size={30}/>
            <h3 className="text-xl font-bold">Upload & Analyze</h3>
          </div>
          <p
            className={`mb-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Securely upload your retinal scan image. Our intelligent system analyzes the image to provide an initial assessment of your Diabetic Retinopathy stage.
          </p>
          <div className="flex justify-between text-sm text-blue-400 font-medium">
            <span>Get Started →</span>
            <a href="#" className="hover:underline flex items-center gap-1">
              Upload Scan Now<span>&rarr;</span>
            </a>
          </div>
        </div>

        
        <div
          className={`rounded-2xl p-6 shadow hover:shadow-lg transition ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-blue-500">
           <LuHeartPulse size={30}/>
            <h3 className="text-xl font-bold">Get Personalized Guidance</h3>
          </div>
          <p
            className={`mb-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Receive personalized diet plans and food recommendations specifically tailored to your suggested stage to help you manage your health and make informed choices.
          </p>
          <div className="flex justify-between text-sm text-blue-400 font-medium">
            <span>View My Plan →</span>
            <a href="#" className="hover:underline flex items-center gap-1">
              See Recommendations<span>&rarr;</span>
            </a>
          </div>
        </div>

      
        <div
          className={`rounded-2xl p-6 shadow hover:shadow-lg transition ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex items-center gap-2 mb-4 text-green-500">
            
            <TbReport size={30}/>
            <h3 className="text-xl font-bold">Generate Your Report</h3>
          </div>
          <p
            className={`mb-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
             Generate comprehensive reports summarizing your assessment, dietary logs, and progress. Easily download or share these reports with your doctor for informed consultations.
          </p>
          <div className="flex justify-between text-sm text-blue-400 font-medium">
            <span>Create a New Report →</span>
            <a href="#" className="hover:underline flex items-center gap-1">
             Manage Reports<span>&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;