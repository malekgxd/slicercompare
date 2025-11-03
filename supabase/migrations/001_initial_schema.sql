-- Create uploaded_files table
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  content_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  upload_status TEXT NOT NULL DEFAULT 'uploaded',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID,
  metadata JSONB
);

-- Create comparison_sessions table
CREATE TABLE IF NOT EXISTS public.comparison_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create configurations table
CREATE TABLE IF NOT EXISTS public.configurations (
  config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.comparison_sessions(session_id) ON DELETE CASCADE,
  input_file_id UUID REFERENCES public.uploaded_files(id) ON DELETE SET NULL,
  config_name TEXT NOT NULL,
  parameters JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create results table
CREATE TABLE IF NOT EXISTS public.results (
  result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.comparison_sessions(session_id) ON DELETE CASCADE,
  config_id UUID REFERENCES public.configurations(config_id) ON DELETE SET NULL,
  result_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_uploaded_files_user_id ON public.uploaded_files(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_uploaded_at ON public.uploaded_files(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_comparison_sessions_user_id ON public.comparison_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_comparison_sessions_created_at ON public.comparison_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_configurations_session_id ON public.configurations(session_id);
CREATE INDEX IF NOT EXISTS idx_results_session_id ON public.results(session_id);
CREATE INDEX IF NOT EXISTS idx_results_config_id ON public.results(config_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - tighten in production)
CREATE POLICY "Allow all operations on uploaded_files" ON public.uploaded_files FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on comparison_sessions" ON public.comparison_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on configurations" ON public.configurations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on results" ON public.results FOR ALL USING (true) WITH CHECK (true);
