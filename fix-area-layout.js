/**
 * fix-area-layout.js
 * Fixes the area description layout to match the design requirements
 */

const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;

// Function to update the HTML file
function fixAreaLayout(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file has the area-description section
        if (!content.includes('class="area-description"')) {
            console.log(`No area description found in: ${filePath}`);
            return false;
        }
        
        console.log(`Fixing area layout in: ${filePath}`);
        
        // Find the area description content
        const areaDescriptionStart = content.indexOf('<div class="area-description">');
        if (areaDescriptionStart === -1) {
            console.log(`Could not find area-description div in: ${filePath}`);
            return false;
        }
        
        // Find the end of the area description
        const areaDescriptionEnd = content.indexOf('</div>', areaDescriptionStart + 30);
        if (areaDescriptionEnd === -1) {
            console.log(`Could not find end of area-description div in: ${filePath}`);
            return false;
        }
        
        // Get the original area description content
        const originalContent = content.substring(areaDescriptionStart, areaDescriptionEnd + 6);
        
        // Find the style block for area-description
        const styleStartText = '.area-description {';
        const styleStartIdx = content.indexOf(styleStartText);
        
        if (styleStartIdx === -1) {
            console.log(`Could not find area-description style in: ${filePath}`);
            return false;
        }
        
        // Find the end of the style block (the media query)
        const mediaQueryText = '@media (max-width: 768px)';
        const mediaQueryIdx = content.indexOf(mediaQueryText, styleStartIdx);
        
        // Find the end of the entire style block
        const styleBlockEnd = content.indexOf('</style>', styleStartIdx);
        if (styleBlockEnd === -1) {
            console.log(`Could not find closing style tag in: ${filePath}`);
            return false;
        }
        
        // Extract the original style content
        const originalStyle = content.substring(styleStartIdx, styleBlockEnd);
        
        // Create the new content structure that matches the screenshot
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
                <div class="view-all-container">
                    <a href="/areas.html" class="area-item view-all">View All Areas</a>
                </div>
            </div>`;
        
        // New style that matches the screenshot
        const newStyle = `.area-description {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 30px;
        }
        .seo-paragraph {
            line-height: 1.7;
            color: #444;
            margin-bottom: 20px;
            font-size: 1.05rem;
            max-width: 100%;
        }
        .view-all-container {
            text-align: left;
            margin-top: 15px;
        }
        .area-description .view-all {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 12px 25px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s;
        }
        .area-description .view-all:hover {
            background-color: #4338ca;
        }`;
        
        // Replace the original area content with the new content
        let updatedContent = content.replace(originalContent, newAreaContent);
        
        // Replace the original style with the new style
        updatedContent = updatedContent.replace(originalStyle, newStyle);
        
        // Save the updated content
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        
        console.log(`Fixed area layout in: ${filePath}`);
        return true;
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
        return false;
    }
}

// Update the main index.html file
const indexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexPath)) {
    const result = fixAreaLayout(indexPath);
    console.log(`Main index.html update: ${result ? 'Success' : 'No change needed'}`);
} else {
    console.error('Main index.html file not found');
}

console.log('Area layout fix complete.'); 