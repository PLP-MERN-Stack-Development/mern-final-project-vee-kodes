import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { CheckCircleIcon, UserGroupIcon, ChartBarIcon, DocumentTextIcon, PlusIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function to check for active link
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-900 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link to="/" className="flex shrink-0 items-center">
              <CheckCircleIcon className="h-8 w-auto text-green-600" />
              <span className="ml-2 text-xl font-bold text-white">AgriTrace AI</span>
            </Link>
            
            {/* Navigation for Logged-in Users */}
            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:flex-nowrap sm:space-x-7">
              {user && user.role === 'Admin' && (
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'border-b-2 border-green-500 text-white'
                      : 'border-b-2 border-transparent text-gray-300 hover:border-green-400 hover:text-white'
                  }`}
                >
                  <ChartBarIcon className="mr-1 h-5 w-5" />
                  Dashboard
                </Link>
              )}
               {(user?.role === 'Admin' || user?.role === 'FieldOfficer') && (
                 <>
                    <Link
                      to="/farmers"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        isActive('/farmers')
                          ? 'border-b-2 border-green-500 text-white'
                          : 'border-b-2 border-transparent text-gray-300 hover:border-green-400 hover:text-white'
                      }`}
                    >
                      <UserGroupIcon className="mr-1 h-5 w-5" />
                      Farmers
                    </Link>
                    <Link
                      to="/register-farmer"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        isActive('/register-farmer')
                          ? 'border-b-2 border-green-500 text-white'
                          : 'border-b-2 border-transparent text-gray-300 hover:border-green-400 hover:text-white'
                      }`}
                    >
                      <PlusIcon className="mr-1 h-5 w-5" />
                      Register Farmer
                    </Link>
                    <Link
                      to="/record-collection"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        isActive('/record-collection')
                          ? 'border-b-2 border-green-500 text-white'
                          : 'border-b-2 border-transparent text-gray-300 hover:border-green-400 hover:text-white'
                      }`}
                    >
                      <DocumentTextIcon className="mr-1 h-5 w-5" />
                      Produce Intake
                    </Link>
                    <Link
                      to="/add-activity"
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        isActive('/add-activity')
                          ? 'border-b-2 border-green-500 text-white'
                          : 'border-b-2 border-transparent text-gray-300 hover:border-green-400 hover:text-white'
                      }`}
                    >
                      <PlusIcon className="mr-1 h-5 w-5" />
                      Log Farm Operation
                    </Link>
                 </>
               )}
            </div>
          </div>
          
          {/* Public Links & Auth Button */}
          <div className="flex items-center">
            {!user && (
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/')
                      ? 'border-b-2 border-green-500 text-white'
                      : 'border-b-2 border-transparent text-gray-300 hover:border-green-400 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/about')
                      ? 'border-b-2 border-green-500 text-white'
                      : 'border-b-2 border-transparent text-gray-300 hover:border-green-400 hover:text-white'
                  }`}
                >
                  About Us
                </Link>
                <Link
                  to="/features"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/features')
                      ? 'border-b-2 border-green-500 text-white'
                      : 'border-b-2 border-transparent text-gray-300 hover:border-green-400 hover:text-white'
                  }`}
                >
                  Features
                </Link>
                <Link
                  to="/how-it-works"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/how-it-works')
                      ? 'border-b-2 border-green-500 text-white'
                      : 'border-b-2 border-transparent text-gray-300 hover:border-green-400 hover:text-white'
                  }`}
                >
                  How It Works
                </Link>
                <Link
                  to="/roles"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/roles')
                      ? 'border-b-2 border-green-500 text-white'
                      : 'border-b-2 border-transparent text-gray-300 hover:border-green-400 hover:text-white'
                  }`}
                >
                  For Your Team
                </Link>                
                <Link
                  to="/contact"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/contact')
                      ? 'border-b-2 border-green-500 text-white'
                      : 'border-b-2 border-transparent text-gray-300 hover:border-green-400 hover:text-white'
                  }`}
                >
                  Contact
                </Link>
              </div>
            )}
            
            {/* Auth Button */}
            <div className="ml-6 flex items-center">
              {user ? (
                <>
                  <span className="hidden sm:inline mr-3 text-sm font-medium text-gray-300">
                    Welcome, {user.name} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                >
                  Login
                </Link>
              )}
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="sm:hidden ml-2 p-2 text-gray-300 hover:text-white"
              >
                {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && user.role === 'Admin' && (
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                <ChartBarIcon className="inline mr-2 h-5 w-5" /> Dashboard
              </Link>
            )}
            {(user?.role === 'Admin' || user?.role === 'FieldOfficer') && (
              <>
                <Link
                  to="/farmers"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <UserGroupIcon className="inline mr-2 h-5 w-5" /> Farmers
                </Link>
                <Link
                  to="/register-farmer"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <PlusIcon className="inline mr-2 h-5 w-5" /> Register Farmer
                </Link>
                <Link
                  to="/record-collection"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <DocumentTextIcon className="inline mr-2 h-5 w-5" /> Produce Intake
                </Link>
                <Link
                  to="/add-activity"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <PlusIcon className="inline mr-2 h-5 w-5" /> Log Farm Operation
                </Link>
              </>
            )}
            {!user && (
              <>
                <Link
                  to="/"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/features"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link
                  to="/how-it-works"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  to="/roles"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  For Your Team
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
              </>
            )}
            {user && (
              <div className="px-3 py-2">
                <span className="text-sm font-medium text-gray-300">
                  Welcome, {user.name} ({user.role})
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}