// Utilities
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Theme: persist preference in localStorage; follow system as default
const THEME_KEY = 'theme-preference';
const themeToggle = $('#themeToggle');
const themeIcon = $('#themeIcon');

function getSystemPrefersLight() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
}

function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'light') html.classList.add('light'); else html.classList.remove('light');
  themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const theme = saved || (getSystemPrefersLight() ? 'light' : 'dark');
  applyTheme(theme);
}

themeToggle?.addEventListener('click', () => {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  applyTheme(isLight ? 'light' : 'dark');
});

// Mobile nav
const navToggle = $('#navToggle');
const navList = $('#primaryNav');
navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navList?.setAttribute('aria-expanded', String(!expanded));
});

// Year
$('#year').textContent = new Date().getFullYear();

// Typing effect
const typedEl = $('#typed');
const typingPhrases = ['Java Developer', 'MySQL', 'HTML', 'CSS'];
let tpIndex = 0, charIndex = 0, typing = true;
function typeLoop() {
  if (!typedEl) return;
  const phrase = typingPhrases[tpIndex % typingPhrases.length];
  if (typing) {
    typedEl.textContent = phrase.slice(0, ++charIndex);
    if (charIndex === phrase.length) { typing = false; setTimeout(typeLoop, 1200); return; }
  } else {
    typedEl.textContent = phrase.slice(0, --charIndex);
    if (charIndex === 0) { typing = true; tpIndex++; }
  }
  setTimeout(typeLoop, typing ? 90 : 45);
}

// Optimized scroll-based background effects
function initScrollBackground() {
  let ticking = false;
  let lastScrollY = 0;
  
  function updateBackground() {
    const scrollY = window.scrollY;
    const body = document.body;
    
    // Only update if scroll position changed significantly
    if (Math.abs(scrollY - lastScrollY) > 10) {
      if (scrollY > 100) {
        body.classList.add('scrolled');
      } else {
        body.classList.remove('scrolled');
      }
      lastScrollY = scrollY;
    }
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateBackground);
      ticking = true;
    }
  }
  
  // Throttled scroll listener
  window.addEventListener('scroll', requestTick, { passive: true });
}

// Optimized space-themed particles
function initParticles() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  const particles = Array.from({ length: 60 }, () => ({ 
    x: 0, y: 0, vx: 0, vy: 0, r: 0, opacity: 0, 
    color: 0, pulse: 0, angle: 0, type: 'star', twinkle: 0
  }));
  
  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  
  function reset(p) {
    p.x = Math.random() * w; p.y = Math.random() * h;
    p.vx = (Math.random() - 0.5) * 0.2; p.vy = (Math.random() - 0.5) * 0.2;
    p.r = Math.random() * 1.5 + 0.5;
    p.opacity = Math.random() * 0.6 + 0.3;
    p.color = Math.random() * 360;
    p.pulse = Math.random() * Math.PI * 2;
    p.angle = Math.random() * Math.PI * 2;
    p.twinkle = Math.random() * Math.PI * 2;
    p.type = Math.random() < 0.8 ? 'star' : Math.random() < 0.5 ? 'nebula' : 'dust';
  }
  
  function step() {
    ctx.clearRect(0, 0, w, h);
    
    const scrollY = window.scrollY;
    const intensity = Math.min(scrollY / 1000, 1);
    const time = Date.now() * 0.001;
    
    // Render space particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.pulse += 0.01;
      p.twinkle += 0.05;
      p.angle += 0.005;
      
      if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) reset(p);
      
      // Space-themed particle rendering
      if (p.type === 'star') {
        // Twinkling stars
        const twinkleAlpha = p.opacity * (0.3 + 0.7 * Math.sin(p.twinkle));
        const hue = (p.color + time * 5) % 360;
        
        ctx.fillStyle = `hsla(${hue}, 60%, 80%, ${twinkleAlpha})`;
        ctx.globalAlpha = twinkleAlpha;
        
        // Star shape with twinkling effect
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        
        // Draw star
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          const angle = (j * 4 * Math.PI) / 5;
          const x = Math.cos(angle) * p.r;
          const y = Math.sin(angle) * p.r;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        // Add star glow
        ctx.shadowColor = `hsl(${hue}, 60%, 80%)`;
        ctx.shadowBlur = 3;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.restore();
        
      } else if (p.type === 'nebula') {
        // Nebula clouds
        const nebulaAlpha = p.opacity * (0.2 + 0.3 * Math.sin(p.pulse));
        const hue = (p.color + time * 2) % 360;
        
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${nebulaAlpha})`;
        ctx.globalAlpha = nebulaAlpha;
        
        // Draw nebula cloud
        ctx.save();
        ctx.translate(p.x, p.y);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r * 3);
        gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, ${nebulaAlpha})`);
        gradient.addColorStop(1, `hsla(${hue}, 80%, 60%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
      } else if (p.type === 'dust') {
        // Colored cosmic dust particles - no grey
        const dustAlpha = p.opacity * 0.4;
        const dustHue = (p.color + time * 3) % 360;
        ctx.fillStyle = `hsla(${dustHue}, 60%, 60%, ${dustAlpha})`;
        ctx.globalAlpha = dustAlpha;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Optimized cosmic connection lines - reduced frequency
      if (i % 3 === 0) { // Only check every 3rd particle for connections
        for (let j = i + 3; j < particles.length; j += 3) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y; 
          const dist2 = dx*dx + dy*dy;
          if (dist2 < 150*150) {
            const dist = Math.sqrt(dist2);
            const lineAlpha = Math.max(0, 1 - dist / 150) * (0.1 + intensity * 0.15);
            
            // Simplified cosmic energy lines
            ctx.strokeStyle = `hsla(${p.color % 360}, 70%, 60%, ${lineAlpha})`;
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Reduced floating cosmic elements for better performance
    ctx.globalAlpha = 0.05 + intensity * 0.08;
    for (let i = 0; i < 4; i++) {
      const x = (w / 4) * i + Math.sin(time * 0.2 + i) * 80;
      const y = h / 2 + Math.cos(time * 0.15 + i) * 120;
      const size = 25 + Math.sin(time + i) * 10;
      
      // Simplified nebula-like floating elements
      ctx.fillStyle = `hsla(${(i * 90 + time * 8) % 360}, 60%, 50%, 0.2)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  }
  
  resize();
  particles.forEach(reset);
  window.addEventListener('resize', resize);
  requestAnimationFrame(step);
}

// Reveal skill bars when in view
function initSkillBars() {
  const fills = $$('.bar-fill');
  if (!('IntersectionObserver' in window) || !fills.length) {
    fills.forEach(f => f.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  fills.forEach(el => io.observe(el));
}

// Optimized reveal-on-scroll for sections/cards
function initRevealOnScroll() {
  const revealEls = $$('.reveal-on-scroll');
  if (!revealEls.length) return;
  
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }
  
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add delay based on element position for staggered animation
        const delay = Array.from(revealEls).indexOf(entry.target) * 100;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        io.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1, 
    rootMargin: '0px 0px -50px 0px' 
  });
  
  revealEls.forEach(el => io.observe(el));
}

// Contact form validation + optional EmailJS
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const status = document.getElementById('formStatus');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  function validate() {
    let ok = true;
    if (!name.value.trim()) { nameError.textContent = 'Please enter your name.'; ok = false; } else nameError.textContent = '';
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!emailOk) { emailError.textContent = 'Please enter a valid email.'; ok = false; } else emailError.textContent = '';
    if (!message.value.trim()) { messageError.textContent = 'Please enter a message.'; ok = false; } else messageError.textContent = '';
    return ok;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    if (!validate()) return;

    // If EmailJS is available, use it; otherwise fake success
    try {
      const sendBtn = document.getElementById('sendBtn');
      sendBtn.disabled = true; sendBtn.textContent = 'Sending…';

      if (window.emailjs) {
        // Configure with your EmailJS service ID, template ID, and public key
        // emailjs.init('YOUR_PUBLIC_KEY'); // Do once globally
        const resp = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
          from_name: name.value,
          reply_to: email.value,
          message: message.value,
        });
        if (resp.status === 200) {
          status.textContent = 'Thanks! Your message has been sent.';
          form.reset();
        } else {
          throw new Error('Failed to send, please try again later.');
        }
      } else {
        await new Promise(r => setTimeout(r, 800));
        status.textContent = 'Thanks! Your message has been sent.';
        form.reset();
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please try again later.';
    } finally {
      const sendBtn = document.getElementById('sendBtn');
      sendBtn.disabled = false; sendBtn.textContent = 'Send Message';
    }
  });
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticles();
  initScrollBackground();
  typeLoop();
  initSkillBars();
  initRevealOnScroll();
  initContactForm();
});


