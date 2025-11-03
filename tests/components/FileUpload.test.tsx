import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, userEvent } from '../utils/test-helpers';
import { renderWithProviders } from '../utils/test-helpers';
import FileUpload from '@/src/client/components/FileUpload';

// Mock react-dropzone
vi.mock('react-dropzone', () => ({
  useDropzone: vi.fn(),
}));

import { useDropzone } from 'react-dropzone';

describe('FileUpload Component', () => {
  const mockOnUploadSuccess = vi.fn();
  const mockOnUploadError = vi.fn();
  let mockGetRootProps: any;
  let mockGetInputProps: any;
  let mockOnDrop: any;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();

    // Setup default mock for useDropzone
    mockGetRootProps = vi.fn(() => ({
      onClick: vi.fn(),
      onDrop: vi.fn(),
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
    }));

    mockGetInputProps = vi.fn(() => ({
      type: 'file',
      accept: '.stl,.3mf',
      multiple: false,
    }));

    vi.mocked(useDropzone).mockImplementation(({ onDrop }: any) => {
      mockOnDrop = onDrop;
      return {
        getRootProps: mockGetRootProps,
        getInputProps: mockGetInputProps,
        isDragActive: false,
        isDragAccept: false,
        isDragReject: false,
        isFocused: false,
        acceptedFiles: [],
        fileRejections: [],
        rootRef: { current: null },
        inputRef: { current: null },
        open: vi.fn(),
      };
    });
  });

  describe('Rendering', () => {
    it('should render upload area with drag-and-drop text', () => {
      renderWithProviders(
        <FileUpload
          onUploadSuccess={mockOnUploadSuccess}
          onUploadError={mockOnUploadError}
        />
      );

      expect(screen.getByText(/drag stl or 3mf file here/i)).toBeInTheDocument();
      expect(screen.getByText(/maximum file size: 100mb/i)).toBeInTheDocument();
    });

    it('should render file input with dropzone props', () => {
      renderWithProviders(<FileUpload />);

      // Verify useDropzone was called with correct config
      expect(useDropzone).toHaveBeenCalledWith(
        expect.objectContaining({
          accept: {
            'model/stl': ['.stl'],
            'application/vnd.ms-package.3dmanufacturing-3dmodel+xml': ['.3mf'],
          },
          maxSize: 100 * 1024 * 1024,
          multiple: false,
        })
      );
    });

    it('should render upload icon', () => {
      renderWithProviders(<FileUpload />);

      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('File Validation', () => {
    it('should accept .stl files', async () => {
      renderWithProviders(<FileUpload onUploadSuccess={mockOnUploadSuccess} />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

      // Mock successful upload
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'test.stl',
          filePath: '/uploads/test.stl',
          fileUrl: 'http://localhost:3001/uploads/test.stl',
          fileSize: 1024 * 1024,
          mimeType: 'model/stl',
          uploadedAt: new Date().toISOString(),
        }),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/upload',
          expect.objectContaining({
            method: 'POST',
          })
        );
      });
    });

    it('should accept .3mf files', async () => {
      renderWithProviders(<FileUpload onUploadSuccess={mockOnUploadSuccess} />);

      const file = new File(['test content'], 'test.3mf', {
        type: 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml',
      });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

      // Mock successful upload
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'test.3mf',
          filePath: '/uploads/test.3mf',
          fileUrl: 'http://localhost:3001/uploads/test.3mf',
          fileSize: 1024 * 1024,
          mimeType: 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml',
          uploadedAt: new Date().toISOString(),
        }),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('should reject invalid file types', async () => {
      renderWithProviders(<FileUpload onUploadError={mockOnUploadError} />);

      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 1024 });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText(/file format not supported/i)).toBeInTheDocument();
      });

      expect(mockOnUploadError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('File format not supported'),
        })
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should reject files over size limit', async () => {
      renderWithProviders(<FileUpload onUploadError={mockOnUploadError} />);

      const file = new File(['test content'], 'large.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 101 * 1024 * 1024 }); // 101MB

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText(/file size exceeds 100mb limit/i)).toBeInTheDocument();
      });

      expect(mockOnUploadError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('File size exceeds 100MB limit'),
        })
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should show error message with file size for oversized files', async () => {
      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'large.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 150 * 1024 * 1024 }); // 150MB

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText(/current file: 150mb/i)).toBeInTheDocument();
      });
    });

    it('should handle file with uppercase extension', async () => {
      renderWithProviders(<FileUpload onUploadSuccess={mockOnUploadSuccess} />);

      const file = new File(['test content'], 'TEST.STL', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'TEST.STL',
          filePath: '/uploads/TEST.STL',
          fileUrl: 'http://localhost:3001/uploads/TEST.STL',
          fileSize: 1024 * 1024,
          mimeType: 'model/stl',
          uploadedAt: new Date().toISOString(),
        }),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('File Upload', () => {
    it('should show uploading state during upload', async () => {
      let resolveUpload: any;
      const uploadPromise = new Promise((resolve) => {
        resolveUpload = resolve;
      });

      (global.fetch as any).mockReturnValue(uploadPromise);

      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      // Start the upload (don't await since we're testing the loading state)
      mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText('Uploading file...')).toBeInTheDocument();
      });

      // Resolve upload
      resolveUpload({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'test.stl',
          filePath: '/uploads/test.stl',
          fileUrl: 'http://localhost:3001/uploads/test.stl',
          fileSize: 1024 * 1024,
          mimeType: 'model/stl',
          uploadedAt: new Date().toISOString(),
        }),
      });

      // Wait for upload to complete
      await waitFor(() => {
        expect(screen.queryByText('Uploading file...')).not.toBeInTheDocument();
      });
    });

    it('should call onSuccess callback on successful upload', async () => {
      renderWithProviders(<FileUpload onUploadSuccess={mockOnUploadSuccess} />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const uploadedFileData = {
        id: 'test-id-123',
        filename: 'test.stl',
        filePath: '/uploads/test.stl',
        fileUrl: 'http://localhost:3001/uploads/test.stl',
        fileSize: 1024 * 1024,
        mimeType: 'model/stl',
        uploadedAt: new Date().toISOString(),
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => uploadedFileData,
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(mockOnUploadSuccess).toHaveBeenCalledWith(uploadedFileData);
      });
    });

    it('should call onError callback on failed upload', async () => {
      renderWithProviders(<FileUpload onUploadError={mockOnUploadError} />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: { message: 'Invalid file format' },
        }),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(mockOnUploadError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Invalid file format',
          })
        );
      });
    });

    it('should display uploaded file details after successful upload', async () => {
      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'my-model.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 }); // 5MB

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'my-model.stl',
          filePath: '/uploads/my-model.stl',
          fileUrl: 'http://localhost:3001/uploads/my-model.stl',
          fileSize: 5 * 1024 * 1024,
          mimeType: 'model/stl',
          uploadedAt: new Date().toISOString(),
        }),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText('Upload Successful!')).toBeInTheDocument();
        expect(screen.getByText('my-model.stl', { exact: false })).toBeInTheDocument();
        expect(screen.getByText(/5\.00 mb/i)).toBeInTheDocument();
        // Check that STL type is displayed (it appears in both filename and type field)
        expect(screen.getAllByText(/stl/i).length).toBeGreaterThan(0);
      });
    });

    it('should display correct file type for 3MF files', async () => {
      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'model.3mf', {
        type: 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml',
      });
      Object.defineProperty(file, 'size', { value: 3 * 1024 * 1024 });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'model.3mf',
          filePath: '/uploads/model.3mf',
          fileUrl: 'http://localhost:3001/uploads/model.3mf',
          fileSize: 3 * 1024 * 1024,
          mimeType: 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml',
          uploadedAt: new Date().toISOString(),
        }),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText(/3mf/i)).toBeInTheDocument();
      });
    });

    it('should send file as FormData in POST request', async () => {
      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'test.stl',
          filePath: '/uploads/test.stl',
          fileUrl: 'http://localhost:3001/uploads/test.stl',
          fileSize: 1024 * 1024,
          mimeType: 'model/stl',
          uploadedAt: new Date().toISOString(),
        }),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3001/api/upload',
          expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData),
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on upload failure', async () => {
      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          error: { message: 'Server error occurred' },
        }),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText('Server error occurred')).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      renderWithProviders(<FileUpload onUploadError={mockOnUploadError} />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      expect(mockOnUploadError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Network error',
        })
      );
    });

    it('should show generic error message for unknown errors', async () => {
      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      (global.fetch as any).mockRejectedValueOnce({});

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText(/upload failed. please try again/i)).toBeInTheDocument();
      });
    });

    it('should handle upload failure without error details', async () => {
      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({}),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText('Upload failed')).toBeInTheDocument();
      });
    });
  });

  describe('Drag and Drop Behavior', () => {
    it('should show active state when dragging over', () => {
      vi.mocked(useDropzone).mockImplementation(({ onDrop }: any) => {
        mockOnDrop = onDrop;
        return {
          getRootProps: mockGetRootProps,
          getInputProps: mockGetInputProps,
          isDragActive: true,
          isDragAccept: false,
          isDragReject: false,
          isFocused: false,
          acceptedFiles: [],
          fileRejections: [],
          rootRef: { current: null },
          inputRef: { current: null },
          open: vi.fn(),
        };
      });

      renderWithProviders(<FileUpload />);

      expect(screen.getByText(/drop file here/i)).toBeInTheDocument();
    });

    it('should apply correct styling when drag is active', () => {
      vi.mocked(useDropzone).mockImplementation(({ onDrop }: any) => {
        mockOnDrop = onDrop;
        return {
          getRootProps: mockGetRootProps,
          getInputProps: mockGetInputProps,
          isDragActive: true,
          isDragAccept: false,
          isDragReject: false,
          isFocused: false,
          acceptedFiles: [],
          fileRejections: [],
          rootRef: { current: null },
          inputRef: { current: null },
          open: vi.fn(),
        };
      });

      const { container } = renderWithProviders(<FileUpload />);

      const dropZone = container.querySelector('.border-blue-500');
      expect(dropZone).toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    it('should allow uploading another file after successful upload', async () => {
      const user = userEvent.setup();

      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'test.stl',
          filePath: '/uploads/test.stl',
          fileUrl: 'http://localhost:3001/uploads/test.stl',
          fileSize: 1024 * 1024,
          mimeType: 'model/stl',
          uploadedAt: new Date().toISOString(),
        }),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText('Upload Successful!')).toBeInTheDocument();
      });

      const uploadAnotherButton = screen.getByRole('button', {
        name: /upload another file/i,
      });
      await user.click(uploadAnotherButton);

      expect(screen.getByText(/drag stl or 3mf file here/i)).toBeInTheDocument();
      expect(screen.queryByText('Upload Successful!')).not.toBeInTheDocument();
    });

    it('should clear error when uploading new file', async () => {
      renderWithProviders(<FileUpload />);

      // First upload with invalid file type
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(invalidFile, 'size', { value: 1024 });

      await mockOnDrop([invalidFile]);

      await waitFor(() => {
        expect(screen.getByText(/file format not supported/i)).toBeInTheDocument();
      });

      // Second upload with valid file
      const validFile = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(validFile, 'size', { value: 1024 * 1024 });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'test.stl',
          filePath: '/uploads/test.stl',
          fileUrl: 'http://localhost:3001/uploads/test.stl',
          fileSize: 1024 * 1024,
          mimeType: 'model/stl',
          uploadedAt: new Date().toISOString(),
        }),
      });

      await mockOnDrop([validFile]);

      await waitFor(() => {
        expect(screen.queryByText(/file format not supported/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty file array gracefully', async () => {
      renderWithProviders(<FileUpload />);

      await mockOnDrop([]);

      // Should not trigger any error or upload
      expect(global.fetch).not.toHaveBeenCalled();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it('should only process first file when multiple files dropped', async () => {
      renderWithProviders(<FileUpload onUploadSuccess={mockOnUploadSuccess} />);

      const file1 = new File(['test 1'], 'test1.stl', { type: 'model/stl' });
      const file2 = new File(['test 2'], 'test2.stl', { type: 'model/stl' });
      Object.defineProperty(file1, 'size', { value: 1024 });
      Object.defineProperty(file2, 'size', { value: 1024 });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'test1.stl',
          filePath: '/uploads/test1.stl',
          fileUrl: 'http://localhost:3001/uploads/test1.stl',
          fileSize: 1024,
          mimeType: 'model/stl',
          uploadedAt: new Date().toISOString(),
        }),
      });

      await mockOnDrop([file1, file2]);

      await waitFor(() => {
        expect(screen.getByText('test1.stl', { exact: false })).toBeInTheDocument();
      });
    });

    it('should disable upload zone during upload', async () => {
      let resolveUpload: any;
      const uploadPromise = new Promise((resolve) => {
        resolveUpload = resolve;
      });

      (global.fetch as any).mockReturnValue(uploadPromise);

      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      // Start the upload (don't await)
      mockOnDrop([file]);

      // Verify uploading state is shown
      await waitFor(() => {
        expect(screen.getByText('Uploading file...')).toBeInTheDocument();
      });

      // Resolve upload
      resolveUpload({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'test.stl',
          filePath: '/uploads/test.stl',
          fileUrl: 'http://localhost:3001/uploads/test.stl',
          fileSize: 1024 * 1024,
          mimeType: 'model/stl',
          uploadedAt: new Date().toISOString(),
        }),
      });

      // Wait for completion
      await waitFor(() => {
        expect(screen.getByText('Upload Successful!')).toBeInTheDocument();
      });
    });
  });

  describe('Component without callbacks', () => {
    it('should work without onUploadSuccess callback', async () => {
      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'test.stl', { type: 'model/stl' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-id',
          filename: 'test.stl',
          filePath: '/uploads/test.stl',
          fileUrl: 'http://localhost:3001/uploads/test.stl',
          fileSize: 1024 * 1024,
          mimeType: 'model/stl',
          uploadedAt: new Date().toISOString(),
        }),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText('Upload Successful!')).toBeInTheDocument();
      });
    });

    it('should work without onUploadError callback', async () => {
      renderWithProviders(<FileUpload />);

      const file = new File(['test content'], 'invalid.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 1024 });

      await mockOnDrop([file]);

      await waitFor(() => {
        expect(screen.getByText(/file format not supported/i)).toBeInTheDocument();
      });
    });
  });
});
