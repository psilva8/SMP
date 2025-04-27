// areas.js - Handle area redirections and URL routing

document.addEventListener('DOMContentLoaded', function() {
    console.log('Areas.js loaded');
    
    // Environment detection
    const isLocalDev = window.location.protocol === 'file:' 
        || window.location.hostname === 'localhost' 
        || window.location.hostname === '127.0.0.1';
    
    console.log('Is local development:', isLocalDev);
    console.log('Current path:', window.location.pathname);
    
    // Get the current path
    const path = window.location.pathname;
    
    // If we're at the root of 'area/' or 'areas/' without an area name, redirect to areas.html
    if (path === '/area/' || path === '/area' || path === '/areas/' || path === '/areas') {
        window.location.href = isLocalDev ? 'areas.html' : '/areas.html';
        return;
    }
    
    // Handle area redirects
    // E.g. /area/beverly-hills/ -> /areas/beverly-hills/
    if (path.includes('/area/')) {
        const pathParts = path.split('/').filter(p => p.length > 0);
        const areaIndex = pathParts.indexOf('area');
        
        if (areaIndex !== -1 && areaIndex + 1 < pathParts.length) {
            const areaName = pathParts[areaIndex + 1];
            const redirectPath = isLocalDev 
                ? `areas/${areaName}/index.html` 
                : `/areas/${areaName}/`;
                
            console.log(`Redirecting from ${path} to ${redirectPath}`);
            window.location.href = redirectPath;
        }
    }
    
    // Handle direct /neighborhoods/area-name without extension
    if (path.includes('/neighborhoods/')) {
        const pathParts = path.split('/').filter(p => p.length > 0);
        const neighborhoodIndex = pathParts.indexOf('neighborhoods');
        
        if (neighborhoodIndex !== -1 && neighborhoodIndex + 1 < pathParts.length) {
            const areaName = pathParts[neighborhoodIndex + 1].replace('.html', '');
            const redirectPath = isLocalDev 
                ? `areas/${areaName}/index.html` 
                : `/areas/${areaName}/`;
                
            console.log(`Redirecting from ${path} to ${redirectPath}`);
            window.location.href = redirectPath;
        }
    }
    
    // Extract area name from query parameter if present
    const urlParams = new URLSearchParams(window.location.search);
    const areaParam = urlParams.get('area');
    
    if (areaParam) {
        const urlFriendlyArea = areaParam.toLowerCase().replace(/\s+/g, '-');
        const redirectPath = isLocalDev 
            ? `areas/${encodeURIComponent(urlFriendlyArea)}/index.html` 
            : `/areas/${encodeURIComponent(urlFriendlyArea)}/`;
            
        console.log(`Redirecting from query param ${areaParam} to ${redirectPath}`);
        window.location.href = redirectPath;
    }
}); 