import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white px-10 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand Info - Left Aligned */}
        <div className="text-left">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-xl font-bold">DeepVision</h1>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            The essential platform for early detection and management of diabetic retinopathy for patients and their doctors.
          </p>
          <div className="flex space-x-4 text-xl">
            <FaFacebookF className="hover:text-blue-500 cursor-pointer" />
            <FaTwitter className="hover:text-blue-500 cursor-pointer" />
            <FaInstagram className="hover:text-blue-500 cursor-pointer" />
            <FaYoutube className="hover:text-blue-500 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links - Center Aligned */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Home</li>
            <li>Features</li>
            <li>Testimonials</li>
            <li>Roles</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* Support - Right Aligned */}
        <div className="text-right">
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2  text-gray-300 text-sm">
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400 text-sm">
        © 2025 DeepVision. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
