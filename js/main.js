// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for sticky navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Waitlist Form Handling
const waitlistForm = document.getElementById('waitlist-form');
const formSuccess = document.getElementById('form-success');

if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = waitlistForm.querySelector('input[type="email"]');
        const submitButton = waitlistForm.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();

        // Basic email validation
        if (!email || !isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // hCaptcha validation
        const hCaptchaResponse = waitlistForm.querySelector('textarea[name=h-captcha-response]');
        if (!hCaptchaResponse || !hCaptchaResponse.value) {
            showNotification('Please complete the CAPTCHA verification.', 'error');
            return;
        }

        // Disable button and show loading state
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Joining...';

        try {
            // Submit to Web3Forms API
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: waitlistForm.querySelector('input[name="access_key"]').value,
                    email: email,
                    subject: 'ELEVA Waitlist Signup',
                    from_name: 'ELEVA Waitlist',
                    botcheck: waitlistForm.querySelector('input[name="botcheck"]').checked
                })
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                formSuccess.style.display = 'block';
                formSuccess.classList.add('show');
                emailInput.value = '';

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                    setTimeout(() => {
                        formSuccess.style.display = 'none';
                    }, 300);
                }, 5000);
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting to waitlist:', error);
            showNotification('Something went wrong. Please try again.', 'error');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// Email Validation Helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification Helper
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navbar Scroll Effect
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;
});

// Add transition to navbar
navbar.style.transition = 'transform 0.3s ease-in-out';

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .step-card, .security-feature');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        fadeInObserver.observe(el);
    });
});

// Dashboard Card Hover Effect
const dashboardCard = document.querySelector('.dashboard-card');
if (dashboardCard) {
    dashboardCard.addEventListener('mousemove', (e) => {
        const rect = dashboardCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;

        dashboardCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    dashboardCard.addEventListener('mouseleave', () => {
        dashboardCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });

    dashboardCard.style.transition = 'transform 0.1s ease-out';
}

// Console message for developers
console.log('%cELEVA 💜', 'color: #a855f7; font-size: 24px; font-weight: bold;');
console.log('%cWomen\'s Integrated Wellness Intelligence', 'color: #ec4899; font-size: 14px;');
console.log('%cInterested in joining our team? Contact us!', 'color: #ffffff; font-size: 12px;');
