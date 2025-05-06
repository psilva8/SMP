// This script will be added to area pages to fix the clinic card ratings

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Area fix script loaded');
    
    // Wait 3 seconds to see if the main script loaded the clinics
    setTimeout(async function() {
        const clinicsContainer = document.getElementById('area-clinics');
        if (!clinicsContainer) {
            console.log('No area-clinics container found, nothing to fix');
            return;
        }
        
        // Find all rating divs in clinic cards
        const ratingDivs = document.querySelectorAll('.text-yellow-500');
        if (ratingDivs.length === 0) {
            console.log('No rating divs found to update');
            return;
        }
        
        console.log(`Found ${ratingDivs.length} rating divs to update`);
        
        // Update the rating display for each clinic card
        ratingDivs.forEach(div => {
            // Get current text content
            const originalText = div.textContent;
            
            // Extract rating value and review count using regex
            const ratingMatch = originalText.match(/Rating: ([\d.]+|N\/A)/);
            const reviewsMatch = originalText.match(/\((\d+) reviews\)/);
            
            if (!ratingMatch) {
                console.log('Could not extract rating from text:', originalText);
                return;
            }
            
            // Get the rating value
            const ratingValue = ratingMatch[1] === 'N/A' ? 0 : parseFloat(ratingMatch[1]);
            const reviewsCount = reviewsMatch ? parseInt(reviewsMatch[1]) : 0;
            
            // Generate star rating HTML with proper classes
            let starRatingHtml = '';
            
            if (!ratingValue) {
                starRatingHtml = '<span class="no-rating">No rating</span>';
            } else {
                const fullStars = Math.floor(ratingValue);
                const halfStar = ratingValue % 1 >= 0.5;
                const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
                
                // Add numeric rating
                starRatingHtml += `<span class="numeric-rating">${ratingValue.toFixed(1)}</span> `;
                
                // Full stars
                for (let i = 0; i < fullStars; i++) {
                    starRatingHtml += '<span class="star full">★</span>';
                }
                
                // Half star
                if (halfStar) {
                    starRatingHtml += '<span class="star half">★</span>';
                }
                
                // Empty stars
                for (let i = 0; i < emptyStars; i++) {
                    starRatingHtml += '<span class="star empty">☆</span>';
                }
            }
            
            // Update div with new rating display
            div.innerHTML = `
                <div class="clinic-rating">
                    <div class="stars">${starRatingHtml}</div>
                    <span class="rating-text">${ratingValue > 0 ? ratingValue.toFixed(1) : 'No rating'} (${reviewsCount} reviews)</span>
                </div>
            `;
            
            // Add additional CSS styles
            div.style.color = '#FFD700';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.marginBottom = '8px';
            div.style.fontSize = '18px';
            div.style.lineHeight = '1';
        });
        
        console.log('Updated all rating displays');
    }, 3000);
}); 