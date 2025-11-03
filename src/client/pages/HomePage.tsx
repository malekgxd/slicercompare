import { Link, useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { supabase } from '@/lib/supabase/client';

interface UploadedFile {
  id: string;
  filename: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export default function HomePage() {
  const navigate = useNavigate();

  const handleUploadSuccess = async (file: UploadedFile) => {
    console.log('File uploaded successfully:', file);

    try {
      // Create a comparison session for this uploaded file
      const { data: sessionData, error: sessionError } = await supabase
        .from('comparison_sessions')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // Placeholder for anonymous user
          session_name: file.filename,
          status: 'active',
          model_file_path: file.filePath
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Failed to create session:', sessionError);
        throw sessionError;
      }

      console.log('Session created:', sessionData);

      // Navigate to the session detail page
      navigate(`/sessions/${sessionData.session_id}`);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="p-3 sm:p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header - High contrast design */}
        <div className="text-center mb-8 p-6 rounded-lg bg-card">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-heading">
            SlicerCompare
          </h1>
          <p className="text-lg sm:text-xl mb-4 text-body">
            Automated batch slicing comparison tool for 3D print configuration optimization
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border"
               style={{
                 backgroundColor: 'rgba(59, 130, 246, 0.2)',
                 borderColor: '#60a5fa'
               }}>
            <svg className="w-5 h-5" style={{ color: '#93c5fd' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium" style={{ color: '#bfdbfe' }}>
              Reduce workflow from 15-20 minutes to ~5 minutes
            </p>
          </div>
        </div>

        {/* Upload Section - Compact card */}
        <div className="mb-6 p-4 rounded-lg bg-card">
          <h2 className="text-lg font-bold mb-2" style={{ color: '#93c5fd' }}>
            Upload 3D Model
          </h2>
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </div>

        {/* Info Section - High contrast card */}
        <div className="mt-8 p-5 rounded-lg bg-card">
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#a5b4fc' }}>
            How It Works
          </h3>
          <ol className="space-y-4">
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}>
                1
              </span>
              <span className="pt-1 text-base text-body">
                Upload your STL or 3MF file
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}>
                2
              </span>
              <span className="pt-1 text-base text-body">
                Define 2-3 slicer configurations to compare
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}>
                3
              </span>
              <span className="pt-1 text-base text-body">
                Review comparison results (print time, filament usage, support material)
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}>
                4
              </span>
              <span className="pt-1 text-base text-body">
                Download optimized G-code for your chosen configuration
              </span>
            </li>
          </ol>

          <div className="mt-6">
            <Link
              to="/results"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Example Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
