// This script removes any "Hair Tattoo Treatment" entry from clinic cards
// Add this script to the bottom of all pages that show clinic cards

document.addEventListener('DOMContentLoaded', function() {
    console.log('SMP removal script loaded');
    
    // Initial cleanup
    removeScalpMicropigmentationEntries();
    
    // Set up a MutationObserver to watch for dynamically added clinic cards
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Check if any of the added nodes contain clinic cards
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('clinic-card')) {
                            // This is a clinic card, clean it
                            cleanClinicCard(node);
                        } else {
                            // Check if it contains clinic cards
                            const cards = node.querySelectorAll('.clinic-card');
                            if (cards.length > 0) {
                                cards.forEach(cleanClinicCard);
                            }
                        }
                    }
                }
            }
        });
    });
    
    // Start observing the document with configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Add interval to periodically check for new cards (fallback)
    setInterval(removeScalpMicropigmentationEntries, 2000);
});

// Function to clean a single clinic card
function cleanClinicCard(card) {
    const serviceContainer = card.querySelector('.clinic-services');
    if (serviceContainer) {
        const serviceSpans = serviceContainer.querySelectorAll('.clinic-service');
        serviceSpans.forEach(span => {
            if (span.textContent.includes('Hair Tattoo Treatment')) {
                console.log('Removing SMP from clinic card:', card.querySelector('h3').textContent);
                span.remove();
            }
        });
    }
}

// Function to find and remove all "Hair Tattoo Treatment" entries
function removeScalpMicropigmentationEntries() {
    // Find all clinic cards
    const clinicCards = document.querySelectorAll('.clinic-card');
    if (clinicCards.length > 0) {
        console.log('Found', clinicCards.length, 'clinic cards to check');
        clinicCards.forEach(cleanClinicCard);
    }
} 