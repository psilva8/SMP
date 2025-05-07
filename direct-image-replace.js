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
        
        // Try multiple paths to find the working image
        const possiblePaths = [
            'img/hair-tattoo-treatment.jpg', // Fallback to original
            'images/scalp micropigmentation in los angeles.png', // Original upload location
            'img/scalp micropigmentation in los angeles.png', // With spaces
            'img/hair-tattoo-los-angeles.png' // Without spaces
        ];
        
        // Load the first image that exists
        function tryNextImage(index) {
            if (index >= possiblePaths.length) {
                console.error('All image paths failed');
                return;
            }
            
            const path = possiblePaths[index];
            console.log('Trying image path:', path);
            
            // Create a test image to check if the file exists
            const testImg = new Image();
            testImg.onload = function() {
                console.log('Image loaded successfully:', path);
                // Use the working path for our actual image
                newImage.src = path + '?nocache=' + new Date().getTime();
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
            };
            
            testImg.onerror = function() {
                console.warn('Failed to load image:', path);
                // Try the next path
                tryNextImage(index + 1);
            };
            
            testImg.src = path;
        }
        
        // Start trying images
        tryNextImage(0);
        
    }, 1500);
}); 