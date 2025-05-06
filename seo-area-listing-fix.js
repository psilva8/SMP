/**
 * seo-area-listing-fix.js
 * Replaces the area listing with an SEO-focused paragraph
 */

const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;

// Function to update the HTML file
function updateAreaListing(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file has the area-list section
        if (!content.includes('class="area-list"') && !content.includes('class="areas-map"')) {
            console.log(`No area list found in: ${filePath}`);
            return false;
        }
        
        // Check if the file has already been modified
        if (content.includes('Hair Tattoo services are available across California')) {
            console.log(`File already has SEO paragraph: ${filePath}`);
            return false;
        }
        
        console.log(`Updating area listing in: ${filePath}`);
        
        // Find the area-list section
        const areaListStart = content.indexOf('<div class="area-list">');
        if (areaListStart === -1) {
            console.log(`Could not find area-list div in: ${filePath}`);
            return false;
        }
        
        // Find the end of the area-list section
        const areaListEnd = content.indexOf('</div>', areaListStart);
        if (areaListEnd === -1) {
            console.log(`Could not find end of area-list div in: ${filePath}`);
            return false;
        }
        
        // Extract the current area list HTML
        const currentAreaListHTML = content.substring(areaListStart, areaListEnd + 6);
        
        // Create the SEO-focused paragraph and keep the View All Areas button
        const viewAllButton = currentAreaListHTML.includes('View All Areas') ? 
            '<a href="/areas.html" class="area-item view-all">View All Areas</a>' : '';
        
        const newAreaContent = `<div class="area-description">
                <p class="seo-paragraph">
                    Hair Tattoo services are available across California in many locations including Los Angeles, San Francisco, 
                    San Diego, and surrounding areas. Our directory covers top-rated Hair Tattoo clinics in Alameda, Alamo, Auburn, 
                    Beaumont, Beverly Hills, Calabasas, Costa Mesa, Danville, El Monte, Encinitas, Glendale, Irvine, Mountain View, 
                    Oakland, Roseville, Sacramento, Santa Ana, Stockton, and Temecula. Each clinic provides specialized hair loss 
                    solutions using advanced micro-pigmentation techniques to create natural-looking hairlines and density. Los Angeles 
                    offers particularly extensive options for quality Hair Tattoo treatments with experienced practitioners who deliver 
                    exceptional results for all types of hair loss concerns.
                </p>
                ${viewAllButton}
            </div>`;
        
        // Replace the area-list section with the new SEO paragraph
        const updatedContent = content.replace(currentAreaListHTML, newAreaContent);
        
        // Add styling for the SEO paragraph
        const styleTag = `<style>
        .area-description {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 30px;
        }
        .seo-paragraph {
            line-height: 1.6;
            color: #444;
            margin-bottom: 20px;
            font-size: 1.05rem;
        }
        .area-description .view-all {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s;
        }
        .area-description .view-all:hover {
            background-color: #4338ca;
        }
    </style>`;
        
        // Add the style to the head of the document
        const updatedWithStyle = updatedContent.replace('</head>', styleTag + '\n</head>');
        
        // Save the updated content
        fs.writeFileSync(filePath, updatedWithStyle, 'utf8');
        
        console.log(`Updated area listing in: ${filePath}`);
        return true;
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
        return false;
    }
}

// Update the main index.html file
const indexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexPath)) {
    const result = updateAreaListing(indexPath);
    console.log(`Main index.html update: ${result ? 'Success' : 'No change needed'}`);
} else {
    console.error('Main index.html file not found');
}

console.log('SEO area listing update complete.'); 