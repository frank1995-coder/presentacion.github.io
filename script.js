// ============================================
// 1. PARTÍCULAS EN EL FONDO (EFECTO NEÓN)
// ============================================
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color = `rgba(0, 229, 200, ${this.opacity})`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > width) this.speedX *= -1;
    if (this.y < 0 || this.y > height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = '#00e5c8';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function initParticles(count = 120) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 229, 200, ${0.08 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  for (const p of particles) {
    p.update();
    p.draw();
  }
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ============================================
// 2. EFECTO DE ESCRITURA (TYPING) EN EL TÍTULO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const titleElement = document.getElementById('typingTitle');
  if (!titleElement) return;

  const originalHTML = titleElement.innerHTML;
  // Extraemos solo el texto plano, respetando el <span>
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = originalHTML;
  const textContent = tempDiv.textContent; // "Franklin Cañadas"
  const spanContent = originalHTML.match(/<span>.*?<\/span>/)?.[0] || '';

  // Separamos el nombre y el apellido
  const parts = textContent.split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';

  // Limpiamos y empezamos el efecto
  titleElement.innerHTML = '';
  let currentText = '';
  let index = 0;
  const fullText = textContent;

  function typeEffect() {
    if (index < fullText.length) {
      currentText += fullText[index];
      index++;
      // Reconstruimos con el span solo si es la parte del apellido
      if (index > firstName.length) {
        // Estamos en el apellido, lo envolvemos en span
        const typedName = fullText.substring(0, firstName.length);
        const typedLastName = fullText.substring(firstName.length, index);
        titleElement.innerHTML = typedName + ' <span>' + typedLastName + '</span>';
      } else {
        titleElement.textContent = currentText;
      }
      setTimeout(typeEffect, 80 + Math.random() * 40);
    } else {
      // Al terminar, aseguramos el span correcto
      titleElement.innerHTML = originalHTML;
      // Añadir un pequeño destello al final
      titleElement.style.transition = 'text-shadow 0.3s ease';
      titleElement.style.textShadow = '0 0 30px rgba(0, 229, 200, 0.5)';
      setTimeout(() => {
        titleElement.style.textShadow = 'none';
      }, 600);
    }
  }

  // Esperamos medio segundo antes de empezar
  setTimeout(typeEffect, 400);
});

// ============================================
// 3. EFECTO DE BRILLO EN LAS TARJETAS (MOUSE MOVE)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const card = document.querySelector('.card');
  if (!card) return;

  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    this.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    this.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    this.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
  });
});

// ============================================
// 4. ANIMACIÓN DE ENTRADA (FADE-IN) AL HACER SCROLL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  });

  sections.forEach((section) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
    observer.observe(section);
  });

  // También animamos el perfil
  const profile = document.querySelector('.profile');
  if (profile) {
    profile.style.opacity = '0';
    profile.style.transform = 'translateY(30px)';
    profile.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
    setTimeout(() => {
      profile.style.opacity = '1';
      profile.style.transform = 'translateY(0)';
    }, 200);
  }
});