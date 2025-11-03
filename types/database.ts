export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      comparison_sessions: {
        Row: {
          session_id: string
          user_id: string
          session_name: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          session_id?: string
          user_id: string
          session_name?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          session_id?: string
          user_id?: string
          session_name?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      configurations: {
        Row: {
          config_id: string
          session_id: string
          input_file_id: string | null
          config_name: string
          parameters: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          config_id?: string
          session_id: string
          input_file_id?: string | null
          config_name: string
          parameters: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          config_id?: string
          session_id?: string
          input_file_id?: string | null
          config_name?: string
          parameters?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      results: {
        Row: {
          result_id: string
          session_id: string
          config_id: string | null
          result_data: Json | null
          status: string
          completed_at: string | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          result_id?: string
          session_id: string
          config_id?: string | null
          result_data?: Json | null
          status?: string
          completed_at?: string | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          result_id?: string
          session_id?: string
          config_id?: string | null
          result_data?: Json | null
          status?: string
          completed_at?: string | null
          error_message?: string | null
          created_at?: string
        }
      }
      uploaded_files: {
        Row: {
          id: string
          file_name: string
          file_size: number
          content_type: string
          storage_path: string
          upload_status: string
          uploaded_at: string
          user_id: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          file_name: string
          file_size: number
          content_type: string
          storage_path: string
          upload_status?: string
          uploaded_at?: string
          user_id?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          file_name?: string
          file_size?: number
          content_type?: string
          storage_path?: string
          upload_status?: string
          uploaded_at?: string
          user_id?: string | null
          metadata?: Json | null
        }
      }
    }
  }
}

// Type helpers for application code
export type ComparisonSession = Database['public']['Tables']['comparison_sessions']['Row']
export type Configuration = Database['public']['Tables']['configurations']['Row']
export type Result = Database['public']['Tables']['results']['Row']
export type UploadedFile = Database['public']['Tables']['uploaded_files']['Row']

export type ConfigurationInsert = Database['public']['Tables']['configurations']['Insert']
export type ConfigurationUpdate = Database['public']['Tables']['configurations']['Update']

// Configuration parameters type (JSONB field)
export interface ConfigurationParameters {
  layer_height: number
  infill_density: number
  support_type: 'none' | 'normal' | 'tree'
  printer_model: 'X1_Carbon' | 'P1P' | 'P1S' | 'A1_Mini'
  print_speed?: number
  nozzle_temperature?: number
  bed_temperature?: number
  wall_thickness?: number
  top_bottom_thickness?: number
}

// Result data type (JSONB field)
export interface ResultData {
  print_time_seconds: number
  filament_usage_grams: number
  filament_usage_mm?: number
  support_material_grams?: number
  layer_count: number
  gcode_file_path: string
  parsed_at?: string
  model_height_mm?: number
  estimated_cost?: number
}
