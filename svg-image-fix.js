/**
 * svg-image-fix.js
 * Uses a directly embedded SVG image instead of loading from external sources
 */

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        console.log('Applying SVG image fix');
        
        // Find the about image container
        const aboutImageContainer = document.querySelector('.about-image');
        if (!aboutImageContainer) {
            console.error('About image container not found');
            return;
        }
        
        // Use a direct SVG that requires no external resources
        aboutImageContainer.innerHTML = `
            <svg width="100%" height="300" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                <rect width="600" height="400" fill="#4F46E5" rx="8" ry="8" />
                <text x="300" y="180" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="middle">Hair Tattoo</text>
                <text x="300" y="220" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="middle">Los Angeles</text>
                <circle cx="300" cy="120" r="50" fill="white" opacity="0.2" />
                <path d="M300,70 C320,70 340,90 340,120 C340,150 320,180 300,180 C280,180 260,150 260,120 C260,90 280,70 300,70" fill="white" opacity="0.3" />
                <path d="M290,190 C290,210 310,220 330,220 L330,230 C310,230 290,220 290,190" fill="white" opacity="0.3" />
            </svg>
        `;
        
        console.log('Applied SVG image fix');
    }, 300);
}); 