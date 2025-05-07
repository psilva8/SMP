/**
 * direct-fix-js-override.js
 * Direct fix for the horizontal layout issue with !important flags
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find the area description section
    const areaDescription = document.querySelector('.area-description');
    if (!areaDescription) {
        console.error('Area description section not found');
        return;
    }

    // Apply styles with !important to override inline styles
    areaDescription.style.setProperty('display', 'flex', 'important');
    areaDescription.style.setProperty('align-items', 'center', 'important');
    areaDescription.style.setProperty('justify-content', 'space-between', 'important');
    areaDescription.style.setProperty('gap', '40px', 'important');
    areaDescription.style.setProperty('background-color', '#f8f9fa', 'important');
    areaDescription.style.setProperty('border-radius', '8px', 'important');
    areaDescription.style.setProperty('padding', '30px', 'important');
    areaDescription.style.setProperty('box-shadow', '0 2px 10px rgba(0,0,0,0.05)', 'important');
    areaDescription.style.setProperty('margin-bottom', '30px', 'important');

    // Style the paragraph with !important
    const seoParagraph = areaDescription.querySelector('.seo-paragraph');
    if (seoParagraph) {
        seoParagraph.style.setProperty('flex', '1', 'important');
        seoParagraph.style.setProperty('line-height', '1.7', 'important');
        seoParagraph.style.setProperty('color', '#444', 'important');
        seoParagraph.style.setProperty('margin-bottom', '0', 'important');
        seoParagraph.style.setProperty('font-size', '1.05rem', 'important');
    }

    // Style the view all container with !important
    const viewAllContainer = areaDescription.querySelector('.view-all-container');
    if (viewAllContainer) {
        viewAllContainer.style.setProperty('flex-shrink', '0', 'important');
    }

    // Style the view all button with !important
    const viewAllButton = areaDescription.querySelector('.view-all');
    if (viewAllButton) {
        viewAllButton.style.setProperty('display', 'inline-block', 'important');
        viewAllButton.style.setProperty('background-color', '#4F46E5', 'important');
        viewAllButton.style.setProperty('color', 'white', 'important');
        viewAllButton.style.setProperty('padding', '15px 30px', 'important');
        viewAllButton.style.setProperty('border-radius', '4px', 'important');
        viewAllButton.style.setProperty('text-decoration', 'none', 'important');
        viewAllButton.style.setProperty('font-weight', '500', 'important');
        viewAllButton.style.setProperty('transition', 'background-color 0.3s', 'important');
        viewAllButton.style.setProperty('white-space', 'nowrap', 'important');
    }

    // Add hover effect
    if (viewAllButton) {
        viewAllButton.addEventListener('mouseover', function() {
            this.style.setProperty('background-color', '#4338ca', 'important');
        });
        viewAllButton.addEventListener('mouseout', function() {
            this.style.setProperty('background-color', '#4F46E5', 'important');
        });
    }

    // Add responsive behavior with !important flags
    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        // Set flex direction based on screen size with !important
        areaDescription.style.setProperty('flex-direction', isMobile ? 'column' : 'row', 'important');
        areaDescription.style.setProperty('align-items', isMobile ? 'flex-start' : 'center', 'important');
        areaDescription.style.setProperty('gap', isMobile ? '20px' : '40px', 'important');
        
        // Adjust paragraph margin with !important
        if (seoParagraph) {
            seoParagraph.style.setProperty('margin-bottom', isMobile ? '10px' : '0', 'important');
        }
    }

    // Initial call with a longer delay to ensure styles are applied after any other scripts
    setTimeout(handleResize, 300);

    // Add resize listener
    window.addEventListener('resize', handleResize);

    console.log('Direct fix with !important applied to area description section');
}); 