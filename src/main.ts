import { Service, Salon } from './types';
import { fetchJSON } from './api';

// Rövid DOM-segédfüggvények
const $ = <T extends Element = Element>(
  sel: string,
  parent: Document | Element = document
) => parent.querySelector(sel) as T | null;

const $$ = <T extends Element = Element>(
  sel: string,
  parent: Document | Element = document
) => Array.from(parent.querySelectorAll(sel)) as T[];

// Mintadatok (ha nincs backend)
const sample = {
  services: [
    { id: 'svc1', name: 'Női hajvágás', description: 'Szárítással, tanácsadással.', price: 6900 },
    { id: 'svc2', name: 'Férfi hajvágás', description: 'Klasszikus vagy modern fazon.', price: 4900 },
    { id: 'svc3', name: 'Gél lakkozás', description: 'Tartós, fényes körmök.', price: 5500 },
    { id: 'svc4', name: 'Arckezelés', description: 'Bőrdiagnosztikával.', price: 12900 },
    { id: 'svc5', name: 'Szempilla lifting', description: 'Hosszan tartó ív.', price: 11900 },
    { id: 'svc6', name: 'Szemöldök styling', description: 'Formázás, festés.', price: 5900 },
  ] as Service[],
  salons: [
    { id: 'sal1', name: 'Kleopátra – Astoria', address: 'Budapest, Károly krt. 1.', phone: '+36 1 234 5678' },
    { id: 'sal2', name: 'Kleopátra – Nyugati', address: 'Budapest, Teréz krt. 55.', phone: '+36 1 876 5432' },
    { id: 'sal3', name: 'Kleopátra – Gyöngyös', address: 'Gyöngyös, Fő tér 3.', phone: '+36 37 555 555' },
    { id: 'sal4', name: 'Kleopátra – Debrecen', address: 'Debrecen, Piac u. 2.', phone: '+36 52 123 456' },
  ] as Salon[],
};

// ---- Type guardok az API válaszokhoz ----
type ServicesResponse = Service[] | { services: Service[] };
type SalonsResponse = Salon[] | { salons: Salon[] };

function isServicesArray(v: unknown): v is Service[] {
  return Array.isArray(v);
}
function isServicesObj(v: unknown): v is { services: Service[] } {
  return typeof v === 'object' && v !== null && 'services' in v;
}
function isSalonsArray(v: unknown): v is Salon[] {
  return Array.isArray(v);
}
function isSalonsObj(v: unknown): v is { salons: Salon[] } {
  return typeof v === 'object' && v !== null && 'salons' in v;
}

// Szolgáltatások megjelenítése
function renderServices(list: Service[]): void {
  const grid = $('#servicesGrid');
  if (!grid) return;

  grid.innerHTML = '';
  list.forEach((svc: Service) => {
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

  $$<HTMLButtonElement>('.card button').forEach((btn: HTMLButtonElement) => {
    btn.addEventListener('click', () => {
      const sid = btn.getAttribute('data-sid') ?? '';
      const select = $('#serviceSelect') as HTMLSelectElement | null;
      if (select && sid) {
        select.value = sid;
        const booking = $('#booking') as HTMLElement | null;
        if (booking) window.scrollTo({ top: booking.offsetTop - 60, behavior: 'smooth' });
      }
    });
  });
}

// Szalonok megjelenítése
function renderSalons(list: Salon[]): void {
  const box = $('#salonList');
  if (!box) return;

  box.innerHTML = '';
  list.forEach((s: Salon) => {
    const el = document.createElement('div');
    el.className = 'salon-item';
    el.innerHTML = `
      <h4>${s.name}</h4>
      <div class="meta">${s.address ?? ''}</div>
      <div class="meta">${s.phone ? 'Tel: ' + s.phone : ''}</div>
    `;
    box.appendChild(el);
  });

  const salSel = $('#salonSelect') as HTMLSelectElement | null;
  if (salSel) {
    salSel.innerHTML =
      '<option value="">– Válassz –</option>' +
      list.map((s: Salon) => `<option value="${s.id}">${s.name}</option>`).join('');
  }
}

// Szolgáltatások betöltése (API → fallback sample-re)
async function loadServices(): Promise<void> {
  const select = $('#serviceSelect') as HTMLSelectElement | null;

  try {
    const data = await fetchJSON<ServicesResponse>('/api/services?limit=6');

    const arr: Service[] = isServicesArray(data)
      ? data
      : isServicesObj(data)
        ? data.services
        : [];

    renderServices(arr);

    if (select) {
      select.innerHTML =
        '<option value="">– Válassz –</option>' +
        arr.map((s: Service) => `<option value="${s.id}">${s.name}</option>`).join('');
    }
  } catch {
    renderServices(sample.services);
    if (select) {
      select.innerHTML =
        '<option value="">– Válassz –</option>' +
        sample.services.map((s: Service) => `<option value="${s.id}">${s.name}</option>`).join('');
    }
  }
}

// Szalonok betöltése (API → fallback sample-re)
async function loadSalons(): Promise<void> {
  try {
    const data = await fetchJSON<SalonsResponse>('/api/salons');

    const arr: Salon[] = isSalonsArray(data)
      ? data
      : isSalonsObj(data)
        ? data.salons
        : [];

    renderSalons(arr);
  } catch {
    renderSalons(sample.salons);
  }
}

// Fejléc hamburger menü
function initHeader(): void {
  const btn = $('#navToggle') as HTMLButtonElement | null;
  const nav = $('#mainNav') as HTMLElement | null;
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    const spans = btn.querySelectorAll('span');
    if (open) {
      (spans[0] as HTMLElement).style.transform = 'translateY(7px) rotate(45deg)';
      (spans[1] as HTMLElement).style.opacity = '0';
      (spans[2] as HTMLElement).style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      (spans[0] as HTMLElement).style.transform = '';
      (spans[1] as HTMLElement).style.opacity = '';
      (spans[2] as HTMLElement).style.transform = '';
    }
  });
}

// Cookie értesítő
function initCookiebar(): void {
  const bar = $('#cookiebar') as HTMLElement | null;
  const btn = $('#cookieAccept') as HTMLButtonElement | null;
  if (!bar || !btn) return;

  const ok = localStorage.getItem('kleo_cookie_ok');
  if (ok) {
    bar.style.display = 'none';
    return;
  }

  btn.addEventListener('click', () => {
    localStorage.setItem('kleo_cookie_ok', '1');
    bar.remove();
  });
}

// Aktuális év beállítása
function setYear(): void {
  const y = new Date().getFullYear();
  const el = $('#year');
  if (el) el.textContent = String(y);
}

// Foglalási űrlap kezelése
function handleBooking(): void {
  const form = $('#bookingForm') as HTMLFormElement | null;
  const msg = $('#bookingMsg') as HTMLElement | null;
  if (!form || !msg) return;

  form.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault();
    msg.textContent = 'Foglalás küldése...';

    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries()) as Record<string, FormDataEntryValue>;

    try {
      await fetchJSON('/api/appointments', { method: 'POST', body: JSON.stringify(payload) });
      msg.textContent = 'Köszönjük! Hamarosan visszaigazoljuk.';
      form.reset();
    } catch {
      msg.textContent = 'Hiba történt. Próbáld újra később.';
    }
  });
}

// Alkalmazás inicializálása
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initHeader();
  initCookiebar();
  loadServices();
  loadSalons();
  handleBooking();
});
function rotateHero(): void {
  const srcs = [
    '/images/images_1.webp',
    '/images/images_2.webp',
    '/images/images_3.webp',
    '/images/images_4.webp'
  ];
  let i = 0;
  const el = document.getElementById('heroImage') as HTMLImageElement | null;
  if (!el) return;

  setInterval(() => {
    i = (i + 1) % srcs.length;
    el.src = srcs[i];
  }, 4500);
}

document.addEventListener('DOMContentLoaded', () => {
  // ... a meglévő init-ek mellé:
  rotateHero();
});
