const fs = require('fs');
const path = require('path');

// Directories
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Function to update content
function removeReferences(content) {
    // Don't replace in meta tags, titles, or links
    const htmlParts = content.split(/<(meta|title|link)[^>]*>/i);
    let result = '';
    
    for (let i = 0; i < htmlParts.length; i++) {
        if (i % 2 === 0) {
            // Part outside of meta, title, or link tags
            let part = htmlParts[i];
            
            // 1. Remove "hair tattoo treatment" from headings and text
            part = part.replace(/(\d+) hair tattoo treatment (clinic|clinics)/gi, '$1 $2');
            
            // 2. Remove "SMP Clinics in" headings to just "Clinics in"
            part = part.replace(/<h2[^>]*>SMP Clinics in ([^<]+)<\/h2>/gi, '<h2 class="text-3xl font-bold mb-12 text-center">Clinics in $1</h2>');
            
            // 3. Remove "SMP" from "Other Areas with SMP Clinics"
            part = part.replace(/>Other Areas with SMP Clinics</gi, '>Other Areas with Clinics<');
            
            // 4. Remove "SMP" from page descriptions
            part = part.replace(/Find top-rated SMP providers/gi, 'Find top-rated providers');
            
            // 5. Remove references in scripts while preserving functionality
            part = part.replace(/countElement\.textContent = `\${filteredData\.length} hair tattoo treatment \${clinicText} found in \${areaName}`/g, 
                        'countElement.textContent = `${filteredData.length} ${clinicText} found in ${areaName}`');
            
            result += part;
        } else {
            // Meta, title, or link tag - preserve it
            result += '<' + htmlParts[i] + '>';
        }
    }
    
    return result;
}

// Function to update an HTML file
function updateHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Process content
        const updatedContent = removeReferences(content);
        
        // Write back the updated content
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated file: ${filePath}`);
        return true;
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
        return false;
    }
}

// Process all HTML files in the root directory
let updatedCount = 0;
let errorCount = 0;

const rootHtmlFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(rootDir, file));

console.log(`Processing ${rootHtmlFiles.length} HTML files in root directory...`);

rootHtmlFiles.forEach(filePath => {
    const success = updateHtmlFile(filePath);
    if (success) {
        updatedCount++;
    } else {
        errorCount++;
    }
});

// Process all areas
if (fs.existsSync(areasDir)) {
    const areas = fs.readdirSync(areasDir);
    
    console.log(`Processing ${areas.length} area directories...`);
    
    areas.forEach(area => {
        const areaDir = path.join(areasDir, area);
        
        // Check if this is a directory
        if (fs.statSync(areaDir).isDirectory()) {
            const indexFile = path.join(areaDir, 'index.html');
            
            // Check if index.html exists
            if (fs.existsSync(indexFile)) {
                try {
                    const success = updateHtmlFile(indexFile);
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
console.log(`Files updated: ${updatedCount}`);
console.log(`Errors encountered: ${errorCount}`); 