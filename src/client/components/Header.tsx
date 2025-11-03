/**
 * Header - Main navigation header
 * Adapted from SwapSpool design system
 */

import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export function Header() {
  const location = useLocation();
  const [showHelp, setShowHelp] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="shadow-sm" style={{ backgroundColor: '#2a3142' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Brand / Home Link */}
          <Link to="/" className="text-xl sm:text-2xl md:text-3xl font-bold text-white hover:text-blue-300 transition-colors">
            SlicerCompare
          </Link>

          {/* Navigation Links */}
          <nav className="flex gap-4 sm:gap-6 items-center">
            <Link
              to="/"
              className={`text-sm sm:text-base font-medium transition-colors ${
                isActive('/')
                  ? 'text-blue-300 border-b-2 border-blue-300'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              to="/results"
              className={`text-sm sm:text-base font-medium transition-colors ${
                isActive('/results')
                  ? 'text-blue-300 border-b-2 border-blue-300'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Results
            </Link>

            {/* Help Button */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-gray-300 hover:text-white transition-colors relative"
              aria-label="Toggle help"
              title="Help"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </nav>
        </div>

        {/* Help Popup */}
        {showHelp && (
          <div className="mt-4 p-4 bg-blue-900/50 rounded-lg border border-blue-400/30">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>💡</span> Quick Help
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Close help"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-200">
              <div>
                <p className="font-semibold text-white mb-2">How to use SlicerCompare:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Upload your STL files and select slicer profiles to compare</li>
                  <li>Review the comparison results including print time and filament usage</li>
                  <li>View detailed session history on the Results page</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
