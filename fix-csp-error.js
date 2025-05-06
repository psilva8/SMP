const fs = require('fs');
const path = require('path');

// Root directory and area directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Fixed CSP value that follows correct syntax
const fixedCSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https://via.placeholder.com https://*.googleusercontent.com https://*.googleapis.com; font-src 'self'";

// Function to update an HTML file's CSP
function fixCSP(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file has a CSP meta tag
        if (content.includes('http-equiv="Content-Security-Policy"')) {
            // Replace existing CSP meta tag with properly formatted one
            const updatedContent = content.replace(
                /<meta\s+http-equiv="Content-Security-Policy"[^>]+>/g, 
                `<meta http-equiv="Content-Security-Policy" content="${fixedCSP}">`
            );
            
            // Write back the updated content if changes were made
            if (content !== updatedContent) {
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`Fixed CSP in: ${filePath}`);
                return true;
            } else {
                console.log(`No CSP changes needed in: ${filePath}`);
                return false;
            }
        } else {
            console.log(`No CSP meta tag found in: ${filePath}`);
            return false;
        }
    } catch (err) {
        console.error(`Error fixing CSP in ${filePath}:`, err);
        return false;
    }
}

// Process all HTML files
console.log("Fixing CSP in all HTML files...");

// Process root HTML files
const rootHtmlFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.html'));

let fixedCount = 0;
let errorCount = 0;

// Update root HTML files
rootHtmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const success = fixCSP(filePath);
    if (success) {
        fixedCount++;
    }
});

// Process all areas
if (fs.existsSync(areasDir)) {
    const areas = fs.readdirSync(areasDir);
    
    areas.forEach(area => {
        const areaDir = path.join(areasDir, area);
        
        // Check if this is a directory
        if (fs.statSync(areaDir).isDirectory()) {
            const indexFile = path.join(areaDir, 'index.html');
            
            // Check if index.html exists
            if (fs.existsSync(indexFile)) {
                try {
                    const success = fixCSP(indexFile);
                    if (success) {
                        fixedCount++;
                    }
                } catch (err) {
                    console.error(`Error processing ${indexFile}:`, err);
                    errorCount++;
                }
            }
        }
    });
}

console.log(`\nSummary:`);
console.log(`Total files fixed: ${fixedCount}`);
console.log(`Errors encountered: ${errorCount}`);

console.log("\nCSP fix complete."); 