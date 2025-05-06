/**
 * final-dropdown-fix.js
 * Comprehensive solution for all dropdown issues across the website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Debug] Final comprehensive dropdown fix running');
    
    // First, remove all existing click handlers from dropdown buttons by cloning
    const dropdowns = document.querySelectorAll('.dropdown');
    console.log(`[Debug] Found ${dropdowns.length} dropdown containers to fix`);
    
    // Add click handlers to dropdown buttons
    dropdowns.forEach((dropdown, index) => {
        // Target either the .dropbtn class or the first anchor if no specific button
        const originalButton = dropdown.querySelector('.dropbtn') || dropdown.querySelector('a:first-child');
        // Target either the .dropdown-content or .dropdown-menu if available
        const content = dropdown.querySelector('.dropdown-content') || dropdown.querySelector('.dropdown-menu');
        
        if (originalButton && content) {
            // Clone the button to remove existing event listeners
            const button = originalButton.cloneNode(true);
            originalButton.parentNode.replaceChild(button, originalButton);
            
            // Add new click event with proper event bubbling management
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent event from bubbling up
                console.log(`[Debug] Dropdown #${index+1} clicked`);
                
                // Toggle active class on parent dropdown
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach((otherDropdown) => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            });
            
            console.log(`[Debug] Added click handler to dropdown #${index+1}`);
        } else {
            console.log(`[Debug] Couldn't find button or content for dropdown #${index+1}`);
        }
    });
    
    // Add click handlers to prevent closing when interacting with dropdown content
    document.querySelectorAll('.dropdown-content, .dropdown-menu').forEach(content => {
        content.addEventListener('click', function(e) {
            // Don't stop propagation for links, but do for other elements
            if (!e.target.tagName.toLowerCase() === 'a') {
                e.stopPropagation();
            }
        });
        
        // Prevent scroll events from closing dropdown
        content.addEventListener('wheel', function(e) {
            e.stopPropagation();
        });
        
        content.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            console.log('[Debug] Outside click detected, closing all dropdowns');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Populate areas dropdown with static links if needed
    populateAreasDropdown();
});

// Function to populate area dropdowns if they contain "Loading areas..."
function populateAreasDropdown() {
    // Get all dropdown elements that need to be populated
    const areasDropdowns = document.querySelectorAll('#areas-dropdown, .dropdown-content');
    
    if (areasDropdowns.length === 0) {
        console.log('[Debug] No dropdown elements found to populate');
        return;
    }
    
    console.log(`[Debug] Found ${areasDropdowns.length} dropdown elements to check for population`);
    
    // Define static list of areas
    const areasList = [
        { name: 'Alameda', url: '/areas/alameda/' },
        { name: 'Alamo', url: '/areas/alamo/' },
        { name: 'Auburn', url: '/areas/auburn/' },
        { name: 'Beaumont', url: '/areas/beaumont/' },
        { name: 'Beverly Hills', url: '/areas/beverly-hills/' },
        { name: 'Calabasas', url: '/areas/calabasas/' },
        { name: 'Costa Mesa', url: '/areas/costa-mesa/' },
        { name: 'Danville', url: '/areas/danville/' },
        { name: 'El Monte', url: '/areas/el-monte/' },
        { name: 'Encinitas', url: '/areas/encinitas/' },
        { name: 'Glendale', url: '/areas/glendale/' },
        { name: 'Irvine', url: '/areas/irvine/' },
        { name: 'Los Angeles', url: '/areas/los-angeles/' },
        { name: 'Mountain View', url: '/areas/mountain-view/' },
        { name: 'Oakland', url: '/areas/oakland/' },
        { name: 'Roseville', url: '/areas/roseville/' },
        { name: 'Sacramento', url: '/areas/sacramento/' },
        { name: 'San Diego', url: '/areas/san-diego/' },
        { name: 'San Francisco', url: '/areas/san-francisco/' },
        { name: 'San Jose', url: '/areas/san-jose/' },
        { name: 'Santa Ana', url: '/areas/santa-ana/' },
        { name: 'Stockton', url: '/areas/stockton/' },
        { name: 'Temecula', url: '/areas/temecula/' },
        { name: 'All Areas', url: '/areas.html' }
    ];
    
    // Determine if we're in an area page for path correction
    const isAreaPage = window.location.pathname.includes('/areas/');
    console.log('[Debug] Is area page:', isAreaPage);
    
    // Populate each dropdown that has the loading message
    areasDropdowns.forEach((dropdown, index) => {
        // Only replace contents if it has the loading message or is empty
        if (dropdown.textContent.includes('Loading areas') || dropdown.children.length === 0) {
            // Clear the existing content
            dropdown.innerHTML = '';
            
            // Create links for each area
            areasList.forEach(area => {
                const link = document.createElement('a');
                
                // Fix URLs based on current page location
                if (isAreaPage) {
                    // Fix the URL for relative paths
                    let areaUrl = area.url;
                    if (areaUrl === '/areas.html') {
                        areaUrl = '../../areas.html';
                    } else if (areaUrl.startsWith('/areas/')) {
                        areaUrl = '../../' + areaUrl.slice(1);
                    }
                    link.href = areaUrl;
                } else {
                    link.href = area.url;
                }
                
                link.textContent = area.name;
                dropdown.appendChild(link);
            });
            
            console.log(`[Debug] Populated dropdown #${index+1} with ${areasList.length} areas`);
        } else {
            console.log(`[Debug] Dropdown #${index+1} already has content, skipping`);
        }
    });
} 