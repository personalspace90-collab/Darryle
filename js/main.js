/* ============================================
DARRYLE JONES — main.js
============================================ */

/* ── PACKAGE DATA ── */
const PACKAGES = {
bronze: { name: ‘Bronze — Fan Experience’, price: ‘$75’ },
silver: { name: ‘Silver — Style Session’,  price: ‘$150’ },
gold:   { name: ‘Gold — VIP Access’,       price: ‘$300’ }
};

const FORMSPREE_URL = ‘https://formspree.io/f/mjgdgrnl’;

/* ── STATE ── */
let selectedPackage = null;

/* ============================================
MODAL — OPEN / CLOSE
============================================ */
function openModal(pkg) {
const overlay = document.getElementById(‘overlay’);
overlay.classList.add(‘open’);
document.body.style.overflow = ‘hidden’;

// Reset to step 1 and show form
document.getElementById(‘formWrap’).style.display = ‘block’;
document.getElementById(‘successScreen’).style.display = ‘none’;
goStep(1);

// Pre-select package if passed in
if (pkg) selectPackage(pkg);

// Set min date to today
document.getElementById(‘f-dt’).min = new Date().toISOString().split(‘T’)[0];
}

function closeModal() {
document.getElementById(‘overlay’).classList.remove(‘open’);
document.body.style.overflow = ‘’;
}

// Close when clicking the dark background
function handleOverlayClick(e) {
if (e.target === document.getElementById(‘overlay’)) {
closeModal();
}
}

/* ============================================
MODAL — PACKAGE SELECTION
============================================ */
function selectPackage(id) {
selectedPackage = id;

// Remove selected state from all cards
[‘bronze’, ‘silver’, ‘gold’].forEach(p => {
document.getElementById(‘pc-’ + p).classList.remove(‘sel’);
});

// Add selected state to chosen card
document.getElementById(‘pc-’ + id).classList.add(‘sel’);
}

/* ============================================
MODAL — STEP NAVIGATION
============================================ */
function goStep(n) {
// Validate step 2 entry
if (n === 2 && !selectedPackage) {
alert(‘Please select a package first.’);
return;
}

// Validate step 3 entry
if (n === 3) {
const fn = document.getElementById(‘f-fn’).value.trim();
const ln = document.getElementById(‘f-ln’).value.trim();
const em = document.getElementById(‘f-em’).value.trim();
const ph = document.getElementById(‘f-ph’).value.trim();
const dt = document.getElementById(‘f-dt’).value;
const tm = document.getElementById(‘f-tm’).value;

```
if (!fn || !ln || !em || !ph || !dt || !tm) {
  alert('Please fill in all required fields.');
  return;
}

const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
if (!emailValid) {
  alert('Please enter a valid email address.');
  return;
}

buildConfirmSummary(fn, ln, em, ph, dt, tm);
```

}

// Update step indicators
[1, 2, 3].forEach(i => {
const panel = document.getElementById(‘p’ + i);
const indicator = document.getElementById(‘si’ + i);

```
panel.classList.remove('active');
indicator.classList.remove('active', 'done');

if (i < n)      indicator.classList.add('done');
else if (i === n) indicator.classList.add('active');
```

});

// Show current panel
document.getElementById(‘p’ + n).classList.add(‘active’);

// Scroll modal to top
document.getElementById(‘modalBox’).scrollTop = 0;
}

/* ============================================
MODAL — BUILD CONFIRMATION SUMMARY
============================================ */
function buildConfirmSummary(fn, ln, em, ph, dt, tm) {
const pkg = PACKAGES[selectedPackage];
const dateObj = new Date(dt + ‘T12:00:00’);
const dateStr = dateObj.toLocaleDateString(‘en-US’, {
weekday: ‘long’, year: ‘numeric’, month: ‘long’, day: ‘numeric’
});

document.getElementById(‘summary’).innerHTML = `<div class="crow"><span class="ckey">Package</span><span class="cval">${pkg.name}</span></div> <div class="crow"><span class="ckey">Price</span><span class="cval">${pkg.price}</span></div> <div class="crow"><span class="ckey">Name</span><span class="cval">${fn} ${ln}</span></div> <div class="crow"><span class="ckey">Email</span><span class="cval">${em}</span></div> <div class="crow"><span class="ckey">Phone</span><span class="cval">${ph}</span></div> <div class="crow"><span class="ckey">Date</span><span class="cval">${dateStr}</span></div> <div class="crow"><span class="ckey">Time</span><span class="cval">${tm}</span></div>`;
}

/* ============================================
MODAL — SUBMIT BOOKING (sends to Formspree)
============================================ */
async function submitBooking() {
const fn = document.getElementById(‘f-fn’).value.trim();
const ln = document.getElementById(‘f-ln’).value.trim();
const em = document.getElementById(‘f-em’).value.trim();
const ph = document.getElementById(‘f-ph’).value.trim();
const dt = document.getElementById(‘f-dt’).value;
const tm = document.getElementById(‘f-tm’).value;
const nt = document.getElementById(‘f-note’).value.trim();
const pkg = PACKAGES[selectedPackage];

const btn = document.querySelector(’#p3 .btn-next’);
btn.textContent = ‘Sending…’;
btn.disabled = true;

try {
const response = await fetch(FORMSPREE_URL, {
method: ‘POST’,
headers: {
‘Content-Type’: ‘application/json’,
‘Accept’: ‘application/json’
},
body: JSON.stringify({
_subject: `New Meet & Greet Booking — ${pkg.name}`,
package:  pkg.name,
price:    pkg.price,
name:     `${fn} ${ln}`,
email:    em,
phone:    ph,
date:     dt,
time:     tm,
notes:    nt || ‘None’
})
});

```
if (response.ok) {
  // Show success screen
  document.getElementById('formWrap').style.display = 'none';
  document.getElementById('successScreen').style.display = 'block';

  // Reset form fields
  ['f-fn','f-ln','f-em','f-ph','f-dt','f-note'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('f-tm').value = '';
  selectedPackage = null;
  ['bronze','silver','gold'].forEach(p => {
    document.getElementById('pc-' + p).classList.remove('sel');
  });
} else {
  alert('Something went wrong. Please email darrylejonesmgteam@gmail.com directly.');
}
```

} catch (err) {
alert(‘Connection error. Please email darrylejonesmgteam@gmail.com directly.’);
} finally {
btn.textContent = ‘Confirm Booking ✓’;
btn.disabled = false;
}
}

/* ============================================
CONTACT FORM — SUBMIT
============================================ */
async function handleContactSubmit(e) {
e.preventDefault();
const form = e.target;
const btn = form.querySelector(’.submit-btn’);

btn.textContent = ‘Sending…’;
btn.disabled = true;

try {
const response = await fetch(FORMSPREE_URL, {
method: ‘POST’,
body: new FormData(form),
headers: { ‘Accept’: ‘application/json’ }
});

```
if (response.ok) {
  btn.textContent = 'Message Sent ✓';
  form.reset();
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }, 3000);
} else {
  btn.textContent = 'Try Again';
  btn.disabled = false;
}
```

} catch (err) {
btn.textContent = ‘Try Again’;
btn.disabled = false;
}
}

/* ============================================
SMOOTH SCROLL
============================================ */
function initSmoothScroll() {
document.querySelectorAll(‘a[href^=”#”]’).forEach(link => {
link.addEventListener(‘click’, e => {
const target = document.querySelector(link.getAttribute(‘href’));
if (target) {
e.preventDefault();
target.scrollIntoView({ behavior: ‘smooth’ });
}
});
});
}

/* ============================================
KEYBOARD: ESC CLOSES MODAL
============================================ */
function initKeyboard() {
document.addEventListener(‘keydown’, e => {
if (e.key === ‘Escape’) closeModal();
});
}

/* ============================================
INIT — runs when page loads
============================================ */
document.addEventListener(‘DOMContentLoaded’, () => {
initSmoothScroll();
initKeyboard();

// Wire up contact form
const contactForm = document.getElementById(‘contactForm’);
if (contactForm) {
contactForm.addEventListener(‘submit’, handleContactSubmit);
}

// Wire up overlay background click
const overlay = document.getElementById(‘overlay’);
if (overlay) {
overlay.addEventListener(‘click’, handleOverlayClick);
}
});
