/**
 * direct-image-replace.js
 * Directly replaces the about image with the correct image
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait to ensure DOM is fully loaded
    setTimeout(function() {
        console.log('Starting direct image replacement');
        
        // Find the about image container
        const aboutImageContainer = document.querySelector('.about-image');
        if (!aboutImageContainer) {
            console.error('About image container not found');
            return;
        }
        
        // Create a completely new image element
        const newImage = document.createElement('img');
        newImage.src = 'img/hair-tattoo-los-angeles.png?nocache=' + new Date().getTime();
        newImage.alt = 'Hair Tattoo Treatment in Los Angeles';
        newImage.style.maxWidth = '100%';
        newImage.style.height = 'auto';
        newImage.style.display = 'block';
        newImage.style.borderRadius = '8px';
        newImage.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        
        // Clear the container and add the new image
        aboutImageContainer.innerHTML = '';
        aboutImageContainer.appendChild(newImage);
        
        console.log('Direct image replacement complete');
    }, 1500);
}); 