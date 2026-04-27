/* ═══════════════════════════════════════════════════════════
   script.js — Portfolio Interactions & Animations
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Typing effect ──────────────────────────────────────
    const titles = ['SQA Engineer', 'AI Graduate Student', 'Full-Stack Developer', 'System Engineer', 'Quality Enthusiast'];
    const typedEl = document.getElementById('typedTitle');
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const current = titles[titleIndex];

        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 70;

        if (!isDeleting && charIndex === current.length) {
            speed = 2200; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            speed = 500; // Pause before next word
        }

        setTimeout(typeEffect, speed);
    }

    // Start typing after a small delay
    setTimeout(typeEffect, 1400);

    // ── Neural Network Background ──────────────────────────
    const canvas = document.getElementById('neuralCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 60 : 120;
        const connectionDistance = 140;
        const mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 1.5;
                this.speedX = (Math.random() * 1 - 0.5) * 0.7;
                this.speedY = (Math.random() * 1 - 0.5) * 0.7;
            }

            update() {
                // Return to original speed if mouse is gone
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

                // Mouse interaction - Magnetic Attraction
                if (mouse.x !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x += dx * force * 0.03;
                        this.y += dy * force * 0.03;
                    }
                }
            }

            draw() {
                ctx.fillStyle = 'rgba(15, 23, 42, 0.6)'; // Stronger Black/Slate
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Mouse to Particle connection
                if (mouse.x !== null) {
                    let dx = mouse.x - particles[i].x;
                    let dy = mouse.y - particles[i].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        ctx.strokeStyle = `rgba(15, 23, 42, ${0.2 * (1 - distance / mouse.radius)})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(particles[i].x, particles[i].y);
                        ctx.stroke();
                    }
                }

                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = 1 - (distance / connectionDistance);
                        ctx.strokeStyle = `rgba(15, 23, 42, ${opacity * 0.18})`; 
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', init);
        init();
        animate();
    }

    // ── Navbar scroll effect ───────────────────────────────
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    const handleScroll = () => {
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', scrolled);

        // Back to top button visibility
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load

    // ── Back to top click ──────────────────────────────────
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── Mobile nav toggle ──────────────────────────────────
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    function closeNav() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
    }

    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('open');
        if (isOpen) {
            closeNav();
        } else {
            navToggle.classList.add('active');
            navLinks.classList.add('open');
            if (navOverlay) navOverlay.classList.add('active');
        }
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close on overlay click
    if (navOverlay) {
        navOverlay.addEventListener('click', closeNav);
    }

    // ── Scroll-triggered animations ────────────────────────
    const animObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animObserver.observe(el);
    });

    // ── Skill bar fills on scroll ──────────────────────────
    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    fill.style.width = fill.dataset.level + '%';
                    skillObserver.unobserve(fill);
                }
            });
        },
        { threshold: 0.3 }
    );

    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        skillObserver.observe(bar);
    });

    // ── Language ring fills on scroll ───────────────────────
    const ringObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    ringObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll('.lang-ring-fill').forEach(ring => {
        ringObserver.observe(ring);
    });

    // ── Count-up animation for stat numbers ────────────────
    const countObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    if (isNaN(target)) return;
                    let current = 0;
                    const step = Math.ceil(target / 40);
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = current + '+';
                    }, 40);
                    countObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll('[data-count]').forEach(el => {
        countObserver.observe(el);
    });

    // ── Active nav link highlight on scroll ────────────────
    const sections = document.querySelectorAll('.section, .hero');
    const navLinkElements = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinkElements.forEach(link => {
                        const isActive = link.getAttribute('href') === '#' + id;
                        link.classList.toggle('active', isActive);
                    });
                }
            });
        },
        { threshold: 0.25, rootMargin: '-80px 0px -35% 0px' }
    );

    sections.forEach(section => sectionObserver.observe(section));

    // ── Smooth reveal for hero elements (ensure visibility) ─
    // The hero elements use CSS keyframe animations, so trigger
    // the animate-on-scroll visible class immediately for them.
    document.querySelectorAll('.hero .animate-on-scroll').forEach(el => {
        el.classList.add('visible');
    });

})();
