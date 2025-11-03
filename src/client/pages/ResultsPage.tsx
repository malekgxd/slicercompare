import { Link } from 'react-router-dom';

export default function ResultsPage() {
  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Header card - SwapSpool style */}
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#2a3142' }}>
          <div className="px-3 md:px-4 py-4 rounded-t-lg border-b-2 border-blue-500/30">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-300">
              Comparison Results
            </h1>
          </div>
        </div>

        {/* Content card - SwapSpool style */}
        <div className="rounded-lg p-6" style={{ backgroundColor: '#2a3142' }}>
          <div className="flex items-start gap-4">
            <svg className="w-12 h-12 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Results Coming Soon
              </h3>
              <p className="text-gray-300">
                Results will be displayed here after batch slicing is complete.
                This is a placeholder page for Story 1.1 infrastructure setup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
