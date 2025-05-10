// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');


// Get custom name argument
const args = process.argv.slice(2);
const baseName = args[0];

if (!baseName) {
  console.error('❌ Please provide a migration name.');
  process.exit(1);
}

// Create timestamp
const timestamp = new Date()
  .toISOString()
  .replace(/[-:T.Z]/g, '')
  .slice(0, 14); // e.g., 20240509123000

// Final filename
const fileName = `${timestamp}-${baseName}`;
const migrationDir = path.resolve(__dirname, 'src/migrations');

// Ensure folder exists
if (!fs.existsSync(migrationDir)) {
  fs.mkdirSync(migrationDir, { recursive: true });
}

// Build command
const command = `typeorm migration:generate src/migrations/${fileName} -d dist/config/data-source.js`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (err) {
  console.error('❌ Migration generation failed.\n' + err);
  process.exit(1);
}
