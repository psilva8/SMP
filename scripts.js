// SMP Landing Page JavaScript

// DOM Elements
let consultationForm;
let mobileMenuToggle;
let navMenu;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Initialize page functionality
function initializePage() {
    // Get DOM elements
    consultationForm = document.getElementById('consultationForm');
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize animations
    initializeAnimations();
    
    console.log('SMP Landing Page initialized');
}

// Set up all event listeners
function setupEventListeners() {
    // Form submission
    if (consultationForm) {
        consultationForm.addEventListener('submit', handleFormSubmission);
    }
    
    // Smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Service card interactions
    setupServiceCards();
    
    // Add scroll animations
    setupScrollAnimations();
}

// Handle consultation form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(consultationForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.service) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(data.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = consultationForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Booking...';
    submitButton.disabled = true;
    
    // Submit to HubSpot
    submitToHubSpot(data, submitButton, originalText);
}

// Submit form data to HubSpot
function submitToHubSpot(data, submitButton, originalText) {
    // HubSpot credentials from your account
    const HUBSPOT_PORTAL_ID = '243392629';
    const HUBSPOT_FORM_GUID = 'a1109ab9-116a-493b-8ba3-ed550350eabc';
    
    // HubSpot Forms API endpoint for NA2 region
    const HUBSPOT_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;
    
    // Prepare data for HubSpot submission
    const hubspotData = {
        fields: [
            {
                objectTypeId: "0-1", // Contact object
                name: "email",
                value: data.email
            },
            {
                objectTypeId: "0-1",
                name: "firstname", 
                value: data.name.split(' ')[0]
            },
            {
                objectTypeId: "0-1",
                name: "lastname",
                value: data.name.split(' ').slice(1).join(' ') || ''
            },
            {
                objectTypeId: "0-1",
                name: "phone",
                value: data.phone
            },
            {
                objectTypeId: "0-1",
                name: "service_interest", // Custom property - you may need to create this in HubSpot
                value: data.service
            },
            {
                objectTypeId: "0-1",
                name: "message", // Custom property - you may need to create this in HubSpot
                value: data.message || ''
            }
        ],
        context: {
            pageUri: window.location.href,
            pageName: document.title,
            hutk: getHubSpotCookie() // Gets the HubSpot tracking cookie if available
        }
    };
    
    // Submit to HubSpot
    fetch(HUBSPOT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hubspotData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok');
    })
    .then(result => {
        // Success
        console.log('Successfully submitted to HubSpot:', result);
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showMessage('Thank you! Your consultation request has been submitted. We\'ll contact you within 24 hours.', 'success');
        
        // Reset form
        consultationForm.reset();
        
        // Optional: Track conversion with Google Analytics or other analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with your conversion tracking ID
                'value': 1.0,
                'currency': 'USD'
            });
        }
    })
    .catch(error => {
        console.error('Error submitting to HubSpot:', error);
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show error message
        showMessage('Sorry, there was an error submitting your request. Please try again or call us directly.', 'error');
    });
}

// Get HubSpot tracking cookie for better attribution
function getHubSpotCookie() {
    const name = 'hubspotutk=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message to user
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.style.cssText = `
        padding: 15px;
        margin: 15px 0;
        border-radius: 6px;
        font-weight: 500;
        text-align: center;
        ${type === 'success' ? 'background: #48bb78; color: white;' : ''}
        ${type === 'error' ? 'background: #f56565; color: white;' : ''}
        ${type === 'info' ? 'background: #4299e1; color: white;' : ''}
    `;
    messageEl.textContent = message;
    
    // Insert message above the form
    consultationForm.insertBefore(messageEl, consultationForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Functions called from HTML onclick handlers
function openConsultationForm() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const headerOffset = 80;
        const elementPosition = contactSection.offsetTop;
        const offsetPosition = elementPosition - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Focus on the name field after a short delay
        setTimeout(() => {
            const nameField = document.getElementById('name');
            if (nameField) {
                nameField.focus();
            }
        }, 800);
    }
}

function scrollToGallery() {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        const headerOffset = 80;
        const elementPosition = gallerySection.offsetTop;
        const offsetPosition = elementPosition - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Setup service card interactions
function setupServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const button = card.querySelector('.service-cta');
        
        if (button) {
            button.addEventListener('click', function() {
                // Get the service name
                const serviceName = card.querySelector('h3').textContent;
                
                // Pre-fill the form with this service
                const serviceSelect = document.getElementById('service');
                if (serviceSelect) {
                    // Map service names to form values
                    const serviceMap = {
                        'Hairline Restoration': 'hairline',
                        'Density Enhancement': 'density',
                        'Scar Concealment': 'scar',
                        'Complete Baldness Solution': 'complete'
                    };
                    
                    const serviceValue = serviceMap[serviceName];
                    if (serviceValue) {
                        serviceSelect.value = serviceValue;
                    }
                }
                
                // Scroll to consultation form
                openConsultationForm();
            });
        }
    });
}

// Initialize animations on scroll
function setupScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .about-content, .contact-content');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize animations
function initializeAnimations() {
    // Add staggered animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add staggered animation to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
}

// Header scroll effect
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Add header scroll effect after DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeHeaderScroll();
});

// Gallery hover effects
function initializeGalleryEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Initialize gallery effects
document.addEventListener('DOMContentLoaded', function() {
    initializeGalleryEffects();
});

// Phone number formatting
function formatPhoneNumber(input) {
    // Remove all non-digit characters
    let value = input.value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    
    input.value = value;
}

// Add phone formatting to phone input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
});

// Utility function to get element by ID safely
function getElementById(id) {
    return document.getElementById(id);
}

// Utility function to add class safely
function addClass(element, className) {
    if (element && element.classList) {
        element.classList.add(className);
    }
}

// Utility function to remove class safely
function removeClass(element, className) {
    if (element && element.classList) {
        element.classList.remove(className);
    }
}

// Console log for debugging
console.log('SMP Landing Page JavaScript loaded successfully'); 