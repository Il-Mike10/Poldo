document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Effect on Navbar
    const header = document.querySelector('.glass-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for fade-up animations (About cards)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach(card => {
        observer.observe(card);
    });

    // 3. Subtle Parallax effect on Poldo Image
    const heroSection = document.querySelector('.hero-section');
    const poldoImg = document.getElementById('poldo-img');
    const imageContainer = document.querySelector('.hero-image-container');

    heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Calculate mouse position relative to center of screen
        const xPos = (clientX / innerWidth - 0.5) * 20; // max rotation degrees
        const yPos = (clientY / innerHeight - 0.5) * -20;
        
        // Apply rotation to the container
        imageContainer.style.transform = `perspective(1000px) rotateY(${xPos}deg) rotateX(${yPos}deg)`;
        
        // Minor offset for the image itself inside the container (creates depth)
        const imgX = (clientX / innerWidth - 0.5) * -10;
        const imgY = (clientY / innerHeight - 0.5) * -10;
        poldoImg.style.transform = `translate(${imgX}px, ${imgY}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
        imageContainer.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        imageContainer.style.transition = 'transform 0.5s ease-out';
        
        poldoImg.style.transform = `translate(0px, 0px)`;
        poldoImg.style.transition = 'transform 0.5s ease-out';
        
        // Remove transitions after they finish so mousemove is snappy again
        setTimeout(() => {
            imageContainer.style.transition = '';
            poldoImg.style.transition = '';
        }, 500);
    });

    // 4. Background Music Control
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    // Set volume to a reasonable reading level
    bgMusic.volume = 0.4;

    // Function to update button state
    function updateMusicButton(playing) {
        if (playing) {
            musicBtn.innerHTML = '⏸️ Pause Music';
            musicBtn.classList.add('playing');
        } else {
            musicBtn.innerHTML = '🎵 Play Music';
            musicBtn.classList.remove('playing');
        }
        isPlaying = playing;
    }

    // Attempt to autoplay (browsers might block this until first click)
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Autoplay started!
            updateMusicButton(true);
        }).catch(error => {
            // Autoplay was prevented.
            console.log("Autoplay was prevented by the browser.");
            updateMusicButton(false);
        });
    }

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            updateMusicButton(false);
        } else {
            bgMusic.play().catch(e => {
                console.error("Audio play failed:", e);
            });
            updateMusicButton(true);
        }
    });

    // Also try to start playing on the first click anywhere on the page if autoplay failed
    document.addEventListener('click', () => {
        if (!isPlaying && bgMusic.paused) {
            bgMusic.play().then(() => {
                updateMusicButton(true);
            }).catch(() => {});
        }
    }, { once: true });
});
