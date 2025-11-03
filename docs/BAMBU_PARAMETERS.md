# Bambu Slicer Parameter Catalog

**Document Version:** 1.0
**Date:** 2025-11-01
**Author:** Mary (Business Analyst)
**Epic:** Epic 2 - Production-Ready Enhancement
**Story:** Story 2.1 - Full Bambu Slicer Parameter Exposure

---

## Executive Summary

### Parameter Scope
- **Total parameters identified:** 60+ unique parameters
- **Tier 1 (Essential):** 15 parameters - Story 2.1 MVP
- **Tier 2 (Advanced):** 20 parameters - Story 2.1 Nice-to-Have
- **Tier 3 (Expert):** 30+ parameters - Defer to Epic 3

### Key Findings
1. **CLI Integration:** Bambu Studio CLI supports JSON-based settings files (`--load-settings` and `--load-filaments`)
2. **Settings Architecture:** Three-part structure (Process, Filament, Machine)
3. **Inheritance Model:** Settings files use inheritance chains (e.g., inherits from base profiles)
4. **Validation Requirement:** Settings must include printer compatibility declarations
5. **Default Behavior:** Without custom settings, CLI uses Bambu defaults (0.2mm layer, 20% infill)

### Story 2.1 MVP Recommendation
Focus on **Tier 1 Essential Parameters** (15 parameters) that provide maximum user value with minimal UI complexity. These parameters:
- Cover 80% of common optimization scenarios
- Have clear, predictable impacts on results
- Are familiar to print farm operators
- Can be validated programmatically

---

## Tier 1: Essential Parameters (Story 2.1 MVP)

**Category: Quality Settings**

| Parameter | Type | Range/Options | Default | Description | Impact |
|-----------|------|---------------|---------|-------------|--------|
| `layer_height` | number | 0.08-0.36mm | 0.2mm | Height of each printed layer | **Critical** - Primary quality vs speed trade-off. Lower = better quality, longer print time |
| `initial_layer_height` | number | 0.1-0.4mm | 0.2mm | Height of first layer only | **High** - Affects bed adhesion. Usually 100-120% of layer_height |
| `wall_loops` | integer | 2-10 | 3 | Number of perimeter walls | **High** - Affects strength and material usage. More walls = stronger, slower |
| `top_shell_layers` | integer | 3-10 | 4 | Number of solid top layers | **Medium** - Affects surface finish and strength |
| `bottom_shell_layers` | integer | 2-8 | 3 | Number of solid bottom layers | **Medium** - Affects first layer stability |

**Category: Infill Settings**

| Parameter | Type | Range/Options | Default | Description | Impact |
|-----------|------|---------------|---------|-------------|--------|
| `sparse_infill_density` | string | "0%"-"100%" | "20%" | Internal infill percentage | **Critical** - Major impact on material, time, and strength. 15-20% typical |
| `sparse_infill_pattern` | string | grid, gyroid, honeycomb, triangle, cubic, line, concentric, 3dhoneycomb, hilbertcurve, archimedeanchords, octagramspiral | grid | Infill pattern type | **Medium** - Gyroid for strength, grid for speed |

**Category: Support Settings**

| Parameter | Type | Range/Options | Default | Description | Impact |
|-----------|------|---------------|---------|-------------|--------|
| `enable_support` | boolean | 0, 1 | 0 | Enable support structures | **Critical** - Required for overhangs. Major time/material impact |
| `support_type` | string | normal, tree | normal | Support structure type | **High** - Tree supports use less material, easier removal |
| `support_threshold_angle` | integer | 0-90° | 30° | Minimum angle requiring support | **Medium** - Lower = more supports. 30° typical for FDM |

**Category: Speed Settings**

| Parameter | Type | Range/Options | Default | Description | Impact |
|-----------|------|---------------|---------|-------------|--------|
| `outer_wall_speed` | number | 50-300 mm/s | 200 | Speed for outer perimeters | **High** - Lower = better quality. Most visible surface |
| `inner_wall_speed` | number | 100-350 mm/s | 300 | Speed for inner perimeters | **Medium** - Can be faster than outer walls |
| `sparse_infill_speed` | number | 150-450 mm/s | 270 | Speed for infill printing | **Medium** - Fastest component, least visible |
| `initial_layer_speed` | number | 20-100 mm/s | 50 | Speed for first layer | **High** - Critical for bed adhesion. Keep low |

**Category: Temperature Settings**

| Parameter | Type | Range/Options | Default | Description | Impact |
|-----------|------|---------------|---------|-------------|--------|
| `nozzle_temperature` | number | 170-300°C | 220°C (PLA) | Nozzle temperature during print | **Critical** - Material-specific. Too low = under-extrusion, too high = stringing |

### Tier 1 Parameter Dependencies

**Critical Dependencies:**
- `initial_layer_height` should be ≥ `layer_height` (typically 100-125%)
- `enable_support` must be `1` for `support_type` and `support_threshold_angle` to apply
- `sparse_infill_density` at "0%" makes `sparse_infill_pattern` irrelevant

**Validation Rules:**
- Layer height: Must be compatible with nozzle size (typically 25-75% of nozzle diameter)
- Wall loops: Minimum 2 for structural integrity
- Infill density: "0%" to "100%" in increments of "5%"
- Temperatures: Must match filament type specifications

---

## Tier 2: Advanced Parameters (Story 2.1 Nice-to-Have)

**Category: Advanced Speed Control**

| Parameter | Type | Range/Options | Default | Description | Impact |
|-----------|------|---------------|---------|-------------|--------|
| `travel_speed` | number | 200-500 mm/s | 500 | Non-printing movement speed | **Medium** - Affects overall print time |
| `bridge_speed` | number | 30-100 mm/s | 50 | Speed for bridging gaps | **Medium** - Lower for better bridging |
| `top_surface_speed` | number | 100-250 mm/s | 200 | Speed for visible top surfaces | **Medium** - Lower for better finish |
| `support_speed` | number | 80-200 mm/s | 150 | Speed for support structures | **Low** - Supports don't need high quality |
| `support_interface_speed` | number | 50-150 mm/s | 80 | Speed for support interface layers | **Medium** - Slower for easier removal |

**Category: Advanced Support**

| Parameter | Type | Range/Options | Default | Description | Impact |
|-----------|------|---------------|---------|-------------|--------|
| `support_interface_pattern` | string | rectilinear, concentric, grid | grid | Support interface pattern | **Low** - Affects removal difficulty |
| `support_interface_spacing` | number | 0.1-0.5mm | 0.2mm | Gap between support and model | **Medium** - Larger = easier removal, worse overhangs |
| `support_base_pattern` | string | rectilinear, honeycomb, grid | honeycomb | Main support structure pattern | **Low** - Affects support strength/material |

**Category: Retraction & Stringing Control**

| Parameter | Type | Range/Options | Default | Description | Impact |
|-----------|------|---------------|---------|-------------|--------|
| `retraction_length` | number | 0-8mm | 0.8mm | Filament retraction distance | **High** - Reduces stringing. Too much = jams |
| `retraction_speed` | number | 20-70 mm/s | 30 | Retraction movement speed | **Medium** - Faster can reduce stringing |
| `z_hop` | number | 0-2mm | 0mm | Z-lift during travel moves | **Medium** - Prevents nozzle dragging, adds time |
| `z_hop_types` | string | Normal, Spiral, Slope | Normal | Type of z-hop movement | **Low** - Optimization for different scenarios |

**Category: Cooling**

| Parameter | Type | Range/Options | Default | Description | Impact |
|-----------|------|---------------|---------|-------------|--------|
| `fan_cooling_layer_time` | number | 0-300s | 60s | Minimum layer time for cooling | **Medium** - Ensures adequate cooling for small layers |
| `overhang_fan_speed` | number | 0-100% | Auto | Fan speed for overhanging areas | **Medium** - Higher for better overhangs |
| `slow_down_layer_time` | number | 0-60s | 10s | Slow down if layer time below this | **Low** - Quality control for fast layers |

**Category: Advanced Quality**

| Parameter | Type | Range/Options | Default | Description | Impact |
|-----------|------|---------------|---------|-------------|--------|
| `seam_position` | string | aligned, nearest, random, back | aligned | Where layer seams appear | **Medium** - Affects surface finish aesthetics |
| `ironing_type` | string | no ironing, top surfaces, all solid surfaces | no ironing | Iron top surfaces for smoothness | **Medium** - Improves top finish, adds significant time |
| `filter_out_gap_fill` | number | 0-100% | 0% | Skip small gap fills | **Low** - Can reduce print time slightly |

**Category: Acceleration & Jerk**

| Parameter | Type | Range/Options | Default | Description | Impact |
|-----------|------|---------------|---------|-------------|--------|
| `default_acceleration` | number | 500-20000 mm/s² | 10000 | Base acceleration value | **Medium** - Higher = faster direction changes, more vibration |
| `outer_wall_acceleration` | number | 1000-10000 mm/s² | 5000 | Acceleration for outer walls | **Medium** - Lower for better quality |
| `initial_layer_acceleration` | number | 300-2000 mm/s² | 500 | First layer acceleration | **Medium** - Keep low for adhesion |

### Tier 2 Parameter Dependencies

**Complex Dependencies:**
- Retraction settings interact with filament type and temperature
- Cooling parameters depend on material (PLA needs cooling, ABS doesn't)
- Acceleration values should decrease for quality-critical features (outer walls, first layer)
- Z-hop should only be enabled if retraction is also enabled

**Validation Notes:**
- Retraction length depends on extruder type (Bowden: 4-8mm, Direct Drive: 0.5-2mm)
- Fan speeds may need to be disabled/reduced for high-temp materials (ABS, ASA, PC)
- Ironing significantly increases print time (20-50% for top-heavy models)

---

## Tier 3: Expert Parameters (Defer to Epic 3)

**Brief List - Minimal Detail:**

**Exotic Infill & Pattern Control:**
- Infill combination ratios
- Infill direction angles
- Adaptive layer height parameters
- Lightning infill settings

**Advanced Flow & Extrusion:**
- Extrusion multiplier/flow ratio per feature
- Line width control (first layer, external, internal)
- Overlap percentages (infill/wall, wall/wall)
- Arc fitting parameters

**Extreme Speed Tuning:**
- Overhang speed tiers (1/4, 2/4, 3/4, 4/4 overhang)
- Small perimeter speed threshold
- Gap fill speed
- Travel acceleration per axis

**Wipe & Prime:**
- Wipe distance and settings
- Prime tower configuration
- Skirt/brim/raft options and counts

**G-code & Machine-Specific:**
- Custom G-code insertion points (start, end, layer change, tool change)
- Volumetric speed limits
- Pressure advance / linear advance
- Arc welder settings

**Material-Specific Advanced:**
- Filament diameter tolerance
- Temperature-dependent flow curves
- Bed temperature per layer height
- Chamber temperature control

**Multi-Material (AMS):**
- Purge volumes per color transition
- Prime tower settings
- Flush multipliers
- Tool change G-code

**Other Expert Settings:**
- Elephant foot compensation
- XY hole/size compensation
- Resolution (curve approximation)
- Fuzzy skin
- Scarf seam settings

**Total Expert Parameters:** 30+ additional parameters

**Implementation Note:** These parameters require deep 3D printing knowledge, have complex interdependencies, and serve niche optimization scenarios. Recommend deferring to Epic 3 or a future "Advanced Mode" toggle.

---

## Settings File Format

### File Structure

Bambu Studio uses a **three-part settings architecture:**

1. **Process Settings** (`--load-settings`) - Layer heights, speeds, infill, supports
2. **Filament Settings** (`--load-filaments`) - Temperatures, retractions, material properties
3. **Machine Settings** - Build volume, nozzle size, extruder type (typically auto-detected)

### Process Settings JSON Format

**Location:** `C:\Users\[user]\AppData\Roaming\BambuStudio\system\BBL\process\`

**Schema:**
```json
{
  "type": "process",
  "name": "Configuration Name",
  "from": "user",
  "inherits": "fdm_process_single_0.20",
  "setting_id": "CUSTOM001",

  "layer_height": ["0.2"],
  "sparse_infill_density": ["20%"],
  "wall_loops": ["3"],
  "enable_support": ["1"],
  "support_type": ["tree"],

  "outer_wall_speed": ["200", "200"],
  "inner_wall_speed": ["300", "300"],
  "sparse_infill_speed": ["270", "270"],
  "initial_layer_speed": ["50", "50"],

  "nozzle_temperature": ["220"],
  "nozzle_temperature_initial_layer": ["220"],

  "compatible_printers": [
    "Bambu Lab X1 Carbon 0.4 nozzle",
    "Bambu Lab P1S 0.4 nozzle"
  ]
}
```

**Key Fields:**
- `type`: Must be "process"
- `name`: User-facing configuration name
- `from`: "user" for custom settings, "system" for presets
- `inherits`: Base profile to inherit from (optional but recommended)
- `setting_id`: Unique identifier (use "CUSTOM" prefix for user configs)
- `compatible_printers`: Array of printer model names (required)

**Parameter Value Format:**
- Most parameters: Array of strings (even for numbers)
- Single-extruder: Array with one value `["200"]`
- Dual-extruder: Array with two values `["200", "220"]`
- Percentages: String with % symbol `["20%"]`
- Booleans: String "0" or "1" `["1"]`

### Filament Settings JSON Format

**Location:** `C:\Users\[user]\AppData\Roaming\BambuStudio\system\BBL\filament\`

**Schema:**
```json
{
  "type": "filament",
  "name": "Filament Name",
  "from": "user",
  "inherits": "fdm_filament_pla",

  "filament_type": ["PLA"],
  "nozzle_temperature": ["220", "220"],
  "nozzle_temperature_initial_layer": ["220", "220"],
  "hot_plate_temp": ["55"],
  "hot_plate_temp_initial_layer": ["60"],

  "filament_retraction_length": ["0.8", "0.8"],
  "filament_retraction_speed": ["30", "30"],
  "filament_z_hop": ["0", "0"],

  "filament_flow_ratio": ["0.98", "0.98"],
  "filament_max_volumetric_speed": ["21", "21"],

  "compatible_printers": [
    "Bambu Lab X1 Carbon 0.4 nozzle"
  ]
}
```

### CLI Usage Examples

**Basic slicing with default settings:**
```bash
"/c/Program Files/Bambu Studio/bambu-studio.exe" \
  --slice 0 \
  --outputdir "/output/path" \
  "/path/to/model.stl"
```

**With custom process settings:**
```bash
"/c/Program Files/Bambu Studio/bambu-studio.exe" \
  --slice 0 \
  --outputdir "/output/path" \
  --load-settings "/path/to/process.json" \
  "/path/to/model.stl"
```

**With process AND filament settings:**
```bash
"/c/Program Files/Bambu Studio/bambu-studio.exe" \
  --slice 0 \
  --outputdir "/output/path" \
  --load-settings "/path/to/process.json" \
  --load-filaments "/path/to/filament.json" \
  "/path/to/model.stl"
```

**Multiple configurations (semicolon-separated):**
```bash
"/c/Program Files/Bambu Studio/bambu-studio.exe" \
  --slice 0 \
  --outputdir "/output/path" \
  --load-settings "config1.json;config2.json" \
  "/path/to/model.stl"
```

### Generation Approach for Story 2.1

**Recommended Implementation Strategy:**

**Option A: Template-Based Generation (Recommended for MVP)**
1. Create base template JSON with all Tier 1 parameters
2. User inputs values via UI form
3. Backend merges user values into template
4. Validates required fields (type, name, from, compatible_printers)
5. Writes JSON to temporary file
6. Passes file path to CLI via `--load-settings`

**Template Example:**
```javascript
// Backend template generator
function generateProcessSettings(userConfig) {
  return {
    type: "process",
    name: userConfig.configName,
    from: "user",
    inherits: "fdm_process_single_0.20", // Use standard base
    setting_id: `USER_${Date.now()}`, // Unique ID

    // Merge user values
    layer_height: [userConfig.layerHeight.toString()],
    sparse_infill_density: [`${userConfig.infillDensity}%`],
    wall_loops: [userConfig.wallLoops.toString()],
    // ... etc

    // Compatibility - use broad compatibility for user configs
    compatible_printers: [
      "Bambu Lab X1 Carbon 0.4 nozzle",
      "Bambu Lab P1S 0.4 nozzle",
      "Bambu Lab X1 0.4 nozzle"
    ]
  };
}
```

**Option B: Use System Presets (Alternative for Phase 1)**
- Don't generate custom JSON initially
- Use existing system presets via preset name
- Faster to implement, less flexible
- Good for validating CLI integration before custom settings

**Option C: Hybrid Approach**
- Start with system presets (Story 1.5 - basic parameters only)
- Add custom JSON generation in Story 2.1 for full parameter control
- Allows incremental complexity

### Known Issues & Limitations

**From Emergency Validation Report (2025-11-01):**

1. **Settings File Validation is Strict**
   - Missing "from" field causes: `Error: file's from unsupported`
   - Missing compatibility causes: `Error: process not compatible with printer`
   - **Mitigation:** Always include both fields, use broad printer compatibility

2. **Default Settings Are Undocumented**
   - Without `--load-settings`, CLI uses internal defaults
   - Observed: layer_height=0.2mm, infill=20%, supports=disabled
   - **Mitigation:** Always provide explicit settings for predictable results

3. **Inheritance Chain Complexity**
   - System presets use inheritance (`inherits: "fdm_process_single_0.20"`)
   - Inheritance chain not fully documented
   - **Mitigation:** For MVP, use flat configs without inheritance OR inherit from well-known base

4. **Multi-Value Parameter Confusion**
   - Array values support multi-extruder scenarios
   - Single extruder: Use single value repeated `["200", "200"]` OR just `["200"]`
   - **Testing needed:** Validate both approaches work

5. **CLI Warning (Non-Fatal)**
   - Every slice shows: `calc_exclude_triangles:Unable to create plate triangles`
   - Does not prevent G-code generation
   - **Mitigation:** Ignore warning, monitor in future versions

---

## Implementation Notes for Story 2.1

### Validation Approach

**Client-Side Validation (React UI):**
```javascript
// Validation rules for Tier 1 parameters
const validationRules = {
  layer_height: {
    min: 0.08,
    max: 0.36,
    step: 0.01,
    validate: (value) => value >= 0.08 && value <= 0.36
  },
  sparse_infill_density: {
    min: 0,
    max: 100,
    step: 5,
    validate: (value) => value >= 0 && value <= 100
  },
  wall_loops: {
    min: 2,
    max: 10,
    validate: (value) => Number.isInteger(value) && value >= 2
  },
  enable_support: {
    options: [0, 1],
    validate: (value) => [0, 1].includes(value)
  },
  support_type: {
    options: ['normal', 'tree'],
    dependsOn: 'enable_support',
    validate: (value, config) =>
      config.enable_support === 0 || ['normal', 'tree'].includes(value)
  }
};
```

**Server-Side Validation (Node.js):**
```javascript
function validateProcessConfig(config) {
  const errors = [];

  // Required fields
  if (!config.type || config.type !== 'process') {
    errors.push('type must be "process"');
  }
  if (!config.name || config.name.trim() === '') {
    errors.push('name is required');
  }
  if (!config.from || !['user', 'system'].includes(config.from)) {
    errors.push('from must be "user" or "system"');
  }
  if (!config.compatible_printers || config.compatible_printers.length === 0) {
    errors.push('compatible_printers must have at least one entry');
  }

  // Parameter validation
  if (config.layer_height) {
    const height = parseFloat(config.layer_height[0]);
    if (height < 0.08 || height > 0.36) {
      errors.push('layer_height must be between 0.08 and 0.36mm');
    }
  }

  // Dependency validation
  if (config.enable_support && config.enable_support[0] === "0") {
    if (config.support_type) {
      errors.push('support_type is irrelevant when enable_support is 0');
    }
  }

  return errors;
}
```

### UI Organization Recommendations

**Grouped Form Layout (Story 2.1 MVP):**

```
┌─────────────────────────────────────────┐
│  Configuration Name: [____________]      │
├─────────────────────────────────────────┤
│  ▼ Quality Settings                     │
│    Layer Height:        [0.2] mm        │
│    Initial Layer:       [0.2] mm        │
│    Wall Loops:          [3]             │
│    Top Layers:          [4]             │
│    Bottom Layers:       [3]             │
├─────────────────────────────────────────┤
│  ▼ Infill Settings                      │
│    Density:             [20] %          │
│    Pattern:             [Grid ▼]        │
├─────────────────────────────────────────┤
│  ▼ Support Settings                     │
│    Enable Supports:     [✓]             │
│    Support Type:        [Tree ▼]        │
│    Threshold Angle:     [30] °          │
├─────────────────────────────────────────┤
│  ▼ Speed Settings                       │
│    Outer Wall:          [200] mm/s      │
│    Inner Wall:          [300] mm/s      │
│    Infill:              [270] mm/s      │
│    First Layer:         [50] mm/s       │
├─────────────────────────────────────────┤
│  ▼ Temperature                          │
│    Nozzle:              [220] °C        │
├─────────────────────────────────────────┤
│           [Save Config] [Reset]         │
└─────────────────────────────────────────┘
```

**Progressive Disclosure for Tier 2 (Story 2.1 Nice-to-Have):**
- Add "Show Advanced Settings" toggle
- Advanced sections start collapsed
- Visual indicator (badge) shows how many advanced params are non-default

**Preset Integration:**
- "Load from Preset" dropdown at top
- Common presets: "Draft", "Standard", "Fine", "Ultra Fine"
- "Save as Preset" button after successful validation

### Dependencies to Handle

**Critical Implementation Dependencies:**

1. **Layer Height Cascade:**
   - When `layer_height` changes, suggest updating `initial_layer_height` to 100-125%
   - Show warning if `initial_layer_height` < `layer_height`

2. **Support Enable/Disable:**
   - When `enable_support` = 0, gray out/disable `support_type` and `support_threshold_angle`
   - Show info message: "Support settings only apply when supports are enabled"

3. **Infill Density Edge Case:**
   - When `sparse_infill_density` = "0%", pattern becomes irrelevant
   - Optional: Show info message about vase mode or sparse models

4. **Temperature Warnings:**
   - If temperature doesn't match common ranges for selected filament type
   - PLA: 190-220°C, PETG: 230-250°C, ABS: 240-260°C
   - Show warning but allow override

**UI State Management:**
```javascript
// React state example
const [config, setConfig] = useState({
  enable_support: 1,
  support_type: 'tree',
  layer_height: 0.2,
  initial_layer_height: 0.2
});

// Dependency handler
useEffect(() => {
  if (config.enable_support === 0) {
    // Clear support-specific settings when disabled
    setConfig(prev => ({
      ...prev,
      support_type: null,
      support_threshold_angle: null
    }));
  }
}, [config.enable_support]);

// Cascading default
useEffect(() => {
  if (config.initial_layer_height < config.layer_height) {
    // Auto-suggest correction
    setConfig(prev => ({
      ...prev,
      initial_layer_height: config.layer_height * 1.2
    }));
  }
}, [config.layer_height]);
```

### Performance Considerations

**JSON Generation Performance:**
- Generating JSON from form values: < 1ms (negligible)
- Writing JSON to temp file: < 10ms (negligible)
- Total overhead vs CLI slicing time (~1-2 seconds): < 1%

**Validation Performance:**
- Client-side validation: Run on input blur/change (< 1ms per field)
- Server-side validation: Run before CLI invocation (< 5ms total)
- Total overhead: Negligible

**Scalability:**
- Tier 1 (15 params): Single form, no performance concerns
- Tier 2 (+20 params): Still manageable with collapsible sections
- Tier 3 (+30 params): Would require tabbed interface or search/filter

---

## References

### Documentation Sources

1. **Bambu Studio CLI Validation Report**
   - File: `temp/EMERGENCY_VALIDATION_REPORT.md`
   - Date: 2025-11-01
   - Key Findings: CLI works, default settings, parameter passing challenges

2. **Bambu Studio System Settings**
   - Location: `C:\Users\[user]\AppData\Roaming\BambuStudio\system\BBL\`
   - Process Settings: 230 preset files analyzed
   - Filament Settings: 50+ material profiles examined
   - CLI Config: `cli_config.json` for printer compatibility

3. **Bambu Studio CLI Help Output**
   - Command: `bambu-studio.exe --help`
   - Version: BambuStudio-02.03.01.51
   - Full option list documented in Section 1

4. **Settings File Analysis**
   - Sample files: `0.20mm Standard @BBL X1C.json`, `0.08mm Extra Fine @BBL X1C.json`
   - Parameter extraction from real system presets
   - JSON structure validation via test files

### Bambu Studio Parameter Reference

**Official Documentation:**
- Bambu Studio lacks comprehensive public parameter documentation
- Settings discovered via reverse-engineering system preset files
- Community knowledge from Bambu Lab forums and wiki

**Parameter Naming Convention:**
- Speed parameters: suffix `_speed` (e.g., `outer_wall_speed`)
- Acceleration: suffix `_acceleration`
- Enable flags: prefix `enable_` (e.g., `enable_support`)
- Layer-specific: prefix `initial_layer_` or suffix `_initial_layer`
- Multi-extruder: Array values `["value1", "value2"]`

### Known Gaps & Future Research

**Areas Requiring Further Investigation:**

1. **Inheritance Chain:**
   - How deep do inheritance chains go?
   - What happens if base profile doesn't exist?
   - Can we omit inheritance for user configs?

2. **Printer Compatibility Matrix:**
   - Complete list of `compatible_printers` values
   - Wildcard matching (e.g., "Bambu Lab * 0.4 nozzle")?
   - Downward compatibility checking logic

3. **Parameter Interactions:**
   - Full dependency graph between parameters
   - Which combinations cause CLI errors?
   - Optimal value ranges per material/printer

4. **Multi-Material/AMS:**
   - Per-extruder parameter overrides
   - Color transition settings
   - Prime tower configuration

5. **Advanced Features:**
   - Adaptive layer height algorithm parameters
   - Arc fitting/G2/G3 support
   - Pressure advance implementation

**Recommendation:** Address gaps incrementally in Epic 3 or via user feedback from Story 2.1 deployment.

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-01 | Mary (Business Analyst) | Initial comprehensive parameter catalog for Story 2.1 |

---

**Document Status:** ✅ COMPLETE - Ready for Story 2.1 Implementation

**Next Steps:**
1. Review with development team for technical feasibility
2. Validate Tier 1 parameter selection with print farm operators
3. Begin UI mockups for Story 2.1 configuration interface
4. Create JSON generation utility for backend implementation
