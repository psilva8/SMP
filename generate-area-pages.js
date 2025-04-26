// Script to generate area-specific pages from the template
const fs = require('fs');
const path = require('path');

// Read the business data
const businessDataPath = path.join(__dirname, 'Outscraper-20250423020658xs04_micropigmentation_+1.json');
const businessData = JSON.parse(fs.readFileSync(businessDataPath, 'utf8'));

// Read the area template
const areaTemplatePath = path.join(__dirname, 'area.html');
let areaTemplate = fs.readFileSync(areaTemplatePath, 'utf8');

// Extract unique areas from the data
const areas = new Set();

businessData.forEach(business => {
    // Add city if available
    if (business.city && business.city !== '' && business.city !== 'Unknown Area') {
        areas.add(business.city);
    }
    
    // Add neighborhood if available and not Unknown
    if (business.neighborhood && business.neighborhood !== 'Unknown Area') {
        areas.add(business.neighborhood);
    }
});

console.log(`Found ${areas.size} unique areas`);

// Create the area directory if it doesn't exist
const areaDir = path.join(__dirname, 'area');
if (!fs.existsSync(areaDir)) {
    fs.mkdirSync(areaDir);
}

// Create a directory and index.html file for each area
areas.forEach(area => {
    // Create URL-friendly area name
    const urlFriendlyArea = area.toLowerCase().replace(/\s+/g, '-');
    
    // Create the area directory
    const specificAreaDir = path.join(areaDir, urlFriendlyArea);
    if (!fs.existsSync(specificAreaDir)) {
        fs.mkdirSync(specificAreaDir);
    }
    
    // Create the index.html file using the template
    const indexPath = path.join(specificAreaDir, 'index.html');
    
    // Replace AREA_NAME with the actual area name
    let areaContent = areaTemplate;
    
    // Make sure all paths reference the root correctly (../ for each resource)
    areaContent = areaContent.replace(/href="([^"]*)"/g, (match, p1) => {
        // Don't modify external URLs or already adjusted paths
        if (p1.startsWith('http') || p1.startsWith('#') || p1.startsWith('../')) {
            return match;
        }
        
        // Add ../ to the path
        return `href="../${p1}"`;
    });
    
    // Update script sources
    areaContent = areaContent.replace(/src="([^"]*)"/g, (match, p1) => {
        // Don't modify external URLs or already adjusted paths
        if (p1.startsWith('http') || p1.startsWith('../')) {
            return match;
        }
        
        // Add ../ to the path
        return `src="../${p1}"`;
    });
    
    // Update title and metadata
    areaContent = areaContent.replace(/AREA_NAME/g, area);
    areaContent = areaContent.replace(/<title>.*?<\/title>/, `<title>SMP Clinics in ${area} | Hair Tattoo Directory</title>`);
    
    // Add canonical URL for SEO
    const canonicalLink = `<link rel="canonical" href="https://yourdomain.com/area/${urlFriendlyArea}/" />`;
    areaContent = areaContent.replace('</head>', `  ${canonicalLink}\n</head>`);
    
    fs.writeFileSync(indexPath, areaContent);
    console.log(`Created ${indexPath}`);
});

console.log('Finished generating area pages');

// Instructions for running the script
console.log('\nTo generate all area pages, run:');
console.log('node generate-area-pages.js');
console.log('\nThis will create individual HTML files in the area/ directory.'); 