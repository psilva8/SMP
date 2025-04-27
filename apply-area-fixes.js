const fs = require('fs');
const path = require('path');

// Directory containing area directories
const areasDir = path.join(__dirname, 'areas');

// The fallback script to add to all area pages
const fallbackScript = `
    <!-- Fallback script to ensure clinics load -->
    <script>
        // Wait 3 seconds to see if the main script loaded the clinics
        setTimeout(async function() {
            const clinicsContainer = document.getElementById('area-clinics');
            if (!clinicsContainer) return;
            
            // Check if container still has loading text
            if (clinicsContainer.textContent.includes('Loading')) {
                console.log('Area clinics still loading after 3 seconds, attempting direct load');
                
                try {
                    // Direct fetch the JSON
                    const response = await fetch('/Outscraper-20250423020658xs04_micropigmentation_+1.json');
                    if (!response.ok) throw new Error(\`Network error: \${response.status}\`);
                    
                    const data = await response.json();
                    console.log(\`Successfully loaded \${data.length} businesses directly\`);
                    
                    // Extract area name from URL path
                    const pathname = window.location.pathname;
                    const match = pathname.match(/\\/areas\\/([^\\/]+)/i);
                    if (!match) return;
                    
                    const areaSlug = match[1];
                    let areaName = areaSlug.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
                    
                    const filteredData = data.filter(business => {
                        return (
                            (business.city && business.city.toLowerCase() === areaName.toLowerCase()) ||
                            (business.neighborhood && business.neighborhood.toLowerCase() === areaName.toLowerCase()) ||
                            (business.address && business.address.toLowerCase().includes(areaName.toLowerCase())) ||
                            (business.full_address && business.full_address.toLowerCase().includes(areaName.toLowerCase()))
                        );
                    });
                    
                    console.log(\`Found \${filteredData.length} clinics in \${areaName}\`);
                    
                    // Clear the container
                    clinicsContainer.innerHTML = '';
                    
                    if (filteredData.length === 0) {
                        clinicsContainer.innerHTML = \`<p class="text-center py-8 col-span-full">No clinics found in \${areaName}. Try another area nearby.</p>\`;
                        return;
                    }
                    
                    // Sort by rating
                    const sortedBusinesses = [...filteredData].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    
                    // Create cards for each business
                    sortedBusinesses.forEach(business => {
                        const imageUrl = business.photos && business.photos.length > 0 && business.photos[0] 
                            ? business.photos[0] 
                            : 'https://via.placeholder.com/400x250?text=SMP+Clinic';
                        
                        const address = business.full_address || business.address || 'Address not available';
                        const rating = business.rating || 'N/A';
                        const reviews = business.reviews_count || 0;
                        
                        const card = document.createElement('div');
                        card.className = 'bg-white rounded-lg shadow-md overflow-hidden';
                        
                        card.innerHTML = \`
                            <div class="h-48 bg-gray-200 overflow-hidden">
                                <img src="\${imageUrl}" alt="\${business.name}" class="w-full h-full object-cover" 
                                    onerror="this.src='https://via.placeholder.com/400x250?text=SMP+Clinic'; this.onerror=null;">
                            </div>
                            <div class="p-5">
                                <h3 class="text-xl font-bold mb-2">\${business.name || 'Unnamed Clinic'}</h3>
                                <div class="text-yellow-500 mb-2">Rating: \${rating} ⭐ (\${reviews} reviews)</div>
                                <p class="text-gray-600 mb-3 truncate">\${address}</p>
                                <div class="flex justify-between items-center">
                                    <span class="text-blue-600 font-medium">\${business.phone_number || 'No phone'}</span>
                                </div>
                            </div>
                        \`;
                        
                        clinicsContainer.appendChild(card);
                    });
                    
                    // Update the count text
                    const countElement = document.querySelector('.area-hero p');
                    if (countElement) {
                        const clinicText = filteredData.length === 1 ? 'clinic' : 'clinics';
                        countElement.textContent = \`\${filteredData.length} scalp micropigmentation \${clinicText} found in \${areaName}\`;
                    }
                    
                } catch (error) {
                    console.error('Error in direct load:', error);
                    clinicsContainer.innerHTML = \`<p class="text-center py-8 col-span-full">Error loading clinics: \${error.message}. Please try refreshing the page.</p>\`;
                }
            } else {
                console.log('Clinics loaded successfully through normal process');
            }
        }, 3000);
    </script>
</body>
</html>`;

// Function to update an HTML file
function updateHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the fallback script is already added
        if (content.includes('Fallback script to ensure clinics load')) {
            console.log(`File already updated: ${filePath}`);
            return;
        }
        
        // Replace the closing body/html tags with our fallback script
        const updatedContent = content.replace(/<\/body>\s*<\/html>/i, fallbackScript);
        
        // Write back the updated content
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated file: ${filePath}`);
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
    }
}

// Process all areas
if (fs.existsSync(areasDir)) {
    const areas = fs.readdirSync(areasDir);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    areas.forEach(area => {
        const areaDir = path.join(areasDir, area);
        
        // Check if this is a directory
        if (fs.statSync(areaDir).isDirectory()) {
            const indexFile = path.join(areaDir, 'index.html');
            
            // Check if index.html exists
            if (fs.existsSync(indexFile)) {
                try {
                    updateHtmlFile(indexFile);
                    updatedCount++;
                } catch (err) {
                    console.error(`Error processing ${indexFile}:`, err);
                    errorCount++;
                }
            }
        }
    });
    
    console.log(`\nSummary:`);
    console.log(`Total areas processed: ${areas.length}`);
    console.log(`Files updated: ${updatedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
} else {
    console.error(`Areas directory not found: ${areasDir}`);
} 