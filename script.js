document.addEventListener("DOMContentLoaded", () => {

    // 1. Terminal Typing Effect
    const roles = ["Game Developer", "Unity Programmer", "Full-Stack Web", "Tech Enthusiast"];
    const typingText = document.querySelector(".typing-text");
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        if (!typingText) return;
        
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 30 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2500; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500; // Pause before next word
        }

        setTimeout(type, speed);
    }
    type();

    // 2. Project Filtering System
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    // Trigger reflow for animation
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => { card.style.display = 'none'; }, 300); // Match CSS transition
                }
            });
        });
    });

    // 3. Scroll Spy & Progress Bar
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("#navbar a");
    const faders = document.querySelectorAll(".fade-in");
    const progressBar = document.getElementById("progressBar");

    // Fade-in on scroll
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));

    // Progress bar & active link update
    window.addEventListener("scroll", () => {
        let scrollTop = window.scrollY;
        let docHeight = document.body.offsetHeight - window.innerHeight;
        let scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + "%";

        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // 4. Konami Code Easter Egg (Optional Fun Feature!)
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateHackerMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateHackerMode() {
        document.documentElement.style.setProperty('--bg-color', '#001100');
        document.documentElement.style.setProperty('--accent', '#0f0');
        document.documentElement.style.setProperty('--text-main', '#0f0');
        document.documentElement.style.setProperty('--surface-color', '#002200');
        document.body.style.fontFamily = "'JetBrains Mono', monospace";
        alert("👨‍💻 Developer Mode Activated!");
    }
});