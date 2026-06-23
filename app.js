// Navigation menu toggle for mobile
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');

    // Burger Animation
    burger.classList.toggle('toggle');

    // Animate lines if needed
    const line1 = document.querySelector('.line1');
    const line2 = document.querySelector('.line2');
    const line3 = document.querySelector('.line3');

    if (nav.classList.contains('nav-active')) {
        line1.style.transform = 'rotate(-45deg) translate(-5px, 5px)';
        line2.style.opacity = '0';
        line3.style.transform = 'rotate(45deg) translate(-5px, -5px)';
    } else {
        line1.style.transform = 'none';
        line2.style.opacity = '1';
        line3.style.transform = 'none';
    }
});

// Removed smooth scrolling as it's a multi-page site now
// Portfolio Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');

            if (filterValue === 'all' || filterValue === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 400); // Matches transition duration
            }
        });
    });
});

// Form Submission to Google Sheets
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzRkmHDkjip7ej6iJ4z1ksY7yCcB8xK5lAWbkFn518c9sT9z5Pj0DdD3jok884cglfL/exec'; // Replace with the actual deployed URL

function handleFormSubmit(formId, msgId, successText) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const msgEl = document.getElementById(msgId);
        const originalText = btn.innerText;

        btn.innerText = 'Sending...';
        btn.disabled = true;
        msgEl.innerText = '';
        msgEl.style.color = 'var(--text-main)';

        const formData = new FormData(form);
        // Add form identifier to know which sheet to use
        formData.append('formType', formId);
        
        // Convert FormData to URLSearchParams so Google Apps Script can parse it via e.parameter
        const formBody = new URLSearchParams(formData);

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formBody,
            mode: 'no-cors' // Needs to be no-cors for Google Apps Script without complex setup
        })
            .then(() => {
                btn.innerText = 'Sent!';
                btn.style.background = '#4CAF50';
                msgEl.innerText = successText;
                msgEl.style.color = '#4CAF50';
                form.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    msgEl.innerText = '';
                }, 5000);
            })
            .catch(error => {
                console.error('Error!', error.message);
                btn.innerText = originalText;
                btn.disabled = false;
                msgEl.innerText = 'Error sending message. Please try again.';
                msgEl.style.color = 'var(--accent)';
            });
    });
}

handleFormSubmit('emailCollectorForm', 'newsletterMsg', 'Successfully subscribed!');
handleFormSubmit('mainContactForm', 'contactFormMsg', 'Message sent successfully. We will get back to you soon!');

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 12, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 12, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Video Modal Logic
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeModal = document.querySelector('.close-modal');

if (videoModal && videoPlayer && closeModal) {
    // Open modal on portfolio item click
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const videoUrl = item.getAttribute('data-video');
            if (videoUrl) {
                videoPlayer.src = videoUrl;
                videoModal.classList.add('show');
                videoPlayer.play().catch(e => console.log('Autoplay prevented:', e));
            }
        });
    });

    // Close modal function
    const closeVideoModal = () => {
        videoModal.classList.remove('show');
        videoPlayer.pause();
        setTimeout(() => { videoPlayer.src = ''; }, 300);
    };

    // Close on X click
    closeModal.addEventListener('click', closeVideoModal);

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
}
