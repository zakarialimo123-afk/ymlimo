/* YM LIMOUSINE INC. — Scripts */

// Mobile Nav Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.textContent = '☰';
  });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.service-card, .fleet-card, .testimonial-card, .why-item').forEach(el => {
  observer.observe(el);
});

// Form handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const btn = this.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Build message for Telegram/email
  const formData = new FormData(this);
  const fields = {};
  const fieldNames = [
    'name', 'phone', 'email', 'passengers',
    'pickup', 'dropoff', 'date', 'time',
    'vehicle', 'notes'
  ];

  this.querySelectorAll('input, select, textarea').forEach((el, i) => {
    if (i < fieldNames.length) {
      fields[fieldNames[i]] = el.value;
    }
  });

  let msg = '🚗 *New Booking Request*\n\n';
  msg += `*Name:* ${fields.name}\n`;
  msg += `*Phone:* ${fields.phone}\n`;
  if (fields.email) msg += `*Email:* ${fields.email}\n`;
  msg += `*Passengers:* ${fields.passengers || 'Not specified'}\n`;
  msg += `*Pickup:* ${fields.pickup}\n`;
  msg += `*Dropoff:* ${fields.dropoff}\n`;
  msg += `*Date:* ${fields.date}\n`;
  msg += `*Time:* ${fields.time}\n`;
  msg += `*Vehicle:* ${document.querySelector('#contactForm select').value || 'Not specified'}\n`;
  if (fields.notes) msg += `*Notes:* ${fields.notes}\n`;

  console.log('Booking Request:', msg);

  // Simulate sending — replace with actual API call
  setTimeout(() => {
    btn.textContent = '✓ Quote Request Sent!';
    btn.style.background = '#22c55e';
    btn.style.borderColor = '#22c55e';
    btn.style.color = '#fff';
    this.reset();

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 3000);
  }, 1200);
});
