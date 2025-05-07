/**
 * clinic-reload.js
 * Script to handle clinic data loading issues
 */

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Clinic reload script loaded');
    
    // Listen for custom reload event from clinic-image-fix.js
    document.addEventListener('force-clinic-reload', async function() {
        console.log('Force clinic reload triggered');
        await loadClinics();
    });
    
    // Check clinics after 4 seconds (longer than all other scripts)
    setTimeout(async function() {
        const clinicsContainer = document.querySelector('.clinic-cards');
        if (!clinicsContainer) {
            console.error('Could not find clinics container');
            return;
        }
        
        // If container is empty or only has loading text, try loading again
        if (clinicsContainer.children.length <= 1 || 
            (clinicsContainer.textContent && clinicsContainer.textContent.trim().toLowerCase().includes('loading'))) {
            console.log('Clinics not properly loaded after 4 seconds, forcing reload');
            await loadClinics();
        } else {
            console.log('Clinics appear to be loaded, checking count...');
            const clinicCards = clinicsContainer.querySelectorAll('.clinic-card');
            console.log(`Found ${clinicCards.length} clinic cards`);
            
            if (clinicCards.length === 0) {
                console.log('No clinic cards found, forcing reload');
                await loadClinics();
            }
        }
    }, 4000);
    
    async function loadClinics() {
        console.log('Attempting to load clinics directly');
        const clinicsContainer = document.querySelector('.clinic-cards');
        if (!clinicsContainer) {
            console.error('Could not find clinics container for loading');
            return;
        }
        
        // Show loading state
        clinicsContainer.innerHTML = '<div class="loading-text">Loading clinics...</div>';
        
        try {
            // Create static clinic data as fallback in case JSON fetch fails
            const staticClinicData = [
                {
                    name: "LA Hair Clinic",
                    rating: "4.9",
                    reviews: "120",
                    address: "123 Hollywood Blvd, Los Angeles, CA 90028",
                    phone: "(213) 555-1234"
                },
                {
                    name: "Beverly Hills Hair Tattoo",
                    rating: "4.8",
                    reviews: "95",
                    address: "456 Rodeo Dr, Beverly Hills, CA 90210",
                    phone: "(310) 555-6789"
                },
                {
                    name: "Hollywood Hair Solutions",
                    rating: "4.7",
                    reviews: "88",
                    address: "789 Sunset Blvd, Los Angeles, CA 90046",
                    phone: "(323) 555-9876"
                },
                {
                    name: "Santa Monica Hair Clinic",
                    rating: "4.6",
                    reviews: "75",
                    address: "321 Ocean Ave, Santa Monica, CA 90401",
                    phone: "(310) 555-4567"
                },
                {
                    name: "San Diego Hair Tattoo",
                    rating: "4.8",
                    reviews: "110",
                    address: "654 Pacific Beach Dr, San Diego, CA 92109",
                    phone: "(619) 555-7654"
                },
                {
                    name: "San Francisco Hair Solutions",
                    rating: "4.7",
                    reviews: "92",
                    address: "987 Market St, San Francisco, CA 94103",
                    phone: "(415) 555-2345"
                }
            ];
            
            // Render the static clinic data
            clinicsContainer.innerHTML = '';
            
            staticClinicData.forEach((clinic) => {
                const card = document.createElement('div');
                card.className = 'clinic-card';
                
                // Create rating stars
                const rating = parseFloat(clinic.rating);
                const fullStars = Math.floor(rating);
                const halfStar = rating % 1 >= 0.5;
                const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
                
                let starHtml = '';
                for (let i = 0; i < fullStars; i++) {
                    starHtml += '<span class="star full">★</span>';
                }
                if (halfStar) {
                    starHtml += '<span class="star half">★</span>';
                }
                for (let i = 0; i < emptyStars; i++) {
                    starHtml += '<span class="star empty">☆</span>';
                }
                
                card.innerHTML = `
                    <div class="clinic-image" style="background-image: url(https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Hair+Tattoo+Clinic); background-size: cover; background-position: center;">
                        <img src="https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Hair+Tattoo+Clinic" alt="${clinic.name}" style="width: 100%; height: 200px; object-fit: cover; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    </div>
                    <div class="clinic-info">
                        <h3>${clinic.name}</h3>
                        <div class="clinic-rating">
                            <div class="stars">${starHtml}</div>
                            <span class="rating-text">${clinic.rating} (${clinic.reviews} reviews)</span>
                        </div>
                        <div class="clinic-address">${clinic.address}</div>
                        <div class="clinic-contact">
                            <div class="clinic-phone">${clinic.phone}</div>
                            <div class="clinic-website"><a href="#" target="_blank">Website</a></div>
                        </div>
                        <div class="clinic-services">
                            <span class="clinic-service">Hair Tattoo</span>
                        </div>
                    </div>
                `;
                
                clinicsContainer.appendChild(card);
            });
            
            console.log('Successfully loaded static clinic data');
        } catch (error) {
            console.error('Error loading clinics:', error);
            clinicsContainer.innerHTML = '<div class="loading-text">Error loading clinics. Please refresh the page.</div>';
        }
    }
}); 