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
                    // Create clinic card with consistent styling
                    const card = document.createElement('div');
                    card.className = 'clinic-card';
                    
                    // Format address
                    const addressParts = [
                        business.address || '',
                        business.city || '',
                        business.state || '',
                        business.postal_code || ''
                    ].filter(Boolean);
                    
                    const formattedAddress = addressParts.join(', ') || business.full_address || 'Address not available';
                    
                    // Get rating and reviews
                    const ratingValue = parseFloat(business.rating) || 0;
                    const reviewsCount = parseInt(business.reviews) || 0;
                    
                    // Create star rating
                    let starRating = '';
                    const roundedRating = Math.round(ratingValue * 2) / 2;
                    
                    // Add full stars
                    for (let i = 1; i <= Math.floor(roundedRating); i++) {
                        starRating += '★';
                    }
                    
                    // Add half star if needed
                    if (roundedRating % 1 !== 0) {
                        starRating += '★';
                    }
                    
                    // Add empty stars to make 5 stars total
                    const emptyStars = 5 - Math.ceil(roundedRating);
                    for (let i = 0; i < emptyStars; i++) {
                        starRating += '☆';
                    }
                    
                    // Format phone
                    let phoneNumber = business.phone || 'N/A';
                    let formattedPhone = phoneNumber;
                    
                    if (phoneNumber !== 'N/A') {
                        // Simple phone formatting (XXX) XXX-XXXX
                        const cleaned = phoneNumber.replace(/\D/g, '');
                        if (cleaned.length === 10) {
                            formattedPhone = `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
                        } else if (cleaned.length === 11 && cleaned[0] === '1') {
                            formattedPhone = `(${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 11)}`;
                        }
                    }
                    
                    // Get website URL
                    const websiteUrl = business.site || business.website || business.url || '#';
                    
                    // Add default services
                    const services = ['Scalp Micropigmentation'];
                    
                    // Set the card HTML
                    card.innerHTML = `
                        <div class="clinic-image" style="background-image: url(${business.photo || (business.photos && business.photos[0]) || 'img/default-clinic.jpg'})"></div>
                        <div class="clinic-info">
                            <h3>${business.name || 'Unnamed Clinic'}</h3>
                            <div class="clinic-rating">
                                <div class="stars">${starRating}</div>
                                <span>${ratingValue.toFixed(1) !== '0.0' ? ratingValue.toFixed(1) : 'N/A'} (${reviewsCount} reviews)</span>
                            </div>
                            <div class="clinic-address">${formattedAddress}</div>
                            <div class="clinic-contact">
                                <div class="clinic-phone">${formattedPhone}</div>
                                ${websiteUrl !== '#' ? `<div class="clinic-website"><a href="${websiteUrl}" target="_blank">Website</a></div>` : ''}
                            </div>
                            <div class="clinic-services">
                                ${services.map(service => `<span class="clinic-service">${service}</span>`).join('')}
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