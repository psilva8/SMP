/**
 * last-resort-fix.js
 * Extreme approach to replace section with direct DOM manipulation
 */

// Run immediately when script loads, before DOMContentLoaded
(function() {
    // Add event listener for when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Try multiple times with increasing delays
        tryFix(100);
        tryFix(500);
        tryFix(1000);
        tryFix(2000);
    });
    
    function tryFix(delay) {
        setTimeout(function() {
            console.log(`Attempting fix at ${delay}ms delay...`);
            
            // Get the areas section
            const areasSection = document.querySelector('section.areas');
            
            if (!areasSection) {
                console.error(`Could not find areas section at ${delay}ms`);
                return;
            }
            
            // Create a completely new section element
            const newSection = document.createElement('section');
            newSection.className = 'areas replaced-section';
            
            // Set the HTML content directly
            newSection.innerHTML = `
                <div class="container">
                    <h2>Browse Clinics by Area</h2>
                    <div class="horizontal-layout" style="
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        padding: 30px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                        margin-bottom: 30px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        gap: 40px;
                    ">
                        <div style="
                            flex: 1;
                            line-height: 1.7;
                            color: #444;
                            font-size: 1.05rem;
                        ">
                            Hair Tattoo services are available across California in many locations including Los Angeles, San Francisco, 
                            San Diego, and surrounding areas. Our directory covers top-rated Hair Tattoo clinics in Alameda, Alamo, Auburn, 
                            Beaumont, Beverly Hills, Calabasas, Costa Mesa, Danville, El Monte, Encinitas, Glendale, Irvine, Mountain View, 
                            Oakland, Roseville, Sacramento, Santa Ana, Stockton, and Temecula. Each clinic provides specialized hair loss 
                            solutions using advanced micro-pigmentation techniques to create natural-looking hairlines and density. Los Angeles 
                            offers particularly extensive options for quality Hair Tattoo treatments with experienced practitioners who deliver 
                            exceptional results for all types of hair loss concerns.
                        </div>
                        <div>
                            <a href="/areas.html" style="
                                display: inline-block;
                                background-color: #4F46E5;
                                color: white;
                                padding: 15px 30px;
                                border-radius: 4px;
                                text-decoration: none;
                                font-weight: 500;
                                transition: background-color 0.3s;
                                white-space: nowrap;
                            ">View All Areas</a>
                        </div>
                    </div>
                </div>
            `;
            
            // Replace the original section with our new one
            areasSection.parentNode.replaceChild(newSection, areasSection);
            
            // Apply responsive behavior
            applyResponsive();
            window.addEventListener('resize', applyResponsive);
            
            console.log(`Successfully replaced section at ${delay}ms`);
        }, delay);
    }
    
    function applyResponsive() {
        const layout = document.querySelector('.horizontal-layout');
        if (!layout) return;
        
        if (window.innerWidth <= 768) {
            layout.style.flexDirection = 'column';
            layout.style.alignItems = 'flex-start';
            layout.style.gap = '20px';
        } else {
            layout.style.flexDirection = 'row';
            layout.style.alignItems = 'center';
            layout.style.gap = '40px';
        }
    }
})(); 