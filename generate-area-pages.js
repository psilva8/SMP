// Script to generate area-specific pages from the template
const fs = require('fs');
const path = require('path');

// Read the area template
const templatePath = path.join(__dirname, 'area.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Read the JSON data file to get all areas
const dataPath = path.join(__dirname, 'Outscraper-20250423020658xs04_micropigmentation_+1.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Extract unique areas (neighborhoods and cities)
const areas = new Set();

data.forEach(business => {
    // Check if business is permanently closed
    if (business.permanently_closed === true || business.business_status === "CLOSED_PERMANENTLY") {
        return;
    }
    
    // Add city if available
    if (business.city && business.city.trim() !== '') {
        areas.add(business.city.trim());
    }
    
    // Try to extract city from address if not directly available
    if (!business.city && (business.address || business.full_address || business.formatted_address)) {
        const address = business.address || business.full_address || business.formatted_address;
        const cityMatch = address ? address.match(/([^,]+),\s*([^,]+),\s*([A-Z]{2})/) : null;
        if (cityMatch && cityMatch[1]) {
            areas.add(cityMatch[1].trim());
        }
    }
    
    // Extract neighborhood if available
    const neighborhood = extractNeighborhood(business.address || business.full_address || '');
    if (neighborhood && neighborhood !== 'Unknown Area') {
        areas.add(neighborhood);
    }
});

// Helper function to extract neighborhood from address
function extractNeighborhood(address) {
    if (!address) return "Unknown Area";
    
    // Look for neighborhood patterns in the address
    const parts = address.split(',').map(part => part.trim());
    
    // If we have multiple parts, the second to last is often the city
    if (parts.length >= 2) {
        // Check for city districts or neighborhoods
        const cityPart = parts[parts.length - 2];
        
        // Check for neighborhood patterns like "Downtown Los Angeles" or "North Berkeley"
        const neighborhoodPatterns = [
            /\b(north|south|east|west|downtown|uptown|central|old)\s+\w+/i,
            /\b(heights|hills|park|valley|village|district|vista)\b/i
        ];
        
        for (const pattern of neighborhoodPatterns) {
            const match = cityPart.match(pattern);
            if (match) return match[0];
        }
        
        // If no specific neighborhood, return the city
        return cityPart;
    }
    
    return "Unknown Area";
}

// Create directories if they don't exist
const neighborhoodsDir = path.join(__dirname, 'neighborhoods');
if (!fs.existsSync(neighborhoodsDir)) {
    fs.mkdirSync(neighborhoodsDir);
}

// Convert Set to array and sort alphabetically
const sortedAreas = Array.from(areas).sort();

// Generate page for each area
console.log(`Generating pages for ${sortedAreas.length} areas...`);

sortedAreas.forEach(area => {
    if (area === 'Unknown Area') return;
    
    // Create URL-friendly filename
    const urlFriendlyName = area.toLowerCase().replace(/\s+/g, '-');
    const filePath = path.join(neighborhoodsDir, `${urlFriendlyName}.html`);
    
    // Copy template content
    let pageContent = template;
    
    // Update meta title and description with area name
    pageContent = pageContent.replace(
        /<title>.*?<\/title>/,
        `<title>SMP Clinics in ${area} | Hair Tattoo Directory</title>`
    );
    
    pageContent = pageContent.replace(
        /<meta name="description" content=".*?">/,
        `<meta name="description" content="Find top-rated scalp micropigmentation (SMP) clinics in ${area}, Los Angeles. Compare providers, services, and read reviews.">`
    );
    
    // Write the file
    fs.writeFileSync(filePath, pageContent);
    console.log(`Generated: ${filePath}`);
});

console.log('Area pages generation complete!');

// Instructions for running the script
console.log('\nTo generate all area pages, run:');
console.log('node generate-area-pages.js');
console.log('\nThis will create individual HTML files in the neighborhoods/ directory.'); 