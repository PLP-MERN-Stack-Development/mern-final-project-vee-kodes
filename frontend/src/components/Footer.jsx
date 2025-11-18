import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl overflow-hidden px-5 py-5 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div className="pb-6">
            <Link to="/" className="text-sm leading-6 text-gray-300 hover:text-white">
              Home
            </Link>
          </div>
          <div className="pb-6">
            <Link to="/about" className="text-sm leading-6 text-gray-300 hover:text-white">
              About
            </Link>
          </div>
          <div className="pb-6">
            <Link to="/contact" className="text-sm leading-6 text-gray-300 hover:text-white">
              Contact
            </Link>
          </div>
          <div className="pb-6">
            <Link to="/login" className="text-sm leading-6 text-gray-300 hover:text-white">
              Login
            </Link>
          </div>
        </nav>
        <div className="mt-10 flex justify-center space-x-3 items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <span className="font-bold text-white">AgriTrace AI</span>
        </div>
        <p className="mt-2 text-center text-xs leading-5 text-gray-400">
          &copy; {new Date().getFullYear()} AgriTrace AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}