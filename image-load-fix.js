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

        // Force update the image source with direct path
        aboutImage.src = 'img/hair-tattoo-los-angeles.png?t=' + new Date().getTime();
        
        // Set important styles
        aboutImage.style.maxWidth = '100%'; 
        aboutImage.style.height = 'auto';
        aboutImage.style.display = 'block';
        aboutImage.style.borderRadius = '8px';
        aboutImage.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        
        console.log('Applied direct image fix');
    }, 1000); // Increased delay to ensure DOM is ready
}); 