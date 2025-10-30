import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiBookOpen, 
  FiPlus, 
  FiSettings,
  FiHome,
  FiUsers,
  FiMessageSquare
} from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, className = "" }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(to)
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      } ${className}`}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FiBookOpen className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EduNexus</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/courses">Courses</NavLink>
            
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                
                {user?.role === 'instructor' && (
                  <NavLink to="/create-course">
                    <FiPlus className="inline mr-1" />
                    Create Course
                  </NavLink>
                )}
                
                {user?.role === 'admin' && (
                  <NavLink to="/admin">
                    <FiUsers className="inline mr-1" />
                    Admin
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-gray-700">{user?.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiUser className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <NavLink to="/" className="block">
              <FiHome className="inline mr-2" />
              Home
            </NavLink>
            <NavLink to="/courses" className="block">
              <FiBookOpen className="inline mr-2" />
              Courses
            </NavLink>
            
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className="block">
                  <FiSettings className="inline mr-2" />
                  Dashboard
                </NavLink>
                
                {user?.role === 'instructor' && (
                  <NavLink to="/create-course" className="block">
                    <FiPlus className="inline mr-2" />
                    Create Course
                  </NavLink>
                )}
                
                {user?.role === 'admin' && (
                  <NavLink to="/admin" className="block">
                    <FiUsers className="inline mr-2" />
                    Admin Panel
                  </NavLink>
                )}
                
                <div className="border-t pt-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiUser className="mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="border-t pt-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
