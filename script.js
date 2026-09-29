document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const hoverElements = document.querySelectorAll('a, button, .timeline-card, .card, input');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // 2. Sticky Navbar behavior on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // 5. Primary source category filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sourceCards = document.querySelectorAll('.source-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedCategory = button.dataset.filter;

            filterButtons.forEach(filterButton => {
                const isActive = filterButton === button;
                filterButton.classList.toggle('active', isActive);
                filterButton.setAttribute('aria-pressed', String(isActive));
            });

            sourceCards.forEach(card => {
                card.hidden = selectedCategory !== 'all' && card.dataset.category !== selectedCategory;
            });
        });
    });

    // 6. Interactive Vertical Timeline (Accordion)
    const timelineCards = document.querySelectorAll('.timeline-card');
    const progressItems = document.querySelectorAll('.progress-item');
    const progressLineFill = document.querySelector('.progress-line-fill');

    timelineCards.forEach((card, index) => {
        const header = card.querySelector('.timeline-header');
        header.addEventListener('click', () => {
            const isOpen = card.classList.contains('open');
            
            // Close others
            timelineCards.forEach(c => c.classList.remove('open'));
            
            if (!isOpen) {
                card.classList.add('open');
                updateProgressTracker(index);
                
                // Scroll card into view slightly after opening
                setTimeout(() => {
                    const rect = card.getBoundingClientRect();
                    const offset = 150; // offset for sticky nav
                    if (rect.top < offset || rect.bottom > window.innerHeight) {
                        window.scrollTo({
                            top: window.scrollY + rect.top - offset,
                            behavior: 'smooth'
                        });
                    }
                }, 400); // wait for CSS grid animation
            }
        });
    });

    function updateProgressTracker(activeIndex) {
        progressItems.forEach((item, index) => {
            item.classList.remove('active', 'completed');
            if (index < activeIndex) {
                item.classList.add('completed');
            } else if (index === activeIndex) {
                item.classList.add('active');
            }
        });
        
        // Calculate and set the fill line height
        if (progressLineFill && progressItems.length > 0) {
            const percentage = (activeIndex / (progressItems.length - 1)) * 100;
            progressLineFill.style.height = `${percentage}%`;
        }
    }
    
    // Initialize fill line based on the first open card
    let initialIndex = 0;
    timelineCards.forEach((card, index) => {
        if(card.classList.contains('open')) initialIndex = index;
    });
    updateProgressTracker(initialIndex);

    // Initialize tracker clicks to sync with cards
    progressItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetCard = document.getElementById(targetId);
            if (targetCard) {
                timelineCards.forEach(c => c.classList.remove('open'));
                targetCard.classList.add('open');
                updateProgressTracker(index);
                
                setTimeout(() => {
                    const offset = 150;
                    const top = targetCard.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }, 100);
            }
        });
    });

});
