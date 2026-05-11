document.addEventListener("DOMContentLoaded", () => {

    // 🌌 2. Particle System (Fixed Dark Mode Colors + Interactive Mouse Physics)
    const canvas = document.getElementById("heroParticles");
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = document.getElementById("home").offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // ตัวแปรเก็บตำแหน่งเมาส์
    const mouse = {
        x: null,
        y: null,
        radius: 120 // ระยะห่างที่ Particle จะเริ่มหนีเมาส์
    };

    window.addEventListener('mousemove', function(event) {
        // อัปเดตตำแหน่งเมาส์เมื่ออยู่บน Header
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // รีเซ็ตเมาส์เมื่อเลื่อนออกไปข้างนอก
    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.baseX = this.x;
            this.baseY = this.y;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // 🌟 เพิ่ม Logic การหนีเมาส์
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    
                    // ความแรงในการผลัก (ยิ่งใกล้เมาส์ยิ่งผลักแรง)
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    this.x -= forceDirectionX * force * 4;
                    this.y -= forceDirectionY * force * 4;
                }
            }

            // Wrap ให้วนกลับมาถ้าหลุดกรอบ
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            // ใช้สี Indigo สไตล์ Cyberpunk
            ctx.fillStyle = `rgba(129, 140, 248, ${this.opacity})`;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = window.innerWidth < 768 ? 40 : 80; // เพิ่มจำนวน Particle ขึ้นนิดหน่อยเพื่อให้เอฟเฟกต์หนีเมาส์ดูชัดขึ้น
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ⌨️ 3. Typing Effect
    const roles = ["Game Programmer", "Unity Developer", "Java Enthusiast"];
    const typingText = document.querySelector(".typing-text");
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }
    type();

    // 📜 4. Scroll Spy & Animations
    const sections = document.querySelectorAll("section, header");
    const navLinks = document.querySelectorAll("#navbar a");
    const faders = document.querySelectorAll(".fade-in");
    const backToTop = document.getElementById("backToTop");
    const progressBar = document.getElementById("progressBar");

    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));

    window.addEventListener("scroll", () => {
        let scrollTop = window.scrollY;
        let docHeight = document.body.offsetHeight - window.innerHeight;
        let scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + "%";

        if (scrollTop > 500) backToTop.style.display = "block";
        else backToTop.style.display = "none";

        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
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

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

});