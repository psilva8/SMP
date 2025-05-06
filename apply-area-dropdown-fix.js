const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Get the fix script content
let fixScriptContent;
try {
    fixScriptContent = fs.readFileSync(path.join(rootDir, 'fix-area-dropdown.js'), 'utf8');
    console.log('Loaded fix-area-dropdown.js script content');
} catch (err) {
    console.error('Error reading fix script:', err);
    process.exit(1);
}

// Function to add the fix script to an HTML file
function addScriptToFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file already has the fix script
        if (content.includes('Fix area dropdown script loaded')) {
            console.log(`Script already exists in: ${filePath}`);
            return false;
        }
        
        // Add the script content before the closing body tag
        const updatedContent = content.replace('</body>', `<script>${fixScriptContent}</script>\n</body>`);
        
        // Save the changes
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Added dropdown fix script to: ${filePath}`);
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

console.log("Starting area dropdown fix application to area pages...");
const totalUpdated = processAreaFiles(areasDir);
console.log(`\nTotal files updated: ${totalUpdated}`);
console.log("Area dropdown fix complete."); 