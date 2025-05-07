/**
 * image-load-fix.js
 * Fix to ensure the about section image loads properly
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit after page load to ensure all resources are loaded
    setTimeout(function() {
        const aboutImage = document.querySelector('.about-image img');
        if (!aboutImage) {
            console.error('About image not found');
            return;
        }

        // Set a fallback in case the image fails to load
        aboutImage.onerror = function() {
            console.error('Image failed to load, applying fallback');
            aboutImage.src = 'img/hair-tattoo-treatment.jpg';
            aboutImage.style.width = '100%';
            aboutImage.style.height = 'auto';
            aboutImage.style.display = 'block';
            aboutImage.style.borderRadius = '8px';
        };

        // Force a reload of the image
        const currentSrc = aboutImage.src;
        aboutImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // Empty image
        aboutImage.src = currentSrc + '?t=' + new Date().getTime(); // Add cache-busting parameter
        
        console.log('Applied image load fix');
    }, 500);
}); 