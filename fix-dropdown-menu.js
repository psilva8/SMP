const fs = require('fs');
const path = require('path');

// Root directory
const rootDir = __dirname;

// Content to add to all pages to fix dropdown menus
const dropdownFixScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Fix dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropbtn') || dropdown.querySelector('a:first-child');
        const content = dropdown.querySelector('.dropdown-content') || dropdown.querySelector('.dropdown-menu');
        
        if (button && content) {
            // Add click event to toggle dropdown
            button.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close all other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});
</script>
`;

// Function to add dropdown fix script to HTML files
function addDropdownFix(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file already has the dropdown fix
        if (content.includes('Fix dropdown menus')) {
            console.log(`Dropdown fix already exists in: ${filePath}`);
            return false;
        }
        
        // Add the script before the closing body tag
        const updatedContent = content.replace('</body>', `${dropdownFixScript}\n</body>`);
        
        // Save the updated file
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Added dropdown fix to: ${filePath}`);
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
            const updated = addDropdownFix(filePath);
            if (updated) count++;
        } else if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
            count += processHtmlFiles(filePath);
        }
    }
    
    return count;
}

console.log("Starting dropdown menu fixes across all HTML files...");
const totalUpdated = processHtmlFiles(rootDir);
console.log(`\nTotal files updated: ${totalUpdated}`);
console.log("Dropdown menu fixes complete."); 