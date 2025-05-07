/**
 * area-section-replacement.js
 * Complete HTML replacement for the area section
 */

// Wait a bit to ensure everything is loaded
setTimeout(function() {
    // Find the areas section container
    const areasSection = document.querySelector('.areas .container');
    if (!areasSection) {
        console.error("Could not find areas section container");
        return;
    }

    // Create completely new HTML
    const newHTML = `
        <h2>Browse Clinics by Area</h2>
        <div class="areas-map">
            <div style="
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                gap: 40px;
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                margin-bottom: 30px;
            ">
                <div style="
                    flex: 1;
                    line-height: 1.7;
                    color: #444;
                    margin-bottom: 0;
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
                <div style="flex-shrink: 0;">
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

    // Replace the entire content
    areasSection.innerHTML = newHTML;
    
    console.log('Area section completely replaced with new HTML');

    // Set up a media query for mobile responsiveness
    const checkMobile = function() {
        const container = document.querySelector('.areas-map > div');
        if (!container) return;
        
        if (window.innerWidth <= 768) {
            container.style.flexDirection = 'column';
            container.style.alignItems = 'flex-start';
            container.style.gap = '20px';
        } else {
            container.style.flexDirection = 'row';
            container.style.alignItems = 'center';
            container.style.gap = '40px';
        }
    };
    
    // Run initially and on resize
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
}, 500); // Increased delay to 500ms 