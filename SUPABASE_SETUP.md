# Supabase Setup Instructions for Story 1.2

## Prerequisites
- Supabase account with project created
- Supabase URL and ANON_KEY in `.env` file

## Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** section
3. Click **New bucket**
4. Bucket configuration:
   - **Name:** `uploaded-models`
   - **Public bucket:** Yes (check the box)
   - **File size limit:** 100MB (104857600 bytes)
   - **Allowed MIME types:** `model/stl`, `application/vnd.ms-package.3dmanufacturing-3dmodel+xml`, `application/sla`
5. Click **Create bucket**

## Step 2: Configure Bucket Policies

The bucket should allow:
- **Public read access** (for CLI to download files)
- **Authenticated uploads** (backend uses service key)

Default public bucket settings should work for MVP.

## Step 3: Run Database Migration

### Option A: Using Supabase CLI (Recommended)
```bash
# If Supabase CLI is installed
supabase db push

# Or apply migration directly
supabase db reset
```

### Option B: Manual SQL Execution
1. Go to Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the migration file: `supabase/migrations/20251030_uploaded_files.sql`
4. Copy and paste the SQL into the editor
5. Click **Run**

## Step 4: Verify Setup

### Verify Bucket
```bash
# Check bucket exists
curl -X GET \
  'https://YOUR_PROJECT_REF.supabase.co/storage/v1/bucket/uploaded-models' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

### Verify Table
```sql
-- Run in SQL Editor
SELECT * FROM uploaded_files LIMIT 1;
```

Expected result: Empty table with correct schema.

## Step 5: Update Environment Variables

Ensure `.env` contains:
```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
# Optional: Service role key for backend uploads
SUPABASE_SERVICE_KEY=your_service_key_here
```

## Verification Checklist

- [ ] Storage bucket `uploaded-models` created
- [ ] Bucket has public read access
- [ ] `uploaded_files` table exists in database
- [ ] Table has correct schema (id, filename, file_path, file_size, mime_type, uploaded_at, status)
- [ ] Indexes created (idx_uploaded_files_status, idx_uploaded_files_uploaded_at)
- [ ] Environment variables configured

## Troubleshooting

**Bucket creation fails:**
- Check project storage quota
- Verify project is not on free tier limits

**Migration fails:**
- Check for existing `uploaded_files` table
- Verify database permissions
- Use `DROP TABLE IF EXISTS uploaded_files CASCADE;` if needed (caution: deletes data)

**Upload test fails:**
- Verify ANON_KEY is correct
- Check bucket policies allow public read
- Ensure CORS is configured if testing from browser

## Next Steps

After setup is complete, proceed with implementing the upload API endpoint (Task 2).
