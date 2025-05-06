const fs = require('fs');
const path = require('path');

// Root directory and area directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Correct CSP value that follows proper syntax
const correctCSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https://via.placeholder.com https://*.googleusercontent.com https://*.googleapis.com; font-src 'self'";

// Function to add CSP meta tag to an HTML file
function addCSP(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file already has a CSP meta tag
        if (content.includes('http-equiv="Content-Security-Policy"')) {
            // Replace existing CSP meta tag
            const updatedContent = content.replace(
                /<meta\s+http-equiv="Content-Security-Policy"[^>]+>/g, 
                `<meta http-equiv="Content-Security-Policy" content="${correctCSP}">`
            );
            
            if (content !== updatedContent) {
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`Updated existing CSP in: ${filePath}`);
                return true;
            } 
            return false;
        } else {
            // Add CSP meta tag if not exists
            const headTagMatch = content.match(/<head>[\s\S]*?<\/head>/i);
            
            if (headTagMatch) {
                // Add CSP tag after the opening head tag
                const updatedContent = content.replace(
                    /<head>/i,
                    `<head>\n    <meta http-equiv="Content-Security-Policy" content="${correctCSP}">`
                );
                
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`Added new CSP to: ${filePath}`);
                return true;
            } else {
                console.warn(`No <head> tag found in: ${filePath}`);
                return false;
            }
        }
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
        return false;
    }
}

// Process main HTML files
console.log("Adding/updating CSP in HTML files...");

// Process index.html and other important files first
const mainFiles = [
    path.join(rootDir, 'index.html'),
    path.join(rootDir, 'about.html'),
    path.join(rootDir, 'areas.html')
];

let updatedCount = 0;
let errorCount = 0;

mainFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        const success = addCSP(filePath);
        if (success) {
            updatedCount++;
        }
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
                    const success = addCSP(indexFile);
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
console.log(`Total files updated with CSP: ${updatedCount}`);
console.log(`Errors encountered: ${errorCount}`);

console.log("\nCSP addition/update complete."); 