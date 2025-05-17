document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation Toggle
    const primaryNav = document.getElementById('primary-navigation');
    const navToggle = document.querySelector('.mobile-nav-toggle');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            primaryNav.setAttribute('data-visible', String(!isVisible));
            navToggle.setAttribute('aria-expanded', String(!isVisible));
            document.body.classList.toggle('no-scroll', !isVisible);
        });
    }

    // Scroll animations for sections and their items
    const sectionsToObserve = document.querySelectorAll('section:not(.hero-banner)');

    const revealElements = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Make the section visible first

                let itemsToAnimate = [];
                let itemStagger = 0.15; // Default stagger

                if (entry.target.id === 'services' || entry.target.querySelector('.service-grid')) {
                    itemsToAnimate = entry.target.querySelectorAll('.service-item');
                    itemStagger = 0.15;
                } else if (entry.target.id === 'testimonials-list' || entry.target.querySelector('.testimonial-item')) {
                    itemsToAnimate = entry.target.querySelectorAll('.testimonial-item');
                    itemStagger = 0.2;
                }

                itemsToAnimate.forEach((item, index) => {
                    item.style.transitionDelay = `${index * itemStagger}s`;
                    item.classList.add('is-visible');
                });
                
                observer.unobserve(entry.target);
            }
        });
    };

    if (sectionsToObserve.length) {
        const sectionObserver = new IntersectionObserver(revealElements, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Lower threshold for parent section to trigger item animations sooner
        });
        sectionsToObserve.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('nav a[href^="#"], .scroll-down-arrow-simple[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                if (primaryNav && primaryNav.getAttribute('data-visible') === 'true') {
                    primaryNav.setAttribute('data-visible', 'false');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });
    
    document.querySelectorAll('nav a[href^="index.html#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetId = href.substring(href.indexOf('#') + 1);
            const targetPath = href.substring(0, href.indexOf('#'));

            if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith(targetPath)) {
                 if (document.getElementById(targetId)) {
                    e.preventDefault();
                    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
                    if (primaryNav && primaryNav.getAttribute('data-visible') === 'true') {
                        primaryNav.setAttribute('data-visible', 'false');
                        navToggle.setAttribute('aria-expanded', 'false');
                        document.body.classList.remove('no-scroll');
                    }
                }
            } 
        });
    });

    // Active link highlighter
    const navLinks = document.querySelectorAll('#primary-navigation a');
    const currentPath = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const linkPath = linkHref.split('/').pop().split('#')[0];
        
        if ((currentPath === '' || currentPath === 'index.html') && (linkPath === '' || linkPath === 'index.html' || linkHref === 'index.html')) {
            if (!linkHref.includes('#')) { 
                 link.classList.add('active-link');
            }
        } else if (linkPath !== '' && currentPath === linkPath) {
            link.classList.add('active-link');
        }
    });

    // Header scroll effect
    const header = document.querySelector('header');
    if(header){
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) { // Reduced threshold for quicker effect
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Scroll down arrow fade
    const scrollArrow = document.querySelector('.scroll-down-arrow-simple');
    if (scrollArrow) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                scrollArrow.classList.add('hidden');
            } else {
                scrollArrow.classList.remove('hidden');
            }
        });
    }

}); 