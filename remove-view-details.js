const fs = require('fs');
const path = require('path');

// Directory containing area directories
const areasDir = path.join(__dirname, 'areas');

// Function to update an HTML file
function updateHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove the "View Details" link from the fallback script
        const updatedContent = content.replace(
            /<a href="\\?\${business\.url \|\| '#'}" target="_blank" class="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition">View Details<\/a>/g, 
            ''
        );
        
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