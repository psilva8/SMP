// fix-area-dropdown.js - Script to fix the area dropdown loading issue

document.addEventListener('DOMContentLoaded', function() {
    console.log('Fix area dropdown script loaded');
    
    // Get all dropdown elements that need to be populated
    const areasDropdowns = document.querySelectorAll('#areas-dropdown');
    
    if (areasDropdowns.length === 0) {
        console.log('No areas dropdown found, nothing to fix');
        return;
    }
    
    console.log(`Found ${areasDropdowns.length} area dropdowns to populate`);
    
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
    
    // Populate each dropdown with the area links
    areasDropdowns.forEach(dropdown => {
        // Clear the loading message
        dropdown.innerHTML = '';
        
        // Handle paths based on current location (relative vs absolute)
        let isAreaPage = window.location.pathname.includes('/areas/');
        
        // Create links for each area
        areasList.forEach(area => {
            const link = document.createElement('a');
            
            // If we're in an area page, use relative paths
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
        
        console.log(`Populated dropdown with ${areasList.length} areas`);
    });
    
    // Also fix missing dropdown functionality if needed
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Only add event listeners if they're not already added
    if (!window.dropdownsInitialized) {
        dropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('.dropbtn') || dropdown.querySelector('a:first-child');
            const content = dropdown.querySelector('.dropdown-content') || dropdown.querySelector('.dropdown-menu');
            
            if (button && content) {
                // Add click event to toggle dropdown
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    
                    // Close all other dropdowns
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
        
        // Set flag to prevent duplicate initialization
        window.dropdownsInitialized = true;
    }
}); 