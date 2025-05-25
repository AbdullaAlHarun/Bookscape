import React from "react";
import footerBg from "../../assets/footer_bg.svg";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="w-full mt-16 bg-[#fff8f4] text-gray-700">
      {/* Top banner */}
      <div
        className="w-full text-center py-20 bg-cover bg-no-repeat bg-bottom"
        style={{ backgroundImage: `url(${footerBg})` }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1e1e1e] leading-tight">
          Any Enquiry? Feel <br /> Free to <span className="text-[#ff4123]">Contact Us</span>
        </h2>
      </div>

      {/* Footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Logo About */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center md:items-start">
          <img
            src={logo}
            alt="BookScape Logo"
            className="w-20 mb-4"
          />
          <p className="text-sm text-gray-600 max-w-xs">
            Discover unique stays and unforgettable experiences with BookScape.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-[#1e1e1e]">Explore</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="/">Home</a></li>
            <li><a href="/venues">Browse Venues</a></li>
            <li><a href="/customer">My Bookings</a></li>
            <li><a href="/manager">My Venues</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-[#1e1e1e]">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/cookies">Cookie Policy</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-[#1e1e1e]">Support</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="/profile">My Profile</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
