/**
 * clinic-image-fix.js
 * Script to fix clinic card image loading
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure the original clinic load script has run
    setTimeout(function() {
        console.log('Applying clinic image fix');
        
        // Check if any clinic images need to be fixed
        const clinicImages = document.querySelectorAll('.clinic-image');
        if (!clinicImages || clinicImages.length === 0) {
            console.log('No clinic images found, may need to restart clinic loading');
            
            // Force reloading clinics
            const clinicsContainer = document.querySelector('.clinic-cards');
            if (clinicsContainer) {
                console.log('Found clinic container, adding loading message to trigger reload');
                clinicsContainer.innerHTML = '<div class="loading-text">Loading clinics...</div>';
                
                // Trigger the reload by dispatching a custom event that index-fix.js will respond to
                const reloadEvent = new Event('force-clinic-reload');
                document.dispatchEvent(reloadEvent);
            }
            
            return;
        }
        
        console.log(`Found ${clinicImages.length} clinic images to potentially fix`);
        
        // Fix each clinic image
        clinicImages.forEach((imageDiv, index) => {
            // Get the background image URL
            const style = window.getComputedStyle(imageDiv);
            const backgroundImage = style.backgroundImage;
            
            // If no background image or it failed, set a placeholder
            if (!backgroundImage || backgroundImage === 'none' || backgroundImage.includes('undefined')) {
                console.log(`Fixing clinic image ${index+1}`);
                
                // Create a placeholder
                imageDiv.style.backgroundImage = 'url(https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Hair+Tattoo+Clinic)';
                
                // Also add an img tag as backup
                const imgElement = document.createElement('img');
                imgElement.src = 'https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Hair+Tattoo+Clinic';
                imgElement.alt = 'Hair Tattoo Clinic';
                imgElement.style.width = '100%';
                imgElement.style.height = '200px';
                imgElement.style.objectFit = 'cover';
                imgElement.style.borderTopLeftRadius = '8px';
                imgElement.style.borderTopRightRadius = '8px';
                
                // Clear and append
                imageDiv.innerHTML = '';
                imageDiv.appendChild(imgElement);
            }
        });
        
        console.log('Clinic image fix complete');
    }, 3000); // Wait longer than the index-fix.js delay (2000ms)
}); 