// This script fixes images that fail to load in clinic cards
document.addEventListener('DOMContentLoaded', function() {
    console.log('Image fix script loaded');
    
    // Wait for cards to be loaded
    setTimeout(function() {
        // Find all clinic card images
        const cardImages = document.querySelectorAll('img[src^="http"]');
        console.log(`Found ${cardImages.length} images to verify`);
        
        // Add error handler to each image to use a placeholder if it fails to load
        cardImages.forEach(img => {
            // Set a fallback error handler
            if (!img.getAttribute('onerror')) {
                img.onerror = function() {
                    console.log(`Image failed to load: ${this.src}`);
                    this.src = 'https://via.placeholder.com/400x200/cccccc/666666?text=SMP+Clinic';
                    this.onerror = null; // Prevent infinite loops
                };
            }
            
            // If image is already broken (happens faster than we can set the handler)
            if (img.naturalWidth === 0 && img.naturalHeight === 0) {
                img.src = 'https://via.placeholder.com/400x200/cccccc/666666?text=SMP+Clinic';
            }
        });
        
        console.log('Image error handlers set up');
    }, 2000);
}); 