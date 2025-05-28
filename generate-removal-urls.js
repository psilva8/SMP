const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Base URL of your site
const baseUrl = 'https://micropigmentationla.com';

// Function to generate list of problematic URLs
function generateRemovalUrls() {
    const problematicUrls = [];
    
    try {
        // Read all area directories
        const areas = fs.readdirSync(areasDir);
        
        // Generate the problematic double areas URLs
        areas.forEach(area => {
            const areaPath = path.join(areasDir, area);
            const stat = fs.statSync(areaPath);
            
            if (stat.isDirectory()) {
                // Generate the problematic double areas URLs
                const problematicUrl = `${baseUrl}/areas/areas/${area}/`;
                problematicUrls.push(problematicUrl);
            }
        });
        
        // Sort the URLs
        problematicUrls.sort();
        
        return problematicUrls;
    } catch (err) {
        console.error('Error reading areas directory:', err);
        return [];
    }
}

// Function to save URLs to a file
function saveUrlsToFile(urls) {
    const outputFile = path.join(rootDir, 'urls-to-remove.txt');
    const content = urls.join('\n');
    
    try {
        fs.writeFileSync(outputFile, content, 'utf8');
        console.log(`Saved ${urls.length} URLs to ${outputFile}`);
        return true;
    } catch (err) {
        console.error('Error saving URLs to file:', err);
        return false;
    }
}

// Function to create a CSV file for bulk removal
function createCsvFile(urls) {
    const csvFile = path.join(rootDir, 'urls-to-remove.csv');
    const csvContent = 'URL\n' + urls.join('\n');
    
    try {
        fs.writeFileSync(csvFile, csvContent, 'utf8');
        console.log(`Saved ${urls.length} URLs to ${csvFile} for bulk removal`);
        return true;
    } catch (err) {
        console.error('Error saving CSV file:', err);
        return false;
    }
}

// Main execution
console.log('Generating list of problematic URLs to remove from Google Search Console...');

const urlsToRemove = generateRemovalUrls();

if (urlsToRemove.length > 0) {
    console.log(`\nFound ${urlsToRemove.length} problematic URLs:`);
    
    // Show first 10 URLs as examples
    console.log('\nFirst 10 URLs:');
    urlsToRemove.slice(0, 10).forEach((url, index) => {
        console.log(`${index + 1}. ${url}`);
    });
    
    if (urlsToRemove.length > 10) {
        console.log(`... and ${urlsToRemove.length - 10} more`);
    }
    
    // Save to files
    saveUrlsToFile(urlsToRemove);
    createCsvFile(urlsToRemove);
    
    console.log('\n=== INSTRUCTIONS FOR GOOGLE SEARCH CONSOLE ===');
    console.log('1. Go to Google Search Console: https://search.google.com/search-console');
    console.log('2. Select your property: micropigmentationla.com');
    console.log('3. Go to "Removals" in the left sidebar');
    console.log('4. Click "New Request"');
    console.log('5. Choose "Remove URLs"');
    console.log('6. For each URL, select "Remove this URL only"');
    console.log('7. You can also use the pattern: /areas/areas/* to remove all at once');
    console.log('\n=== BULK REMOVAL OPTION ===');
    console.log('You can use the CSV file (urls-to-remove.csv) if Google provides bulk removal tools');
    console.log('\n=== PREVENTION ===');
    console.log('The robots.txt file has been updated to prevent future crawling of these URLs');
    
} else {
    console.log('No problematic URLs found.');
}

console.log('\nScript completed.'); 