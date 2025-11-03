# Bambu CLI - Validated Working Commands

**Validation Date:** 2025-11-01
**Bambu Studio Version:** BambuStudio-02.03.01.51
**CLI Path:** `C:\Program Files\Bambu Studio\bambu-studio.exe`

---

## ✅ BASIC SLICING (VALIDATED)

### Command
```bash
"/c/Program Files/Bambu Studio/bambu-studio.exe" \
  --slice 0 \
  --outputdir "/path/to/output" \
  "/path/to/model.stl"
```

### Example (Git Bash on Windows)
```bash
"/c/Program Files/Bambu Studio/bambu-studio.exe" \
  --slice 0 \
  --outputdir "/c/Users/dpmal/projects/slicercompare/output" \
  "/c/Users/dpmal/projects/slicercompare/tests/fixtures/test-cube-10mm.stl"
```

### Expected Output
- File: `output/plate_1.gcode`
- Exit code: 0
- Duration: 1-2 seconds for simple geometry
- Warning (non-fatal): `calc_exclude_triangles:Unable to create plate triangles`

### Default Settings Used
- Layer height: 0.2mm
- Infill density: 20%
- Support: Disabled
- Printer: Generic FFF

---

## ✅ CONCURRENT SLICING (VALIDATED)

### Command
```bash
# Start multiple processes in background
"/c/Program Files/Bambu Studio/bambu-studio.exe" \
  --slice 0 --outputdir "/output1" "model1.stl" &

"/c/Program Files/Bambu Studio/bambu-studio.exe" \
  --slice 0 --outputdir "/output2" "model2.stl" &

# Wait for all background processes
wait
```

### Validation Results
- Both processes completed successfully
- No file locking issues
- Exit codes: 0 for both
- Output files identical when using same input

---

## ✅ G-CODE METADATA EXTRACTION (VALIDATED)

### Metadata Available in G-code Comments

**Location:** First 200 lines of G-code file (lines starting with `;`)

**Validated Patterns:**

| Metadata | Pattern | Example Output |
|----------|---------|----------------|
| Print Time | `; estimated printing time.*=\s*(.+)` | `5m 38s` |
| Filament Length | `; total filament length.*:\s*([\d.]+)` | `220.18 mm` |
| Layer Count | `; total layer number.*:\s*(\d+)` | `50` |
| Layer Height | `; layer_height\s*=\s*([\d.]+)` | `0.2` |
| Infill Density | `; sparse_infill_density\s*=\s*([\d.]+)` | `20` |
| Support Enabled | `; enable_support\s*=\s*(\d+)` | `0` or `1` |
| Max Z Height | `; max_z_height.*:\s*([\d.]+)` | `10.00` |

### Node.js Parser (Validated)

```javascript
const fs = require('fs');

function parseGcodeMetadata(gcodeFilePath) {
  const gcodeContent = fs.readFileSync(gcodeFilePath, 'utf-8');
  const lines = gcodeContent.split('\n');
  const metadata = {};

  const commentLines = lines.filter(l => l.trim().startsWith(';'));

  commentLines.forEach(line => {
    if (/estimated printing time/i.test(line)) {
      const match = line.match(/=\s*(.+)/);
      if (match) metadata.printTime = match[1].trim();
    }
    if (/total filament length/i.test(line)) {
      const match = line.match(/:\s*([\d.]+)/);
      if (match) metadata.filamentLength = parseFloat(match[1]);
    }
    if (/total layer number/i.test(line)) {
      const match = line.match(/:\s*(\d+)/);
      if (match) metadata.totalLayers = parseInt(match[1]);
    }
    if (/layer_height\s*=/i.test(line)) {
      const match = line.match(/=\s*([\d.]+)/);
      if (match) metadata.layerHeight = parseFloat(match[1]);
    }
    if (/sparse_infill_density\s*=/i.test(line)) {
      const match = line.match(/=\s*([\d.]+)/);
      if (match) metadata.infillDensity = parseFloat(match[1]);
    }
    if (/enable_support\s*=/i.test(line)) {
      const match = line.match(/=\s*(\d+)/);
      if (match) metadata.supportEnabled = match[1] === '1';
    }
  });

  return metadata;
}

// Example usage
const metadata = parseGcodeMetadata('plate_1.gcode');
console.log(metadata);
// Output:
// {
//   printTime: '5m 38s',
//   filamentLength: 220.18,
//   totalLayers: 50,
//   layerHeight: 0.2,
//   infillDensity: 20,
//   supportEnabled: false
// }
```

---

## ⚠️ PARAMETER PASSING (NOT VALIDATED)

### Status: REQUIRES INVESTIGATION

Passing custom settings via `--load-settings` requires:
1. Valid JSON settings file
2. "from" field set to "system" or "user"
3. Printer compatibility declaration
4. Possibly machine/printer settings file

**Recommendation:** Use default settings for now. Defer custom parameter passing to future story.

**Example Settings File Location:**
```
C:\Users\[username]\AppData\Roaming\BambuStudio\system\BBL\process\
```

---

## 📦 VALID TEST FIXTURES

### ✅ test-cube-10mm.stl
- **Location:** `tests/fixtures/test-cube-10mm.stl`
- **Description:** 10mm cube with valid 3D geometry
- **Slicing time:** ~1.3 seconds
- **G-code output:** 75 KB (3190 lines, 2242 commands)
- **Print time:** 5m 38s
- **Filament:** 220.18 mm

### ❌ test-triangle.stl (INVALID - DO NOT USE)
- **Issue:** Flat 2D geometry (all z=0)
- **Error:** `its_convex_hull: Unable to create convex hull`
- **Status:** REPLACE with test-cube-10mm.stl

---

## 🔍 CLI OPTIONS REFERENCE

### Verified Available Options

```
--slice 0              Slice all plates (0 = all, i = plate i)
--outputdir dir        Output directory for exported files
--load-settings file   Load process/machine settings from JSON
--load-filaments file  Load filament settings from JSON
--export-3mf file.3mf  Export project as 3MF
--export-png option    Export plate preview as PNG
--help, -h             Show command help

--allow-rotations      Allow rotations when placing objects
--clone-objects list   Clone objects in load list
--debug level          Set debug logging level (0-5)
--pipe pipename        Send progress to pipe
```

### Full Help Output
```bash
"/c/Program Files/Bambu Studio/bambu-studio.exe" --help
```

---

## 🚨 KNOWN ISSUES

1. **Non-fatal warning on every slice:**
   ```
   [error] Slic3r::GUI::PartPlateList::calc_exclude_triangles:Unable to create plate triangles
   ```
   - Impact: None (G-code still generates successfully)
   - Recommendation: Monitor, may be Bambu Studio bug

2. **No direct parameter flags:**
   - Cannot pass `--layer-height 0.3` directly
   - Must use `--load-settings` with JSON file
   - JSON format is complex and not fully documented

3. **No version flag:**
   - `--version` returns "Invalid option --version"
   - Version appears in `--help` output

---

## ✅ SUCCESS CRITERIA MET

- [x] CLI exists at documented path
- [x] CLI accepts STL files and slices them
- [x] G-code files generated successfully
- [x] Slicing completes in <2 seconds for simple geometry
- [x] Metadata can be extracted from G-code
- [x] Concurrent slicing works without conflicts
- [x] Parser patterns validated with real output

---

**Validation Completed:** 2025-11-01
**Epic Status:** GO for Epic 1 implementation with default settings
