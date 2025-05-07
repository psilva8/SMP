/**
 * final-about-image-fix.js
 * Final attempt to show the original image using multiple methods
 */

document.addEventListener('DOMContentLoaded', function() {
    // Execute immediately and also with multiple delays
    tryFix(0);
    setTimeout(() => tryFix(500), 500);
    setTimeout(() => tryFix(1500), 1500);
    setTimeout(() => tryFix(3000), 3000);
    
    function tryFix(delay) {
        console.log(`Trying about image fix with ${delay}ms delay`);
        
        // Find the about image container with multiple selectors
        const aboutImageContainer = document.querySelector('.about-image') || 
                                   document.getElementById('aboutImage') ||
                                   document.querySelector('.about-content > div:last-child');
        
        if (!aboutImageContainer) {
            console.error(`Could not find about image container at ${delay}ms delay`);
            return;
        }
        
        // Array of possible image paths to try
        const imagePaths = [
            'static-image.png',
            'images/scalp micropigmentation in los angeles.png',
            'img/scalp micropigmentation in los angeles.png',
            'img/hair-tattoo-los-angeles.png',
            '/images/scalp micropigmentation in los angeles.png',
            '/img/scalp micropigmentation in los angeles.png',
            '/img/hair-tattoo-los-angeles.png',
            'https://raw.githubusercontent.com/psilva8/SMP/main/images/scalp%20micropigmentation%20in%20los%20angeles.png',
            'https://raw.githubusercontent.com/psilva8/SMP/main/img/hair-tattoo-los-angeles.png'
        ];
        
        // Try each image and use the first one that loads
        function tryImage(index) {
            if (index >= imagePaths.length) {
                console.log(`All ${imagePaths.length} image paths failed, staying with SVG`);
                return;
            }
            
            const path = imagePaths[index];
            console.log(`Trying image path: ${path}`);
            
            const img = new Image();
            img.onload = function() {
                console.log(`Success! Image loaded from: ${path}`);
                // Replace the current content with the working image
                aboutImageContainer.innerHTML = '';
                const displayImg = document.createElement('img');
                displayImg.src = path;
                displayImg.alt = 'Hair Tattoo Treatment in Los Angeles';
                displayImg.style.maxWidth = '100%';
                displayImg.style.height = 'auto';
                displayImg.style.display = 'block';
                displayImg.style.borderRadius = '8px';
                displayImg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                aboutImageContainer.appendChild(displayImg);
                
                // Force display by applying to document body
                document.body.style.display = 'none';
                document.body.offsetHeight; // Force reflow
                document.body.style.display = '';
            };
            
            img.onerror = function() {
                console.log(`Failed to load: ${path}`);
                tryImage(index + 1);
            };
            
            img.src = path;
        }
        
        // Start trying images
        tryImage(0);
    }
}); 