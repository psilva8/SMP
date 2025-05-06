const fs = require('fs');
const path = require('path');

// Areas directory
const areasDir = path.join(__dirname, 'areas');

// Function to update an HTML file
function updateHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 1. Replace in area hero section
        content = content.replace(
            /(\d+) hair tattoo treatment (clinic|clinics)/gi, 
            '$1 $2'
        );
        
        // 2. Replace in inline scripts by updating the template text
        const countElementRegex = /const countElement = document\.querySelector\('\.area-hero p'\);[\s\S]+?countElement\.textContent = `\${filteredData\.length} hair tattoo treatment \${clinicText} found in \${areaName}`/g;
        
        content = content.replace(
            countElementRegex,
            (match) => match.replace('hair tattoo treatment ', '')
        );
        
        // Write back the updated content
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated file: ${filePath}`);
        return true;
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
        return false;
    }
}

// Process all areas
if (fs.existsSync(areasDir)) {
    const areas = fs.readdirSync(areasDir);
    
    let updatedCount = 0;
    let errorCount = 0;
    
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
    
    console.log(`\nSummary:`);
    console.log(`Total areas processed: ${areas.length}`);
    console.log(`Files updated: ${updatedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
} else {
    console.error(`Areas directory not found: ${areasDir}`);
} 