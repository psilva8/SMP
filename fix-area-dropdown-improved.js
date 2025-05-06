/**
 * Improved fix-area-dropdown.js
 * This script solves the issues with area dropdown menus not populating
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Debug] Improved area dropdown fix running');
    
    // Fix the parent link first - make sure it points to the right place
    const areaLinks = document.querySelectorAll('.dropdown a[href="/areas.html"]');
    if (areaLinks.length > 0) {
        areaLinks.forEach(link => {
            if (window.location.pathname.includes('/areas/')) {
                link.href = "../../areas.html";
            }
        });
    }
    
    // Get all dropdown elements that need to be populated
    // Use a more specific selector that matches both main and area pages
    const areasDropdowns = document.querySelectorAll('#areas-dropdown, .dropdown-content');
    
    if (areasDropdowns.length === 0) {
        console.log('[Debug] No dropdown elements found to populate');
        return;
    }
    
    console.log(`[Debug] Found ${areasDropdowns.length} dropdown elements to populate`);
    
    // Define static list of areas (same as in the homepage)
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
    
    // Populate each dropdown with the area links
    areasDropdowns.forEach((dropdown, index) => {
        // Only replace contents if it has the loading message
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
    
    // Fix dropdown toggle functionality
    fixDropdownToggle();
});

// Separate function to fix dropdown toggle functionality
function fixDropdownToggle() {
    const dropdowns = document.querySelectorAll('.dropdown');
    console.log(`[Debug] Found ${dropdowns.length} dropdown containers to fix`);
    
    // Add click handlers to dropdown buttons
    dropdowns.forEach((dropdown, index) => {
        // Target either the .dropbtn class or the first anchor if no specific button
        const button = dropdown.querySelector('.dropbtn') || dropdown.querySelector('a:first-child');
        // Target either the .dropdown-content or .dropdown-menu if available
        const content = dropdown.querySelector('.dropdown-content') || dropdown.querySelector('.dropdown-menu');
        
        if (button && content) {
            // Remove any existing click listeners (to avoid duplicates)
            const newButton = button.cloneNode(true);
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }
            
            // Add new click event
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent event from bubbling up
                console.log(`[Debug] Dropdown #${index+1} clicked`);
                
                // Toggle active class on parent dropdown
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach((otherDropdown, otherIndex) => {
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
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            console.log('[Debug] Outside click detected, closing all dropdowns');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
} 