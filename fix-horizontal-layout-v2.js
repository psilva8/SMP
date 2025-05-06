/**
 * fix-horizontal-layout-v2.js
 * Final fix for the horizontal layout issue in the area section
 */

const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;

// Function to update the HTML file
function fixHorizontalLayoutFinal(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file has the area-description section
        if (!content.includes('class="area-description"')) {
            console.log(`No area description found in: ${filePath}`);
            return false;
        }
        
        console.log(`Applying final horizontal layout fix in: ${filePath}`);
        
        // Get the areas section
        const areasSectionStart = content.indexOf('<section class="areas">');
        const areasSectionEnd = content.indexOf('</section>', areasSectionStart) + 10;
        
        if (areasSectionStart === -1 || areasSectionEnd === -1) {
            console.log(`Could not find areas section in: ${filePath}`);
            return false;
        }
        
        // Create a completely new areas section with proper structure
        const newAreasSection = `<section class="areas">
        <div class="container">
            <h2>Browse Clinics by Area</h2>
            <div class="areas-map">
                <div class="area-description">
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
            </div>
        </div>
    </section>`;
        
        // Replace the entire areas section
        const updatedContent = content.substring(0, areasSectionStart) + 
                               newAreasSection + 
                               content.substring(areasSectionEnd);
        
        // Find the style tags in the head section
        const headStart = updatedContent.indexOf('<head>');
        const headEnd = updatedContent.indexOf('</head>', headStart);
        
        if (headStart === -1 || headEnd === -1) {
            console.log(`Could not find head section in: ${filePath}`);
            return false;
        }
        
        // Check if there's an inline style for area-description
        const areaStyleStart = updatedContent.indexOf('<style>\n        .area-description', headStart);
        
        if (areaStyleStart === -1 || areaStyleStart > headEnd) {
            console.log(`Could not find area-description style in: ${filePath}`);
            return false;
        }
        
        // Find the end of this style block
        const areaStyleEnd = updatedContent.indexOf('</style>', areaStyleStart);
        
        if (areaStyleEnd === -1 || areaStyleEnd > headEnd) {
            console.log(`Could not find end of style tag in: ${filePath}`);
            return false;
        }
        
        // Create new CSS with proper horizontal layout
        const newAreaStyle = `<style>
        .area-description {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 30px;
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
            .area-description {
                flex-direction: column;
                align-items: flex-start;
                gap: 20px;
            }
            .seo-paragraph {
                margin-bottom: 10px;
            }
        }</style>`;
        
        // Replace the area style
        const finalContent = updatedContent.substring(0, areaStyleStart) + 
                             newAreaStyle + 
                             updatedContent.substring(areaStyleEnd + 8); // +8 to include the </style> tag
        
        // Save the updated content
        fs.writeFileSync(filePath, finalContent, 'utf8');
        
        console.log(`Fixed horizontal layout in: ${filePath}`);
        
        // Also add this fix to styles.css to ensure it persists
        const stylesPath = path.join(rootDir, 'styles.css');
        if (fs.existsSync(stylesPath)) {
            let stylesContent = fs.readFileSync(stylesPath, 'utf8');
            
            // Check if styles.css already has the area-description styles
            if (stylesContent.includes('.area-description {')) {
                // Find the area description styles
                const cssAreaStyleStart = stylesContent.indexOf('.area-description {');
                let cssAreaStyleEnd = stylesContent.indexOf('}', cssAreaStyleStart);
                
                // Keep looking for the end of all area description related styles
                let nextStyle = stylesContent.indexOf('.area-description', cssAreaStyleEnd);
                while (nextStyle !== -1 && nextStyle < cssAreaStyleEnd + 100) {
                    cssAreaStyleEnd = stylesContent.indexOf('}', nextStyle);
                    nextStyle = stylesContent.indexOf('.area-description', cssAreaStyleEnd + 1);
                }
                
                if (cssAreaStyleStart !== -1 && cssAreaStyleEnd !== -1) {
                    // Extract the CSS without the style tags
                    const cssContent = `
/* Area Description Styles */
.area-description {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    margin-bottom: 30px;
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

/* Responsive adjustments for area description */
@media (max-width: 768px) {
    .area-description {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
    .seo-paragraph {
        margin-bottom: 10px;
    }
}`;
                    
                    // Replace the existing styles
                    const updatedStylesContent = stylesContent.substring(0, cssAreaStyleStart) + 
                                               cssContent + 
                                               stylesContent.substring(cssAreaStyleEnd + 1);
                    
                    fs.writeFileSync(stylesPath, updatedStylesContent, 'utf8');
                    console.log(`Updated area-description styles in styles.css`);
                } else {
                    // Append the styles at the end if we couldn't find the exact section
                    const cssContent = `
/* Area Description Styles */
.area-description {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    margin-bottom: 30px;
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

/* Responsive adjustments for area description */
@media (max-width: 768px) {
    .area-description {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
    .seo-paragraph {
        margin-bottom: 10px;
    }
}`;
                    
                    fs.appendFileSync(stylesPath, cssContent, 'utf8');
                    console.log(`Appended area-description styles to styles.css`);
                }
            } else {
                // Append the styles if they don't exist at all
                const cssContent = `
/* Area Description Styles */
.area-description {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    margin-bottom: 30px;
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

/* Responsive adjustments for area description */
@media (max-width: 768px) {
    .area-description {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
    .seo-paragraph {
        margin-bottom: 10px;
    }
}`;
                
                fs.appendFileSync(stylesPath, cssContent, 'utf8');
                console.log(`Appended area-description styles to styles.css`);
            }
        }
        
        return true;
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
        return false;
    }
}

// Update the main index.html file
const indexPath = path.join(rootDir, 'index.html');
if (fs.existsSync(indexPath)) {
    const result = fixHorizontalLayoutFinal(indexPath);
    console.log(`Main index.html update: ${result ? 'Success' : 'No change needed'}`);
} else {
    console.error('Main index.html file not found');
}

console.log('Horizontal layout fix complete.'); 