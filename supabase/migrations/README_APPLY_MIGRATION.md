# How to Apply Migration 004

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New query**
4. Copy and paste the entire contents of `004_add_slicing_columns.sql`
5. Click **Run** to execute the migration

## Option 2: Using Supabase CLI

If you have Supabase CLI installed locally:

```bash
supabase db push
```

## Verification

After applying the migration, verify the columns were added:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'configurations'
AND column_name IN ('processing_status', 'error_message', 'gcode_file_path');
```

Expected output:
- `processing_status` | `character varying(50)` | `'draft'::character varying`
- `error_message` | `text` | `NULL`
- `gcode_file_path` | `text` | `NULL`
