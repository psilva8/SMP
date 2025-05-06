const fs = require('fs');
const path = require('path');

// Root directory and area directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// New CSP value that includes Google images
const newCSP = `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https://via.placeholder.com https://*.googleusercontent.com https://*.googleapis.com; font-src 'self';`;

// Function to update an HTML file's CSP
function updateCSP(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file has a CSP meta tag
        if (content.includes('http-equiv="Content-Security-Policy"')) {
            // Replace existing CSP meta tag
            const updatedContent = content.replace(
                /<meta\s+http-equiv="Content-Security-Policy"[^>]+>/g, 
                `<meta http-equiv="Content-Security-Policy" content="${newCSP}">`
            );
            
            // Write back the updated content
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Updated CSP in: ${filePath}`);
            return true;
        } else {
            // If no CSP meta tag exists, add one in the head section
            const headMatch = content.match(/<head>[\s\S]*?<\/head>/i);
            if (headMatch) {
                const headContent = headMatch[0];
                const newHeadContent = headContent.replace(
                    /<head>/i,
                    `<head>\n    <meta http-equiv="Content-Security-Policy" content="${newCSP}">`
                );
                
                const updatedContent = content.replace(headContent, newHeadContent);
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`Added CSP to: ${filePath}`);
                return true;
            } else {
                console.warn(`Could not locate <head> tag in: ${filePath}`);
                return false;
            }
        }
    } catch (err) {
        console.error(`Error updating CSP in ${filePath}:`, err);
        return false;
    }
}

// Process root HTML files
const rootHtmlFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(rootDir, file));

let updatedCount = 0;
let errorCount = 0;

// Update root HTML files
rootHtmlFiles.forEach(filePath => {
    const success = updateCSP(filePath);
    if (success) {
        updatedCount++;
    } else {
        errorCount++;
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
                    const success = updateCSP(indexFile);
                    if (success) {
                        updatedCount++;
                    } else {
                        errorCount++;
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