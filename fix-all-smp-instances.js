const fs = require('fs');
const path = require('path');

// Root directory and areas directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Function to replace all occurrences of "SMP" with "Hair Tattoo"
function updateSMPReferences(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let changed = false;
        
        // First, handle exact phrases with proper casing
        const exactPhraseReplacements = [
            { from: 'SMP Clinics', to: 'Hair Tattoo Clinics' },
            { from: 'SMP Hair Tattoo', to: 'Hair Tattoo' },
            { from: 'About SMP', to: 'About Hair Tattoo' },
            { from: 'SMP Directory', to: 'Hair Tattoo Directory' },
            { from: 'SMP clinic', to: 'Hair Tattoo clinic' },
            { from: 'SMP Clinic', to: 'Hair Tattoo Clinic' },
            { from: 'SMP treatment', to: 'Hair Tattoo treatment' },
            { from: 'SMP Treatment', to: 'Hair Tattoo Treatment' },
            { from: 'Key Benefits of SMP', to: 'Key Benefits of Hair Tattoo' },
            { from: 'Hair Tattoo Treatment', to: 'Hair Tattoo Treatment' },
            { from: 'hair tattoo treatment', to: 'hair tattoo treatment' },
            { from: '"SMP', to: '"Hair Tattoo' },
            { from: 'SMP"', to: 'Hair Tattoo"' },
        ];
        
        // Apply exact phrase replacements
        for (const replacement of exactPhraseReplacements) {
            if (content.includes(replacement.from)) {
                content = content.replaceAll(replacement.from, replacement.to);
                changed = true;
            }
        }
        
        // Second, use regex to match remaining standalone "SMP" instances
        // This will match "SMP" when it's a whole word, with word boundaries
        const smpRegex = /\bSMP\b/g;
        if (smpRegex.test(content)) {
            content = content.replace(/\bSMP\b/g, 'Hair Tattoo');
            changed = true;
        }
        
        // Third, handle common HTML patterns with regex
        const htmlPatterns = [
            // Titles and headers with SMP
            { regex: /<title>([^<]*?)SMP([^<]*?)<\/title>/g, replacement: '<title>$1Hair Tattoo$2</title>' },
            { regex: /<h1[^>]*>([^<]*?)SMP([^<]*?)<\/h1>/g, replacement: '<h1>$1Hair Tattoo$2</h1>' },
            { regex: /<h2[^>]*>([^<]*?)SMP([^<]*?)<\/h2>/g, replacement: '<h2>$1Hair Tattoo$2</h2>' },
            { regex: /<h3[^>]*>([^<]*?)SMP([^<]*?)<\/h3>/g, replacement: '<h3>$1Hair Tattoo$2</h3>' },
            
            // Links and navigation items containing SMP
            { regex: /<a([^>]*)>([^<]*?)SMP([^<]*?)<\/a>/g, replacement: '<a$1>$2Hair Tattoo$3</a>' },
            
            // Paragraphs containing SMP
            { regex: /<p[^>]*>([^<]*?)SMP([^<]*?)<\/p>/g, replacement: '<p>$1Hair Tattoo$2</p>' }
        ];
        
        // Apply HTML pattern replacements
        for (const pattern of htmlPatterns) {
            if (pattern.regex.test(content)) {
                content = content.replace(pattern.regex, pattern.replacement);
                changed = true;
            }
        }
        
        // Finally, ensure remaining edge cases are addressed with a more aggressive approach
        if (content.includes('SMP')) {
            content = content.replaceAll('SMP', 'Hair Tattoo');
            changed = true;
        }
        
        if (changed) {
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

// Function to process an entire directory
function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    let count = 0;
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile() && path.extname(filePath).toLowerCase() === '.html') {
            // Process HTML file
            const updated = updateSMPReferences(filePath);
            if (updated) count++;
        } else if (stat.isDirectory()) {
            // Process subdirectory
            count += processDirectory(filePath);
        }
    }
    
    return count;
}

// Process all HTML files in root directory
console.log("Looking for HTML files in root directory...");
const rootFiles = fs.readdirSync(rootDir);
let totalUpdated = 0;

for (const file of rootFiles) {
    const filePath = path.join(rootDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile() && path.extname(filePath).toLowerCase() === '.html') {
        // Process HTML file
        const updated = updateSMPReferences(filePath);
        if (updated) totalUpdated++;
    }
}

// Process all area directories
console.log("\nProcessing area directories...");
if (fs.existsSync(areasDir)) {
    const areaCount = processDirectory(areasDir);
    totalUpdated += areaCount;
    console.log(`Updated ${areaCount} files in area directories.`);
}

console.log(`\nTotal files updated: ${totalUpdated}`);
console.log("SMP reference replacement complete."); 