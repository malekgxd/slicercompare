import express, { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabase.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Initial extension check
    const allowedExtensions = ['.stl', '.3mf'];
    const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE'));
    }
  },
});

// File upload endpoint
router.post('/upload', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        error: {
          code: 'MISSING_FILE',
          message: 'No file uploaded. Please select a file.'
        }
      });
    }

    // Note: file-type library may not detect STL/3MF reliably, so we rely on extension validation
    const ext = req.file.originalname.toLowerCase().slice(req.file.originalname.lastIndexOf('.'));

    // Validate file is not empty
    if (req.file.size === 0) {
      return res.status(400).json({
        error: {
          code: 'INVALID_FILE',
          message: 'File is empty. Please upload a valid STL or 3MF file.'
        }
      });
    }

    // Generate unique file path
    const fileId = uuidv4();
    const sanitizedFilename = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${fileId}/${sanitizedFilename}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('uploaded-models')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(500).json({
        error: {
          code: 'UPLOAD_FAILED',
          message: 'Upload failed. Please try again.'
        }
      });
    }

    // Determine MIME type for database
    let mimeType = 'model/stl';  // Default for STL
    if (ext === '.3mf') {
      mimeType = 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml';
    }

    // Insert metadata to database
    const { data: dbData, error: dbError } = await supabase
      .from('uploaded_files')
      .insert({
        file_name: req.file.originalname,
        storage_path: filePath,
        file_size: req.file.size,
        content_type: mimeType,
        upload_status: 'uploaded',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);

      // Cleanup: Delete uploaded file from storage
      await supabase.storage
        .from('uploaded-models')
        .remove([filePath]);

      return res.status(500).json({
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to save file metadata. Please try again.'
        }
      });
    }

    // Get public URL for the file
    const { data: urlData } = supabase.storage
      .from('uploaded-models')
      .getPublicUrl(filePath);

    // Return success response
    res.status(201).json({
      id: dbData.id,
      filename: dbData.file_name,
      filePath: dbData.storage_path,
      fileUrl: urlData.publicUrl,
      fileSize: dbData.file_size,
      mimeType: dbData.content_type,
      uploadedAt: dbData.uploaded_at,
    });

  } catch (error: any) {
    // Handle multer errors
    if (error.message === 'INVALID_FILE') {
      return res.status(400).json({
        error: {
          code: 'INVALID_FILE',
          message: 'File format not supported. Please upload STL or 3MF files only.'
        }
      });
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: {
          code: 'FILE_TOO_LARGE',
          message: `File size exceeds 100MB limit. Current file: ${Math.round(error.fileSize / 1024 / 1024)}MB.`
        }
      });
    }

    // Generic error handling
    console.error('Upload error:', error);
    next(error);
  }
});

export default router;
