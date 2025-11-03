const fs = require('fs');

// Read actual G-code
const gcodeContent = fs.readFileSync('/c/Users/dpmal/projects/slicercompare/temp/cli-test/plate_1.gcode', 'utf-8');
const lines = gcodeContent.split('\n');

console.log('=== G-CODE PARSING TEST ===\n');
console.log(`Total lines: ${lines.length}\n`);

// Extract metadata using patterns from POC
const metadata = {};
const metadataLines = lines.filter(l => l.trim().startsWith(';')).slice(0, 200);

metadataLines.forEach(line => {
  // Print time
  if (/estimated printing time/i.test(line)) {
    const match = line.match(/=\s*(.+)/);
    if (match) metadata.printTime = match[1].trim();
  }
  
  // Filament length
  if (/total filament length/i.test(line)) {
    const match = line.match(/:\s*([\d.]+)/);
    if (match) metadata.filamentLength = match[1] + ' mm';
  }
  
  // Layer count
  if (/total layer number/i.test(line)) {
    const match = line.match(/:\s*(\d+)/);
    if (match) metadata.totalLayers = match[1];
  }
  
  // Layer height
  if (/layer_height\s*=/i.test(line)) {
    const match = line.match(/=\s*([\d.]+)/);
    if (match) metadata.layerHeight = match[1] + ' mm';
  }
  
  // Infill
  if (/sparse_infill_density\s*=/i.test(line)) {
    const match = line.match(/=\s*([\d.]+)/);
    if (match) metadata.infillDensity = match[1] + '%';
  }
  
  // Support
  if (/enable_support\s*=/i.test(line)) {
    const match = line.match(/=\s*(\d+)/);
    if (match) metadata.supportEnabled = match[1] === '1' ? 'Yes' : 'No';
  }
});

console.log('EXTRACTED METADATA:');
console.log(JSON.stringify(metadata, null, 2));
console.log('\n');

// Count actual G-code commands
const gcodeCommands = lines.filter(l => {
  const t = l.trim();
  return t.length > 0 && !t.startsWith(';');
});

console.log(`G-code command lines: ${gcodeCommands.length}`);
console.log('\nFirst 10 G-code commands:');
gcodeCommands.slice(0, 10).forEach(cmd => console.log(`  ${cmd}`));
