const fs = require('fs');
const path = require('path');

// Directory containing area directories
const areasDir = path.join(__dirname, 'areas');

// Function to update an HTML file
function updateHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file already uses loadAreaClinics
        if (content.includes('loadAreaClinics()') && !content.includes('loadNeighborhoodClinics()')) {
            console.log(`File already updated: ${filePath}`);
            return;
        }
        
        // Replace loadNeighborhoodClinics with loadAreaClinics
        const updatedContent = content.replace(/loadNeighborhoodClinics\(\)/g, 'loadAreaClinics()');
        
        // Write back the updated content
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated file: ${filePath}`);
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
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
                    updateHtmlFile(indexFile);
                    updatedCount++;
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