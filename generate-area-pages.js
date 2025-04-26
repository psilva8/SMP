// Script to generate area-specific pages from the template
const fs = require('fs');
const path = require('path');

// Paths
const businessDataPath = path.join(__dirname, 'Outscraper-20250423020658xs04_micropigmentation_+1.json');
const areaTemplatePath = path.join(__dirname, 'area.html');
const areasDir = path.join(__dirname, 'areas');

// Create areas directory if it doesn't exist
if (!fs.existsSync(areasDir)) {
    fs.mkdirSync(areasDir, { recursive: true });
}

// Read business data
const businessData = JSON.parse(fs.readFileSync(businessDataPath, 'utf8'));
const areaTemplate = fs.readFileSync(areaTemplatePath, 'utf8');

// Extract unique areas (cities and neighborhoods)
const uniqueAreas = new Set();

businessData.forEach(business => {
    // Add city if available and not unknown
    if (business.city && business.city.toLowerCase() !== 'unknown area') {
        uniqueAreas.add(business.city);
    }
    
    // Add neighborhood if available and not unknown
    if (business.neighborhood && business.neighborhood.toLowerCase() !== 'unknown area') {
        uniqueAreas.add(business.neighborhood);
    }
});

console.log(`Found ${uniqueAreas.size} unique areas`);

// Create a directory and index.html for each area
uniqueAreas.forEach(area => {
    // Create URL-friendly area name
    const areaSlug = area.toLowerCase().replace(/\s+/g, '-');
    const areaDir = path.join(areasDir, areaSlug);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(areaDir)) {
        fs.mkdirSync(areaDir, { recursive: true });
    }
    
    // Create index.html file from template
    let areaHtml = areaTemplate;
    
    // Replace placeholders with area-specific content
    areaHtml = areaHtml.replace(/{{AREA_NAME}}/g, area);
    areaHtml = areaHtml.replace(/{{AREA_SLUG}}/g, areaSlug);
    
    // Write the file
    fs.writeFileSync(path.join(areaDir, 'index.html'), areaHtml);
    
    console.log(`Created ${path.join(areaDir, 'index.html')}`);
});

console.log('Area page generation complete!');

// Instructions for running the script
console.log('\nTo generate all area pages, run:');
console.log('node generate-area-pages.js');
console.log('\nThis will create individual HTML files in the areas/ directory.'); 