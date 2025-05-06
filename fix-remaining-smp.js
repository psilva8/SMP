const fs = require('fs');
const path = require('path');

// Root directory and areas directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Direct SMP replacement with regex patterns to handle all cases
function updateAllSMPReferences(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Just directly replace all instances of SMP with Hair Tattoo
        // This is a more aggressive approach but should catch everything
        content = content.replace(/SMP/g, 'Hair Tattoo');
        
        // Fix double naming that might have occurred in previous updates
        content = content.replace(/Hair Tattoo Hair Tattoo/g, 'Hair Tattoo');
        
        // Fix meta description for SEO
        content = content.replace(/hair tattoo treatment \(Hair Tattoo\)/g, 'hair tattoo treatment');
        
        // Save if changes were made
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated SMP references in: ${filePath}`);
            return true;
        } else {
            console.log(`No SMP references found in: ${filePath}`);
            return false;
        }
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
        return false;
    }
}

// Process all HTML files recursively
function processAllHTMLFiles(directory) {
    const files = fs.readdirSync(directory);
    let count = 0;
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile() && path.extname(filePath).toLowerCase() === '.html') {
            const updated = updateAllSMPReferences(filePath);
            if (updated) count++;
        } else if (stat.isDirectory()) {
            count += processAllHTMLFiles(filePath);
        }
    }
    
    return count;
}

console.log("Starting final SMP replacement pass...");
let totalUpdated = processAllHTMLFiles(rootDir);
console.log(`\nTotal files updated: ${totalUpdated}`);
console.log("Final SMP replacement complete."); 