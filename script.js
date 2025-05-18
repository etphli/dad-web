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
                } else if (entry.target.id === 'testimonials-showcase' || entry.target.querySelector('.testimonial-grid')) {
                    itemsToAnimate = entry.target.querySelectorAll('.testimonial-card');
                    itemStagger = 0.18;
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

    /* Footer animation trigger - REMOVED FOR NOW
    const footer = document.querySelector('footer');
    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.style.animationPlayState = 'running';
                    footerObserver.unobserve(footer);
                }
            });
        }, { threshold: 0.1 });
        footerObserver.observe(footer);
    }
    */

    // Gallery Contact CTA animation trigger
    const galleryCta = document.querySelector('#gallery-contact-cta');
    if (galleryCta) {
        const galleryCtaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    galleryCta.style.animationPlayState = 'running';
                    galleryCtaObserver.unobserve(galleryCta);
                }
            });
        }, { threshold: 0.1 });
        galleryCtaObserver.observe(galleryCta);
    }

    // Gallery Photo Wheel Slider
    const sliderContainer = document.querySelector('.photo-wheel-slider-container');
    if (sliderContainer) {
        const slidesContainer = sliderContainer.querySelector('.slides-container');
        const slides = Array.from(slidesContainer.querySelectorAll('.slide'));
        const nextButton = sliderContainer.querySelector('.next-slide');
        const prevButton = sliderContainer.querySelector('.prev-slide');
        const dotsContainer = sliderContainer.querySelector('.slide-dots');
        let currentSlideIndex = 0;
        let slideInterval;
        const SLIDE_TIME = 3000; // 3 seconds

        function createDots() {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(index);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots(index) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function updateSlidesClass(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active-slide', i === index);
            });
        }

        function goToSlide(index) {
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;
            currentSlideIndex = index;
            updateDots(index);
            updateSlidesClass(index);
        }

        function nextSlide() {
            let newIndex = (currentSlideIndex + 1) % slides.length;
            goToSlide(newIndex);
        }

        function prevSlide() {
            let newIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            goToSlide(newIndex);
        }

        function startInterval() {
            slideInterval = setInterval(nextSlide, SLIDE_TIME);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        if (slides.length > 0) {
            createDots();
            goToSlide(0); // Initialize first slide
            startInterval();

            nextButton.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });

            prevButton.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });

            // Pause on hover
            sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
            sliderContainer.addEventListener('mouseleave', startInterval);
        }
    }

}); 