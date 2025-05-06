/**
 * apply-final-dropdown-fix.js
 * Applies the final dropdown fix to all HTML files in the website
 */

const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;

// Get the final fix script content
let fixScriptContent;
try {
    fixScriptContent = fs.readFileSync(path.join(rootDir, 'final-dropdown-fix.js'), 'utf8');
    console.log('Loaded final-dropdown-fix.js script content');
} catch (err) {
    console.error('Error reading final fix script:', err);
    process.exit(1);
}

// Function to add the fix script to an HTML file
function addScriptToFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file already has the final fix script
        if (content.includes('Final comprehensive dropdown fix running')) {
            console.log(`Final script already exists in: ${filePath}`);
            return false;
        }
        
        // Remove any existing dropdown scripts to avoid conflicts
        const scriptsToRemove = [
            'Fix dropdown menus',
            'Dropdown handling',
            'fix-area-dropdown.js',
            'Improved area dropdown fix running',
            'Fix area dropdown script loaded'
        ];
        
        let modified = false;
        
        for (const scriptMarker of scriptsToRemove) {
            if (content.includes(scriptMarker)) {
                console.log(`Removing existing dropdown script (${scriptMarker}) from: ${filePath}`);
                
                // Find the script tag containing the marker
                const scriptStartIdx = content.indexOf(scriptMarker);
                if (scriptStartIdx !== -1) {
                    // Look backwards to find the opening script tag
                    const openTagIdx = content.lastIndexOf('<script', scriptStartIdx);
                    if (openTagIdx !== -1) {
                        // Find the closing script tag
                        const closeTagIdx = content.indexOf('</script>', scriptStartIdx);
                        if (closeTagIdx !== -1) {
                            // Remove the entire script block
                            content = content.substring(0, openTagIdx) + 
                                     content.substring(closeTagIdx + 9); // +9 for "</script>"
                            modified = true;
                        }
                    }
                }
            }
        }
        
        // Add the final script content before the closing body tag
        if (!content.includes('final-dropdown-fix.js')) {
            content = content.replace('</body>', `<script src="final-dropdown-fix.js"></script>\n</body>`);
            modified = true;
        }
        
        // Save the changes if modifications were made
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Added final dropdown fix reference to: ${filePath}`);
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

// Process all HTML files in a directory and its subdirectories
function processHtmlFiles(directory) {
    const files = fs.readdirSync(directory);
    let count = 0;
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile() && path.extname(filePath) === '.html') {
            const updated = addScriptToFile(filePath);
            if (updated) count++;
        } else if (stat.isDirectory() && !file.startsWith('.')) {
            // Recursively process subdirectories, skip hidden directories
            count += processHtmlFiles(filePath);
        }
    }
    
    return count;
}

// Fix paths in area pages
function fixAreaPagePaths() {
    const areasDir = path.join(rootDir, 'areas');
    if (!fs.existsSync(areasDir)) {
        console.log("Areas directory not found, skipping area path fixes");
        return 0;
    }
    
    // Copy the fix script to areas directory for easier referencing
    fs.copyFileSync(
        path.join(rootDir, 'final-dropdown-fix.js'), 
        path.join(areasDir, 'final-dropdown-fix.js')
    );
    console.log("Copied final-dropdown-fix.js to areas directory");
    
    // Now modify all area HTML files to reference the script correctly
    const areaFiles = processHtmlFiles(areasDir);
    console.log(`Updated ${areaFiles} area HTML files with correct script paths`);
    return areaFiles;
}

console.log("Starting final dropdown fix application...");

// First, process main HTML files
const totalMainUpdated = processHtmlFiles(rootDir);
console.log(`\nTotal main files updated: ${totalMainUpdated}`);

// Then, fix paths in area pages
const totalAreaUpdated = fixAreaPagePaths();

console.log(`\nGrand total files updated: ${totalMainUpdated + totalAreaUpdated}`);
console.log("Final dropdown fix application complete."); 