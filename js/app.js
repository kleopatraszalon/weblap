/* ====== Egyszerű statikus web + API integráció ====== */
// Állítsd be a backend API base URL-t a js/config.js-ben (window.KLEO_API_BASE)
const API_BASE = (typeof window !== 'undefined' && window.KLEO_API_BASE) ? window.KLEO_API_BASE : 'http://localhost:5000';

const $ = (sel, parent=document) => parent.querySelector(sel);
const $$ = (sel, parent=document) => Array.from(parent.querySelectorAll(sel));

const fetchJSON = async (path, opts={}) => {
  try{
    const res = await fetch(`${API_BASE}${path}`, { headers:{'Content-Type':'application/json'}, ...opts });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }catch(err){
    console.warn('API hiba', path, err);
    throw err;
  }
};

const sample = {
  services: [
    { id:'svc1', name:'Női hajvágás', description:'Szárítással, tanácsadással.', price: 6900 },
    { id:'svc2', name:'Férfi hajvágás', description:'Klasszikus vagy modern fazon.', price: 4900 },
    { id:'svc3', name:'Gél lakkozás', description:'Tartós, fényes körmök.', price: 5500 },
    { id:'svc4', name:'Arckezelés', description:'Bőrdiagnosztikával.', price: 12900 },
    { id:'svc5', name:'Szempilla lifting', description:'Hosszan tartó ív.', price: 11900 },
    { id:'svc6', name:'Szemöldök styling', description:'Formázás, festés.', price: 5900 },
  ],
  salons: [
    { id:'sal1', name:'Kleopátra – Astoria', address:'Budapest, Károly krt. 1.', phone:'+36 1 234 5678' },
    { id:'sal2', name:'Kleopátra – Nyugati', address:'Budapest, Teréz krt. 55.', phone:'+36 1 876 5432' },
    { id:'sal3', name:'Kleopátra – Gyöngyös', address:'Gyöngyös, Fő tér 3.', phone:'+36 37 555 555' },
    { id:'sal4', name:'Kleopátra – Debrecen', address:'Debrecen, Piac u. 2.', phone:'+36 52 123 456' }
  ]
};

function renderServices(list){
  const grid = $('#servicesGrid');
  grid.innerHTML = '';
  list.forEach(svc=>{
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <h3>${svc.name}</h3>
      <p class="desc">${svc.description ?? ''}</p>
      <div class="price">${Intl.NumberFormat('hu-HU').format(svc.price)} Ft</div>
      <button class="btn btn-primary" data-sid="${svc.id}">Foglalok</button>
    `;
    grid.appendChild(el);
  });

  // gombok -> kiválasztás a foglalási űrlapban
  $$('.card button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const sid = btn.getAttribute('data-sid');
      const select = $('#serviceSelect');
      if(select && sid){
        select.value = sid;
        window.scrollTo({ top: $('#booking').offsetTop - 60, behavior: 'smooth' });
      }
    });
  });
}
function renderSalons(list){
  const box = $('#salonList');
  box.innerHTML = '';
  list.forEach(s=>{
    const el = document.createElement('div');
    el.className = 'salon-item';
    el.innerHTML = `
      <h4>${s.name}</h4>
      <div class="meta">${s.address ?? ''}</div>
      <div class="meta">${s.phone ? 'Tel: ' + s.phone : ''}</div>
    `;
    box.appendChild(el);
  });

  // töltsük a selecteket is
  const salSel = $('#salonSelect');
  if(salSel){
    salSel.innerHTML = '<option value="">– Válassz –</option>' + list.map(s=>`<option value="${s.id}">${s.name}</option>`).join('');
  }
}

async function loadServices(){
  try{
    // Backend tipp: GET /api/services?limit=6
    const data = await fetchJSON('/api/services?limit=6');
    renderServices(data?.services || data || []);
    // service select töltése
    const select = $('#serviceSelect');
    if(select){
      const arr = data?.services || data || [];
      select.innerHTML = '<option value="">– Válassz –</option>' + arr.map(s=>`<option value="${s.id}">${s.name}</option>`).join('');
    }
  }catch{
    renderServices(sample.services);
    const select = $('#serviceSelect');
    if(select){
      select.innerHTML = '<option value="">– Válassz –</option>' + sample.services.map(s=>`<option value="${s.id}">${s.name}</option>`).join('');
    }
  }
}

async function loadSalons(){
  try{
    // Backend tipp: GET /api/salons
    const data = await fetchJSON('/api/salons');
    renderSalons(data?.salons || data || []);
  }catch{
    renderSalons(sample.salons);
  }
}

function handleNewsletter(){
  const form = $('#newsletterForm');
  const msg = $('#newsletterMsg');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    msg.textContent = 'Küldés...';
    const fd = new FormData(form);
    const payload = { email: fd.get('email') };
    try{
      // Backend tipp: POST /api/newsletter/subscribe
      await fetchJSON('/api/newsletter/subscribe', { method:'POST', body: JSON.stringify(payload) });
      msg.textContent = 'Köszönjük! Sikeres feliratkozás.';
      form.reset();
    }catch(err){
      msg.textContent = 'Hopp, nem sikerült. Próbáld újra később.';
    }
  });
}

function handleBooking(){
  const form = $('#bookingForm');
  const msg = $('#bookingMsg');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    msg.textContent = 'Foglalás küldése...';
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    try{
      // Backend tipp: POST /api/appointments
      await fetchJSON('/api/appointments', { method:'POST', body: JSON.stringify(payload) });
      msg.textContent = 'Köszönjük! Hamarosan visszaigazoljuk.';
      form.reset();
    }catch(err){
      msg.textContent = 'Hiba történt a foglalásnál. Kérjük, próbáld újra.';
    }
  });
}

function initHeader(){
  const btn = $('#navToggle');
  const nav = $('#mainNav');
  if(!btn || !nav) return;

  btn.addEventListener('click', ()=>{
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    // anim ikon
    const spans = btn.querySelectorAll('span');
    if(open){
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    }else{
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}

function initCookiebar(){
  const bar = $('#cookiebar');
  const btn = $('#cookieAccept');
  if(!bar || !btn) return;
  const ok = localStorage.getItem('kleo_cookie_ok');
  if(ok) { bar.style.display = 'none'; return }
  btn.addEventListener('click', ()=>{
    localStorage.setItem('kleo_cookie_ok', '1');
    bar.remove();
  });
}

function setYear(){
  const y = new Date().getFullYear();
  const el = $('#year');
  if(el) el.textContent = y;
}

document.addEventListener('DOMContentLoaded', ()=>{
  setYear();
  initHeader();
  initCookiebar();
  loadServices();
  loadSalons();
  handleNewsletter();
  handleBooking();
});
