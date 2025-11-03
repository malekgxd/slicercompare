# Bambu Studio CLI Fix - Complete Solution

## Problem Summary

The Bambu Studio CLI was failing with exit code 4294967279 and empty stderr, causing all slicing operations to fail.

## Root Cause

Bambu Studio CLI requires **THREE types of settings files**:
1. **Process Settings** - Slicing parameters (layer height, infill, etc.)
2. **Machine Settings** - Printer specifications
3. **Filament Settings** - Material properties

We were only providing process settings, causing the error: **"process not compatible with printer"**

## Solution Implemented

### 1. Added Machine and Filament Presets (src/server/services/bambu-cli.ts)

```typescript
// Map printer models to machine presets
const machinePresets: Record<string, string> = {
  'X1_Carbon': path.join(presetsBasePath, 'machine', 'Bambu Lab X1 Carbon 0.4 nozzle.json'),
  'P1P': path.join(presetsBasePath, 'machine', 'Bambu Lab P1P 0.4 nozzle.json'),
  'P1S': path.join(presetsBasePath, 'machine', 'Bambu Lab P1S 0.4 nozzle.json'),
  'A1_Mini': path.join(presetsBasePath, 'machine', 'Bambu Lab A1 mini 0.4 nozzle.json')
};

// Map printer models to filament presets (using PLA Basic as default)
const filamentPresets: Record<string, string> = {
  'X1_Carbon': path.join(presetsBasePath, 'filament', 'Bambu PLA Basic @BBL X1C.json'),
  'P1P': path.join(presetsBasePath, 'filament', 'Bambu PLA Basic @BBL P1P.json'),
  'P1S': path.join(presetsBasePath, 'filament', 'Bambu PLA Basic @BBL P1S.json'),
  'A1_Mini': path.join(presetsBasePath, 'filament', 'Bambu PLA Basic @BBL A1M.json')
};
```

### 2. Updated CLI Arguments

```typescript
const args = [
  '--slice', '0',                    // Slice without GUI
  '--outputdir', path.dirname(sanitizedOutput),
  '--load-settings', settingsFiles,  // Process + Machine settings (semicolon-separated)
  '--load-filaments', filamentPreset, // Filament settings
  sanitizedInput                     // Input file as final argument
];
```

## Testing Results

### ✅ Success
- Bambu Studio CLI now executes successfully
- Exit code: 0 (success)
- Both test configurations sliced in ~700ms each
- G-code files generated

### Example Log Output
```
[INFO] cli - Slicing completed successfully {
  "configId": "f7223570-d4e9-45bf-a924-2f25c4d50670",
  "duration": 698,
  "outputFile": "...f7223570-d4e9-45bf-a924-2f25c4d50670.gcode"
}
```

## Remaining Issues to Fix

### 1. File Naming Issue
**Problem**: Bambu Studio always saves files as `plate_1.gcode`, ignoring our custom filename.

**Impact**: Multiple configurations overwrite each other's output.

**Solution Needed**: Rename `plate_1.gcode` to the expected filename after slicing completes.

### 2. Database Schema Issue
**Error**: `Could not find the 'configuration_id' column of 'results' in the schema cache`

**Solution Needed**: User must apply database migration to add the `configuration_id` column to the `results` table.

## Files Modified

- `src/server/services/bambu-cli.ts` - Added machine and filament preset logic
- `src/server/services/slicing-batch.ts` - File download from Storage (already implemented)
- `src/server/services/settings-generator.ts` - Debug logging (already implemented)

## Next Steps

1. **Fix file renaming**: Rename `plate_1.gcode` after slicing
2. **Database migration**: Add `configuration_id` column to `results` table
3. **Test end-to-end**: Verify complete workflow with test files
