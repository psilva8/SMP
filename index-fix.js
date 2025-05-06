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
                // Try direct fetch with both paths
                let response;
                let data;
                
                try {
                    response = await fetch('/Outscraper-20250423020658xs04_micropigmentation_+1.json');
                    if (!response.ok) {
                        throw new Error(`Network error: ${response.status}`);
                    }
                    data = await response.json();
                } catch (error) {
                    console.log('Failed with absolute path, trying relative path');
                    response = await fetch('Outscraper-20250423020658xs04_micropigmentation_+1.json');
                    if (!response.ok) {
                        throw new Error(`Network error: ${response.status}`);
                    }
                    data = await response.json();
                }
                
                console.log(`Successfully loaded ${data.length} businesses`);
                
                // Sort by rating first, then by review count if ratings are equal
                const sortedData = [...data].sort((a, b) => {
                    const ratingA = parseFloat(a.rating) || 0;
                    const ratingB = parseFloat(b.rating) || 0;
                    
                    // First compare by rating
                    if (ratingA !== ratingB) {
                        return ratingB - ratingA;
                    }
                    
                    // If ratings are equal, sort by review count
                    const reviewsA = parseInt(a.reviews) || 0;
                    const reviewsB = parseInt(b.reviews) || 0;
                    return reviewsB - reviewsA;
                });
                
                const topBusinesses = sortedData.slice(0, 12);
                console.log('Top 12 businesses by rating:', topBusinesses.map(b => ({
                    name: b.name, 
                    rating: parseFloat(b.rating) || 0,
                    reviews: parseInt(b.reviews) || 0
                })));
                
                // Clear container and add clinics
                clinicsContainer.innerHTML = '';
                
                // Log detailed business data for debugging
                topBusinesses.forEach((business, index) => {
                    console.log(`Business #${index + 1}:`, {
                        name: business.name,
                        rating: business.rating,
                        reviews: business.reviews,
                        phone: business.phone,
                        site: business.site,
                        url: business.url,
                        website: business.website
                    });
                });
                
                topBusinesses.forEach(business => {
                    // Create clinic card with consistent styling
                    const card = document.createElement('div');
                    card.className = 'clinic-card';
                    
                    // Format address
                    const addressParts = [
                        business.address || '',
                        business.city || '',
                        business.state || '',
                        business.postal_code || business.zip_code || ''
                    ].filter(Boolean);
                    
                    const formattedAddress = addressParts.join(', ') || business.full_address || business.formatted_address || 'Address not available';
                    
                    // Get rating and reviews with proper fallbacks
                    const ratingValue = business.rating ? parseFloat(business.rating) : 0;
                    const reviewsCount = business.reviews ? parseInt(business.reviews) : 0;
                    
                    // Create star rating with proper class names to match CSS
                    let starRating = '';
                    
                    if (!ratingValue) {
                        starRating = '<span class="no-rating">No rating</span>';
                    } else {
                        const fullStars = Math.floor(ratingValue);
                        const halfStar = ratingValue % 1 >= 0.5;
                        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
                        
                        // Add numeric rating
                        starRating += `<span class="numeric-rating">${ratingValue.toFixed(1)}</span> `;
                        
                        // Full stars
                        for (let i = 0; i < fullStars; i++) {
                            starRating += '<span class="star full">★</span>';
                        }
                        
                        // Half star
                        if (halfStar) {
                            starRating += '<span class="star half">★</span>';
                        }
                        
                        // Empty stars
                        for (let i = 0; i < emptyStars; i++) {
                            starRating += '<span class="star empty">☆</span>';
                        }
                    }
                    
                    // Format phone with proper fallback
                    let phoneNumber = business.phone || 'No phone';
                    let formattedPhone = phoneNumber;
                    
                    if (phoneNumber !== 'No phone') {
                        // Simple phone formatting (XXX) XXX-XXXX
                        const cleaned = phoneNumber.replace(/\D/g, '');
                        if (cleaned.length === 10) {
                            formattedPhone = `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
                        } else if (cleaned.length === 11 && cleaned[0] === '1') {
                            formattedPhone = `(${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 11)}`;
                        }
                    }
                    
                    // Get website URL with multiple fallbacks
                    const websiteUrl = business.site || business.website || business.url || '#';
                    
                    // Add default services
                    const services = ['Scalp Micropigmentation'];
                    
                    // Default image
                    const imageUrl = business.image_url || business.photo || 
                        (business.photos && business.photos.length > 0 ? business.photos[0] : 'img/default-clinic.jpg');
                    
                    // Enhanced debugging for specific items that might be causing issues
                    console.log(`${business.name} - Rating: ${ratingValue}, Reviews: ${reviewsCount}, Phone: ${formattedPhone}, Website: ${websiteUrl}`);
                    
                    // Set the card HTML
                    card.innerHTML = `
                        <div class="clinic-image" style="background-image: url(${imageUrl})"></div>
                        <div class="clinic-info">
                            <h3>${business.name || 'Unnamed Clinic'}</h3>
                            <div class="clinic-rating">
                                <div class="stars">${starRating}</div>
                                <span class="rating-text">${ratingValue > 0 ? ratingValue.toFixed(1) : 'No rating'} (${reviewsCount} reviews)</span>
                            </div>
                            <div class="clinic-address">${formattedAddress}</div>
                            <div class="clinic-contact">
                                <div class="clinic-phone">${formattedPhone}</div>
                                ${websiteUrl !== '#' ? `<div class="clinic-website"><a href="${websiteUrl}" target="_blank" rel="noopener noreferrer">Website</a></div>` : ''}
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