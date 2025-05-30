const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Function to fix area page integration
function fixAreaIntegration() {
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
                        
                        // Find and replace the area page functionality script
                        const scriptStart = content.indexOf('<!-- Area page functionality -->');
                        const scriptEnd = content.indexOf('</script>', scriptStart) + 9;
                        
                        if (scriptStart !== -1 && scriptEnd !== -1) {
                            const areaNameFormatted = area.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            
                            const newScript = `<!-- Area page functionality -->
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
            
            // Wait for main scripts to load and then load area clinics
            loadAreaClinicsWithRetry();
        });
        
        function loadAreaClinicsWithRetry() {
            const clinicsContainer = document.getElementById('area-clinics');
            if (!clinicsContainer) return;
            
            let attempts = 0;
            const maxAttempts = 10;
            
            function tryLoadClinics() {
                attempts++;
                
                // Check if we have data from the main script
                if (window.filteredBusinesses && window.filteredBusinesses.length > 0) {
                    console.log('Found filtered businesses data, displaying area clinics');
                    displayAreaClinics(window.filteredBusinesses);
                    return;
                }
                
                // Check if fetchBusinessData is available
                if (typeof fetchBusinessData === 'function') {
                    console.log('fetchBusinessData available, calling it');
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
                            if (attempts < maxAttempts) {
                                setTimeout(tryLoadClinics, 1000);
                            } else {
                                showNoDataMessage();
                            }
                        });
                    return;
                }
                
                // If neither is available and we haven't exceeded max attempts, try again
                if (attempts < maxAttempts) {
                    console.log(\`Attempt \${attempts}/\${maxAttempts}: Waiting for scripts to load...\`);
                    setTimeout(tryLoadClinics, 500);
                } else {
                    console.log('Max attempts reached, showing fallback message');
                    showNoDataMessage();
                }
            }
            
            // Start trying to load clinics
            tryLoadClinics();
        }
        
        function displayAreaClinics(businessData) {
            const clinicsContainer = document.getElementById('area-clinics');
            if (!clinicsContainer) return;
            
            const areaName = '${areaNameFormatted}';
            console.log(\`Filtering \${businessData.length} businesses for area: \${areaName}\`);
            
            // Filter businesses for this area with more flexible matching
            const filteredClinics = businessData.filter(business => {
                const areaNameLower = areaName.toLowerCase();
                const businessCity = (business.city || '').toLowerCase();
                const businessNeighborhood = (business.neighborhood || '').toLowerCase();
                const businessAddress = (business.address || '').toLowerCase();
                const businessFullAddress = (business.full_address || '').toLowerCase();
                
                return (
                    businessCity === areaNameLower ||
                    businessNeighborhood === areaNameLower ||
                    businessAddress.includes(areaNameLower) ||
                    businessFullAddress.includes(areaNameLower) ||
                    // Also try matching without spaces for compound names
                    businessCity === areaNameLower.replace(/\\s+/g, '') ||
                    businessAddress.includes(areaNameLower.replace(/\\s+/g, '')) ||
                    businessFullAddress.includes(areaNameLower.replace(/\\s+/g, ''))
                );
            });
            
            console.log(\`Found \${filteredClinics.length} clinics in \${areaName}\`);
            
            // Clear container
            clinicsContainer.innerHTML = '';
            
            if (filteredClinics.length === 0) {
                clinicsContainer.innerHTML = \`
                    <div class="col-span-full text-center py-8">
                        <p class="text-gray-500">No clinics found in \${areaName}.</p>
                        <p class="text-gray-400 mt-2">Try searching in nearby areas.</p>
                        <p class="text-gray-300 mt-1 text-xs">Searched \${businessData.length} total businesses</p>
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
            
            // Update page title with count
            const titleElement = document.getElementById('area-title');
            if (titleElement) {
                titleElement.textContent = \`\${areaName} (\${filteredClinics.length} clinic\${filteredClinics.length !== 1 ? 's' : ''})\`;
            }
        }
        
        function createClinicCardSimple(business) {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow';
            
            // Use a more reliable placeholder image
            const imageUrl = (business.photos && business.photos.length > 0 && business.photos[0]) 
                ? business.photos[0] 
                : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNsaW5pYyBJbWFnZTwvdGV4dD48L3N2Zz4=';
            
            const address = business.full_address || business.address || 'Address not available';
            const rating = business.rating ? parseFloat(business.rating).toFixed(1) : 'N/A';
            const reviews = business.reviews_count || business.reviews || 0;
            const phone = business.phone_number || business.phone || 'No phone';
            const website = business.website || business.site || business.url || '';
            
            card.innerHTML = \`
                <div class="h-48 bg-gray-200 overflow-hidden">
                    <img src="\${imageUrl}" alt="\${business.name}" class="w-full h-full object-cover" 
                        onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNsaW5pYyBJbWFnZTwvdGV4dD48L3N2Zz4='; this.onerror=null;">
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
                            
                            const beforeScript = content.substring(0, scriptStart);
                            const afterScript = content.substring(scriptEnd);
                            
                            content = beforeScript + newScript + afterScript;
                        }
                        
                        // Only write if content changed
                        if (content !== originalContent) {
                            fs.writeFileSync(indexPath, content, 'utf8');
                            console.log(`Fixed integration: ${area}/index.html`);
                            fixedCount++;
                        }
                        
                    } catch (error) {
                        console.error(`Error fixing ${area}/index.html:`, error.message);
                    }
                }
            }
        });
        
        console.log(`\nFixed integration for ${fixedCount} area pages successfully!`);
        
    } catch (error) {
        console.error('Error fixing area integration:', error);
    }
}

// Run the fix
console.log('Starting area integration fix...');
fixAreaIntegration(); 