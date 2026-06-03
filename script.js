document.addEventListener('DOMContentLoaded', () => {
  
  // --- STICKY HEADER ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- MOBILE NAV TOGGLE ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- TYPING ANIMATION ---
  const typeText = document.querySelector('.typing-text');
  if (typeText) {
    const phrases = [
      "Architecting Digital Futures.",
      "Building Enterprise Systems.",
      "Scaling Modern Tech Stacks.",
      "Securing Cloud Environments."
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        // Remove char
        typeText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Deleting is faster
      } else {
        // Add char
        typeText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 120; // Natural typing speed
      }

      // If word is complete
      if (!isDeleting && charIndex === currentPhrase.length) {
        typingSpeed = 2000; // Pause at end of phrase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before typing next phrase
      }

      setTimeout(type, typingSpeed);
    }

    // Start the typewriter loop
    setTimeout(type, 1000);
  }

  // --- INTERSECTION OBSERVER FOR SCROLL REVEALS ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after revealing to prevent repeated triggering
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- SECTION HEADER TYPING ANIMATION ---
  const sectionHeaders = document.querySelectorAll('.section-header h2');
  sectionHeaders.forEach(header => {
    const text = header.textContent.trim();
    header.textContent = ''; // Clear text content
    
    const textSpan = document.createElement('span');
    textSpan.className = 'typed-title';
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor';
    cursorSpan.textContent = '|';
    cursorSpan.style.color = 'var(--primary-light)';
    cursorSpan.style.marginLeft = '5px';
    cursorSpan.style.animation = 'blink 0.8s infinite';
    
    header.appendChild(textSpan);
    header.appendChild(cursorSpan);
    
    let charIndex = 0;
    let hasTyped = false;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasTyped) {
        hasTyped = true;
        
        function typeChar() {
          if (charIndex < text.length) {
            textSpan.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 60);
          } else {
            cursorSpan.style.display = 'none';
          }
        }
        
        setTimeout(typeChar, 200);
        observer.unobserve(header);
      }
    }, { threshold: 0.25 });
    
    observer.observe(header);
  });

  // --- STATS COUNT-UP ANIMATION ---
  const statsSection = document.querySelector('.stats');
  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  function animateStats() {
    statNums.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const suffix = stat.getAttribute('data-suffix') || '';
      const decimals = stat.getAttribute('data-decimals') === 'true';
      let current = 0;
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        
        current = easeProgress * target;
        
        if (decimals) {
          stat.textContent = current.toFixed(1) + suffix;
        } else {
          stat.textContent = Math.floor(current) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          if (decimals) {
            stat.textContent = target.toFixed(1) + suffix;
          } else {
            stat.textContent = target + suffix;
          }
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  if (statsSection && statNums.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateStats();
      }
    }, { threshold: 0.3 });
    
    statsObserver.observe(statsSection);
  }

  // --- TECH STACK TAB FILTERING ---
  const tabButtons = document.querySelectorAll('.tech-tab-btn');
  const techItems = document.querySelectorAll('.tech-item');

  if (tabButtons.length > 0 && techItems.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        techItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          
          if (category === 'all' || itemCategory === category) {
            // Show item with animation
            item.style.display = 'flex';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            // Hide item
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
  
  // --- CONTACT FORM SUBMISSION ANIMATION ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
      
      setTimeout(() => {
        submitBtn.style.background = '#00e676';
        submitBtn.style.color = '#fff';
        submitBtn.textContent = 'Message Sent Successfully!';
        
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.textContent = originalText;
        }, 3000);
      }, 1500);
    });
  }
});
