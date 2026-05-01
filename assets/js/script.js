// ============================================
// QUANTOM Website JavaScript - Master Script
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize Core UI & Visuals
    initSmoothScroll();
    initScrollToTop();
    initScrollReveal();
    initFloatingParallax();
    
    // 2. Initialize Component Logic
    animateCounters();
    initTopicSelection(); 
    initArticleCards();
    initFAQEnhancement();
    
    // 3. Initialize All Form Logic
    initContactForms();
    initNewsletterForms();
    initBurgerContact();
});

// ============================================
// SECTION 1: ANIMATIONS & REVEALS
// ============================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(c => observer.observe(c));
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Smooth deceleration
        obj.innerHTML = Math.floor(easeOutQuart * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function initArticleCards() {
    const cards = document.querySelectorAll('.article-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Staggered entrance
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.cssText = 'opacity: 0; transform: translateY(30px); transition: all 0.6s ease;';
        observer.observe(card);
    });
}

function initFloatingParallax() {
    const floatElements = document.querySelectorAll('.contact-float-decoration, .footer-float-decoration');
    // Disable on touch devices to save battery/performance
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        floatElements.forEach((el, i) => {
            const speed = (i % 3 + 1) * 0.5;
            el.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        });
    });
}

// ============================================
// SECTION 2: NAVIGATION & UI UTILITIES
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = document.querySelector('.navbar')?.offsetHeight || 0;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
                // Close mobile menu if open
                const toggler = document.querySelector('.navbar-toggler');
                const collapse = document.querySelector('.navbar-collapse');
                if (collapse?.classList.contains('show')) toggler.click();
            }
        });
    });
}

function initTopicSelection() {
    const allTags = document.querySelectorAll('.topic-tag, .topic-chip');
    allTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.active').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            // Interaction feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = '', 150);
        });
    });
}

function initFAQEnhancement() {
    const buttons = document.querySelectorAll('.accordion-button');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('.faq-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                setTimeout(() => icon.style.transform = '', 200);
            }
        });
    });
}

// ============================================
// SECTION 3: FORM LOGIC & FEEDBACK
// ============================================

function initContactForms() {
    const forms = document.querySelectorAll('.cute-form, #contactFormNew');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"], .btn-send-message');
            const originalHTML = submitBtn.innerHTML;
            
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let valid = true;
            inputs.forEach(i => { if(!i.value) valid = false; });

            if (!valid) {
                showCuteAlert('Please fill in all fields! 🥺', 'error');
                return;
            }

            submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate API Call
            setTimeout(() => {
                showCuteAlert('Yay! Your message has been sent! 🎉', 'success');
                submitBtn.innerHTML = '<i class="bi bi-check-lg"></i> Sent!';
                submitBtn.style.background = '#28a745';
                
                const successView = document.getElementById('contactSuccess');
                const formView = document.getElementById('contactFormView');
                if (successView) {
                    formView.classList.add('hidden');
                    successView.classList.remove('hidden');
                }

                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    });
}

function initNewsletterForms() {
    const newsForms = document.querySelectorAll('.newsletter-form, #newsletterFormNew');
    
    newsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"]');
            const btn = this.querySelector('button');
            
            if (!input.value || !input.value.includes('@')) {
                showCuteAlert('Please enter a valid email! 📧', 'error');
                return;
            }

            const originalBtn = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-lg"></i>';
            btn.style.background = '#28a745';
            
            showCuteAlert('Welcome to the QUANTOM crew! 🎊', 'success');
            
            setTimeout(() => {
                this.reset();
                btn.innerHTML = originalBtn;
                btn.style.background = '';
            }, 2500);
        });
    });
}

function initBurgerContact() {
    const burgerBtn = document.getElementById('burgerBtn');
    const backBtn = document.getElementById('backToBurger');
    const trigger = document.getElementById('burgerTrigger');
    const formView = document.getElementById('contactFormView');

    if (!burgerBtn) return;

    burgerBtn.addEventListener('click', () => {
        burgerBtn.style.transform = 'scale(0) rotate(360deg)';
        burgerBtn.style.opacity = '0';
        setTimeout(() => {
            trigger.classList.add('hidden');
            formView.classList.remove('hidden');
            formView.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            formView.classList.add('hidden');
            document.getElementById('contactSuccess')?.classList.add('hidden');
            trigger.classList.remove('hidden');
            burgerBtn.style.transform = '';
            burgerBtn.style.opacity = '1';
        });
    }
}

// ============================================
// SECTION 4: GLOBAL UTILITIES & STYLES
// ============================================

function showCuteAlert(message, type = 'success') {
    const oldAlert = document.querySelector('.cute-alert');
    if (oldAlert) oldAlert.remove();

    const alert = document.createElement('div');
    alert.className = `cute-alert cute-alert-${type}`;
    alert.innerHTML = `<span>${type === 'success' ? '✨' : '💫'}</span> ${message}`;
    
    Object.assign(alert.style, {
        position: 'fixed', top: '100px', left: '50%',
        transform: 'translateX(-50%) translateY(-20px)',
        background: type === 'success' ? 'linear-gradient(135deg, #28a745, #34ce57)' : 'linear-gradient(135deg, #dc3545, #e4606d)',
        color: 'white', padding: '1rem 2rem', borderRadius: '50px',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        fontWeight: '600', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        zIndex: '9999', opacity: '0', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });

    document.body.appendChild(alert);
    requestAnimationFrame(() => {
        alert.style.opacity = '1';
        alert.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => alert.remove(), 400);
    }, 4000);
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.pageYOffset > 500);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Ensure essential CSS classes are present
const globalStyles = document.createElement('style');
globalStyles.textContent = `
    .hidden { display: none !important; }
    .revealed { opacity: 1 !important; transform: translateY(0) !important; }
    .spin { animation: spin 1s linear infinite; display: inline-block; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(globalStyles);

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Accordion Toggle Logic
    const faqCards = document.querySelectorAll('.faq-card');

    faqCards.forEach(card => {
        card.addEventListener('click', () => {
            const isActive = card.classList.contains('active');
            
            // Tutup semua yang lain
            faqCards.forEach(c => c.classList.remove('active'));
            
            // Toggle yang diklik
            if (!isActive) {
                card.classList.add('active');
            }
        });
    });

    // 2. Search Logic (Live Filter)
    const searchInput = document.getElementById('faqSearch');
    const noResults = document.getElementById('noResults');

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        let hasMatch = false;

        faqCards.forEach(card => {
            const content = card.getAttribute('data-question').toLowerCase();
            if (content.includes(term)) {
                card.style.display = 'block';
                hasMatch = true;
            } else {
                card.style.display = 'none';
            }
        });

        noResults.classList.toggle('hidden', hasMatch);
    });

    // 3. Form Submission Simulation
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('successMsg');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Animasi loading sederhana
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Mengirim...";
        btn.disabled = true;

        setTimeout(() => {
            form.classList.add('hidden');
            successMsg.classList.remove('hidden');
            console.log("Form Data:", {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                msg: document.getElementById('message').value
            });
        }, 1500);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Scroll Reveal Animation ---
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.1, // Trigger earlier so it feels more fluid
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // --- 2. Intriguing 3D Card Tilt Effect ---
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Get dimensions and position of the card
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation limits (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            // Apply the 3D transformation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = "none"; // Remove transition for instant tracking
        });

        // Reset the card when the mouse leaves
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)"; // Smooth snap back
        });
    });
});