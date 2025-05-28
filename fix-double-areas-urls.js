const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Function to fix double areas URLs in HTML files
function fixDoubleAreasUrls(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Fix double areas URLs in href attributes
        content = content.replace(/href="([^"]*?)\/areas\/areas\//g, 'href="$1/areas/');
        content = content.replace(/href="\.\.\/\.\.\/areas\/areas\//g, 'href="../../areas/');
        content = content.replace(/href="\/areas\/areas\//g, 'href="/areas/');
        
        // Fix double areas URLs in src attributes
        content = content.replace(/src="([^"]*?)\/areas\/areas\//g, 'src="$1/areas/');
        content = content.replace(/src="\.\.\/\.\.\/areas\/areas\//g, 'src="../../areas/');
        content = content.replace(/src="\/areas\/areas\//g, 'src="/areas/');
        
        // Fix double areas URLs in JavaScript
        content = content.replace(/['"`]([^'"`]*?)\/areas\/areas\/([^'"`]*?)['"`]/g, '"$1/areas/$2"');
        
        // Fix any window.location or href assignments
        content = content.replace(/window\.location\.href\s*=\s*['"`]([^'"`]*?)\/areas\/areas\/([^'"`]*?)['"`]/g, 'window.location.href = "$1/areas/$2"');
        
        // Save if changes were made
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed double areas URLs in: ${filePath}`);
            return true;
        } else {
            console.log(`No double areas URLs found in: ${filePath}`);
            return false;
        }
    } catch (err) {
        console.error(`Error processing file ${filePath}:`, err);
        return false;
    }
}

// Function to fix the problematic fix-html-styling.js file
function fixHtmlStylingScript() {
    const stylingScriptPath = path.join(rootDir, 'fix-html-styling.js');
    
    if (fs.existsSync(stylingScriptPath)) {
        try {
            let content = fs.readFileSync(stylingScriptPath, 'utf8');
            let originalContent = content;
            
            // Fix the problematic line that causes double areas URLs
            content = content.replace(
                /content = content\.replace\(\/href="\\\/areas\\\//g,
                `// Fix navigation links - but avoid double areas paths
            content = content.replace(/href="\\/areas\\//g, function(match, offset, string) {
                // Check if we're already in an areas subdirectory
                const beforeMatch = string.substring(0, offset);
                if (beforeMatch.includes('../../areas/')) {
                    return match; // Don't modify if already has relative path
                }
                return 'href="../../areas/';
            });`
            );
            
            if (content !== originalContent) {
                fs.writeFileSync(stylingScriptPath, content, 'utf8');
                console.log('Fixed fix-html-styling.js to prevent double areas URLs');
                return true;
            }
        } catch (err) {
            console.error('Error fixing fix-html-styling.js:', err);
        }
    }
    return false;
}

// Process all HTML and JS files recursively
function processFiles(directory) {
    const files = fs.readdirSync(directory);
    let count = 0;
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            if (ext === '.html' || ext === '.js') {
                const updated = fixDoubleAreasUrls(filePath);
                if (updated) count++;
            }
        } else if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
            count += processFiles(filePath);
        }
    }
    
    return count;
}

// Create a robots.txt to disallow the problematic URLs
function createRobotsTxt() {
    const robotsPath = path.join(rootDir, 'robots.txt');
    const robotsContent = `User-agent: *
Allow: /

# Disallow double areas URLs that were created by mistake
Disallow: /areas/

# Sitemap
Sitemap: https://micropigmentationla.com/sitemap.xml
`;
    
    try {
        fs.writeFileSync(robotsPath, robotsContent, 'utf8');
        console.log('Created/updated robots.txt to disallow double areas URLs');
    } catch (err) {
        console.error('Error creating robots.txt:', err);
    }
}

// Main execution
console.log("Starting fix for double areas URLs...");

// Fix the problematic script first
fixHtmlStylingScript();

// Process all files to fix existing double areas URLs
const totalUpdated = processFiles(rootDir);

// Create robots.txt to prevent future crawling of these URLs
createRobotsTxt();

console.log(`\nTotal files updated: ${totalUpdated}`);
console.log("Double areas URLs fix complete.");
console.log("\nNext steps:");
console.log("1. Run this script: node fix-double-areas-urls.js");
console.log("2. Commit and push the changes to your repository");
console.log("3. In Google Search Console, use the URL removal tool to remove the /areas/ URLs");
console.log("4. Submit your updated sitemap.xml"); 