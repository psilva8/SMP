// This script will be added at the bottom of index.html to fix the clinic display issue

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Index fix script loaded');
    
    // Check if clinics are already loaded
    const clinicsContainer = document.querySelector('.clinic-cards') || 
                            document.getElementById('top-clinics-container');
    
    if (!clinicsContainer) {
        console.error('Could not find clinics container');
        return;
    }
    
    // If container still shows loading message after 2 seconds, try direct loading
    setTimeout(async function() {
        // Check if container still has loading text
        if (clinicsContainer.textContent.includes('Loading')) {
            console.log('Clinics still loading after 2 seconds, attempting direct load');
            
            try {
                // Try direct fetch
                const response = await fetch('/Outscraper-20250423020658xs04_micropigmentation_+1.json');
                if (!response.ok) {
                    throw new Error(`Network error: ${response.status}`);
                }
                
                const data = await response.json();
                console.log(`Successfully loaded ${data.length} businesses`);
                
                // Sort by rating
                const sortedData = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                const topBusinesses = sortedData.slice(0, 12);
                
                // Clear container and add clinics
                clinicsContainer.innerHTML = '';
                
                topBusinesses.forEach(business => {
                    // Create clinic card
                    const imageUrl = business.photos && business.photos.length > 0 && business.photos[0] 
                    ? business.photos[0] 
                    : 'https://via.placeholder.com/400x250?text=SMP+Clinic';
                    
                    // Format address
                    const address = business.full_address || business.address || 'Address not available';
                    
                    // Format rating
                    const rating = business.rating || 'N/A';
                    const reviews = business.reviews_count || 0;
                    
                    const card = document.createElement('div');
                    card.className = 'clinic-card bg-white rounded-lg shadow-md overflow-hidden';
                    
                    card.innerHTML = `
                        <div class="h-48 bg-gray-200 overflow-hidden">
                            <img src="${imageUrl}" alt="${business.name}" class="w-full h-full object-cover" 
                                onerror="this.src='https://via.placeholder.com/400x250?text=SMP+Clinic'; this.onerror=null;">
                        </div>
                        <div class="p-5">
                            <h3 class="text-xl font-bold mb-2">${business.name || 'Unnamed Clinic'}</h3>
                            <div class="text-yellow-500 mb-2">Rating: ${rating} ⭐ (${reviews} reviews)</div>
                            <p class="text-gray-600 mb-3 truncate">${address}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-blue-600 font-medium">${business.phone_number || 'No phone'}</span>
                                <a href="${business.url || '#'}" target="_blank" class="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition">View Details</a>
                            </div>
                        </div>
                    `;
                    
                    clinicsContainer.appendChild(card);
                });
            } catch (error) {
                console.error('Error in direct load:', error);
                clinicsContainer.innerHTML = `<p>Error loading clinics: ${error.message}. Please try refreshing the page.</p>`;
            }
        } else {
            console.log('Clinics loaded successfully through normal process');
        }
    }, 2000);
}); 