const fs = require('fs');
const path = require('path');

// Add the SMP removal script to all HTML files
function addSmpRemovalScript() {
  console.log('Adding SMP removal script to HTML files...');
  
  // Add to root HTML files
  addScriptToHtmlFiles(__dirname);
  
  // Add to area HTML files
  const areasDir = path.join(__dirname, 'areas');
  if (fs.existsSync(areasDir)) {
    const areaDirs = fs.readdirSync(areasDir);
    for (const areaDir of areaDirs) {
      const areaDirPath = path.join(areasDir, areaDir);
      // Check if it's a directory
      if (fs.statSync(areaDirPath).isDirectory()) {
        addScriptToHtmlFiles(areaDirPath);
      }
    }
  }
  
  console.log('Completed adding SMP removal script to HTML files.');
}

function addScriptToHtmlFiles(directory) {
  try {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
      if (file.endsWith('.html')) {
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the script is already included
        if (!content.includes('remove-smp-dom.js')) {
          // Add the script before the closing body tag
          content = content.replace(
            '</body>',
            '    <!-- Script to remove Hair Tattoo Treatment from clinic cards -->\n    <script src="/remove-smp-dom.js"></script>\n</body>'
          );
          
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Added SMP removal script to ${filePath}`);
        } else {
          console.log(`SMP removal script already present in ${filePath}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
}

// Run the function
addSmpRemovalScript(); 