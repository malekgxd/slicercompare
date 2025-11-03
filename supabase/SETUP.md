# Supabase Setup Guide

This guide will help you set up your Supabase database and storage for SlicerCompare.

## Prerequisites
- Supabase account (https://supabase.com)
- Supabase project created (you have: eynsbmggzhpibfdlmvsu)

## Step 1: Run Database Migrations

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/eynsbmggzhpibfdlmvsu
2. Navigate to the **SQL Editor** section (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `migrations/001_initial_schema.sql`
5. Click **Run** to execute the SQL

This will create:
- `uploaded_files` table
- `comparison_sessions` table
- `configurations` table
- `results` table
- Necessary indexes
- Row Level Security policies

## Step 2: Create Storage Bucket

1. In your Supabase Dashboard, navigate to **Storage** (left sidebar)
2. Click **New Bucket**
3. Configure the bucket:
   - **Name**: `uploaded-models`
   - **Public bucket**: Check this box (so files can be accessed via public URLs)
4. Click **Create Bucket**

## Step 3: Configure Storage Policies

1. Click on the `uploaded-models` bucket
2. Go to **Policies** tab
3. Add the following policies:

### Policy 1: Allow file uploads
- **Policy name**: Allow file uploads
- **Allowed operation**: INSERT
- **Policy definition**:
  ```sql
  true
  ```

### Policy 2: Allow file downloads
- **Policy name**: Allow file downloads
- **Allowed operation**: SELECT
- **Policy definition**:
  ```sql
  true
  ```

### Policy 3: Allow file deletions
- **Policy name**: Allow file deletions
- **Allowed operation**: DELETE
- **Policy definition**:
  ```sql
  true
  ```

## Step 4: Verify Setup

Run these checks to ensure everything is set up correctly:

### Check Tables
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('uploaded_files', 'comparison_sessions', 'configurations', 'results');
```

You should see all 4 tables listed.

### Check Storage Bucket
Navigate to Storage > uploaded-models and verify the bucket exists and is public.

## Step 5: Test the Application

1. Ensure your `.env` file has the correct credentials:
   ```
   SUPABASE_URL=https://eynsbmggzhpibfdlmvsu.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. Start the development server:
   ```bash
   npm run dev
   npm run server
   ```

3. Try uploading a file through the application

## Troubleshooting

### "Bucket not found" error
- Verify the bucket name is exactly `uploaded-models`
- Check that the bucket is created and public
- Verify storage policies are set correctly

### "Table does not exist" error
- Ensure the migration SQL ran successfully
- Check the SQL Editor for any error messages
- Verify you're connected to the correct project

### Permission errors
- Check RLS policies are created
- For development, ensure policies allow all operations
- Check the Logs section in Supabase for detailed error messages
