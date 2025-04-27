// Global variables
let allBusinesses = [];
let filteredBusinesses = [];
let businessData = [];

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the site functionality
    initSite();
    
    // Initialize dropdowns
    initDropdowns();
    
    // If on search.html page, load all clinics
    if (window.location.pathname.includes('search.html')) {
        displayAllClinics(window.filteredBusinesses || []);
    }
    
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Initialize the site
function initSite() {
    console.log('Initializing site...');
    // Set up event listeners and initial state
    
    // Initialize dropdowns
    initDropdowns();
    
    // Load business data if we're on a page that needs it
    if (document.getElementById('clinics-container') || 
        document.getElementById('neighborhood-clinics') || 
        document.getElementById('area-clinics')) {
        
        loadBusinessData()
            .then(data => {
                // Store data globally
                window.businessData = data;
                
                // Update UI based on page type
                updateUI(data);
            })
            .catch(error => {
                console.error('Error loading business data:', error);
            });
    }
}

// Initialize dropdown menus
function initDropdowns() {
    // Get all dropdown toggles
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Add click handlers to each dropdown toggle
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find the menu associated with this toggle
            const menu = this.nextElementSibling;
            
            // Toggle the 'visible' class
            if (menu.classList.contains('visible')) {
                menu.classList.remove('visible');
            } else {
                // Close all other dropdowns first
                document.querySelectorAll('.dropdown-menu.visible').forEach(visibleMenu => {
                    if (visibleMenu !== menu) {
                        visibleMenu.classList.remove('visible');
                    }
                });
                
                menu.classList.add('visible');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.visible').forEach(menu => {
                menu.classList.remove('visible');
            });
        }
    });
}

// Load search results from query parameter
function loadSearchResults() {
    console.log('loadSearchResults() called [DEBUG]');
    
    // This function has been removed as part of eliminating search functionality
}

// Display search results based on query
function displaySearchResults(query) {
    console.log('displaySearchResults() called [DEBUG]');
    
    // This function has been removed as part of eliminating search functionality
}

// Fetch business data from JSON file
function fetchBusinessData() {
    return new Promise((resolve, reject) => {
        console.log('Fetching business data... [DEBUG]');
        
        // Check for cached data
        if (window.allBusinesses && window.allBusinesses.length > 0) {
            console.log('Using cached data:', window.allBusinesses.length, 'businesses [DEBUG]');
            resolve(window.allBusinesses);
            return;
        }
        
        // Determine if we're in local development (file:// protocol)
        const isLocalDev = window.location.protocol === 'file:';
        
        // Choose the appropriate path based on environment
        const jsonUrl = isLocalDev 
            ? 'Outscraper-20250423020658xs04_micropigmentation_+1.json' // Relative path for local development
            : '/Outscraper-20250423020658xs04_micropigmentation_+1.json'; // Absolute path for production
        
        console.log('Fetching from URL:', jsonUrl, '[DEBUG]');
        
        // FOR DEBUGGING: Log all scripts on the page
        const scripts = document.querySelectorAll('script');
        console.log('Scripts on page:', scripts.length, '[DEBUG]');
        scripts.forEach((script, index) => {
            console.log(`Script ${index}:`, script.src || 'inline script', '[DEBUG]');
        });
        
        // Fetch the JSON data
        fetch(jsonUrl)
            .then(response => {
                console.log('Fetch response status:', response.status, response.statusText, '[DEBUG]');
                if (!response.ok) {
                    console.error('Network response was not ok:', response.status, response.statusText, '[DEBUG]');
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Received JSON data:', data ? data.length : 'null or empty', 'items [DEBUG]');
                
                // Process the data
                const processedData = processBusinessData(data);
                console.log('Processed data:', processedData.length, 'businesses after filtering [DEBUG]');
                
                // Cache the data
                window.allBusinesses = processedData;
                window.filteredBusinesses = processedData;
                
                // Update UI with the processed data
                updateUI(processedData);
                
                resolve(processedData);
            })
            .catch(error => {
                console.error('Error fetching business data:', error, '[DEBUG]');
                
                // Try relative path as fallback if not already tried
                if (jsonUrl.startsWith('/')) {
                    console.log('Trying relative path as fallback... [DEBUG]');
                    const fallbackUrl = 'Outscraper-20250423020658xs04_micropigmentation_+1.json';
                    console.log('Fallback URL:', fallbackUrl, '[DEBUG]');
                    
                    fetch(fallbackUrl)
                        .then(response => {
                            console.log('Fallback fetch response:', response.status, response.statusText, '[DEBUG]');
                            if (!response.ok) {
                                throw new Error('Fallback fetch failed: ' + response.statusText);
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('Received data from fallback path:', data.length, 'businesses [DEBUG]');
                            const processedData = processBusinessData(data);
                            window.allBusinesses = processedData;
                            window.filteredBusinesses = processedData;
                            
                            // Update UI with the processed data
                            updateUI(processedData);
                            
                            resolve(processedData);
                        })
                        .catch(fallbackError => {
                            console.error('Fallback fetch also failed:', fallbackError, '[DEBUG]');
                            reject(fallbackError);
                        });
                } else {
                    reject(error);
                }
            });
    });
}

// Process the raw business data
function processBusinessData(businessData) {
    console.log('Processing business data, received:', businessData.length, 'items');
    
    // LA County cities and nearby areas
    const laCities = [
        'los angeles', 'long beach', 'santa monica', 'malibu', 'calabasas', 
        'beverly hills', 'west hollywood', 'hollywood', 'culver city', 
        'marina del rey', 'venice', 'pacific palisades', 'brentwood', 
        'bel air', 'encino', 'sherman oaks', 'studio city', 'north hollywood',
        'burbank', 'glendale', 'pasadena', 'arcadia', 'monrovia', 'azusa',
        'covina', 'west covina', 'pomona', 'claremont', 'la verne', 'san dimas',
        'walnut', 'diamond bar', 'rowland heights', 'hacienda heights',
        'whittier', 'la mirada', 'cerritos', 'norwalk', 'downey', 'compton',
        'inglewood', 'hawthorne', 'el segundo', 'manhattan beach', 'hermosa beach',
        'redondo beach', 'torrance', 'palos verdes', 'san pedro', 'wilmington',
        'carson', 'lakewood', 'bellflower', 'paramount', 'south gate',
        'lynwood', 'gardena', 'lawndale', 'lomita', 'rolling hills',
        'montebello', 'pico rivera', 'santa fe springs', 'la puente',
        'alhambra', 'monterey park', 'rosemead', 'el monte', 'south el monte',
        'baldwin park', 'glendora', 'duarte', 'sierra madre', 'san gabriel',
        'temple city', 'altadena', 'la canada flintridge', 'la crescenta-montrose',
        'tujunga', 'sunland', 'sylmar', 'san fernando', 'newhall', 'santa clarita',
        'valencia', 'stevenson ranch', 'canyon country', 'castaic', 'gorman',
        'lancaster', 'palmdale', 'acton', 'agua dulce', 'littlerock'
    ];
    
    // Log filtering steps
    console.log('Filtering permanently closed businesses...');
    
    // Filter out permanently closed businesses
    const activeBusiness = businessData.filter(business => {
        if (business.permanently_closed === true || business.business_status === "CLOSED_PERMANENTLY") {
            console.log('Filtering out permanently closed business:', business.name);
            return false;
        }
        return true;
    });
    
    console.log('After filtering closed businesses, kept:', activeBusiness.length);
    
    // Filter out San Francisco businesses
    console.log('Filtering San Francisco businesses...');
    const nonSFBusinesses = activeBusiness.filter(business => {
        let city = '';
        
        if (business.city) {
            city = business.city.toLowerCase();
        } else if (business.address || business.full_address || business.formatted_address) {
            const address = business.address || business.full_address || business.formatted_address;
            const cityMatch = address ? address.match(/([^,]+),\s*([^,]+),\s*([A-Z]{2})/) : null;
            if (cityMatch && cityMatch[1]) {
                city = cityMatch[1].trim().toLowerCase();
            }
        }
        
        // Check if city is San Francisco
        if (city.includes('san francisco')) {
            console.log('Filtering out San Francisco business:', business.name);
            return false;
        }
        
        return true;
    });
    
    console.log('After filtering SF businesses, kept:', nonSFBusinesses.length);
    
    // Extract neighborhood information
    console.log('Extracting neighborhood information...');
    const processedData = nonSFBusinesses.map(business => {
        // Extract neighborhood from address if not already present
        if (!business.neighborhood && business.address) {
            business.neighborhood = extractNeighborhood(business.address);
        }
        
        return business;
    });
    
    console.log('Processed and enhanced data, final count:', processedData.length);
    
    // Sort businesses by rating (highest first)
    processedData.sort((a, b) => {
        // If both have ratings, compare them
        if (a.rating_value && b.rating_value) {
            return b.rating_value - a.rating_value;
        }
        // If only one has a rating, prioritize the one with rating
        if (a.rating_value) return -1;
        if (b.rating_value) return 1;
        // If neither has ratings, keep original order
        return 0;
    });
    
    // Keep a copy of the complete dataset
    window.allBusinesses = processedData;
    
    // IMPORTANT: Set the filteredBusinesses variable for use throughout the site
    window.filteredBusinesses = processedData;
    console.log('window.filteredBusinesses set with', window.filteredBusinesses.length, 'businesses [DEBUG]');
    
    // Update UI with the processed data
    updateUI(processedData);
    
    return processedData;
}

// Improved neighborhood extraction
function extractNeighborhood(address) {
    if (!address) return "Unknown Area";
    
    // Look for neighborhood patterns in the address
    const parts = address.split(',').map(part => part.trim());
    
    // If we have multiple parts, the second to last is often the city
    if (parts.length >= 2) {
        // Check for city districts or neighborhoods
        const cityPart = parts[parts.length - 2];
        
        // Check for neighborhood patterns like "Downtown Los Angeles" or "North Berkeley"
        const neighborhoodPatterns = [
            /\b(north|south|east|west|downtown|uptown|central|old)\s+\w+/i,
            /\b(heights|hills|park|valley|village|district|vista)\b/i
        ];
        
        for (const pattern of neighborhoodPatterns) {
            const match = cityPart.match(pattern);
            if (match) return match[0];
        }
        
        // If no specific neighborhood, return the city
        return cityPart;
    }
    
    return "Unknown Area";
}

// Update UI with business data
function updateUI(businessData) {
    // Update top clinics section on home page (similar to Top Restaurants)
    updateTopClinics(businessData);
    
    // Update neighborhoods section on home page
    updateNeighborhoodsList(businessData);
    
    // If on neighborhood detail page, update the clinic list for that neighborhood
    if (window.location.pathname.includes('neighborhood.html')) {
        loadNeighborhoodClinics();
    }
    
    // If on neighborhoods.html page, display all clinics
    if (window.location.pathname.includes('neighborhoods.html')) {
        displayAllClinics(businessData);
    }
    
    // If on cuisines page (in our case, services/types), update the service types list
    if (window.location.pathname.includes('services.html')) {
        updateServiceTypesList(businessData);
    }
}

// Update top clinics section (similar to Top Restaurants in Eating Vancouver)
function updateTopClinics(businessData) {
    const topClinicsContainer = document.getElementById('top-clinics-container');
    if (!topClinicsContainer) return;
    
    // Clear loading message
    topClinicsContainer.innerHTML = '';
    
    // Display top 12 clinics by default, now sorted primarily by review count
    displayClinics(businessData.slice(0, 12), topClinicsContainer);
    
    // Log total clinic count and top clinics to console
    console.log(`Total clinics loaded: ${businessData.length}`);
    console.log('Top 12 clinics (by review count):', businessData.slice(0, 12).map(clinic => ({
        name: clinic.name,
        reviews: clinic.standardized_review_count,
        rating: clinic.rating || 0
    })));
}

// Function to display clinics in the specified container
function displayClinics(businesses, container) {
    console.log('displayClinics called with', businesses ? businesses.length : 'null or empty', 'businesses [DEBUG]');
    console.log('Container ID:', container ? container.id : 'container is null', '[DEBUG]');
    
    // Check if container exists
    if (!container) {
        console.error('Container element not found for displaying clinics [DEBUG]');
        return;
    }
    
    // Check if businesses is valid
    if (!businesses || !Array.isArray(businesses)) {
        console.error('Invalid businesses data:', businesses, '[DEBUG]');
        container.innerHTML = '<div class="col-span-full text-center py-8"><p class="text-gray-500">No clinic data available.</p></div>';
        return;
    }
    
    // Clear existing content
    console.log('Clearing container content [DEBUG]');
    container.innerHTML = '';
    
    // Show message if no clinics found
    if (businesses.length === 0) {
        console.log('No clinics found to display [DEBUG]');
        container.innerHTML = '<div class="col-span-full text-center py-8"><p class="text-gray-500">No clinics found in this area.</p></div>';
        return;
    }
    
    console.log('Creating clinic cards for', businesses.length, 'businesses [DEBUG]');
    
    // Create clinic cards for each business
    businesses.forEach((business, index) => {
        console.log(`Creating card ${index + 1} for ${business.name} [DEBUG]`);
        
        // Create clinic card
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition';
        
        // FIX: Ensure valid image URL with proper HTTPS placeholder
        let imageUrl;
        
        if (business.photos && business.photos.length > 0 && business.photos[0] && 
            typeof business.photos[0] === 'string' && business.photos[0].startsWith('http')) {
            // Use the business photo if it's a valid URL
            imageUrl = business.photos[0];
        } else {
            // Use a secure placeholder image
            imageUrl = 'https://via.placeholder.com/400x250?text=SMP+Clinic';
        }
        
        // Format rating if available
        let ratingDisplay = '';
        if (business.rating_value) {
            ratingDisplay = `<div class="text-yellow-500 mb-2">${generateStarRating(business.rating_value)} <span class="text-gray-600">(${business.reviews || '0'})</span></div>`;
        } else {
            ratingDisplay = '<div class="text-gray-400 mb-2">No ratings yet</div>';
        }
        
        // Format address
        const address = business.full_address || business.address || 'Address not available';
        
        // Format phone
        const phone = business.phone_number ? formatPhoneNumber(business.phone_number) : 'No phone listed';
        
        // Set the card HTML with improved image error handling
        card.innerHTML = `
            <div class="h-48 bg-gray-200 overflow-hidden">
                <img src="${imageUrl}" alt="${business.name}" class="w-full h-full object-cover" 
                     onerror="this.src='https://via.placeholder.com/400x250?text=SMP+Clinic'; this.onerror=null;">
            </div>
            <div class="p-5">
                <h3 class="text-xl font-bold mb-2">${business.name}</h3>
                ${ratingDisplay}
                <p class="text-gray-600 mb-3 truncate">${address}</p>
                <div class="flex justify-between items-center">
                    <span class="text-blue-600 font-medium">${phone}</span>
                    <a href="${business.url || '#'}" target="_blank" class="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition">View on Maps</a>
                </div>
            </div>
        `;
        
        // Add the card to the container
        container.appendChild(card);
        console.log(`Card ${index + 1} added to container [DEBUG]`);
    });
    
    console.log('All clinic cards added to container [DEBUG]');
}

// Generate star rating HTML (simplified version for the filter/sort UI)
function generateStarRating(rating) {
    if (!rating) return '<span class="no-rating">No rating</span>';
    
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Add numeric rating
    starsHtml += `<span class="numeric-rating">${rating.toFixed(1)}</span> `;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<span class="star full">★</span>';
    }
    
    // Half star
    if (halfStar) {
        starsHtml += '<span class="star half">★</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<span class="star empty">☆</span>';
    }
    
    return starsHtml;
}

// Format phone number
function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return 'N/A';
    
    // Remove all non-numeric characters
    const cleaned = phoneNumber.toString().replace(/\D/g, '');
    
    // Check if the number has the right length
    if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
        return `(${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 11)}`;
    }
    
    // If the format doesn't match, return the original
    return phoneNumber;
}

// Update neighborhoods list on home page (similar to Hair Restoration Life's city lists)
function updateNeighborhoodsList(businessData) {
    const neighborhoodsContainer = document.getElementById('neighborhoods-container');
    if (!neighborhoodsContainer) return;
    
    // Remove loading message
    const loadingMessage = neighborhoodsContainer.querySelector('#loading-message');
    if (loadingMessage) {
        neighborhoodsContainer.removeChild(loadingMessage);
    }
    
    // Get unique cities/areas
    const cities = {};
    businessData.forEach(business => {
        let city = business.city || '';
        
        if (city && city !== '') {
            if (!cities[city]) {
                cities[city] = 0;
            }
            cities[city]++;
        }
    });
    
    // Sort cities by count
    const citiesList = Object.entries(cities)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    
    // Create a container for the cities
    const citiesContainer = document.createElement('div');
    citiesContainer.className = 'cities-list';
    citiesContainer.style.display = 'flex';
    citiesContainer.style.flexWrap = 'wrap';
    citiesContainer.style.justifyContent = 'center';
    citiesContainer.style.gap = '10px';
    
    // Add cities (only show top 10)
    const topCities = citiesList.slice(0, 10);
    topCities.forEach(city => {
        const cityLink = document.createElement('a');
        // Create URL-friendly city name
        const urlFriendlyCity = city.name.toLowerCase().replace(/\s+/g, '-');
        cityLink.href = `areas/${encodeURIComponent(urlFriendlyCity)}`;
        cityLink.className = 'city-link';
        cityLink.dataset.city = city.name;
        cityLink.style.padding = '8px 16px';
        cityLink.style.backgroundColor = '#f8f8f8';
        cityLink.style.borderRadius = '4px';
        cityLink.style.textDecoration = 'none';
        cityLink.style.color = '#333';
        cityLink.style.fontWeight = 'bold';
        cityLink.style.display = 'inline-block';
        cityLink.textContent = city.name;
        
        citiesContainer.appendChild(cityLink);
    });
    
    neighborhoodsContainer.appendChild(citiesContainer);
    
    // Add a dropdown for all cities (like Hair Restoration Life)
    const dropdownContainer = document.createElement('div');
    dropdownContainer.style.marginTop = '30px';
    dropdownContainer.style.textAlign = 'center';
    
    const dropdownLabel = document.createElement('label');
    dropdownLabel.for = 'city-dropdown';
    dropdownLabel.textContent = 'Select a city: ';
    dropdownLabel.style.fontWeight = 'bold';
    dropdownLabel.style.marginRight = '10px';
    
    const dropdown = document.createElement('select');
    dropdown.id = 'city-dropdown';
    dropdown.style.padding = '8px 16px';
    dropdown.style.borderRadius = '4px';
    dropdown.style.border = '1px solid #ccc';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Cities';
    dropdown.appendChild(defaultOption);
    
    // Add all cities to dropdown
    citiesList.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name;
        option.textContent = city.name;
        dropdown.appendChild(option);
    });
    
    // Add change event to dropdown
    dropdown.addEventListener('change', function() {
        const selectedCity = this.value;
        if (selectedCity === '') {
            // Show all clinics
            window.location.href = 'index.html';
        } else {
            // Go to the city page using the new URL structure
            const urlFriendlyCity = selectedCity.toLowerCase().replace(/\s+/g, '-');
            window.location.href = `areas/${encodeURIComponent(urlFriendlyCity)}`;
        }
    });
    
    dropdownContainer.appendChild(dropdownLabel);
    dropdownContainer.appendChild(dropdown);
    neighborhoodsContainer.appendChild(dropdownContainer);
}

// Filter clinics by city
function filterClinicsByCity(cityName) {
    console.log(`Filtering by city: ${cityName}`);
    
    // Determine which container to use based on the current page
    let clinicsContainer;
    if (window.location.pathname.includes('neighborhoods.html')) {
        clinicsContainer = document.getElementById('neighborhood-clinics-container');
    } else {
        clinicsContainer = document.getElementById('top-clinics-container');
    }
    
    if (!clinicsContainer) return;
    
    // Update heading to show filtered view
    const filterNotice = document.getElementById('filter-notice') || document.createElement('div');
    filterNotice.id = 'filter-notice';
    filterNotice.style.textAlign = 'center';
    filterNotice.style.padding = '10px';
    filterNotice.style.margin = '10px 0';
    filterNotice.style.backgroundColor = '#f0f8ff';
    filterNotice.style.borderRadius = '4px';
    filterNotice.style.fontWeight = 'bold';
    filterNotice.innerHTML = `
        <p>Showing clinics in <span style="color: #4F46E5;">${cityName}</span></p>
        <button id="reset-filter" style="background-color: #4F46E5; color: white; padding: 4px 8px; border: none; border-radius: 4px; margin-top: 5px; cursor: pointer;">View All Locations</button>
    `;
    
    // Add the filter notice if it doesn't exist yet
    if (!document.getElementById('filter-notice')) {
        clinicsContainer.prepend(filterNotice);
    }
    
    // Add click event to reset button
    setTimeout(() => {
        const resetButton = document.getElementById('reset-filter');
        if (resetButton) {
            resetButton.addEventListener('click', resetClinicFilters);
        }
    }, 0);
    
    // Filter the clinics by the selected city
    const filteredClinics = window.filteredBusinesses.filter(clinic => {
        let clinicCity = '';
        
        // Try to extract city from various fields
        if (clinic.city) {
            clinicCity = clinic.city;
        } else if (clinic.address || clinic.full_address || clinic.formatted_address) {
            const address = clinic.address || clinic.full_address || clinic.formatted_address;
            const cityMatch = address ? address.match(/([^,]+),\s*([^,]+),\s*([A-Z]{2})/) : null;
            if (cityMatch && cityMatch[1]) {
                clinicCity = cityMatch[1].trim();
            }
        }
        
        return clinicCity === cityName;
    });
    
    // Display the filtered clinics
    displayClinics(filteredClinics, clinicsContainer);
    
    // Update the city dropdown to match the selected city
    const dropdown = document.getElementById('city-dropdown');
    if (dropdown) {
        dropdown.value = cityName;
    }
    
    // Highlight the selected city link
    document.querySelectorAll('.city-link').forEach(link => {
        if (link.dataset.city === cityName) {
            link.style.backgroundColor = '#4F46E5';
            link.style.color = 'white';
        } else {
            link.style.backgroundColor = '#f8f8f8';
            link.style.color = '#333';
        }
    });
}

// Reset clinic filters to show all clinics
function resetClinicFilters() {
    console.log('Resetting filters');
    
    // Remove the filter notice
    const filterNotice = document.getElementById('filter-notice');
    if (filterNotice) {
        filterNotice.remove();
    }
    
    // Reset the dropdown
    const dropdown = document.getElementById('city-dropdown');
    if (dropdown) {
        dropdown.value = '';
    }
    
    // Reset city link styles
    document.querySelectorAll('.city-link').forEach(link => {
        link.style.backgroundColor = '#f8f8f8';
        link.style.color = '#333';
    });
    
    // Determine which container to use and refresh content
    if (window.location.pathname.includes('neighborhoods.html')) {
        const clinicsContainer = document.getElementById('neighborhood-clinics-container');
        if (clinicsContainer) {
            displayClinics(window.filteredBusinesses.slice(0, 15), clinicsContainer);
        }
    } else {
        const clinicsContainer = document.getElementById('top-clinics-container');
        if (clinicsContainer) {
            displayClinics(window.filteredBusinesses.slice(0, 12), clinicsContainer);
        }
    }
}

// Load clinics for a specific neighborhood
function loadNeighborhoodClinics() {
    console.log('loadNeighborhoodClinics called [DEBUG]');
    
    // Extract the area name from the URL path instead of a query parameter
    let areaName = '';
    
    // Handle different protocols and development environments
    const isLocalDev = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    console.log('Is local development:', isLocalDev, '[DEBUG]');
    console.log('Full pathname:', window.location.pathname, '[DEBUG]');
    
    // Check if we're on an area page (both 'areas' and 'area' paths)
    if (window.location.pathname.includes('/areas/') || window.location.pathname.includes('/area/')) {
        // Extract the area name from the path
        const pathParts = window.location.pathname.split('/').filter(p => p.length > 0);
        console.log('Path parts:', pathParts, '[DEBUG]');
        
        // Find the index of either 'areas' or 'area' in the path
        const areasIndex = pathParts.findIndex(part => part === 'areas' || part === 'area');
        console.log('Areas index:', areasIndex, '[DEBUG]');
        
        if (areasIndex > -1 && areasIndex + 1 < pathParts.length) {
            areaName = decodeURIComponent(pathParts[areasIndex + 1]);
            // In case there's an index.html at the end, remove it
            areaName = areaName.replace(/\/index\.html$/, '').replace(/\.html$/, '');
            // Convert hyphenated format back to spaces
            areaName = areaName.replace(/-/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase());
            console.log('Extracted area name from path:', areaName, '[DEBUG]');
        }
    } else {
        // Fallback to the old method using query parameters
        const urlParams = new URLSearchParams(window.location.search);
        areaName = urlParams.get('name');
        console.log('Area name from query parameter:', areaName, '[DEBUG]');
    }
    
    if (!areaName) {
        console.log('No area name found, redirecting to home [DEBUG]');
        // In local development, redirect to index.html instead of /
        if (isLocalDev) {
            window.location.href = 'index.html';
        } else {
            window.location.href = '/';
        }
        return;
    }
    
    // Update page title with area name
    const pageTitle = document.getElementById('neighborhood-title') || document.getElementById('area-title');
    if (pageTitle) {
        pageTitle.textContent = areaName;
        console.log('Updated page title to:', areaName, '[DEBUG]');
    }
    
    // Wait for business data to load if needed
    if (!window.filteredBusinesses || window.filteredBusinesses.length === 0) {
        console.log('No filtered businesses found, fetching data first [DEBUG]');
        
        fetchBusinessData()
            .then(data => {
                console.log('Data fetched, filtering for area:', areaName, '[DEBUG]');
                filterAndDisplayAreaClinics(areaName);
            })
            .catch(error => {
                console.error('Failed to load business data for area:', error, '[DEBUG]');
            });
    } else {
        console.log('Using existing filtered businesses data [DEBUG]');
        filterAndDisplayAreaClinics(areaName);
    }
}

// Helper function to filter and display clinics for an area
function filterAndDisplayAreaClinics(areaName) {
    console.log('Filtering clinics for area:', areaName, '[DEBUG]');
    console.log('Total businesses before filtering:', window.filteredBusinesses.length, '[DEBUG]');
    
    // Improved matching to handle more flexible naming
    const areaNameLower = areaName.toLowerCase();
    const clinics = window.filteredBusinesses.filter(business => {
        // Direct match with city or neighborhood
        if ((business.city && business.city.toLowerCase() === areaNameLower) || 
            (business.neighborhood && business.neighborhood.toLowerCase() === areaNameLower)) {
            return true;
        }
        
        // Check if the address contains the area name
        if (business.address && business.address.toLowerCase().includes(areaNameLower)) {
            return true;
        }
        
        // Check full_address as well if available
        if (business.full_address && business.full_address.toLowerCase().includes(areaNameLower)) {
            return true;
        }
        
        return false;
    });
    
    console.log('Found', clinics.length, 'clinics for', areaName, '[DEBUG]');
    
    // Display clinics
    const clinicsContainer = document.getElementById('neighborhood-clinics') || document.getElementById('area-clinics');
    if (clinicsContainer) {
        console.log('Found clinics container with ID:', clinicsContainer.id, '[DEBUG]');
        
        if (clinics.length === 0) {
            clinicsContainer.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-500">No clinics found in ${areaName}.</p>
                </div>
            `;
            console.log('No clinics found for this area [DEBUG]');
        } else {
            // Use the displayClinics function instead of creating cards manually
            displayClinics(clinics, clinicsContainer);
        }
    } else {
        console.error('Could not find clinics container! [DEBUG]');
    }
}

// Update service types list (similar to Eating Vancouver's cuisines)
function updateServiceTypesList(businessData) {
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;
    
    // Define service types (equivalent to cuisines in Eating Vancouver)
    const serviceTypes = [
        'Scalp Micropigmentation',
        'Hair Restoration',
        'Hair Transplant',
        'Hair Loss Treatment',
        'Micropigmentation',
        'Permanent Makeup',
        'Cosmetic Tattoo',
        'Beauty Salon',
        'Medical Spa',
        'Consultation'
    ];
    
    // Create a count of businesses per service type
    // This is a simplification since we don't have actual service type data
    // In a real implementation, you would extract this from business data
    const serviceCounts = {};
    serviceTypes.forEach(type => {
        // Simulate count based on business name or description containing keywords
        serviceCounts[type] = businessData.filter(business => 
            (business.name && business.name.toLowerCase().includes(type.toLowerCase())) ||
            (business.description && business.description.toLowerCase().includes(type.toLowerCase()))
        ).length;
    });
    
    // Convert to array and sort by count (descending)
    const servicesList = Object.entries(serviceCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    
    // Create the HTML structure
    const listHTML = document.createElement('div');
    listHTML.className = 'services-list';
    
    // Add heading
    const heading = document.createElement('h2');
    heading.textContent = 'All Services';
    heading.className = 'section-heading';
    listHTML.appendChild(heading);
    
    // Add description
    const description = document.createElement('p');
    description.textContent = 'Browse clinics by service type, sorted by popularity';
    description.className = 'section-description';
    listHTML.appendChild(description);
    
    // Add service types
    servicesList.forEach(service => {
        if (service.count > 0) {
            const item = document.createElement('a');
            item.href = `service.html?type=${encodeURIComponent(service.name)}`;
            item.className = 'service-item';
            item.innerHTML = `
                <span class="name">${service.name}</span>
                <span class="count">${service.count} clinic${service.count !== 1 ? 's' : ''}</span>
            `;
            listHTML.appendChild(item);
        }
    });
    
    servicesContainer.appendChild(listHTML);
}

// Populate the areas dropdown in the navigation menu
function populateAreasDropdown(businessData) {
    // Get the areas dropdown element
    const areasDropdown = document.getElementById('areas-dropdown');
    if (!areasDropdown) return;
    
    // Clear any existing content
    areasDropdown.innerHTML = '';
    
    // Get all unique cities from the business data
    const cities = {};
    businessData.forEach(business => {
        if (business.city && business.city !== 'Unknown Area') {
            cities[business.city] = (cities[business.city] || 0) + 1;
        }
    });
    
    // Sort cities by count (descending) then alphabetically
    const sortedCities = Object.keys(cities).sort((a, b) => {
        // First sort by count (descending)
        if (cities[b] !== cities[a]) {
            return cities[b] - cities[a];
        }
        // If counts are equal, sort alphabetically
        return a.localeCompare(b);
    });
    
    // Check if we're on the neighborhoods page or areas page
    const isAreasPage = window.location.pathname.includes('neighborhoods') || 
                        window.location.pathname.includes('areas/') ||
                        window.location.pathname.includes('area/');
    
    // Determine the base path
    const basePath = isAreasPage ? '../' : '';
    
    // Check if we're in local development mode (file:// protocol)
    const isLocalDev = window.location.protocol === 'file:';
    
    // Add a link for each city
    sortedCities.forEach(city => {
        const link = document.createElement('a');
        const urlFriendlyCity = city.toLowerCase().replace(/\s+/g, '-');
        
        // Add .html extension for local development
        if (isLocalDev) {
            link.href = `${basePath}areas/${encodeURIComponent(urlFriendlyCity)}/index.html`;
        } else {
            link.href = `${basePath}areas/${encodeURIComponent(urlFriendlyCity)}/`;
        }
        
        link.textContent = city;
        areasDropdown.appendChild(link);
    });
}

// Display all clinics on the neighborhoods page
function displayAllClinics(businessData) {
    const clinicsContainer = document.getElementById('neighborhood-clinics-container');
    if (!clinicsContainer) return;
    
    // Clear container
    clinicsContainer.innerHTML = '';
    
    // Display clinics
    displayClinics(businessData.slice(0, 15), clinicsContainer);
    
    // Also populate the neighborhood map container
    populateNeighborhoodMap(businessData);
}

// Populate the neighborhood map container with areas
function populateNeighborhoodMap(businessData) {
    const mapContainer = document.getElementById('neighborhood-map-container');
    if (!mapContainer) return;
    
    // Clear the container
    mapContainer.innerHTML = '';
    
    // Get all unique neighborhoods and count occurrences
    const neighborhoods = {};
    
    businessData.forEach(business => {
        // Check for city field
        if (business.city && business.city !== 'Unknown Area') {
            neighborhoods[business.city] = (neighborhoods[business.city] || 0) + 1;
        }
        
        // Check for neighborhood field
        if (business.neighborhood && business.neighborhood !== 'Unknown Area') {
            neighborhoods[business.neighborhood] = (neighborhoods[business.neighborhood] || 0) + 1;
        }
    });
    
    // Convert to array and sort
    const sortedNeighborhoods = Object.keys(neighborhoods).sort((a, b) => {
        // First sort by count (descending)
        if (neighborhoods[b] !== neighborhoods[a]) {
            return neighborhoods[b] - neighborhoods[a];
        }
        // If counts are equal, sort alphabetically
        return a.localeCompare(b);
    });
    
    // Check if we're in local development mode (file:// protocol)
    const isLocalDev = window.location.protocol === 'file:';
    
    // Create links for each neighborhood
    sortedNeighborhoods.forEach(neighborhood => {
        const urlFriendlyName = neighborhood.toLowerCase().replace(/\s+/g, '-');
        const link = document.createElement('a');
        
        // Add .html extension for local development
        if (isLocalDev) {
            link.href = `areas/${encodeURIComponent(urlFriendlyName)}/index.html`;
        } else {
            link.href = `areas/${encodeURIComponent(urlFriendlyName)}/`;
        }
        
        link.className = 'block px-4 py-2 bg-white hover:bg-blue-50 border border-gray-300 rounded-lg transition';
        link.innerHTML = `
            <span class="font-medium">${neighborhood}</span>
            <span class="text-gray-500 text-sm ml-2">(${neighborhoods[neighborhood]} clinics)</span>
        `;
        mapContainer.appendChild(link);
    });
}

// Load business data from JSON file
async function loadBusinessData() {
    try {
        const response = await fetch('data/businesses.json');
        if (!response.ok) {
            throw new Error('Failed to load business data');
        }
        businessData = await response.json();
        
        // Initialize page elements after data is loaded
        initializePage();
    } catch (error) {
        console.error('Error loading business data:', error);
        document.querySelector('.loading-text').textContent = 'Error loading data. Please try again later.';
    }
}

// Initialize page elements
function initializePage() {
    // Check if we're on a specific page type
    const currentPath = window.location.pathname;
    
    if (currentPath === '/' || currentPath === '/index.html') {
        // Home page
        displayAllClinics();
        populateAreasDropdown();
        populateAreaMap();
    } else if (currentPath.includes('/areas/')) {
        // Area specific page
        loadAreaClinics();
    }
    
    // Initialize service filter
    initializeServiceFilter();
}

// Display all clinics on the home page
function displayAllClinics() {
    const clinicsContainer = document.querySelector('.clinic-cards');
    if (!clinicsContainer) return;
    
    // Clear loading text
    clinicsContainer.innerHTML = '';
    
    // Debug data
    console.log("Total businesses:", businessData.length);
    
    // Sort businesses by review count first, then by rating
    const sortedBusinesses = [...businessData].sort((a, b) => {
        // Get review counts, handling various field names and formats
        const reviewsA = parseInt(a.reviews_count) || parseInt(a.reviews) || 0;
        const reviewsB = parseInt(b.reviews_count) || parseInt(b.reviews) || 0;
        
        // First sort by review count (descending)
        if (reviewsB !== reviewsA) {
            return reviewsB - reviewsA;
        }
        
        // If review counts are the same, sort by rating (descending)
        const ratingA = parseFloat(a.rating) || parseFloat(a.rating_value) || 0;
        const ratingB = parseFloat(b.rating) || parseFloat(b.rating_value) || 0;
        return ratingB - ratingA;
    });
    
    // Log top clinics for debugging
    console.log("Top 12 businesses by review count:", sortedBusinesses.slice(0, 12).map(business => ({
        name: business.name,
        reviews: parseInt(business.reviews_count) || parseInt(business.reviews) || 0,
        rating: parseFloat(business.rating) || parseFloat(business.rating_value) || 0
    })));
    
    // Display top 12 businesses
    const topBusinesses = sortedBusinesses.slice(0, 12);
    
    topBusinesses.forEach(business => {
        createClinicCard(business, clinicsContainer);
    });
}

// Create a clinic card HTML element
function createClinicCard(business, container) {
    const card = document.createElement('div');
    card.className = 'clinic-card';
    
    // Format address
    const addressParts = [
        business.address || '',
        business.city || '',
        business.state || '',
        business.zip_code || ''
    ].filter(Boolean);
    
    const formattedAddress = addressParts.join(', ');
    
    // Format services
    const services = getBusinessServices(business);
    
    // Debug rating value and other important fields
    console.log("Business data:", {
        name: business.name,
        rating: business.rating,
        rating_value: business.rating_value,
        reviews: business.reviews,
        reviews_count: business.reviews_count,
        phone: business.phone,
        phone_number: business.phone_number,
        site: business.site,
        url: business.url,
        website: business.website
    });
    
    // If rating is not available or is NaN, use rating_value or default to 0
    const ratingValue = parseFloat(business.rating) || 0;
    const reviewsCount = parseInt(business.reviews) || 0;
    
    // Format phone number
    const phoneNumber = business.phone || business.phone_number || 'N/A';
    const formattedPhone = phoneNumber !== 'N/A' ? formatPhoneNumber(phoneNumber) : 'N/A';
    
    // Get website URL
    const websiteUrl = business.site || business.website || business.url || '#';
    
    const starRating = createStarRating(ratingValue);
    
    card.innerHTML = `
        <div class="clinic-image" style="background-image: url(${business.image_url || business.photo || business.photos && business.photos[0] || 'img/default-clinic.jpg'})"></div>
        <div class="clinic-info">
            <h3>${business.name}</h3>
            <div class="clinic-rating">
                <div class="stars">${starRating}</div>
                <span>${ratingValue.toFixed(1) !== '0.0' ? ratingValue.toFixed(1) : 'N/A'} (${reviewsCount} reviews)</span>
            </div>
            <div class="clinic-address">${formattedAddress || business.full_address || 'Address not available'}</div>
            <div class="clinic-contact">
                <div class="clinic-phone">${formattedPhone}</div>
                ${websiteUrl !== '#' ? `<div class="clinic-website"><a href="${websiteUrl}" target="_blank">Website</a></div>` : ''}
            </div>
            <div class="clinic-services">
                ${services.map(service => `<span class="clinic-service">${service}</span>`).join('')}
            </div>
        </div>
    `;
    
    container.appendChild(card);
}

// Extract services from business data
function getBusinessServices(business) {
    const services = [];
    
    // Check business name and description for services
    const textToCheck = (business.name + ' ' + (business.description || '')).toLowerCase();
    
    // Define common SMP services
    const serviceKeywords = [
        'scalp micropigmentation',
        'smp',
        'hair tattoo',
        'scalp tattoo',
        'hair density',
        'hairline restoration',
        'scar concealment'
    ];
    
    serviceKeywords.forEach(service => {
        if (textToCheck.includes(service.toLowerCase())) {
            // Capitalize first letter of each word
            const formattedService = service.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            if (!services.includes(formattedService)) {
                services.push(formattedService);
            }
        }
    });
    
    // If no services found, add a default
    if (services.length === 0) {
        services.push('Scalp Micropigmentation');
    }
    
    return services;
}

// Create star rating HTML
function createStarRating(rating) {
    // Round rating to nearest half star
    const roundedRating = Math.round(rating * 2) / 2;
    let stars = '';
    
    // Add full stars
    for (let i = 1; i <= Math.floor(roundedRating); i++) {
        stars += '★';
    }
    
    // Add half star if needed
    if (roundedRating % 1 !== 0) {
        stars += '★';
    }
    
    // Add empty stars to make 5 stars total
    const emptyStars = 5 - Math.ceil(roundedRating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return stars;
}

// Populate area map
function populateAreaMap() {
    const areaMap = document.querySelector('.areas-map');
    if (!areaMap) return;
    
    // Clear existing items
    areaMap.innerHTML = '';
    
    // Count occurrences of each city
    const cityCount = {};
    
    businessData.forEach(business => {
        const city = business.city;
        if (city && city !== 'Unknown Area') {
            cityCount[city] = (cityCount[city] || 0) + 1;
        }
    });
    
    // Convert to array and sort by count (descending)
    const sortedCities = Object.keys(cityCount)
        .map(city => ({ name: city, count: cityCount[city] }))
        .sort((a, b) => {
            // Sort by count (descending), then alphabetically
            if (b.count !== a.count) {
                return b.count - a.count;
            }
            return a.name.localeCompare(b.name);
        });
    
    // Add top 20 cities to area map
    sortedCities.slice(0, 20).forEach(city => {
        const urlFriendlyName = generateUrlFriendlyName(city.name);
        const link = document.createElement('a');
        link.href = `areas/${urlFriendlyName}`;
        link.className = 'area-link';
        link.innerHTML = `${city.name} <span class="area-count">${city.count}</span>`;
        areaMap.appendChild(link);
    });
}

// Load area-specific clinics
function loadAreaClinics() {
    // Extract area name from URL
    const pathname = window.location.pathname;
    const match = pathname.match(/\/areas\/([^\/]+)/i);
    
    if (!match) return;
    
    const areaSlug = match[1];
    const areaName = decodeUrlFriendlyName(areaSlug);
    
    console.log("Loading area clinics for:", areaName);
    
    // Update page title
    updatePageTitle(areaName);
    
    if (!businessData || businessData.length === 0) {
        console.log("No business data available, fetching...");
        fetchBusinessData()
            .then(data => {
                filterAndDisplayAreaBusinesses(areaName, data);
            })
            .catch(error => {
                console.error("Error fetching business data:", error);
            });
        return;
    }
    
    filterAndDisplayAreaBusinesses(areaName, businessData);
}

// Helper function to filter and display businesses for an area
function filterAndDisplayAreaBusinesses(areaName, businesses) {
    // Filter businesses by area
    const filteredBusinesses = businesses.filter(business => {
        // Check if business city or neighborhood matches the area name
        const areaNameLower = areaName.toLowerCase();
        return (
            (business.city && business.city.toLowerCase() === areaNameLower) ||
            (business.neighborhood && business.neighborhood.toLowerCase() === areaNameLower) ||
            (business.address && business.address.toLowerCase().includes(areaNameLower)) ||
            (business.full_address && business.full_address.toLowerCase().includes(areaNameLower))
        );
    });
    
    // Update clinic count
    updateClinicCount(filteredBusinesses.length, areaName);
    
    // Display filtered clinics
    const clinicsContainer = document.querySelector('.clinic-cards');
    if (!clinicsContainer) return;
    
    // Clear loading text
    clinicsContainer.innerHTML = '';
    
    if (filteredBusinesses.length === 0) {
        clinicsContainer.innerHTML = `<p class="loading-text">No SMP clinics found in ${areaName}. Try another area nearby.</p>`;
        return;
    }
    
    // Sort businesses by rating (highest first)
    const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
        // Get rating values, handling various field names and formats
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        
        // Sort by rating desc
        return ratingB - ratingA;
    });
    
    console.log(`Displaying ${sortedBusinesses.length} clinics for ${areaName}`);
    
    sortedBusinesses.forEach(business => {
        createClinicCard(business, clinicsContainer);
    });
}

// Update page title for area pages
function updatePageTitle(areaName) {
    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleElement.textContent = `SMP Clinics in ${areaName} | Hair Tattoo Directory`;
    }
    
    const pageTitle = document.querySelector('.area-hero h1');
    if (pageTitle) {
        pageTitle.textContent = `SMP Clinics in ${areaName}`;
    }
}

// Update clinic count display
function updateClinicCount(count, areaName) {
    const countElement = document.querySelector('.area-hero p');
    if (countElement) {
        const clinicText = count === 1 ? 'clinic' : 'clinics';
        countElement.textContent = `${count} scalp micropigmentation ${clinicText} found in ${areaName}`;
    }
}

// Initialize service filter
function initializeServiceFilter() {
    const serviceFilter = document.querySelector('.service-filter select');
    if (!serviceFilter) return;
    
    // Populate service options
    populateServiceOptions(serviceFilter);
    
    // Add event listener
    serviceFilter.addEventListener('change', function() {
        const selectedService = this.value;
        filterClinicsByService(selectedService);
    });
}

// Populate service filter options
function populateServiceOptions(selectElement) {
    // Define common SMP services
    const services = [
        'All Services',
        'Scalp Micropigmentation',
        'Hair Density',
        'Hairline Restoration',
        'Scar Concealment'
    ];
    
    // Add options to select element
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service === 'All Services' ? '' : service;
        option.textContent = service;
        selectElement.appendChild(option);
    });
}

// Filter clinics by service
function filterClinicsByService(service) {
    const clinicsContainer = document.querySelector('.clinic-cards');
    if (!clinicsContainer) return;
    
    // If no service selected, show all relevant clinics
    if (!service) {
        const pathname = window.location.pathname;
        
        if (pathname === '/' || pathname === '/index.html') {
            // Home page - show top 12
            displayAllClinics();
        } else if (pathname.includes('/areas/')) {
            // Area page - reload area clinics
            loadAreaClinics();
        }
        
        return;
    }
    
    // Filter businesses by service
    const filteredBusinesses = businessData.filter(business => {
        const services = getBusinessServices(business);
        return services.includes(service);
    });
    
    // Apply additional area filter if on area page
    let businessesToShow = filteredBusinesses;
    
    const pathname = window.location.pathname;
    if (pathname.includes('/areas/')) {
        const match = pathname.match(/\/areas\/([^\/]+)/i);
        if (match) {
            const areaSlug = match[1];
            const areaName = decodeUrlFriendlyName(areaSlug);
            
            businessesToShow = filteredBusinesses.filter(business => {
                return (
                    (business.city && business.city.toLowerCase() === areaName.toLowerCase()) ||
                    (business.neighborhood && business.neighborhood.toLowerCase() === areaName.toLowerCase()) ||
                    (business.address && business.address.toLowerCase().includes(areaName.toLowerCase()))
                );
            });
        }
    }
    
    // Clear container
    clinicsContainer.innerHTML = '';
    
    if (businessesToShow.length === 0) {
        clinicsContainer.innerHTML = `<p class="loading-text">No clinics found offering "${service}". Please try another service.</p>`;
        return;
    }
    
    // Sort and display filtered businesses
    const sortedBusinesses = [...businessesToShow].sort((a, b) => b.rating - a.rating);
    
    // Limit to top 12 on home page
    const businessesToDisplay = pathname === '/' || pathname === '/index.html' 
        ? sortedBusinesses.slice(0, 12) 
        : sortedBusinesses;
    
    businessesToDisplay.forEach(business => {
        createClinicCard(business, clinicsContainer);
    });
}

// Generate URL-friendly name
function generateUrlFriendlyName(name) {
    if (!name) return '';
    return name.trim().toLowerCase().replace(/\s+/g, '-');
}

// Decode URL-friendly name back to normal text
function decodeUrlFriendlyName(slug) {
    if (!slug) return '';
    return slug.replace(/-/g, ' ')
        .replace(/\b\w/g, letter => letter.toUpperCase()); // Capitalize first letter of each word
}