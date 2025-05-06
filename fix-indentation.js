const fs = require('fs');

const filePath = 'index.html';
const content = fs.readFileSync(filePath, 'utf8');

// Find the area description section
const startMarker = '<div class="area-description">';
const startPos = content.indexOf(startMarker);
if (startPos === -1) {
    console.error('Could not find area description start');
    process.exit(1);
}

// Replace the section with fixed indentation
const oldSection = `<div class="area-description">
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

const newSection = `<div class="area-description">
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

const updatedContent = content.replace(oldSection, newSection);
fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('Fixed area section indentation'); 