import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { name: "Browse Venues", path: "/venues" },
  { name: "Start Hosting", path: "/hosting" },
  { name: "Support", path: "/support" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="bg-[#fff8f4] shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-[#1e1e1e]">
            Book<span className="italic text-[#ff4123]">Scape</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#ff4123]"
                      : "text-[#1e1e1e] hover:text-[#ff4123]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {isAuthenticated ? (
                  <>
                    <img
                      src={user?.avatar?.url || "https://i.pravatar.cc/40"}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-[#1e1e1e]">{user.name}</span>
                  </>
                ) : (
                  <>
                    <FiUser className="text-xl text-[#1e1e1e]" />
                    <span className="text-sm text-[#1e1e1e]">Profile</span>
                  </>
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border shadow rounded py-2 z-50">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-[#ff4123] hover:bg-[#fff0eb]"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-white bg-[#ff4123] hover:bg-[#e1371c] rounded mx-2 text-center"
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-[#fff0eb]"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#fff0eb]"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>

          <button
            className="md:hidden text-2xl text-[#ff4123]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#fff8f4] px-6 pb-6 pt-2 shadow">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-[#1e1e1e] hover:text-[#ff4123]"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            <div className="border-t pt-3 space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="block w-full text-center border border-[#ff4123] text-[#ff4123] font-medium py-2 rounded hover:bg-[#fff0eb]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center bg-[#ff4123] text-white font-medium py-2 rounded hover:bg-[#e1371c]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-[#fff0eb]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-[#fff0eb]"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
