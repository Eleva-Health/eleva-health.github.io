/**
 * Contact Form Handler
 * Handles form submission, validation, and communication with Web3Forms API
 */

(function() {
    'use strict';

    // Get form elements
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const formMessage = document.getElementById('formMessage');

    // Get input fields
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Get error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const captchaError = document.getElementById('captchaError');

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        return emailRegex.test(email);
    }

    /**
     * Clear all error messages
     */
    function clearErrors() {
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        captchaError.textContent = '';
        formMessage.style.display = 'none';
    }

    /**
     * Show success message
     */
    function showSuccess(message) {
        formMessage.textContent = message;
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Show error message
     */
    function showError(message) {
        formMessage.textContent = message;
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Validate form inputs
     */
    function validateForm() {
        let isValid = true;
        clearErrors();

        // Validate name
        const name = nameInput.value.trim();
        if (name.length < 2) {
            nameError.textContent = 'Name must be at least 2 characters long';
            isValid = false;
        } else if (name.length > 100) {
            nameError.textContent = 'Name must be less than 100 characters';
            isValid = false;
        }

        // Validate email
        const email = emailInput.value.trim();
        if (!email) {
            emailError.textContent = 'Email is required';
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }

        // Validate message
        const message = messageInput.value.trim();
        if (message.length < 10) {
            messageError.textContent = 'Message must be at least 10 characters long';
            isValid = false;
        } else if (message.length > 1000) {
            messageError.textContent = 'Message must be less than 1000 characters';
            isValid = false;
        }

        // Check hCaptcha
        const captchaResponse = form.querySelector('[name="h-captcha-response"]');
        if (!captchaResponse || !captchaResponse.value) {
            captchaError.textContent = 'Please complete the captcha verification';
            isValid = false;
        }

        return isValid;
    }

    /**
     * Reset form to initial state
     */
    function resetForm() {
        form.reset();

        // Reset hCaptcha
        if (typeof hcaptcha !== 'undefined') {
            hcaptcha.reset();
        }

        clearErrors();
    }

    /**
     * Handle form submission
     */
    async function handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Disable button and show loader
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        try {
            // Prepare form data
            const formData = new FormData(form);

            // Add timestamp
            formData.append('timestamp', new Date().toISOString());

            // Submit to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Success!
                showSuccess('Thank you for your message! We\'ll get back to you as soon as possible.');
                resetForm();
            } else {
                // API returned error
                showError('Oops! Something went wrong. Please try again or contact us directly.');
                console.error('Form submission error:', result);
            }

        } catch (error) {
            // Network or other error
            showError('Unable to send your message. Please check your connection and try again.');
            console.error('Form submission error:', error);
        } finally {
            // Re-enable button and hide loader
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }

    /**
     * Real-time validation on blur
     */
    nameInput.addEventListener('blur', function() {
        const name = this.value.trim();
        if (name && (name.length < 2 || name.length > 100)) {
            nameError.textContent = 'Name must be between 2 and 100 characters';
        } else {
            nameError.textContent = '';
        }
    });

    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
        } else {
            emailError.textContent = '';
        }
    });

    messageInput.addEventListener('blur', function() {
        const message = this.value.trim();
        if (message && (message.length < 10 || message.length > 1000)) {
            messageError.textContent = 'Message must be between 10 and 1000 characters';
        } else {
            messageError.textContent = '';
        }
    });

    /**
     * Character counter for message field (optional enhancement)
     */
    messageInput.addEventListener('input', function() {
        const length = this.value.length;
        const hint = this.parentElement.querySelector('.form-hint');

        if (length > 0) {
            hint.textContent = `${length}/1000 characters`;

            if (length < 10) {
                hint.style.color = '#ef4444';
            } else if (length > 900) {
                hint.style.color = '#f59e0b';
            } else {
                hint.style.color = 'var(--text-tertiary)';
            }
        } else {
            hint.textContent = 'Minimum 10 characters, maximum 1000 characters';
            hint.style.color = 'var(--text-tertiary)';
        }
    });

    // Attach form submit handler
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

})();
