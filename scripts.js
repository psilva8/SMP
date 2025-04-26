// Global variables
let allBusinesses = [];
let filteredBusinesses = [];

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    fetchBusinessData();
    
    // If on search.html page, load all clinics
    if (window.location.pathname.includes('search.html')) {
        displayAllClinics(window.filteredBusinesses || []);
    }
});

// Handle search functionality
function handleSearch() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    if (searchButton && searchInput) {
        // Create the suggestions container 
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'search-suggestions';
        suggestionsContainer.style.position = 'absolute';
        suggestionsContainer.style.zIndex = '1000';
        suggestionsContainer.style.backgroundColor = 'white';
        suggestionsContainer.style.width = '100%';
        suggestionsContainer.style.maxHeight = '300px';
        suggestionsContainer.style.overflowY = 'auto';
        suggestionsContainer.style.borderRadius = '0 0 5px 5px';
        suggestionsContainer.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        suggestionsContainer.style.display = 'none';
        
        // Insert suggestions container right after search input
        if (searchInput.parentNode) {
            // Make parent position relative to contain absolute-positioned dropdown
            searchInput.parentNode.style.position = 'relative';
            searchInput.parentNode.appendChild(suggestionsContainer);
        }
        
        // Perform the search
        const performSearch = (query) => {
            if (query.trim()) {
                // Track the search query
                trackSearch(query);
                
                // Update URL with search query
                const currentUrl = new URL(window.location.href);
                
                // If we're already on the search page, just update the URL
                if (window.location.pathname.includes('search.html')) {
                    currentUrl.searchParams.set('q', query);
                    
                    // Update URL without reloading the page
                    window.history.pushState({ query }, '', currentUrl.toString());
                    
                    // Manually trigger search results display
                    displaySearchResults(query);
                } else {
                    // Navigate to search page with query
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            }
        };
        
        // Add click handler to search button
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            performSearch(query);
        });
        
        // Function to generate and display search suggestions
        const updateSuggestions = () => {
            const query = searchInput.value.trim().toLowerCase();
            if (query.length < 2) {
                suggestionsContainer.style.display = 'none';
                return;
            }
            
            // Wait for businesses to load
            if (!window.filteredBusinesses || window.filteredBusinesses.length === 0) {
                return;
            }
            
            // Find matching business names, cities, and neighborhoods
            const nameMatches = [];
            const cityMatches = new Set();
            const neighborhoodMatches = new Set();
            
            window.filteredBusinesses.forEach(business => {
                // Check business name
                if (business.name && business.name.toLowerCase().includes(query)) {
                    nameMatches.push(business.name);
                }
                
                // Check city
                if (business.city && business.city.toLowerCase().includes(query)) {
                    cityMatches.add(business.city);
                }
                
                // Check neighborhood
                if (business.neighborhood && business.neighborhood.toLowerCase().includes(query)) {
                    neighborhoodMatches.add(business.neighborhood);
                }
            });
            
            // Get popular search terms from analytics that match the query
            const popularSearches = [];
            if (Object.keys(searchAnalytics).length > 0) {
                // Sort by count (highest first) and filter to those containing the query
                const sortedAnalytics = Object.entries(searchAnalytics)
                    .filter(([term]) => term.includes(query) && term !== query) // exclude exact match
                    .sort((a, b) => b[1].count - a[1].count)
                    .slice(0, 3); // top 3 popular searches
                
                popularSearches.push(...sortedAnalytics.map(([term]) => term));
            }
            
            // Limit to top 5 business names
            const topNameMatches = [...new Set(nameMatches)].slice(0, 5);
            
            // Prepare all suggestions
            const allSuggestions = [
                ...popularSearches,
                ...topNameMatches,
                ...[...cityMatches].slice(0, 3).map(city => `${city} SMP`),
                ...[...neighborhoodMatches].slice(0, 3).map(neighborhood => `${neighborhood} hair tattoo`)
            ];
            
            // Get unique suggestions (no duplicates)
            const uniqueSuggestions = [...new Set(allSuggestions)].slice(0, 10);
            
            // Display suggestions
            if (uniqueSuggestions.length > 0) {
                suggestionsContainer.innerHTML = '';
                
                uniqueSuggestions.forEach(suggestion => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.textContent = suggestion;
                    suggestionItem.style.padding = '10px 15px';
                    suggestionItem.style.borderBottom = '1px solid #eee';
                    suggestionItem.style.cursor = 'pointer';
                    
                    // Add "Popular" badge for suggestions from analytics
                    if (popularSearches.includes(suggestion)) {
                        const popularBadge = document.createElement('span');
                        popularBadge.textContent = 'Popular';
                        popularBadge.style.fontSize = '10px';
                        popularBadge.style.backgroundColor = '#4F46E5';
                        popularBadge.style.color = 'white';
                        popularBadge.style.padding = '2px 5px';
                        popularBadge.style.borderRadius = '3px';
                        popularBadge.style.marginLeft = '8px';
                        suggestionItem.appendChild(popularBadge);
                    }
                    
                    // Highlight the matching part
                    const matchIndex = suggestion.toLowerCase().indexOf(query);
                    if (matchIndex >= 0) {
                        const matchEnd = matchIndex + query.length;
                        const beforeMatch = suggestion.substring(0, matchIndex);
                        const matchText = suggestion.substring(matchIndex, matchEnd);
                        const afterMatch = suggestion.substring(matchEnd);
                        
                        suggestionItem.innerHTML = 
                            beforeMatch +
                            `<strong>${matchText}</strong>` +
                            afterMatch;
                        
                        // Re-add the badge if it was a popular search
                        if (popularSearches.includes(suggestion)) {
                            const popularBadge = document.createElement('span');
                            popularBadge.textContent = 'Popular';
                            popularBadge.style.fontSize = '10px';
                            popularBadge.style.backgroundColor = '#4F46E5';
                            popularBadge.style.color = 'white';
                            popularBadge.style.padding = '2px 5px';
                            popularBadge.style.borderRadius = '3px';
                            popularBadge.style.marginLeft = '8px';
                            suggestionItem.appendChild(popularBadge);
                        }
                    }
                    
                    // Click handler for suggestion
                    suggestionItem.addEventListener('click', () => {
                        searchInput.value = suggestion;
                        suggestionsContainer.style.display = 'none';
                        performSearch(suggestion);
                    });
                    
                    // Hover effect
                    suggestionItem.addEventListener('mouseenter', () => {
                        suggestionItem.style.backgroundColor = '#f0f0f0';
                    });
                    
                    suggestionItem.addEventListener('mouseleave', () => {
                        suggestionItem.style.backgroundColor = '';
                    });
                    
                    suggestionsContainer.appendChild(suggestionItem);
                });
                
                suggestionsContainer.style.display = 'block';
            } else {
                suggestionsContainer.style.display = 'none';
            }
        };
        
        // Add input handler for suggestions
        searchInput.addEventListener('input', updateSuggestions);
        
        // Add focus handler
        searchInput.addEventListener('focus', updateSuggestions);
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== searchInput && e.target !== suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
        });
        
        // Handle keyboard navigation in suggestions
        searchInput.addEventListener('keydown', function(e) {
            const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
            const isVisible = suggestionsContainer.style.display === 'block';
            
            // Currently focused suggestion index
            let focusedIndex = Array.from(suggestions).findIndex(
                item => item === document.activeElement
            );
            
            switch (e.key) {
                case 'ArrowDown':
                    if (isVisible) {
                        e.preventDefault();
                        if (focusedIndex < 0) {
                            // Focus first suggestion
                            suggestions[0]?.focus();
                        } else if (focusedIndex < suggestions.length - 1) {
                            // Focus next suggestion
                            suggestions[focusedIndex + 1].focus();
                        }
                    }
                    break;
                    
                case 'ArrowUp':
                    if (isVisible) {
                        e.preventDefault();
                        if (focusedIndex > 0) {
                            // Focus previous suggestion
                            suggestions[focusedIndex - 1].focus();
                        } else if (focusedIndex === 0) {
                            // Back to search input
                            searchInput.focus();
                        }
                    }
                    break;
                    
                case 'Escape':
                    suggestionsContainer.style.display = 'none';
                    break;
                    
                case 'Enter':
                    if (isVisible && focusedIndex >= 0) {
                        e.preventDefault();
                        // Use the focused suggestion
                        searchInput.value = suggestions[focusedIndex].textContent;
                        suggestionsContainer.style.display = 'none';
                        performSearch(searchInput.value);
                    } else if (searchInput.value.trim()) {
                        // Normal search with input value
                        performSearch(searchInput.value);
                    }
                    break;
            }
        });
        
        // Make suggestion items focusable
        const makeItemsFocusable = () => {
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.setAttribute('tabindex', '0');
            });
        };
        
        // Setup mutation observer to make new suggestion items focusable
        const observer = new MutationObserver(makeItemsFocusable);
        observer.observe(suggestionsContainer, { childList: true });
    }
}

// Load search results on the search page
function loadSearchResults() {
    // Get query parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    // Update search input with query
    const searchInput = document.getElementById('search-input');
    if (searchInput && query) {
        searchInput.value = query;
    }
    
    // Update search term display
    const searchTerm = document.getElementById('search-term');
    if (searchTerm && query) {
        searchTerm.textContent = query;
    }
    
    // Filter businesses based on search query
    if (window.filteredBusinesses && window.filteredBusinesses.length > 0) {
        displaySearchResults(query);
    } else {
        // If businesses not loaded yet, wait for them
        const checkInterval = setInterval(() => {
            if (window.filteredBusinesses && window.filteredBusinesses.length > 0) {
                clearInterval(checkInterval);
                displaySearchResults(query);
            }
        }, 100);
        
        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => clearInterval(checkInterval), 10000);
    }
    
    // Add popstate handler to handle browser back/forward navigation
    window.addEventListener('popstate', (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const newQuery = urlParams.get('q');
        
        // Update search input
        if (searchInput) {
            searchInput.value = newQuery || '';
        }
        
        // Update search results
        displaySearchResults(newQuery);
    });
}

// Display search results based on query
function displaySearchResults(query) {
    const resultsContainer = document.getElementById('search-results-container');
    if (!resultsContainer) return;
    
    // Clear container
    resultsContainer.innerHTML = '';
    
    // Update the search term display
    const searchTerm = document.getElementById('search-term');
    if (searchTerm) {
        searchTerm.textContent = query || '';
    }
    
    if (!query) {
        // If no query, display all businesses
        displayClinics(window.filteredBusinesses.slice(0, 20), resultsContainer);
        return;
    }
    
    // Search with ranking system
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    // Score and rank results
    const scoredResults = window.filteredBusinesses.map(business => {
        // Gather business text fields for searching
        const businessName = (business.name || '').toLowerCase();
        const businessDesc = (business.description || '').toLowerCase();
        const businessAddress = (business.address || business.full_address || '').toLowerCase();
        const businessCity = (business.city || '').toLowerCase();
        const businessNeighborhood = (business.neighborhood || '').toLowerCase();
        
        // Initialize score
        let score = 0;
        let matched = true;
        
        // Check each search term
        for (const term of searchTerms) {
            let termMatched = false;
            
            // Exact name match (highest score)
            if (businessName === term) {
                score += 100;
                termMatched = true;
            }
            // Name contains term as a whole word
            else if (businessName.includes(' ' + term + ' ') || 
                     businessName.startsWith(term + ' ') || 
                     businessName.endsWith(' ' + term)) {
                score += 50;
                termMatched = true;
            }
            // Name contains term as part of a word
            else if (businessName.includes(term)) {
                score += 25;
                termMatched = true;
            }
            
            // City/neighborhood exact match
            if (businessCity === term || businessNeighborhood === term) {
                score += 40;
                termMatched = true;
            }
            // City/neighborhood contains term
            else if (businessCity.includes(term) || businessNeighborhood.includes(term)) {
                score += 20;
                termMatched = true;
            }
            
            // Address contains term
            if (businessAddress.includes(term)) {
                score += 15;
                termMatched = true;
            }
            
            // Description contains term
            if (businessDesc.includes(term)) {
                score += 10;
                termMatched = true;
            }
            
            // If this term didn't match anything, the result isn't relevant
            if (!termMatched) {
                matched = false;
                break;
            }
        }
        
        // Return scored business with match status
        return {
            business,
            score,
            matched
        };
    });
    
    // Filter to only matched results and sort by score
    const results = scoredResults
        .filter(item => item.matched)
        .sort((a, b) => b.score - a.score)
        .map(item => item.business);
    
    // Update analytics with result count
    const normalizedQuery = query.toLowerCase().trim();
    if (searchAnalytics[normalizedQuery]) {
        searchAnalytics[normalizedQuery].results = results.length;
        try {
            localStorage.setItem('smp_search_analytics', JSON.stringify(searchAnalytics));
        } catch (e) {
            console.error('Failed to update search analytics results:', e);
        }
    }
    
    // Update results count and no-results message
    const noResultsMessage = document.getElementById('no-results-message');
    
    if (results.length > 0) {
        if (noResultsMessage) {
            noResultsMessage.classList.add('hidden');
        }
        // Pass search terms for highlighting
        displayClinics(results, resultsContainer, searchTerms);
    } else {
        if (noResultsMessage) {
            noResultsMessage.classList.remove('hidden');
        } else {
            resultsContainer.innerHTML = `
                <p id="no-results-message" class="text-center py-8 text-gray-500 text-lg">
                    No results found for "${query}". Try different keywords or browse our <a href="index.html" class="text-blue-600 hover:underline">top clinics</a>.
                </p>
            `;
        }
    }
    
    // Remove the loading message if it exists
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// Fetch business data from JSON file
function fetchBusinessData() {
    fetch('Outscraper-20250423020658xs04_micropigmentation_+1.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            processBusinessData(data);
        })
        .catch(error => {
            console.error('Error fetching business data:', error);
            document.getElementById('loading-message').textContent = 'Error loading data. Please try again later.';
        });
}

// Process the raw business data
function processBusinessData(businessData) {
    console.log('Total businesses before filtering:', businessData.length);
    
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
    
    // Cities to exclude
    const excludedCities = ['san francisco'];
    
    // First filter out permanently closed businesses
    let localBusinesses = businessData.filter(business => {
        return business.permanently_closed !== true && business.business_status !== "CLOSED_PERMANENTLY";
    });
    
    // Track excluded San Francisco businesses
    let sfExcludedCount = 0;
    let sfExcludedBusinesses = [];
    
    // Create a new array for non-San Francisco businesses
    let nonSFBusinesses = localBusinesses.filter(business => {
        // Extract city from address
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
        const isSanFrancisco = excludedCities.some(excludedCity => city.includes(excludedCity));
        if (isSanFrancisco) {
            console.log(`Excluded San Francisco business: ${business.name} in ${city}`);
            sfExcludedCount++;
            sfExcludedBusinesses.push(business.name);
            return false;
        }
        
        return true;
    });
    
    console.log(`Excluded ${sfExcludedCount} businesses from San Francisco:`, sfExcludedBusinesses);
    
    // Then filter to include only LA County businesses
    localBusinesses = nonSFBusinesses.filter(business => {
        // Extract city from address
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
        
        // Check if city is in LA County
        return laCities.some(laCity => city.includes(laCity));
    });
    
    console.log('LA County businesses after filtering:', localBusinesses.length);
    
    // Extract review counts properly for sorting
    localBusinesses = localBusinesses.map(business => {
        // Standardize the review count field
        const reviewCount = business.reviews_count || business.reviews || business.user_ratings_total || 0;
        return {
            ...business,
            standardized_review_count: parseInt(reviewCount) || 0
        };
    });
    
    // Sort businesses by review count (highest first) and then by rating
    localBusinesses.sort((a, b) => {
        // First sort by review count
        if (b.standardized_review_count !== a.standardized_review_count) {
            return b.standardized_review_count - a.standardized_review_count;
        }
        // If review counts are equal, sort by rating
        return (b.rating || 0) - (a.rating || 0);
    });
    
    // Extract neighborhood information
    localBusinesses = localBusinesses.map(business => {
        const neighborhood = extractNeighborhood(business.address || business.full_address || '');
        return {
            ...business,
            neighborhood: neighborhood
        };
    });
    
    // Store processed data in global variables
    allBusinesses = businessData; // Keep all businesses for reference
    window.filteredBusinesses = localBusinesses; // Only LA County businesses for display
    
    // Update UI with processed data
    updateUI(localBusinesses);
    
    // Populate the areas dropdown with cities
    populateAreasDropdown(localBusinesses);
    
    return localBusinesses;
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

// Helper function to display clinics in a container
function displayClinics(clinics, container, highlightTerms = []) {
    // Clear existing clinic cards
    container.innerHTML = '';
    
    // Create and append clinic cards
    clinics.forEach(clinic => {
        const clinicCard = createClinicCard(clinic, highlightTerms);
        container.appendChild(clinicCard);
    });
}

// Create a clinic card element (similar to Hair Restoration Life cards)
function createClinicCard(clinic, highlightTerms = []) {
    const card = document.createElement('div');
    card.className = 'clinic-card';
    card.style.border = '1px solid #ccc';
    card.style.padding = '15px';
    card.style.margin = '10px 0';
    card.style.borderRadius = '8px';
    card.style.backgroundColor = '#fff';
    card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    
    // Extract contact information
    const phoneDisplay = clinic.phone_number ? formatPhoneNumber(clinic.phone_number) : 
                        (clinic.phone ? formatPhoneNumber(clinic.phone) : 'N/A');
    
    const websiteUrl = clinic.website || clinic.site;
    
    const address = clinic.address || clinic.formatted_address || clinic.full_address || 'N/A';
    
    // Debug logging
    console.log('Clinic: ' + clinic.name);
    console.log('Address found: ' + address);
    console.log('Raw address field: ' + (clinic.address || 'undefined'));
    console.log('Raw formatted_address field: ' + (clinic.formatted_address || 'undefined'));
    console.log('Raw full_address field: ' + (clinic.full_address || 'undefined'));
    
    // Create star rating display
    const rating = clinic.rating || 0;
    const ratingDisplay = rating ? rating.toFixed(1) : 'No Rating';
    const reviewCount = clinic.reviews_count || clinic.reviews || clinic.user_ratings_total || 0;
    
    // Get city/neighborhood from address
    const cityMatch = address.match(/([^,]+),\s*([^,]+),\s*([A-Z]{2})/);
    const city = cityMatch ? cityMatch[1].trim() : (clinic.neighborhood || "");
    
    // Helper function to highlight matching terms
    const highlightText = (text) => {
        if (!highlightTerms || highlightTerms.length === 0 || !text) {
            return text;
        }
        
        let highlightedText = text;
        // Convert to lowercase for case-insensitive matching, but preserve original case in display
        const lowerText = text.toLowerCase();
        
        // Process longest terms first to avoid nested highlights
        const sortedTerms = [...highlightTerms].sort((a, b) => b.length - a.length);
        
        for (const term of sortedTerms) {
            if (!term || term.length === 0) continue;
            
            const lowerTerm = term.toLowerCase();
            let startIndex = 0;
            let foundIndex;
            
            // Add a wrapper with a highlight class around each occurrence
            while ((foundIndex = lowerText.indexOf(lowerTerm, startIndex)) !== -1) {
                // Get the actual case-preserved substring from the original text
                const matchedText = text.substring(foundIndex, foundIndex + term.length);
                
                // Replace with highlighted version using a temporary placeholder to avoid issues with multiple replacements
                const placeholder = `__HIGHLIGHT${foundIndex}__`;
                highlightedText = highlightedText.substring(0, foundIndex) + 
                                  placeholder + 
                                  highlightedText.substring(foundIndex + matchedText.length);
                
                // Move past this occurrence
                startIndex = foundIndex + placeholder.length;
            }
        }
        
        // Replace all placeholders with the actual highlighted HTML
        for (let i = 0; i < text.length; i++) {
            const placeholder = `__HIGHLIGHT${i}__`;
            if (highlightedText.includes(placeholder)) {
                // Get the original text at this position
                const originalText = text.substring(i, i + 1);
                // Replace with highlighted version
                highlightedText = highlightedText.replace(
                    placeholder, 
                    `<span style="background-color: #FFEB3B; font-weight: bold;">${originalText}</span>`
                );
            }
        }
        
        return highlightedText;
    };
    
    // Highlight relevant fields
    const highlightedName = highlightText(clinic.name);
    const highlightedAddress = highlightText(address);
    const highlightedCity = highlightText(city);
    
    card.innerHTML = `
        <div class="clinic-info" style="width: 100%;">
            <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333;">${highlightedName}</h3>
            
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="font-size: 18px; font-weight: bold; color: #333;">${ratingDisplay} <span style="color: #FFD700;">★</span></div>
                <div style="margin-left: 10px; color: #666;">(${reviewCount} review${reviewCount !== 1 ? 's' : ''})</div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="margin-bottom: 8px;">
                    <div style="font-weight: bold; display: inline;">Address:</div>
                    <div style="display: inline-block; margin-left: 5px; color: #333;">${highlightedAddress}</div>
                </div>
                
                <div style="margin-bottom: 8px;">
                    <div style="font-weight: bold; display: inline;">Phone:</div>
                    <div style="display: inline-block; margin-left: 5px; color: #333;">${phoneDisplay}</div>
                </div>
                
                <div style="margin-bottom: 8px;">
                    <div style="font-weight: bold; display: inline;">City:</div>
                    <div style="display: inline-block; margin-left: 5px; color: #333;">${highlightedCity}</div>
                </div>
            </div>
            
            <div>
                ${websiteUrl ? `<a href="${websiteUrl}" target="_blank" style="display: inline-block; background-color: #4F46E5; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-weight: bold;">Visit Website</a>` : 
                             `<span style="color: #888; font-style: italic;">No Website Available</span>`}
            </div>
        </div>
    `;
    
    return card;
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
        cityLink.href = `neighborhoods/${encodeURIComponent(urlFriendlyCity)}`;
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
            window.location.href = 'neighborhoods.html';
        } else {
            // Go to the city page using the new URL structure
            const urlFriendlyCity = selectedCity.toLowerCase().replace(/\s+/g, '-');
            window.location.href = `neighborhoods/${encodeURIComponent(urlFriendlyCity)}`;
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
    const urlParams = new URLSearchParams(window.location.search);
    const neighborhood = urlParams.get('name');
    
    if (!neighborhood) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title with neighborhood name
    const pageTitle = document.getElementById('neighborhood-title');
    if (pageTitle) {
        pageTitle.textContent = neighborhood;
    }
    
    // Filter businesses by neighborhood
    const clinics = window.filteredBusinesses.filter(business => 
        business.neighborhood === neighborhood
    );
    
    // Display clinics
    const clinicsContainer = document.getElementById('neighborhood-clinics');
    if (clinicsContainer) {
        clinicsContainer.innerHTML = '';
        
        if (clinics.length === 0) {
            clinicsContainer.innerHTML = '<p class="no-results">No clinics found in this neighborhood.</p>';
            return;
        }
        
        // Create and append clinic cards
        clinics.forEach(clinic => {
            const clinicCard = createClinicCard(clinic);
            clinicsContainer.appendChild(clinicCard);
        });
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
    
    // Check if we're on the neighborhoods page
    const isAreasPage = window.location.pathname.includes('neighborhoods') || 
                        window.location.pathname.includes('area/');
    
    // Determine the base path
    const basePath = isAreasPage ? '../' : '';
    
    // Add a link for each city
    sortedCities.forEach(city => {
        const link = document.createElement('a');
        const urlFriendlyCity = city.toLowerCase().replace(/\s+/g, '-');
        link.href = `${basePath}area/${encodeURIComponent(urlFriendlyCity)}/`;
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
    
    // Create links for each neighborhood
    sortedNeighborhoods.forEach(neighborhood => {
        const urlFriendlyName = neighborhood.toLowerCase().replace(/\s+/g, '-');
        const link = document.createElement('a');
        link.href = `area/${encodeURIComponent(urlFriendlyName)}/`;
        link.className = 'block px-4 py-2 bg-white hover:bg-blue-50 border border-gray-300 rounded-lg transition';
        link.innerHTML = `
            <span class="font-medium">${neighborhood}</span>
            <span class="text-gray-500 text-sm ml-2">(${neighborhoods[neighborhood]} clinics)</span>
        `;
        mapContainer.appendChild(link);
    });
}