const fs = require('fs');
const path = require('path');

// Directories
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Function to update content in HTML files
function removeReferences(content) {
    // Fix the HTML title and main headings
    content = content.replace(/<title>SMP Directory[^<]*<\/title>/g, '<title>Hair Tattoo Directory | Find Top Clinics</title>');
    
    // Fix h1 heading in hero section
    content = content.replace(/<h1>Find Top Scalp Micropigmentation Clinics<\/h1>/g, '<h1>Find Top Hair Tattoo Clinics</h1>');
    
    // Fix h2 sections with SMP or Scalp Micropigmentation
    content = content.replace(/<h2>Top SMP Clinics<\/h2>/g, '<h2>Top Clinics</h2>');
    content = content.replace(/<h2>Browse SMP Clinics by Area<\/h2>/g, '<h2>Browse Clinics by Area</h2>');
    content = content.replace(/<h2>About Scalp Micropigmentation<\/h2>/g, '<h2>About Hair Tattoo Treatment</h2>');
    
    // Fix the about section text - this can be a bit more extensive
    const aboutSectionRegex = /<p>Scalp Micropigmentation \(SMP\) is[^<]*<\/p>/g;
    content = content.replace(aboutSectionRegex, '<p>Hair Tattoo Treatment is a non-surgical, non-invasive, immediate solution to hair loss. This specialized technique uses micro-needles to deposit pigment into the scalp, creating the appearance of tiny hair follicles to restore the look of a fuller head of hair.</p>');
    
    // Fix the second paragraph in the about section
    content = content.replace(/SMP can help with various conditions/g, 'This treatment can help with various conditions');
    
    // Fix the logo text - keeping "SMP Directory" as it's the brand name
    // Uncomment if you want to change the logo too
    // content = content.replace(/<a href="\/">SMP Directory<\/a>/g, '<a href="/">Hair Tattoo Directory</a>');
    
    // Fix footer references
    content = content.replace(/<h3>SMP Directory<\/h3>/g, '<h3>Hair Tattoo Directory</h3>');
    content = content.replace(/<a href="\/about.html">About SMP<\/a>/g, '<a href="/about.html">About Hair Tattoo</a>');
    content = content.replace(/info@smpdirectory.com/g, 'info@hairtattoodirectory.com');
    
    // Fix the clinic name references if we need to keep SMP in business names
    // This is more complex - only apply to headings, not business names
    
    return content;
}

// Function to update a single HTML file
function updateHtmlFile(filePath) {
    try {
        console.log(`Processing: ${filePath}`);
        
        // Read file
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update content
        const updatedContent = removeReferences(content);
        
        // Write back to file if changes were made
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent);
            console.log(`Updated: ${filePath}`);
            return true;
        } else {
            console.log(`No changes needed for: ${filePath}`);
            return false;
        }
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
        return false;
    }
}

// Process root HTML files
console.log("Processing HTML files in root directory...");

const rootHtmlFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.html'));

rootHtmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    updateHtmlFile(filePath);
});

// Process all area html files
console.log("\nProcessing area HTML files...");

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

console.log("\nHTML update process complete."); 