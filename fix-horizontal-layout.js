/**
 * fix-horizontal-layout.js
 * Creates a proper horizontal layout for the area section
 */

const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;

// Function to update the HTML file
function fixHorizontalLayout(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file has the area-description section
        if (!content.includes('class="area-description"')) {
            console.log(`No area description found in: ${filePath}`);
            return false;
        }
        
        console.log(`Fixing horizontal layout in: ${filePath}`);
        
        // Find the area description content
        const areaDescriptionStart = content.indexOf('<div class="area-description">');
        if (areaDescriptionStart === -1) {
            console.log(`Could not find area-description div in: ${filePath}`);
            return false;
        }
        
        // Find the end of the area description (closing the second div)
        const areaDescriptionEnd = content.indexOf('</div>', content.indexOf('</div>', areaDescriptionStart) + 6);
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
        
        // Find the end of the style block 
        const styleEndText = '.area-description .view-all:hover {';
        const styleEndIdx = content.indexOf(styleEndText);
        
        if (styleEndIdx === -1) {
            console.log(`Could not find end of style block in: ${filePath}`);
            return false;
        }
        
        // Find the end of the entire style block
        const styleBlockEnd = content.indexOf('}', content.indexOf('}', styleEndIdx) + 1);
        if (styleBlockEnd === -1) {
            console.log(`Could not find closing brace for style block in: ${filePath}`);
            return false;
        }
        
        // Extract the original style content
        const originalStyle = content.substring(styleStartIdx, styleBlockEnd + 1);
        
        // Create the new content structure with true horizontal layout
        const newAreaContent = `<div class="area-description">
                <div class="area-content">
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
                </div>
            </div>`;
        
        // New true horizontal style using flexbox correctly
        const newStyle = `.area-description {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 30px;
        }
        .area-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
        }
        .seo-paragraph {
            line-height: 1.7;
            color: #444;
            margin-bottom: 0;
            font-size: 1.05rem;
            flex: 1;
        }
        .view-all-container {
            flex-shrink: 0;
        }
        .area-description .view-all {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 15px 30px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.3s;
            white-space: nowrap;
        }
        .area-description .view-all:hover {
            background-color: #4338ca;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .area-content {
                flex-direction: column;
                align-items: flex-start;
                gap: 20px;
            }
            .seo-paragraph {
                margin-bottom: 10px;
            }
        }`;
        
        // Replace the original area content with the new content
        let updatedContent = content.replace(originalContent, newAreaContent);
        
        // Replace the original style with the new style
        updatedContent = updatedContent.replace(originalStyle, newStyle);
        
        // Save the updated content
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        
        console.log(`Fixed horizontal layout in: ${filePath}`);
        return true;
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
        return false;
    }
}

// Update the main index.html file
const indexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexPath)) {
    const result = fixHorizontalLayout(indexPath);
    console.log(`Main index.html update: ${result ? 'Success' : 'No change needed'}`);
} else {
    console.error('Main index.html file not found');
}

console.log('Horizontal layout fix complete.'); 