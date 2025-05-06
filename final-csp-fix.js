const fs = require('fs');
const path = require('path');

// Root directory and area directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// More permissive CSP that should work with all resources
const finalCSP = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; img-src * data: blob:; connect-src *;";

// Function to update CSP in an HTML file
function updateCSP(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file already has a CSP meta tag
        if (content.includes('http-equiv="Content-Security-Policy"')) {
            // Replace existing CSP meta tag with more permissive one
            const updatedContent = content.replace(
                /<meta\s+http-equiv="Content-Security-Policy"[^>]+>/g, 
                `<meta http-equiv="Content-Security-Policy" content="${finalCSP}">`
            );
            
            if (content !== updatedContent) {
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`Updated CSP in: ${filePath}`);
                return true;
            } else {
                console.log(`No CSP changes needed in: ${filePath}`);
                return false;
            }
        } else {
            // Add new CSP meta tag
            const headMatch = content.match(/<head>/i);
            if (headMatch) {
                const updatedContent = content.replace(
                    /<head>/i,
                    `<head>\n    <meta http-equiv="Content-Security-Policy" content="${finalCSP}">`
                );
                
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`Added CSP to: ${filePath}`);
                return true;
            } else {
                console.warn(`No <head> tag found in: ${filePath}`);
                return false;
            }
        }
    } catch (err) {
        console.error(`Error updating CSP in ${filePath}:`, err);
        return false;
    }
}

// Process main HTML files first
console.log("Applying final CSP fix to HTML files...");

const mainFiles = [
    path.join(rootDir, 'index.html'),
    path.join(rootDir, 'about.html'),
    path.join(rootDir, 'areas.html')
];

let updatedCount = 0;
let errorCount = 0;

// Update main files
mainFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        const success = updateCSP(filePath);
        if (success) {
            updatedCount++;
        }
    }
});

// Process area pages
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
                    const success = updateCSP(indexFile);
                    if (success) {
                        updatedCount++;
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
console.log(`Total files updated: ${updatedCount}`);
console.log(`Errors encountered: ${errorCount}`);

console.log("\nFinal CSP fix complete."); 