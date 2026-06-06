let selPkg_ = null;
const pkgs = {
  bronze: { name: 'Bronze - Fan Experience', price: '$250' },
  silver: { name: 'Silver - Portfolio Shoot', price: '$500' },
  gold: { name: 'Gold - Commercial Package', price: '$1000' }
};

function openModal(pkg) {
  document.getElementById('overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('formWrap').style.display = 'block';
  document.getElementById('successScreen').style.display = 'none';
  goStep(1);
  if (pkg) selPkg(pkg);
  document.getElementById('f-dt').min = new Date().toISOString().split('T')[0];
}

function closeModal() {
  document.getElementById('overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function handleBg(e) {
  if (e.target === document.getElementById('overlay')) closeModal();
}

function selPkg(id) {
  selPkg_ = id;
  ['bronze', 'silver', 'gold'].forEach(p => {
    document.getElementById('pc-' + p).classList.remove('active');
  });
  document.getElementById('pc-' + id).classList.add('active');
}

function goStep(n) {
  ['step1', 'step2'].forEach((s, i) => {
    document.getElementById(s).style.display = (i + 1 === n) ? 'block' : 'none';
  });
}

// Formspree Integration Logic
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('.submit-btn');
    if (btn) btn.textContent = 'Sending...';
    
    try {
      const res = await fetch('https://formspree.io/f/mjgoddor', {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        if (btn) btn.textContent = 'Message Sent ✓';
        document.getElementById('formWrap').style.display = 'none';
        document.getElementById('successScreen').style.display = 'block';
        this.reset();
      } else {
        alert('Something went wrong. Please email darrylejonesmgmt@gmail.com');
        if (btn) btn.textContent = 'Send Message';
      }
    } catch(e) {
      alert('Connection error. Please email darrylejonesmgmt@gmail.com');
      if (btn) btn.textContent = 'Send Message';
    }
  });
}

