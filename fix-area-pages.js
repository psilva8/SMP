const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Function to fix area page HTML files
function fixAreaPages() {
    try {
        // Read all area directories
        const areas = fs.readdirSync(areasDir);
        let fixedCount = 0;
        
        areas.forEach(area => {
            const areaPath = path.join(areasDir, area);
            const stat = fs.statSync(areaPath);
            
            if (stat.isDirectory()) {
                const indexPath = path.join(areaPath, 'index.html');
                
                if (fs.existsSync(indexPath)) {
                    try {
                        let content = fs.readFileSync(indexPath, 'utf8');
                        let originalContent = content;
                        
                        // Remove problematic script references
                        content = content.replace(/<script src="final-dropdown-fix\.js"[^>]*><\/script>/g, '');
                        content = content.replace(/<script src="\/area-fix\.js"[^>]*><\/script>/g, '');
                        content = content.replace(/<script src="\/image-fix\.js"[^>]*><\/script>/g, '');
                        content = content.replace(/<script src="\/remove-smp-dom\.js"[^>]*><\/script>/g, '');
                        
                        // Fix script paths to use relative paths
                        content = content.replace(/src="\/scripts\.js"/g, 'src="../../scripts.js"');
                        
                        // Fix JSON data paths in the inline scripts
                        content = content.replace(/fetch\('\/Outscraper-20250423020658xs04_micropigmentation_\+1\.json'\)/g, 
                            "fetch('../../Outscraper-20250423020658xs04_micropigmentation_+1.json')");
                        
                        // Add a simple area-specific script to handle the page functionality
                        const areaScript = `
    <!-- Area page functionality -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Area page loaded for: ${area}');
            
            // Initialize dropdown functionality
            const dropdowns = document.querySelectorAll('.dropdown');
            
            dropdowns.forEach(dropdown => {
                const dropbtn = dropdown.querySelector('a');
                
                if (dropbtn) {
                    dropbtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                        
                        // Close other dropdowns
                        dropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('active');
                            }
                        });
                    });
                }
            });
            
            // Close dropdowns when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.dropdown')) {
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                }
            });
            
            // Load area clinics with proper error handling
            loadAreaClinicsSimple();
        });
        
        function loadAreaClinicsSimple() {
            const clinicsContainer = document.getElementById('area-clinics');
            if (!clinicsContainer) return;
            
            // Check if we have cached data
            if (window.filteredBusinesses && window.filteredBusinesses.length > 0) {
                displayAreaClinics(window.filteredBusinesses);
                return;
            }
            
            // Try to load from the main scripts.js functionality
            if (typeof fetchBusinessData === 'function') {
                fetchBusinessData()
                    .then(data => {
                        if (data && data.length > 0) {
                            displayAreaClinics(data);
                        } else {
                            showNoDataMessage();
                        }
                    })
                    .catch(error => {
                        console.error('Error loading business data:', error);
                        showNoDataMessage();
                    });
            } else {
                // Fallback: show a message that data is loading
                setTimeout(() => {
                    if (clinicsContainer.textContent.includes('Loading')) {
                        showNoDataMessage();
                    }
                }, 5000);
            }
        }
        
        function displayAreaClinics(businessData) {
            const clinicsContainer = document.getElementById('area-clinics');
            if (!clinicsContainer) return;
            
            const areaName = '${area.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}';
            
            // Filter businesses for this area
            const filteredClinics = businessData.filter(business => {
                const areaNameLower = areaName.toLowerCase();
                return (
                    (business.city && business.city.toLowerCase() === areaNameLower) ||
                    (business.neighborhood && business.neighborhood.toLowerCase() === areaNameLower) ||
                    (business.address && business.address.toLowerCase().includes(areaNameLower)) ||
                    (business.full_address && business.full_address.toLowerCase().includes(areaNameLower))
                );
            });
            
            // Clear container
            clinicsContainer.innerHTML = '';
            
            if (filteredClinics.length === 0) {
                clinicsContainer.innerHTML = \`
                    <div class="col-span-full text-center py-8">
                        <p class="text-gray-500">No clinics found in \${areaName}.</p>
                        <p class="text-gray-400 mt-2">Try searching in nearby areas.</p>
                    </div>
                \`;
                return;
            }
            
            // Sort by rating
            const sortedClinics = [...filteredClinics].sort((a, b) => {
                const ratingA = parseFloat(a.rating) || 0;
                const ratingB = parseFloat(b.rating) || 0;
                return ratingB - ratingA;
            });
            
            // Create clinic cards
            sortedClinics.forEach(business => {
                const card = createClinicCardSimple(business);
                clinicsContainer.appendChild(card);
            });
        }
        
        function createClinicCardSimple(business) {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow';
            
            const imageUrl = (business.photos && business.photos.length > 0 && business.photos[0]) 
                ? business.photos[0] 
                : 'https://via.placeholder.com/400x200/f3f4f6/6b7280?text=Hair+Tattoo+Clinic';
            
            const address = business.full_address || business.address || 'Address not available';
            const rating = business.rating ? parseFloat(business.rating).toFixed(1) : 'N/A';
            const reviews = business.reviews_count || business.reviews || 0;
            const phone = business.phone_number || business.phone || 'No phone';
            const website = business.website || business.site || business.url || '';
            
            card.innerHTML = \`
                <div class="h-48 bg-gray-200 overflow-hidden">
                    <img src="\${imageUrl}" alt="\${business.name}" class="w-full h-full object-cover" 
                        onerror="this.src='https://via.placeholder.com/400x200/f3f4f6/6b7280?text=Hair+Tattoo+Clinic'; this.onerror=null;">
                </div>
                <div class="p-5">
                    <h3 class="text-xl font-bold mb-2 text-gray-800">\${business.name || 'Unnamed Clinic'}</h3>
                    <div class="flex items-center mb-2">
                        <span class="text-yellow-500 mr-1">⭐</span>
                        <span class="text-gray-700">\${rating} (\${reviews} reviews)</span>
                    </div>
                    <p class="text-gray-600 mb-3 text-sm">\${address}</p>
                    <div class="space-y-2">
                        <div class="text-blue-600 font-medium text-sm">\${phone}</div>
                        \${website ? \`<a href="\${website}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 text-sm">Visit Website</a>\` : ''}
                    </div>
                </div>
            \`;
            
            return card;
        }
        
        function showNoDataMessage() {
            const clinicsContainer = document.getElementById('area-clinics');
            if (clinicsContainer) {
                clinicsContainer.innerHTML = \`
                    <div class="col-span-full text-center py-8">
                        <p class="text-gray-500">Unable to load clinic data at this time.</p>
                        <p class="text-gray-400 mt-2">Please try refreshing the page.</p>
                    </div>
                \`;
            }
        }
    </script>`;
                        
                        // Replace the existing complex scripts with our simple one
                        const scriptStartIndex = content.lastIndexOf('<!-- JavaScript -->');
                        if (scriptStartIndex !== -1) {
                            const scriptEndIndex = content.lastIndexOf('</body>');
                            if (scriptEndIndex !== -1) {
                                const beforeScripts = content.substring(0, scriptStartIndex);
                                const afterScripts = content.substring(scriptEndIndex);
                                
                                content = beforeScripts + 
                                    '<!-- JavaScript -->\n' +
                                    '    <script src="../../scripts.js"></script>\n' +
                                    areaScript + '\n' +
                                    afterScripts;
                            }
                        }
                        
                        // Only write if content changed
                        if (content !== originalContent) {
                            fs.writeFileSync(indexPath, content, 'utf8');
                            console.log(`Fixed: ${area}/index.html`);
                            fixedCount++;
                        }
                        
                    } catch (error) {
                        console.error(`Error fixing ${area}/index.html:`, error.message);
                    }
                }
            }
        });
        
        console.log(`\nFixed ${fixedCount} area pages successfully!`);
        
    } catch (error) {
        console.error('Error fixing area pages:', error);
    }
}

// Run the fix
console.log('Starting area pages fix...');
fixAreaPages(); 