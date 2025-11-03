// Database types for Supabase tables

export type SupportType = 'none' | 'normal' | 'tree';
export type PrinterModel = 'X1_Carbon' | 'P1P' | 'P1S' | 'A1_Mini';
export type ProcessingStatus = 'queued' | 'slicing' | 'complete' | 'failed';
export type SessionStatus = 'draft' | 'processing' | 'completed' | 'failed';

export interface ConfigurationParameters {
  // Required parameters
  layer_height: number;        // 0.05-0.4mm
  infill_density: number;      // 0-100%
  support_type: SupportType;
  printer_model: PrinterModel;

  // Optional parameters
  print_speed?: number;           // 50-500 mm/s
  nozzle_temperature?: number;    // 180-300°C
  bed_temperature?: number;       // 0-120°C
  wall_thickness?: number;        // 0.4-10.0mm
  top_bottom_thickness?: number;  // 0.2-5.0mm
}

// comparison_sessions table
export interface ComparisonSession {
  session_id: string;
  user_id: string;
  session_name: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export type ComparisonSessionInsert = Omit<ComparisonSession, 'session_id' | 'created_at' | 'updated_at'>;
export type ComparisonSessionUpdate = Partial<ComparisonSessionInsert>;

// configurations table
export interface Configuration {
  config_id: string;
  session_id: string;
  input_file_id?: string | null;
  config_name: string;
  parameters: ConfigurationParameters;
  is_active: boolean;
  processing_status?: ProcessingStatus;
  error_message?: string | null;
  gcode_file_path?: string | null;
  created_at: string;
  updated_at: string;
}

export type ConfigurationInsert = Omit<Configuration, 'config_id' | 'created_at' | 'updated_at'>;
export type ConfigurationUpdate = Partial<ConfigurationInsert>;

// results table
export interface Result {
  id: string;
  configuration_id: string;
  print_time_minutes: number | null;
  filament_usage_grams: number | null;
  support_material_grams: number | null;
  gcode_file_size_bytes: number | null;
  parsed_at: string | null;
  created_at: string;
}

export type ResultInsert = Omit<Result, 'id' | 'created_at'>;
export type ResultUpdate = Partial<ResultInsert>;

// uploaded_files table
export interface UploadedFile {
  id: string;
  file_name: string;
  storage_path: string;
  file_size: number;
  content_type: string;
  upload_status: string;
  uploaded_at: string;
}

export type UploadedFileInsert = Omit<UploadedFile, 'id' | 'uploaded_at'>;
export type UploadedFileUpdate = Partial<UploadedFileInsert>;

// Database schema type
export interface Database {
  public: {
    Tables: {
      comparison_sessions: {
        Row: ComparisonSession;
        Insert: ComparisonSessionInsert;
        Update: ComparisonSessionUpdate;
      };
      configurations: {
        Row: Configuration;
        Insert: ConfigurationInsert;
        Update: ConfigurationUpdate;
      };
      results: {
        Row: Result;
        Insert: ResultInsert;
        Update: ResultUpdate;
      };
      uploaded_files: {
        Row: UploadedFile;
        Insert: UploadedFileInsert;
        Update: UploadedFileUpdate;
      };
    };
  };
}
