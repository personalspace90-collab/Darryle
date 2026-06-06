let selPkg_ = null;
const pkgs = {bronze:{name:'Bronze — Fan Experience',price:'$75'},silver:{name:'Silver — Style Session',price:'$150'},gold:{name:'Gold — VIP Access',price:'$300'}};

function openModal(pkg){
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow='hidden';
  document.getElementById('formWrap').style.display='block';
  document.getElementById('successScreen').style.display='none';
  goStep(1);
  if(pkg) selPkg(pkg);
  document.getElementById('f-dt').min = new Date().toISOString().split('T')[0];
}
function closeModal(){
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow='';
}
function handleBg(e){if(e.target===document.getElementById('overlay'))closeModal();}

function selPkg(id){
  selPkg_=id;
  ['bronze','silver','gold'].forEach(p=>{
    document.getElementById('pc-'+p).classList.remove('sel');
  });
  document.getElementById('pc-'+id).classList.add('sel');
}

function goStep(n){
  if(n===2&&!selPkg_){alert('Please select a package first.');return;}
  if(n===3){
    const fn=document.getElementById('f-fn').value.trim();
    const ln=document.getElementById('f-ln').value.trim();
    const em=document.getElementById('f-em').value.trim();
    const ph=document.getElementById('f-ph').value.trim();
    const dt=document.getElementById('f-dt').value;
    const tm=document.getElementById('f-tm').value;
    if(!fn||!ln||!em||!ph||!dt||!tm){alert('Please fill in all required fields.');return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){alert('Please enter a valid email.');return;}
    const d=new Date(dt+'T12:00:00');
    const ds=d.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    const p=pkgs[selPkg_];
    document.getElementById('summary').innerHTML=`
      <div class="crow"><span class="ckey">Package</span><span class="cval">${p.name}</span></div>
      <div class="crow"><span class="ckey">Price</span><span class="cval">${p.price}</span></div>
      <div class="crow"><span class="ckey">Name</span><span class="cval">${fn} ${ln}</span></div>
      <div class="crow"><span class="ckey">Email</span><span class="cval">${em}</span></div>
      <div class="crow"><span class="ckey">Phone</span><span class="cval">${ph}</span></div>
      <div class="crow"><span class="ckey">Date</span><span class="cval">${ds}</span></div>
      <div class="crow"><span class="ckey">Time</span><span class="cval">${tm}</span></div>
    `;
  }
  [1,2,3].forEach(i=>{
    document.getElementById('p'+i).classList.remove('active');
    const s=document.getElementById('si'+i);
    s.classList.remove('active','done');
    if(i<n)s.classList.add('done');
    else if(i===n)s.classList.add('active');
  });
  document.getElementById('p'+n).classList.add('active');
  document.getElementById('modalBox').scrollTop=0;
}

async function submitBooking(){
  const fn=document.getElementById('f-fn').value.trim();
  const ln=document.getElementById('f-ln').value.trim();
  const em=document.getElementById('f-em').value.trim();
  const ph=document.getElementById('f-ph').value.trim();
  const dt=document.getElementById('f-dt').value;
  const tm=document.getElementById('f-tm').value;
  const nt=document.getElementById('f-note').value.trim();
  const p=pkgs[selPkg_];

  try{
    const res=await fetch('https://formspree.io/f/mjgdgrnl',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({
        _subject:'New Meet & Greet Booking — '+p.name,
        package:p.name,
        price:p.price,
        name:fn+' '+ln,
        email:em,
        phone:ph,
        date:dt,
        time:tm,
        notes:nt||'None'
      })
    });
    if(res.ok){
      document.getElementById('formWrap').style.display='none';
      document.getElementById('successScreen').style.display='block';
    }else{
      alert('Something went wrong. Please email darrylejonesmgteam@gmail.com directly.');
    }
  }catch(e){
    alert('Connection error. Please email darrylejonesmgteam@gmail.com directly.');
  }
}
// Contact form
document.getElementById('contactForm').addEventListener('submit',async function(e){
  e.preventDefault();
  const btn=this.querySelector('.submit-btn');
  btn.textContent='Sending...';
  try{
    const res=await fetch('https://formspree.io/f/mjgdgrnl',{method:'POST',body:new FormData(this),headers:{Accept:'application/json'}});
    if(res.ok){btn.textContent='Message Sent ✓';this.reset();}
    else{btn.textContent='Send Message';}
  }catch(e){btn.textContent='Send Message';}
});

document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});
