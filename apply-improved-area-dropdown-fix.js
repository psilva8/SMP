const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Get the improved fix script content
let fixScriptContent;
try {
    fixScriptContent = fs.readFileSync(path.join(rootDir, 'fix-area-dropdown-improved.js'), 'utf8');
    console.log('Loaded improved fix-area-dropdown.js script content');
} catch (err) {
    console.error('Error reading improved fix script:', err);
    process.exit(1);
}

// Function to add the fix script to an HTML file
function addScriptToFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove the old fix script if present
        if (content.includes('Fix area dropdown script loaded')) {
            console.log(`Removing old fix script from: ${filePath}`);
            
            // Find where the old script starts and ends
            const oldScriptStart = content.indexOf('// fix-area-dropdown.js');
            if (oldScriptStart !== -1) {
                // Find the end of the script (closing script tag)
                const oldScriptEnd = content.indexOf('</script>', oldScriptStart);
                if (oldScriptEnd !== -1) {
                    // Remove the old script including tags
                    const beforeScript = content.substring(0, oldScriptStart - 8); // -8 for "<script>"
                    const afterScript = content.substring(oldScriptEnd + 9); // +9 for "</script>"
                    content = beforeScript + afterScript;
                }
            }
        }
        
        // Check if the file already has the improved fix script
        if (content.includes('Improved fix-area-dropdown.js')) {
            console.log(`Improved script already exists in: ${filePath}`);
            return false;
        }
        
        // Add the improved script content before the closing body tag
        const updatedContent = content.replace('</body>', `<script>${fixScriptContent}</script>\n</body>`);
        
        // Save the changes
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Added improved dropdown fix script to: ${filePath}`);
            return true;
        } else {
            console.log(`No changes needed in: ${filePath}`);
            return false;
        }
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
        return false;
    }
}

// Process area HTML files
function processAreaFiles(directory) {
    const files = fs.readdirSync(directory);
    let count = 0;
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile() && file === 'index.html') {
            const updated = addScriptToFile(filePath);
            if (updated) count++;
        } else if (stat.isDirectory()) {
            // Recursively process subdirectories
            count += processAreaFiles(filePath);
        }
    }
    
    return count;
}

console.log("Starting improved area dropdown fix application to area pages...");
const totalUpdated = processAreaFiles(areasDir);
console.log(`\nTotal files updated: ${totalUpdated}`);
console.log("Improved area dropdown fix complete."); 