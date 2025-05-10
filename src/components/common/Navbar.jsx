import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";

const navLinks = [
  { name: "Browse Venues", path: "/venues" },
  { name: "Start Hosting", path: "/hosting" },
  { name: "Support", path: "/support" },
];

const isLoggedIn = false;
const user = { name: "Abdul", avatar: "https://i.pravatar.cc/40" };

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Book<span className="italic text-indigo-600">Scape</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-indigo-600" : "text-gray-700 hover:text-indigo-500"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {isLoggedIn ? (
                  <>
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                    <span className="text-sm text-gray-800">{user.name}</span>
                  </>
                ) : (
                  <>
                    <FiUser className="text-xl text-gray-700" />
                    <span className="text-sm text-gray-700">Profile</span>
                  </>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border shadow rounded py-2 z-50">
                  {!isLoggedIn ? (
                    <>
                      <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                      <Link to="/register" className="block px-4 py-2 hover:bg-gray-100">Sign Up</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-6 pt-2 shadow">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-gray-800 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            <div className="border-t pt-3">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
