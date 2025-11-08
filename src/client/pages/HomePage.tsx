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

      // Create 3 default configurations
      const defaultConfigs = [
        {
          session_id: sessionData.session_id,
          config_name: 'Fast Print',
          is_active: true,
          parameters: {
            layer_height: 0.2,
            infill_density: 15,
            support_type: 'none',
            printer_model: 'BBL_X1C',
            print_speed: 150,
            nozzle_temperature: 220,
            bed_temperature: 60,
            wall_thickness: 1.2,
            top_bottom_thickness: 1.0
          }
        },
        {
          session_id: sessionData.session_id,
          config_name: 'Balanced Quality',
          is_active: true,
          parameters: {
            layer_height: 0.16,
            infill_density: 20,
            support_type: 'tree',
            printer_model: 'BBL_X1C',
            print_speed: 100,
            nozzle_temperature: 220,
            bed_temperature: 60,
            wall_thickness: 1.6,
            top_bottom_thickness: 1.2
          }
        },
        {
          session_id: sessionData.session_id,
          config_name: 'High Quality',
          is_active: true,
          parameters: {
            layer_height: 0.12,
            infill_density: 25,
            support_type: 'tree',
            printer_model: 'BBL_X1C',
            print_speed: 75,
            nozzle_temperature: 220,
            bed_temperature: 60,
            wall_thickness: 2.0,
            top_bottom_thickness: 1.6
          }
        }
      ];

      // Insert all 3 configurations
      const { error: configError } = await supabase
        .from('configurations')
        .insert(defaultConfigs);

      if (configError) {
        console.error('Failed to create default configurations:', configError);
      }

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
        {/* Header - Card-based design */}
        <div
          className="text-center mb-6 p-8 rounded-lg shadow-sm"
          style={{ backgroundColor: 'var(--color-background-secondary)' }}
        >
          <h1
            className="text-4xl sm:text-5xl font-bold mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            SlicerCompare
          </h1>
          <p
            className="text-lg sm:text-xl mb-4"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Automated batch slicing comparison tool for 3D print configuration optimization
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--color-primary-100)',
              border: '1px solid var(--color-primary-300)',
            }}
          >
            <svg
              className="w-5 h-5"
              style={{ color: 'var(--color-primary-700)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-medium" style={{ color: 'var(--color-primary-900)' }}>
              Reduce workflow from 15-20 minutes to ~5 minutes
            </p>
          </div>
        </div>

        {/* Upload Section - Card-based */}
        <FileUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />

        {/* Info Section - Card-based design */}
        <div
          className="mt-6 p-6 rounded-lg shadow-sm"
          style={{ backgroundColor: 'var(--color-background-secondary)' }}
        >
          <h3
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            How It Works
          </h3>
          <ol className="space-y-4">
            <li className="flex items-start gap-4">
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: 'var(--color-primary-600)',
                  color: 'var(--color-text-inverse)',
                }}
              >
                1
              </span>
              <span className="pt-1 text-base" style={{ color: 'var(--color-text-secondary)' }}>
                Upload your STL or 3MF file
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: 'var(--color-primary-600)',
                  color: 'var(--color-text-inverse)',
                }}
              >
                2
              </span>
              <span className="pt-1 text-base" style={{ color: 'var(--color-text-secondary)' }}>
                Define 2-3 slicer configurations to compare
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: 'var(--color-primary-600)',
                  color: 'var(--color-text-inverse)',
                }}
              >
                3
              </span>
              <span className="pt-1 text-base" style={{ color: 'var(--color-text-secondary)' }}>
                Review comparison results (print time, filament usage, support material)
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: 'var(--color-primary-600)',
                  color: 'var(--color-text-inverse)',
                }}
              >
                4
              </span>
              <span className="pt-1 text-base" style={{ color: 'var(--color-text-secondary)' }}>
                Download optimized G-code for your chosen configuration
              </span>
            </li>
          </ol>

          <div className="mt-6">
            <Link
              to="/results"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-primary-600)',
                color: 'var(--color-text-inverse)',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              View Example Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
