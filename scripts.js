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
    return new Promise((resolve, reject) => {
        console.log('Fetching business data... [DEBUG]');
        
        // Check for cached data
        if (window.allBusinesses && window.allBusinesses.length > 0) {
            console.log('Using cached data:', window.allBusinesses.length, 'businesses [DEBUG]');
            resolve(window.allBusinesses);
            return;
        }
        
        // Use absolute path for JSON file
        const jsonUrl = '/Outscraper-20250423020658xs04_micropigmentation_+1.json';
        console.log('Fetching from URL:', jsonUrl, '[DEBUG]');
        
        // FOR DEBUGGING: Log all scripts on the page
        const scripts = document.querySelectorAll('script');
        console.log('Scripts on page:', scripts.length, '[DEBUG]');
        scripts.forEach((script, index) => {
            console.log(`Script ${index}:`, script.src || 'inline script', '[DEBUG]');
        });
        
        // Use absolute path for the JSON file
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
                
                resolve(processedData);
            })
            .catch(error => {
                console.error('Error fetching business data:', error, '[DEBUG]');
                
                // Try relative path as fallback
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
                        resolve(processedData);
                    })
                    .catch(fallbackError => {
                        console.error('Fallback fetch also failed:', fallbackError, '[DEBUG]');
                        
                        // Last resort: Try to load directly from a script tag
                        console.log('Final attempt: Adding JSON as script tag... [DEBUG]');
                        const script = document.createElement('script');
                        script.src = 'data.js'; // Assuming we'll create this file
                        script.onload = function() {
                            if (window.businessData) {
                                console.log('Loaded from script tag:', window.businessData.length, 'businesses [DEBUG]');
                                const processedData = processBusinessData(window.businessData);
                                window.allBusinesses = processedData;
                                resolve(processedData);
                            } else {
                                console.error('Script loaded but no data found [DEBUG]');
                                reject(new Error('Failed to load business data from all sources'));
                            }
                        };
                        script.onerror = function() {
                            console.error('Script tag loading failed [DEBUG]');
                            reject(new Error('Failed to load business data from all sources'));
                        };
                        document.head.appendChild(script);
                    });
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
        
        // Create image element with fallback
        let imageUrl = business.photos && business.photos.length > 0 
            ? business.photos[0] 
            : 'https://via.placeholder.com/400x250?text=SMP+Clinic';
        
        // Create star rating
        let stars = '';
        if (business.rating) {
            const fullStars = Math.floor(business.rating);
            const hasHalfStar = business.rating % 1 >= 0.5;
            
            for (let i = 0; i < fullStars; i++) {
                stars += '★';
            }
            
            if (hasHalfStar) {
                stars += '½';
            }
            
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) {
                stars += '☆';
            }
        }
        
        // Set the card HTML
        card.innerHTML = `
            <div class="h-48 bg-gray-200 overflow-hidden">
                <img src="${imageUrl}" alt="${business.name}" class="w-full h-full object-cover">
            </div>
            <div class="p-5">
                <h3 class="text-xl font-bold mb-2">${business.name}</h3>
                <div class="text-yellow-500 mb-2">${stars} <span class="text-gray-600">(${business.reviews || '0'})</span></div>
                <p class="text-gray-600 mb-3 truncate">${business.full_address || business.address || 'Address not available'}</p>
                <div class="flex justify-between items-center">
                    <span class="text-blue-600 font-medium">${business.phone_number || 'No phone listed'}</span>
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
    
    // Check if we're on an area page (both 'areas' and 'area' paths)
    if (window.location.pathname.includes('/areas/') || window.location.pathname.includes('/area/')) {
        // Extract the area name from the path
        const pathParts = window.location.pathname.split('/');
        console.log('Path parts:', pathParts, '[DEBUG]');
        
        // Find the index of either 'areas' or 'area' in the path
        const areasIndex = pathParts.indexOf('areas');
        const areaIndex = pathParts.indexOf('area');
        
        // Use whichever index is found (prefer 'areas' if both are present)
        const indexToUse = areasIndex > -1 ? areasIndex + 1 : areaIndex + 1;
        console.log('Index to use:', indexToUse, '[DEBUG]');
        
        if (indexToUse > 0 && indexToUse < pathParts.length) {
            areaName = decodeURIComponent(pathParts[indexToUse]);
            // Convert hyphenated format back to spaces
            areaName = areaName.replace(/-/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase());
            console.log('Extracted area name:', areaName, '[DEBUG]');
        }
    } else {
        // Fallback to the old method using query parameters
        const urlParams = new URLSearchParams(window.location.search);
        areaName = urlParams.get('name');
        console.log('Area name from query parameter:', areaName, '[DEBUG]');
    }
    
    if (!areaName) {
        console.log('No area name found, redirecting to home [DEBUG]');
        window.location.href = '/';
        return;
    }
    
    // Update page title with area name
    const pageTitle = document.getElementById('neighborhood-title') || document.getElementById('area-title');
    if (pageTitle) {
        pageTitle.textContent = areaName;
        console.log('Updated page title to:', areaName, '[DEBUG]');
    }
    
    // Check if filteredBusinesses is defined
    if (!window.filteredBusinesses) {
        console.error('filteredBusinesses is not defined! [DEBUG]');
        return;
    }
    
    console.log('Total businesses before filtering:', window.filteredBusinesses.length, '[DEBUG]');
    
    // Filter businesses by neighborhood/area
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
        
        return false;
    });
    
    console.log('Found', clinics.length, 'clinics for', areaName, '[DEBUG]');
    
    // Display clinics
    const clinicsContainer = document.getElementById('neighborhood-clinics') || document.getElementById('area-clinics');
    if (clinicsContainer) {
        console.log('Found clinics container with ID:', clinicsContainer.id, '[DEBUG]');
        
        // Use the displayClinics function instead of creating cards manually
        displayClinics(clinics, clinicsContainer);
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
            link.href = `area/${encodeURIComponent(urlFriendlyName)}/index.html`;
        } else {
            link.href = `area/${encodeURIComponent(urlFriendlyName)}/`;
        }
        
        link.className = 'block px-4 py-2 bg-white hover:bg-blue-50 border border-gray-300 rounded-lg transition';
        link.innerHTML = `
            <span class="font-medium">${neighborhood}</span>
            <span class="text-gray-500 text-sm ml-2">(${neighborhoods[neighborhood]} clinics)</span>
        `;
        mapContainer.appendChild(link);
    });
}