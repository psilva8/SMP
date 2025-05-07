/**
 * inline-image-fix.js
 * Uses a direct inline base64 image instead of trying to load from file
 */

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        console.log('Applying inline image fix');
        
        // Find the about image container
        const aboutImageContainer = document.querySelector('.about-image');
        if (!aboutImageContainer) {
            console.error('About image container not found');
            return;
        }
        
        // Use a simple standard image that definitely exists
        aboutImageContainer.innerHTML = `
            <img src="https://placehold.co/600x400/4F46E5/FFFFFF?text=Hair+Tattoo+Los+Angeles" 
                 alt="Hair Tattoo Treatment in Los Angeles"
                 style="max-width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        `;
        
        console.log('Applied inline image');
    }, 500);
}); 