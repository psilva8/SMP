const fs = require('fs');
const path = require('path');

// Function to update all HTML files to remove Hair Tattoo Treatment from clinic cards
function removeScalpMicropigmentationFromCards() {
  console.log('Starting to remove Hair Tattoo Treatment from clinic cards...');
  
  // Update index-fix.js
  updateIndexFix();
  
  // Update scripts.js
  updateScriptsJs();
  
  // Update area-fix.js to also modify existing clinic cards
  updateAreaFix();
  
  console.log('Completed removal of Hair Tattoo Treatment from clinic cards.');
}

// Function to update index-fix.js
function updateIndexFix() {
  const filePath = path.join(__dirname, 'index-fix.js');
  
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove placeholder text using SMP
      content = content.replace(/text=SMP\+Clinic/g, 'text=Clinic');
      
      // Ensure we're using empty services array
      const servicesRegex = /const services = \[(.*?)\];/g;
      content = content.replace(servicesRegex, 'const services = [];');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated index-fix.js');
    }
  } catch (error) {
    console.error('Error updating index-fix.js:', error);
  }
}

// Function to update scripts.js
function updateScriptsJs() {
  const filePath = path.join(__dirname, 'scripts.js');
  
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove placeholder text using SMP
      content = content.replace(/text=SMP\+Clinic/g, 'text=Clinic');
      
      // Fix filterAndDisplayAreaBusinesses function
      content = content.replace(
        /clinicsContainer\.innerHTML = `<p class="loading-text">No SMP clinics found in/g, 
        'clinicsContainer.innerHTML = `<p class="loading-text">No clinics found in'
      );
      
      // Fix updatePageTitle function
      content = content.replace(
        /titleElement\.textContent = `SMP Clinics in \${areaName}/g,
        'titleElement.textContent = `Clinics in ${areaName}'
      );
      
      content = content.replace(
        /pageTitle\.textContent = `SMP Clinics in \${areaName}`;/g,
        'pageTitle.textContent = `Clinics in ${areaName}`;'
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated scripts.js');
    }
  } catch (error) {
    console.error('Error updating scripts.js:', error);
  }
}

// Function to update area-fix.js
function updateAreaFix() {
  const filePath = path.join(__dirname, 'area-fix.js');
  
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Add code to find and remove any remaining "Hair Tattoo Treatment" text from clinic cards
      if (!content.includes('removeScalpMicropigmentation')) {
        // Add the function to remove any "Hair Tattoo Treatment" from existing cards
        content = content.replace(
          /console\.log\('Area fix script loaded'\);/,
          `console.log('Area fix script loaded');
          
    // Function to remove any remaining Hair Tattoo Treatment text from clinic cards
    function removeScalpMicropigmentation() {
        // Find all clinic service containers
        const serviceContainers = document.querySelectorAll('.clinic-services');
        if (serviceContainers.length > 0) {
            console.log('Found ' + serviceContainers.length + ' clinic service containers to check');
            
            serviceContainers.forEach(container => {
                // Find and remove any service with "Hair Tattoo Treatment" text
                const serviceSpans = container.querySelectorAll('.clinic-service');
                serviceSpans.forEach(span => {
                    if (span.textContent.includes('Hair Tattoo Treatment')) {
                        span.remove();
                        console.log('Removed Hair Tattoo Treatment from a clinic card');
                    }
                });
            });
        }
    }
    
    // Run the function to clean up existing cards
    setTimeout(removeScalpMicropigmentation, 1000);`
        );
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated area-fix.js');
    }
  } catch (error) {
    console.error('Error updating area-fix.js:', error);
  }
}

// Run the function
removeScalpMicropigmentationFromCards(); 