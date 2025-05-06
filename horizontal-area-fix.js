/**
 * horizontal-area-fix.js
 * Updates the SEO area listing to be horizontal instead of vertical
 */

const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;

// Function to update the HTML file
function updateAreaStyles(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file has the area-description section
        if (!content.includes('class="area-description"')) {
            console.log(`No area description found in: ${filePath}`);
            return false;
        }
        
        console.log(`Updating area styles in: ${filePath}`);
        
        // Look for the existing style block for area-description
        const styleStartText = '.area-description {';
        const styleStartIdx = content.indexOf(styleStartText);
        
        if (styleStartIdx === -1) {
            console.log(`Could not find area-description style in: ${filePath}`);
            return false;
        }
        
        // Find the end of the style block for area-description (.area-description .view-all:hover)
        const styleEndText = '.area-description .view-all:hover {';
        const styleEndIdx = content.indexOf(styleEndText);
        
        if (styleEndIdx === -1) {
            console.log(`Could not find end of style block in: ${filePath}`);
            return false;
        }
        
        // Find the end of that style rule
        const styleBlockEnd = content.indexOf('}', styleEndIdx);
        if (styleBlockEnd === -1) {
            console.log(`Could not find closing brace for style block in: ${filePath}`);
            return false;
        }
        
        // The entire old style block
        const oldStyleBlock = content.substring(styleStartIdx, styleBlockEnd + 1);
        
        // Create new horizontal layout style
        const newStyleBlock = `.area-description {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
        }
        .seo-paragraph {
            line-height: 1.6;
            color: #444;
            margin-bottom: 0;
            font-size: 1.05rem;
            flex: 1;
        }
        .area-description .view-all {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 12px 24px;
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
            .area-description {
                flex-direction: column;
                gap: 20px;
                text-align: center;
            }
        }`;
        
        // Replace the old style block with the new one
        const updatedContent = content.replace(oldStyleBlock, newStyleBlock);
        
        // Save the updated content
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        
        console.log(`Updated area styles to horizontal layout in: ${filePath}`);
        return true;
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
        return false;
    }
}

// Update the main index.html file
const indexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexPath)) {
    const result = updateAreaStyles(indexPath);
    console.log(`Main index.html update: ${result ? 'Success' : 'No change needed'}`);
} else {
    console.error('Main index.html file not found');
}

console.log('Horizontal area layout update complete.'); 