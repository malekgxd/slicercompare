# Database Cleanup - Fix Corrupted File Paths

## Problem Summary

ALL sessions in the database have **corrupted file paths**. They contain absolute filesystem paths instead of Supabase Storage paths.

### Examples of Corrupted Data

**BAD (Current):**
```
C:\Users\dpmal\projects\slicercompare\b648a2d3-6788-472d-9222-b227b65e0b4e\Skull_1.stl
C:\Users\dpmal\projects\slicercompare\39e539c7-b738-4369-9c81-e9a304c7c5ac\Skull_1.stl
```

**GOOD (Expected):**
```
b648a2d3-6788-472d-9222-b227b65e0b4e/Skull_1.stl
39e539c7-b738-4369-9c81-e9a304c7c5ac/Skull_1.stl
```

### Error Messages in Logs

```
[ERROR] cli - Slicing failed {
  "exitCode": 4294967293,
  "stderr": "No such file: C:\\Users\\dpmal\\projects\\slicercompare\\b648a2d3-6788-472d-9222-b227b65e0b4e\\Skull_1.stl\n"
}
```

### Root Cause

These sessions were created with an OLD version of the upload endpoint that saved files to the local filesystem. The upload endpoint has since been fixed to save files to **Supabase Storage**, but the old sessions remain in the database with invalid paths.

---

## Solution: Complete Database Cleanup

### Step 1: Apply Cleanup Migration

Run the cleanup migration to delete ALL old data:

```bash
cd C:\Users\dpmal\projects\slicercompare
psql -h <YOUR_SUPABASE_HOST> -U postgres -d postgres -f supabase/migrations/007_cleanup_corrupted_sessions.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `supabase/migrations/007_cleanup_corrupted_sessions.sql`
3. Execute

**What it does:**
- Deletes ALL results
- Deletes ALL configurations
- Deletes ALL comparison_sessions

### Step 2: Kill All Old Backend Servers

Multiple backend server processes are running, causing conflicts:

```bash
# Find all Node.js processes
tasklist | findstr "node"

# Kill specific servers (replace PID with actual process ID)
taskkill /F /PID <PID>
```

Or kill ALL tsx watch processes:
```bash
taskkill /F /IM node.exe
```

### Step 3: Start Fresh Backend Server

```bash
cd C:\Users\dpmal\projects\slicercompare
npm run server
```

### Step 4: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click the Refresh button
3. Select "Empty Cache and Hard Reload"

Or use Incognito mode:
```
Ctrl + Shift + N
```

### Step 5: (Optional) Clean Supabase Storage

If you want to also clean up orphaned files in Storage:

1. Go to Supabase Dashboard → Storage → uploaded-models
2. Delete all files manually

Or via SQL:
```sql
-- This just clears the database references, not the actual files
-- Files will remain in Storage until manually deleted
```

---

## Verification Steps

After cleanup, create a **BRAND NEW** session:

### 1. Upload New File
- Go to http://localhost:5177
- Click "New Comparison Session"
- Upload `test-cube-10mm.stl` (or any STL file)
- **DO NOT** reuse any existing session

### 2. Create 2 Configurations
- Config 1: Layer Height 0.2mm, Infill 20%
- Config 2: Layer Height 0.15mm, Infill 30%

### 3. Run Comparison
- Click "Run Comparison"
- Watch backend logs for success

### 4. Expected Success Output
```
[INFO] slicing - File downloaded from storage {
  "sessionId": "...",
  "storagePath": "12345678-1234-1234-1234-123456789abc/test-cube-10mm.stl",
  "localPath": "C:\\Users\\dpmal\\projects\\slicercompare\\storage\\temp\\...",
  "fileSize": 12345
}

[INFO] cli - Slicing completed successfully {
  "configId": "...",
  "duration": 700,
  "outputFile": "C:\\Users\\dpmal\\projects\\slicercompare\\storage\\gcode\\...\\....gcode"
}
```

---

## What Changed to Fix This

### Before (Broken)
`src/server/routes/upload.ts` saved files to local filesystem:
```typescript
const uploadDir = path.join(process.cwd(), sessionId);
await fs.writeFile(path.join(uploadDir, filename), buffer);
// Saved to database: C:\Users\dpmal\projects\slicercompare\sessionId\file.stl
```

### After (Fixed)
`src/server/routes/upload.ts` now saves to Supabase Storage:
```typescript
const filePath = `${fileId}/${sanitizedFilename}`;
await supabase.storage.from('uploaded-models').upload(filePath, buffer);
// Saved to database: fileId/file.stl
```

---

## Files Modified

- **Created:** `supabase/migrations/007_cleanup_corrupted_sessions.sql`
- **Fixed (already):** `src/server/routes/upload.ts` (Storage upload)
- **Fixed (already):** `src/server/services/slicing-batch.ts` (Storage download)

---

## Important Notes

1. **You MUST delete all old sessions** - they cannot be fixed, only deleted
2. **Do not reuse any existing session** after cleanup
3. **Kill all old backend servers** to avoid schema cache issues
4. **Clear browser cache** to avoid frontend caching old sessions
5. **Verify the logs** show Storage paths, not filesystem paths

---

## Next Steps

After applying this fix:
1. ✅ Database cleanup complete
2. ✅ Backend servers restarted
3. ✅ Browser cache cleared
4. ✅ Create brand new session
5. ✅ Upload fresh file
6. ✅ Run comparison
7. ✅ Verify success in logs
