const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Function to update HTML styling
function fixHtmlStyling(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Add meta tags and CSS links to standard pages
        if (!content.includes('tailwindcss') && !filePath.includes('/areas/')) {
            // Fix regular pages (not area pages)
            content = content.replace(
                /<head>[\s\S]*?<title>/g, 
                `<head>
    <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; img-src * data: blob:; connect-src *;">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Find top-rated Hair Tattoo clinics in your area. Compare services, reviews, and pricing.">
    <meta name="keywords" content="Hair Tattoo, Hair Loss, Hairline Restoration, Hair Tattoo Clinic">
    <title>`
            );
            
            // Add CSS link if missing
            if (!content.includes('<link rel="stylesheet" href="styles.css">')) {
                content = content.replace(
                    /<title>.*?<\/title>/g, 
                    '$&\n    <meta name="author" content="Hair Tattoo Directory">\n    <link rel="stylesheet" href="styles.css">'
                );
            }
        } else if (content.includes('tailwindcss') || filePath.includes('/areas/')) {
            // Fix area pages (using Tailwind CSS)
            content = content.replace(
                /<head>[\s\S]*?<title>/g, 
                `<head>
    <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; img-src * data: blob:; connect-src *;">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Find top-rated Hair Tattoo clinics. Compare providers, services, and read reviews.">
    <title>`
            );
            
            // Add Tailwind CSS link if missing
            if (!content.includes('cdn.jsdelivr.net/npm/tailwindcss')) {
                content = content.replace(
                    /<title>.*?<\/title>/g, 
                    '$&\n    <meta name="author" content="Hair Tattoo Directory">\n    <!-- Tailwind CSS CDN -->\n    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">'
                );
            }
        }
        
        // Fix broken image paths
        if (content.includes('img/smp-treatment.jpg')) {
            content = content.replace('img/smp-treatment.jpg', 'img/hair-tattoo-treatment.jpg');
        }
        
        // Fix relative paths in area pages
        if (filePath.includes('/areas/')) {
            // Fix script source paths
            content = content.replace(
                /<script src="\/scripts.js"><\/script>/g,
                '<script src="../../scripts.js"></script>'
            );
            
            // Fix navigation links
            // Fix navigation links - but avoid double areas paths
            content = content.replace(/href="\/areas\//g, function(match, offset, string) {
                // Check if we're already in an areas subdirectory
                const beforeMatch = string.substring(0, offset);
                if (beforeMatch.includes('../../areas/')) {
                    return match; // Don't modify if already has relative path
                }
                return 'href="../../areas/';
            });/g, 'href="../../areas/');
            content = content.replace(/href="\/about.html"/g, 'href="../../about.html"');
            content = content.replace(/href="\/"([^.])/g, 'href="../../$1');
        }
        
        // Save if changes were made
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated HTML styling in: ${filePath}`);
            return true;
        } else {
            console.log(`No changes needed in: ${filePath}`);
            return false;
        }
    } catch (err) {
        console.error(`Error updating file ${filePath}:`, err);
        return false;
    }
}

// Process HTML files recursively
function processHtmlFiles(directory) {
    const files = fs.readdirSync(directory);
    let count = 0;
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile() && path.extname(filePath).toLowerCase() === '.html') {
            const updated = fixHtmlStyling(filePath);
            if (updated) count++;
        } else if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
            count += processHtmlFiles(filePath);
        }
    }
    
    return count;
}

// Check for the image file and rename if needed
const smpImagePath = path.join(rootDir, 'img', 'smp-treatment.jpg');
const hairTattooImagePath = path.join(rootDir, 'img', 'hair-tattoo-treatment.jpg');

if (fs.existsSync(smpImagePath) && !fs.existsSync(hairTattooImagePath)) {
    try {
        const imgDir = path.join(rootDir, 'img');
        if (!fs.existsSync(imgDir)) {
            fs.mkdirSync(imgDir, { recursive: true });
        }
        fs.copyFileSync(smpImagePath, hairTattooImagePath);
        console.log('Image renamed from smp-treatment.jpg to hair-tattoo-treatment.jpg');
    } catch (err) {
        console.error('Error renaming image file:', err);
    }
}

console.log("Starting HTML fixes across all files...");
const totalUpdated = processHtmlFiles(rootDir);
console.log(`\nTotal files updated: ${totalUpdated}`);
console.log("HTML styling fixes complete."); 