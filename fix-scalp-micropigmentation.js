const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;

// File extensions to process
const extensions = ['.html', '.js', '.css'];

// Function to update all Hair Tattoo Treatment references
function updateSMPReferences(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Replace "Hair Tattoo Treatment" with "Hair Tattoo Treatment"
        content = content.replace(/Hair Tattoo Treatment/g, 'Hair Tattoo Treatment');
        content = content.replace(/hair tattoo treatment/g, 'hair tattoo treatment');
        
        // Save if changes were made
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated file: ${filePath}`);
            return true;
        } else {
            console.log(`No references found in: ${filePath}`);
            return false;
        }
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
        return false;
    }
}

// Process files recursively
function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    let count = 0;
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            if (extensions.includes(ext)) {
                const updated = updateSMPReferences(filePath);
                if (updated) count++;
            }
        } else if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
            count += processDirectory(filePath);
        }
    }
    
    return count;
}

console.log("Starting replacement of 'Hair Tattoo Treatment' in all files...");
const totalUpdated = processDirectory(rootDir);
console.log(`\nTotal files updated: ${totalUpdated}`);
console.log("Replacement complete."); 