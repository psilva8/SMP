const fs = require('fs');

const filePath = 'index.html';
let content = fs.readFileSync(filePath, 'utf8');

// Define the content we want to replace and the replacement
const areaStartSearch = '<section class="areas">';
const areaEndSearch = '</section>';

const areaStartPos = content.indexOf(areaStartSearch);
if (areaStartPos === -1) {
  console.error('Could not find areas section start');
  process.exit(1);
}

const afterAreaStart = areaStartPos + areaStartSearch.length;
const areaEndPos = content.indexOf(areaEndSearch, afterAreaStart);
if (areaEndPos === -1) {
  console.error('Could not find areas section end');
  process.exit(1);
}

// Extract the entire areas section
const oldAreaSection = content.substring(areaStartPos, areaEndPos + areaEndSearch.length);

// Create new areas section with proper horizontal layout
const newAreaSection = `<section class="areas">
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

// Replace the old section with the new one
content = content.replace(oldAreaSection, newAreaSection);

// Now update CSS to ensure horizontal layout
const cssSearch = `.area-description {`;
const cssPos = content.indexOf(cssSearch);

if (cssPos !== -1) {
  // Make sure CSS has display: flex
  if (!content.includes('display: flex', cssPos)) {
    const cssEndPos = content.indexOf('}', cssPos);
    const oldCss = content.substring(cssPos, cssEndPos + 1);
    const newCss = `.area-description {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
        }`;
    
    content = content.replace(oldCss, newCss);
  }
}

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Complete area section has been replaced with properly structured horizontal layout'); 