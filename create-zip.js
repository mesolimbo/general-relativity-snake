const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const outputPath = path.join(__dirname, 'general-relativity-snake.zip');
const docsPath = path.join(__dirname, 'docs');

// Create a write stream for the zip file
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  console.log(`✓ Created general-relativity-snake.zip (${archive.pointer()} bytes)`);
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add all files from docs/ to the root of the zip (not nested in a folder)
archive.directory(docsPath, false);

// Finalize the archive
archive.finalize();
