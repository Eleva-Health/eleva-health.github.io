// Homepage-specific JavaScript
// Only loaded on index.html

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

            // Check for rate limiting
            if (response.status === 429) {
                showNotification('Too many requests. Please wait a minute and try again.', 'error');
                return;
            }

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

            // Specific error handling
            if (error.message && error.message.includes('429')) {
                showNotification('Too many requests. Please wait a minute and try again.', 'error');
            } else {
                showNotification('Something went wrong. Please try again.', 'error');
            }
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
