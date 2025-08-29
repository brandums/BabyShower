/* ==========================================================
   ANIMACIÓN DE PUERTA
========================================================== */
const door = document.getElementById("door2");
const overlay = document.getElementById("overlay");
const mainContent = document.getElementById("main-content");

door.addEventListener("animationend", () => {
  overlay.classList.add("zoom");
  setTimeout(() => {
    overlay.remove();
    mainContent.style.display = "block";
    document.body.style.overflow = "auto";
    
    // Iniciar animaciones después de que la puerta se complete
    setTimeout(initAnimations, 300);
  }, 1200);
});

// Fallback en caso de que la animación falle
setTimeout(() => {
  if (overlay.parentNode) {
    overlay.remove();
    mainContent.style.display = "block";
    document.body.style.overflow = "auto";
    initAnimations();
  }
}, 5000);

/* ==========================================================
   UX: Música — activar en primera interacción (normas autoplay)
========================================================== */
(function setupMusicAutoplay(){
  const audio = document.getElementById('musica');
  if(!audio) return;

  const tryPlay = () => {
    audio.play().then(() => {
      // Crear control de volumen después de la reproducción exitosa
      createVolumeControl();
    }).catch(() => { /* silencioso */ });
    removeListeners();
  };

  const removeListeners = () => {
    ['click','touchstart','pointerdown','keydown','scroll'].forEach(ev =>
      document.removeEventListener(ev, tryPlay)
    );
  };

  ['click','touchstart','pointerdown','keydown','scroll'].forEach(ev =>
    document.addEventListener(ev, tryPlay, { once:true, passive:true })
  );

  document.addEventListener('visibilitychange', () => {
    if(document.hidden) {
      audio.pause();
    } else {
      audio.play().catch(() => { /* silencioso */ });
    }
  });
})();

// Crear control de volumen flotante
function createVolumeControl() {
  const audio = document.getElementById('musica');
  if (!audio) return;
  
  const volumeControl = document.createElement('div');
  volumeControl.className = 'volume-control';
  volumeControl.innerHTML = `
    <button id="mute-toggle" aria-label="Silenciar música">
      <i class="fas fa-volume-up"></i>
    </button>
    <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="0.7" aria-label="Control de volumen">
  `;
  
  document.body.appendChild(volumeControl);
  
  const muteToggle = document.getElementById('mute-toggle');
  const volumeSlider = document.getElementById('volume-slider');
  
  // Configurar volumen inicial
  audio.volume = 0.7;
  
  // Evento para el control deslizante de volumen
  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
    if (audio.volume > 0 && audio.muted) {
      audio.muted = false;
      muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  });
  
  // Evento para el botón de silencio
  muteToggle.addEventListener('click', () => {
    audio.muted = !audio.muted;
    if (audio.muted) {
      muteToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  });
  
  // Estilos para el control de volumen
  const style = document.createElement('style');
  style.textContent = `
    .volume-control {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.9);
      padding: 10px 15px;
      border-radius: 50px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      z-index: 100;
      backdrop-filter: blur(10px);
      transition: transform 0.3s ease;
    }
    .volume-control:hover {
      transform: translateY(-3px);
    }
    #mute-toggle {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: var(--pink-500);
      transition: transform 0.2s ease;
    }
    #mute-toggle:hover {
      transform: scale(1.1);
    }
    #volume-slider {
      width: 80px;
      height: 5px;
      -webkit-appearance: none;
      appearance: none;
      background: #ddd;
      border-radius: 5px;
      outline: none;
    }
    #volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--pink-500);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    #volume-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }
    @media (max-width: 768px) {
      .volume-control {
        bottom: 70px;
        right: 10px;
        padding: 8px 12px;
      }
      #volume-slider {
        width: 60px;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ==========================================================
   Menú móvil - VERSIÓN CORREGIDA
========================================================== */
(function mobileMenu(){
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('nav-mobile');
  const links = panel?.querySelectorAll('a') ?? [];
  
  if(!toggle || !panel) return;

  const open = () => {
    panel.classList.remove('hidden');
    toggle.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  };
  
  const close = () => {
    panel.classList.add('hidden');
    toggle.setAttribute('aria-expanded','false');
    document.body.style.overflow = 'auto';
  };
  
  const togglePanel = () => {
    if (panel.classList.contains('hidden')) {
      open();
    } else {
      close();
    }
  };

  // Evento para el botón de toggle
  toggle.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevenir que el evento se propague
    togglePanel();
  });
  
  // Eventos para los enlaces del menú
  links.forEach(a => {
    a.addEventListener('click', function(e) {
      close();
      e.stopPropagation();
    });
  });
  
  // Cerrar menú al hacer clic fuera de él
  document.addEventListener('click', (e) => {
    if (!panel.classList.contains('hidden') && 
        !panel.contains(e.target) && 
        e.target !== toggle) {
      close();
    }
  });
  
  // Cerrar menú al presionar la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
      close();
    }
  });
})();

/* ==========================================================
   Efectos de scroll en navbar
========================================================== */
(function navbarScrollEffect(){
  const navbar = document.querySelector('.nav');
  if (!navbar) return;
  
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
      
      // Ocultar/mostrar navbar al hacer scroll
      if (window.scrollY > lastScrollY && window.scrollY > 200) {
        // Scroll hacia abajo
        navbar.style.transform = 'translateY(-100%)';
      } else {
        // Scroll hacia arriba
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.classList.remove('scrolled');
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = window.scrollY;
  });
})();

/* ==========================================================
   Animaciones al hacer scroll
========================================================== */
function initAnimations() {
  // Animación para elementos con la clase "fade-in"
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.8s ease';
  });
  
  // Observador de intersección para animaciones
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Animaciones específicas para diferentes secciones
        if (entry.target.id === 'evento') {
          animateDetails();
        } else if (entry.target.id === 'countdown') {
          animateCountdown();
        } else if (entry.target.id === 'galeria') {
          animateGallery();
        } else if (entry.target.id === 'regalos') {
          animateGifts();
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observar todas las secciones
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });
  
  // Animación para elementos con la clase "fade-in"
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
        }, 100);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.fade-in').forEach(el => {
    fadeObserver.observe(el);
  });
}

// Animación para los detalles del evento
function animateDetails() {
  const items = document.querySelectorAll('.item');
  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('slide-in-left');
    }, index * 200);
  });
  
  const map = document.querySelector('.map');
  if (map) {
    setTimeout(() => {
      map.classList.add('slide-in-right');
    }, 600);
  }
}

// Animación para la cuenta regresiva
function animateCountdown() {
  const countBoxes = document.querySelectorAll('.count__box');
  countBoxes.forEach((box, index) => {
    setTimeout(() => {
      box.classList.add('fade-in');
      box.style.transform = 'scale(1)';
      box.style.opacity = '1';
    }, index * 150);
  });
}

// Animación para la galería
function animateGallery() {
  const frames = document.querySelectorAll('.frame');
  frames.forEach((frame, index) => {
    setTimeout(() => {
      frame.classList.add('fade-in');
      frame.style.opacity = '1';
    }, index * 200);
  });
}

// Animación para la sección de regalos
function animateGifts() {
  const panel = document.querySelector('.gifts .panel');
  if (panel) {
    setTimeout(() => {
      panel.classList.add('fade-in');
      panel.style.opacity = '1';
    }, 300);
  }
}

/* ==========================================================
   Cuenta regresiva robusta + Confetti
========================================================== */
(function countdown(){
  const target = new Date('2025-09-06T15:30:00-04:00').getTime(); // America/La_Paz
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  const statusEl = document.getElementById('count-status');
  const confettiEl = document.getElementById('confetti');

  if(!daysEl || !hoursEl || !minsEl || !secsEl || !statusEl) return;

  let firedTodayMsg = false;
  let confettiOnce = false;

  const pad = (n) => String(n).padStart(2, '0');

  const renderConfetti = () => {
    if(confettiOnce || !confettiEl) return;
    confettiOnce = true;
    // Generar 80 piezas con posiciones aleatorias
    const frag = document.createDocumentFragment();
    for(let i=0;i<80;i++){
      const p = document.createElement('i');
      const variant = ['a','b','c',''][Math.floor(Math.random()*4)];
      p.className = variant;
      p.style.left = (Math.random()*100)+'%';
      p.style.setProperty('--dur', (2.6 + Math.random()*2.2)+'s');
      frag.appendChild(p);
    }
    confettiEl.appendChild(frag);
    // limpiar confetti después
    setTimeout(()=> confettiEl.innerHTML='', 5500);
  };

  const tick = () => {
    const now = Date.now();
    const diff = target - now;

    if(diff <= 0){
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';

      const today = new Date();
      const sameDay = today.toDateString() === new Date(target).toDateString();

      if(sameDay && !firedTodayMsg){
        statusEl.textContent = '¡Es hoy! 🎉 Te esperamos a las 3:30 PM';
        firedTodayMsg = true;
        renderConfetti();
        
        // Reproducir sonido de celebración
        playCelebrationSound();
      } else {
        statusEl.textContent = '¡Gracias por venir y celebrar con nosotros! 💖';
      }
      return; // detener visualmente (dejamos el interval por simplicidad)
    }

    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const m = Math.floor((diff % (1000*60*60)) / (1000*60));
    const s = Math.floor((diff % (1000*60)) / 1000);

    daysEl.textContent = pad(d);
    hoursEl.textContent = pad(h);
    minsEl.textContent = pad(m);
    secsEl.textContent = pad(s);

    if(d <= 0 && !confettiOnce && (h < 1)){ // activa confetti cuando falta <1h
      renderConfetti();
    }

    if(d <= 3){ statusEl.textContent = '¡Falta muy poquito! 💫' }
    else if(d <= 7){ statusEl.textContent = '¡Comienza la cuenta final! 🥳' }
    else { statusEl.textContent = '' }
  };

  // Sonido de celebración
  function playCelebrationSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ==========================================================
   Efectos de hover mejorados para elementos interactivos
========================================================== */
(function enhanceHoverEffects(){
  // Añadir efecto de ripple a los botones
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'var(--shadow-2)';
    });
  });
  
  // Efecto de parpadeo suave para elementos importantes
  const importantElements = document.querySelectorAll('.badge, .count__num');
  importantElements.forEach(el => {
    setInterval(() => {
      el.style.filter = 'brightness(1.1)';
      setTimeout(() => {
        el.style.filter = 'brightness(1)';
      }, 500);
    }, 3000);
  });
})();

/* ==========================================================
   Accesibilidad de enlaces: smooth scroll compensando header
========================================================== */
(function smoothAnchors(){
  const OFFSET = 76; // altura aprox. del header
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href') || '';
      const el = document.querySelector(id);
      if(!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior:'smooth' });
      // Mover foco accesible
      el.setAttribute('tabindex','-1');
      el.focus({ preventScroll:true });
      
      // Cerrar menú móvil si está abierto
      const mobileMenu = document.getElementById('nav-mobile');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        document.getElementById('nav-toggle').setAttribute('aria-expanded','false');
        document.body.style.overflow = 'auto';
      }
    });
  });
})();

/* ==========================================================
   Efecto de cursor personalizado (opcional)
========================================================== */
(function customCursor(){
  // Solo en dispositivos de escritorio
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Estilos para el cursor personalizado
    const style = document.createElement('style');
    style.textContent = `
      .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(255, 158, 187, 0.5);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
      }
      @media (max-width: 768px) {
        .custom-cursor {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Mover el cursor personalizado
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    
    // Efecto al hacer hover en elementos clickeables
    const clickableElements = document.querySelectorAll('a, button, .btn, .card, .frame');
    clickableElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.background = 'rgba(159, 122, 234, 0.7)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = 'rgba(255, 158, 187, 0.5)';
      });
    });
  }
})();







document.addEventListener('DOMContentLoaded', function() {
    const countSection = document.getElementById('countdown');
    
    // Crear 10 flores
    for (let i = 0; i < 15; i++) {
      const flor = document.createElement('div');
      flor.className = 'flor';
      
      // Posición aleatoria
      const left = Math.random() * 90 + 5; // 5% a 95%
      const top = Math.random() * 80 + 10; // 10% a 90%
      const delay = Math.random() * 10; // Retardo aleatorio para animación
      
      flor.style.left = `${left}%`;
      flor.style.top = `${top}%`;
      flor.style.animationDelay = `${delay}s`;
      
      countSection.appendChild(flor);
    }
  });