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

// Reset: show form, hide success
document.getElementById(‘formWrap’).style.display = ‘block’;
document.getElementById(‘successScreen’).style.display = ‘none’;

// Reset step indicators + panels
goStep(1);

// Pre-select package if one was passed in
if (pkg) selectPackage(pkg);

// Set min date to today
document.getElementById(‘f-dt’).min = new Date().toISOString().split(‘T’)[0];
}

function closeModal() {
document.getElementById(‘overlay’).classList.remove(‘open’);
document.body.style.overflow = ‘’;
}

/* ============================================
PACKAGE SELECTION
============================================ */
function selectPackage(id) {
selectedPackage = id;
[‘bronze’, ‘silver’, ‘gold’].forEach(function(p) {
document.getElementById(‘pc-’ + p).classList.remove(‘sel’);
});
document.getElementById(‘pc-’ + id).classList.add(‘sel’);
}

/* ============================================
STEP NAVIGATION
============================================ */
function goStep(n) {
if (n === 2 && !selectedPackage) {
alert(‘Please select a package first.’);
return;
}

if (n === 3) {
var fn = document.getElementById(‘f-fn’).value.trim();
var ln = document.getElementById(‘f-ln’).value.trim();
var em = document.getElementById(‘f-em’).value.trim();
var ph = document.getElementById(‘f-ph’).value.trim();
var dt = document.getElementById(‘f-dt’).value;
var tm = document.getElementById(‘f-tm’).value;

```
if (!fn || !ln || !em || !ph || !dt || !tm) {
  alert('Please fill in all required fields.');
  return;
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
  alert('Please enter a valid email address.');
  return;
}
buildConfirmSummary(fn, ln, em, ph, dt, tm);
```

}

// Update indicators
[1, 2, 3].forEach(function(i) {
document.getElementById(‘p’ + i).classList.remove(‘active’);
var ind = document.getElementById(‘si’ + i);
ind.classList.remove(‘active’, ‘done’);
if (i < n) ind.classList.add(‘done’);
else if (i === n) ind.classList.add(‘active’);
});

document.getElementById(‘p’ + n).classList.add(‘active’);
document.getElementById(‘modalBox’).scrollTop = 0;
}

/* ============================================
BUILD CONFIRM SUMMARY
============================================ */
function buildConfirmSummary(fn, ln, em, ph, dt, tm) {
var pkg = PACKAGES[selectedPackage];
var d = new Date(dt + ‘T12:00:00’);
var dateStr = d.toLocaleDateString(‘en-US’, {
weekday: ‘long’, year: ‘numeric’, month: ‘long’, day: ‘numeric’
});

document.getElementById(‘summary’).innerHTML =
‘<div class="crow"><span class="ckey">Package</span><span class="cval">’ + pkg.name + ‘</span></div>’ +
‘<div class="crow"><span class="ckey">Price</span><span class="cval">’ + pkg.price + ‘</span></div>’ +
‘<div class="crow"><span class="ckey">Name</span><span class="cval">’ + fn + ’ ’ + ln + ‘</span></div>’ +
‘<div class="crow"><span class="ckey">Email</span><span class="cval">’ + em + ‘</span></div>’ +
‘<div class="crow"><span class="ckey">Phone</span><span class="cval">’ + ph + ‘</span></div>’ +
‘<div class="crow"><span class="ckey">Date</span><span class="cval">’ + dateStr + ‘</span></div>’ +
‘<div class="crow"><span class="ckey">Time</span><span class="cval">’ + tm + ‘</span></div>’;
}

/* ============================================
SUBMIT BOOKING → FORMSPREE
============================================ */
function submitBooking() {
var fn  = document.getElementById(‘f-fn’).value.trim();
var ln  = document.getElementById(‘f-ln’).value.trim();
var em  = document.getElementById(‘f-em’).value.trim();
var ph  = document.getElementById(‘f-ph’).value.trim();
var dt  = document.getElementById(‘f-dt’).value;
var tm  = document.getElementById(‘f-tm’).value;
var nt  = document.getElementById(‘f-note’).value.trim();
var pkg = PACKAGES[selectedPackage];

var btn = document.querySelector(’#p3 .btn-next’);
btn.textContent = ‘Sending…’;
btn.disabled = true;

fetch(FORMSPREE_URL, {
method: ‘POST’,
headers: { ‘Content-Type’: ‘application/json’, ‘Accept’: ‘application/json’ },
body: JSON.stringify({
_subject: ’New Meet & Greet Booking — ’ + pkg.name,
package:  pkg.name,
price:    pkg.price,
name:     fn + ’ ’ + ln,
email:    em,
phone:    ph,
date:     dt,
time:     tm,
notes:    nt || ‘None’
})
})
.then(function(res) {
if (res.ok) {
document.getElementById(‘formWrap’).style.display = ‘none’;
document.getElementById(‘successScreen’).style.display = ‘block’;
// Reset
[‘f-fn’,‘f-ln’,‘f-em’,‘f-ph’,‘f-dt’,‘f-note’].forEach(function(id) {
document.getElementById(id).value = ‘’;
});
document.getElementById(‘f-tm’).value = ‘’;
selectedPackage = null;
[‘bronze’,‘silver’,‘gold’].forEach(function(p) {
document.getElementById(‘pc-’ + p).classList.remove(‘sel’);
});
} else {
alert(‘Something went wrong. Please email darrylejonesmgteam@gmail.com directly.’);
btn.textContent = ‘Confirm Booking ✓’;
btn.disabled = false;
}
})
.catch(function() {
alert(‘Connection error. Please email darrylejonesmgteam@gmail.com directly.’);
btn.textContent = ‘Confirm Booking ✓’;
btn.disabled = false;
});
}

/* ============================================
CONTACT FORM SUBMIT
============================================ */
function handleContactSubmit(e) {
e.preventDefault();
var form = e.target;
var btn  = form.querySelector(’.submit-btn’);

btn.textContent = ‘Sending…’;
btn.disabled = true;

fetch(FORMSPREE_URL, {
method: ‘POST’,
body: new FormData(form),
headers: { ‘Accept’: ‘application/json’ }
})
.then(function(res) {
if (res.ok) {
btn.textContent = ‘Message Sent ✓’;
form.reset();
setTimeout(function() {
btn.textContent = ‘Send Message’;
btn.disabled = false;
}, 3000);
} else {
btn.textContent = ‘Try Again’;
btn.disabled = false;
}
})
.catch(function() {
btn.textContent = ‘Try Again’;
btn.disabled = false;
});
}

/* ============================================
CLOSE ON BACKGROUND CLICK + ESC KEY
============================================ */
document.getElementById(‘overlay’).addEventListener(‘click’, function(e) {
if (e.target === this) closeModal();
});

document.addEventListener(‘keydown’, function(e) {
if (e.key === ‘Escape’) closeModal();
});

/* ============================================
CONTACT FORM LISTENER
============================================ */
document.getElementById(‘contactForm’).addEventListener(‘submit’, handleContactSubmit);

/* ============================================
SMOOTH SCROLL
============================================ */
document.querySelectorAll(‘a[href^=”#”]’).forEach(function(link) {
link.addEventListener(‘click’, function(e) {
var target = document.querySelector(link.getAttribute(‘href’));
if (target) {
e.preventDefault();
target.scrollIntoView({ behavior: ‘smooth’ });
}
});
});
