/**
 * direct-fix.js
 * Direct fix for the horizontal layout issue
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find the area description section
    const areaDescription = document.querySelector('.area-description');
    if (!areaDescription) {
        console.error('Area description section not found');
        return;
    }

    // Apply styles directly to the element
    areaDescription.style.display = 'flex';
    areaDescription.style.alignItems = 'center';
    areaDescription.style.justifyContent = 'space-between';
    areaDescription.style.gap = '40px';
    areaDescription.style.backgroundColor = '#f8f9fa';
    areaDescription.style.borderRadius = '8px';
    areaDescription.style.padding = '30px';
    areaDescription.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    areaDescription.style.marginBottom = '30px';

    // Style the paragraph
    const seoParagraph = areaDescription.querySelector('.seo-paragraph');
    if (seoParagraph) {
        seoParagraph.style.flex = '1';
        seoParagraph.style.lineHeight = '1.7';
        seoParagraph.style.color = '#444';
        seoParagraph.style.marginBottom = '0';
        seoParagraph.style.fontSize = '1.05rem';
    }

    // Style the view all container
    const viewAllContainer = areaDescription.querySelector('.view-all-container');
    if (viewAllContainer) {
        viewAllContainer.style.flexShrink = '0';
    }

    // Style the view all button
    const viewAllButton = areaDescription.querySelector('.view-all');
    if (viewAllButton) {
        viewAllButton.style.display = 'inline-block';
        viewAllButton.style.backgroundColor = '#4F46E5';
        viewAllButton.style.color = 'white';
        viewAllButton.style.padding = '15px 30px';
        viewAllButton.style.borderRadius = '4px';
        viewAllButton.style.textDecoration = 'none';
        viewAllButton.style.fontWeight = '500';
        viewAllButton.style.transition = 'background-color 0.3s';
        viewAllButton.style.whiteSpace = 'nowrap';
    }

    // Add hover effect
    if (viewAllButton) {
        viewAllButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#4338ca';
        });
        viewAllButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#4F46E5';
        });
    }

    // Add responsive behavior
    function handleResize() {
        if (window.innerWidth <= 768) {
            areaDescription.style.flexDirection = 'column';
            areaDescription.style.alignItems = 'flex-start';
            areaDescription.style.gap = '20px';
            if (seoParagraph) {
                seoParagraph.style.marginBottom = '10px';
            }
        } else {
            areaDescription.style.flexDirection = 'row';
            areaDescription.style.alignItems = 'center';
            areaDescription.style.gap = '40px';
            if (seoParagraph) {
                seoParagraph.style.marginBottom = '0';
            }
        }
    }

    // Initial call
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    console.log('Direct fix applied to area description section');
}); 