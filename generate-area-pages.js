// Script to generate area-specific pages from the template
const fs = require('fs');
const path = require('path');

// Load business data from JSON file
const businessDataPath = path.join(__dirname, 'Outscraper-20250423020658xs04_micropigmentation_+1.json');
const businessData = JSON.parse(fs.readFileSync(businessDataPath, 'utf8'));

// Load area template
const areaTemplatePath = path.join(__dirname, 'area.html');
const areaTemplate = fs.readFileSync(areaTemplatePath, 'utf8');

// Extract unique areas from business data
const uniqueAreas = new Set();

businessData.forEach(business => {
    // Use city as the area
    if (business.city && business.city !== 'Unknown Area') {
        uniqueAreas.add(business.city);
    }
});

console.log(`Found ${uniqueAreas.size} unique areas.`);

// Make sure the areas directory exists
const areasDir = path.join(__dirname, 'areas');
if (!fs.existsSync(areasDir)) {
    fs.mkdirSync(areasDir);
}

// Create a directory and index.html file for each area
uniqueAreas.forEach(area => {
    // Create URL-friendly area name
    const urlFriendlyArea = area.toLowerCase().replace(/\s+/g, '-');
    
    // Create area directory
    const areaDir = path.join(areasDir, urlFriendlyArea);
    if (!fs.existsSync(areaDir)) {
        fs.mkdirSync(areaDir);
    }
    
    // Generate area HTML from template
    let areaHtml = areaTemplate
        // Update area name in various places
        .replace(/Beverly Hills/g, area)
        // Update paths for resources to reference root
        .replace(/src="\/scripts.js"/g, 'src="https://micropigmentationla.com/scripts.js"')
        // Update title and metadata
        .replace(/<title>.*?<\/title>/, `<title>SMP Clinics in ${area} | Hair Tattoo Directory</title>`)
        .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="Find top-rated scalp micropigmentation (SMP) clinics in ${area}, Los Angeles. Compare providers, services, and reviews."`)
        .replace(/<link rel="canonical" href=".*?"/, `<link rel="canonical" href="https://smpdirectory.com/areas/${urlFriendlyArea}/"`)
        // Add error handling
        .replace(/document\.addEventListener\('DOMContentLoaded', function\(\) {/, `document.addEventListener('DOMContentLoaded', function() {\n            console.log('Area page DOM content loaded');`);
    
    // Write the file to the area directory
    fs.writeFileSync(path.join(areaDir, 'index.html'), areaHtml);
    console.log(`Created /areas/${urlFriendlyArea}/index.html`);
});

console.log('Area pages generated successfully!');

// Instructions for running the script
console.log('\nTo generate all area pages, run:');
console.log('node generate-area-pages.js');
console.log('\nThis will create individual HTML files in the areas/ directory.'); 