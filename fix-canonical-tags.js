const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;
const areasDir = path.join(rootDir, 'areas');

// Base URL of your site
const baseUrl = 'https://micropigmentationla.com';

// Function to add canonical tag to an HTML file
function addCanonicalTag(filePath, areaName) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Create the canonical URL for this area
        const canonicalUrl = `${baseUrl}/areas/${areaName}/`;
        
        // Check if canonical tag already exists
        if (content.includes('rel="canonical"')) {
            console.log(`Canonical tag already exists in: ${filePath}`);
            return false;
        }
        
        // Find the head section and add canonical tag
        // Look for the closing </head> tag and insert before it
        const headCloseIndex = content.indexOf('</head>');
        if (headCloseIndex === -1) {
            console.error(`Could not find </head> tag in: ${filePath}`);
            return false;
        }
        
        // Insert canonical tag before </head>
        const canonicalTag = `  <link rel="canonical" href="${canonicalUrl}" />\n`;
        content = content.substring(0, headCloseIndex) + canonicalTag + content.substring(headCloseIndex);
        
        // Also ensure proper meta description for this specific area
        const metaDescPattern = /<meta[^>]+name="description"[^>]*content="([^"]*)"[^>]*>/i;
        const currentMetaDesc = content.match(metaDescPattern);
        
        if (currentMetaDesc && !currentMetaDesc[1].includes(areaName)) {
            // Update meta description to be more specific to the area
            const newMetaDesc = `Find top-rated hair tattoo treatment (SMP) clinics in ${areaName}. Compare providers, services, and reviews for scalp micropigmentation.`;
            content = content.replace(metaDescPattern, `<meta name="description" content="${newMetaDesc}" />`);
        }
        
        // Save if changes were made
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Added canonical tag to: ${filePath}`);
            console.log(`Canonical URL: ${canonicalUrl}`);
            return true;
        }
        
        return false;
    } catch (err) {
        console.error(`Error processing file ${filePath}:`, err);
        return false;
    }
}

// Function to process all area pages
function processAreaPages() {
    let processedCount = 0;
    
    try {
        // Read all area directories
        const areas = fs.readdirSync(areasDir);
        
        areas.forEach(area => {
            const areaPath = path.join(areasDir, area);
            const stat = fs.statSync(areaPath);
            
            if (stat.isDirectory()) {
                const indexPath = path.join(areaPath, 'index.html');
                
                if (fs.existsSync(indexPath)) {
                    const updated = addCanonicalTag(indexPath, area);
                    if (updated) processedCount++;
                } else {
                    console.warn(`No index.html found in: ${areaPath}`);
                }
            }
        });
        
        return processedCount;
    } catch (err) {
        console.error('Error reading areas directory:', err);
        return 0;
    }
}

// Function to update the main template files as well
function updateTemplateFiles() {
    const templateFiles = [
        'area-template.html',
        'area.html'
    ];
    
    let updatedCount = 0;
    
    templateFiles.forEach(templateFile => {
        const templatePath = path.join(rootDir, templateFile);
        
        if (fs.existsSync(templatePath)) {
            try {
                let content = fs.readFileSync(templatePath, 'utf8');
                let originalContent = content;
                
                // Check if canonical tag already exists
                if (content.includes('rel="canonical"')) {
                    console.log(`Canonical tag already exists in template: ${templateFile}`);
                    return;
                }
                
                // Find the head section and add canonical tag placeholder
                const headCloseIndex = content.indexOf('</head>');
                if (headCloseIndex !== -1) {
                    // Insert canonical tag placeholder before </head>
                    const canonicalTag = `  <link rel="canonical" href="${baseUrl}/areas/{{AREA_SLUG}}/" />\n`;
                    content = content.substring(0, headCloseIndex) + canonicalTag + content.substring(headCloseIndex);
                    
                    if (content !== originalContent) {
                        fs.writeFileSync(templatePath, content, 'utf8');
                        console.log(`Added canonical tag placeholder to template: ${templateFile}`);
                        updatedCount++;
                    }
                }
            } catch (err) {
                console.error(`Error updating template ${templateFile}:`, err);
            }
        }
    });
    
    return updatedCount;
}

// Function to create a sitemap with all area pages
function updateSitemap() {
    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    
    try {
        // Read current sitemap
        let sitemap = fs.readFileSync(sitemapPath, 'utf8');
        
        // Check if area URLs are already in sitemap
        if (sitemap.includes('/areas/')) {
            console.log('Area URLs already exist in sitemap');
            return false;
        }
        
        // Read all area directories
        const areas = fs.readdirSync(areasDir);
        const areaUrls = [];
        
        areas.forEach(area => {
            const areaPath = path.join(areasDir, area);
            const stat = fs.statSync(areaPath);
            
            if (stat.isDirectory()) {
                const indexPath = path.join(areaPath, 'index.html');
                if (fs.existsSync(indexPath)) {
                    areaUrls.push(`  <url>
    <loc>${baseUrl}/areas/${area}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
                }
            }
        });
        
        // Insert area URLs before the closing </urlset> tag
        const urlsetCloseIndex = sitemap.indexOf('</urlset>');
        if (urlsetCloseIndex !== -1) {
            const areaUrlsXml = areaUrls.join('\n') + '\n';
            sitemap = sitemap.substring(0, urlsetCloseIndex) + areaUrlsXml + sitemap.substring(urlsetCloseIndex);
            
            fs.writeFileSync(sitemapPath, sitemap, 'utf8');
            console.log(`Added ${areaUrls.length} area URLs to sitemap.xml`);
            return true;
        }
        
        return false;
    } catch (err) {
        console.error('Error updating sitemap:', err);
        return false;
    }
}

// Main execution
console.log('Starting canonical tags fix for area pages...');

// Process all area pages
const processedPages = processAreaPages();

// Update template files for future area pages
const updatedTemplates = updateTemplateFiles();

// Update sitemap with area URLs
const sitemapUpdated = updateSitemap();

console.log(`\n=== SUMMARY ===`);
console.log(`Area pages updated: ${processedPages}`);
console.log(`Template files updated: ${updatedTemplates}`);
console.log(`Sitemap updated: ${sitemapUpdated ? 'Yes' : 'No'}`);

console.log('\n=== NEXT STEPS ===');
console.log('1. Commit and push these changes to your repository');
console.log('2. Submit the updated sitemap.xml to Google Search Console');
console.log('3. Use the URL Inspection tool to request re-indexing of affected pages');
console.log('4. The canonical tags will help Google understand which URLs are preferred');

console.log('\nCanonical tags fix completed!'); 