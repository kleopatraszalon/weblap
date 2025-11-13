
// Kleopátra marketing oldal – API bekötés minta
const API_BASE = window.KLEO_API_BASE || "https://your-api.example.com/public";

function apiUrl(path) {
  return API_BASE.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
}

async function fetchJSON(path) {
  const url = apiUrl(path);
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    credentials: "omit",
  });
  if (!res.ok) {
    throw new Error("API hiba: " + res.status + " " + res.statusText);
  }
  return res.json();
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function renderLocations() {
  const root = document.querySelector("[data-locations-root]");
  if (!root) return;
  root.innerHTML = '<p class="small muted">Szalonok betöltése...</p>';
  try {
    const data = await fetchJSON("locations");
    const items = Array.isArray(data) ? data : data.items || [];
    if (!items.length) {
      root.innerHTML = '<p class="small muted">Jelenleg nincs megjeleníthető szalon.</p>';
      return;
    }
    root.innerHTML = "";
    items.forEach((loc) => {
      const card = document.createElement("article");
      card.className = "card";
      const name = loc.display_name || loc.name || "Kleopátra Szépségszalon";
      const city = loc.city || "";
      const address = loc.address || "";
      const url = loc.public_url || loc.website || null;
      const services = loc.services_summary || "";
      card.innerHTML = `
        <h2 class="card-title">${escapeHtml(name)}</h2>
        <p class="card-text">${escapeHtml(city)} ${escapeHtml(address)}</p>
        <p class="card-text small muted">${escapeHtml(services)}</p>
        ${
          url
            ? `<a class="link-btn" href="${escapeHtml(url)}" target="_blank" rel="noopener">Részletek a szalon oldalán</a>`
            : ""
        }
      `;
      root.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    root.innerHTML =
      '<p class="form-msg form-msg--error">Nem sikerült betölteni a szalonokat. Ellenőrizd az API-t.</p>';
  }
}

async function renderServices() {
  const root = document.querySelector("[data-services-root]");
  if (!root) return;
  root.innerHTML = '<p class="small muted">Szolgáltatások betöltése...</p>';
  try {
    const data = await fetchJSON("services");
    const items = Array.isArray(data) ? data : data.items || [];
    if (!items.length) {
      root.innerHTML = '<p class="small muted">Jelenleg nincs megjeleníthető szolgáltatás.</p>';
      return;
    }
    root.innerHTML = "";
    items.forEach((s) => {
      const card = document.createElement("article");
      card.className = "card";
      const name = s.display_name || s.name || "Szolgáltatás";
      const cat = s.category_name || s.category || "";
      const desc = s.short_description || s.description || "";
      const dur = s.duration_minutes;
      const price = s.from_price_huf || s.price_huf || null;
      let meta = [];
      if (cat) meta.push(escapeHtml(cat));
      if (dur) meta.push("~" + dur + " perc");
      if (price != null) {
        try {
          const val = Number(price);
          if (!isNaN(val)) {
            meta.push(
              new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(val) + " Ft-tól"
            );
          }
        } catch (e) {
          meta.push(escapeHtml(price));
        }
      }
      card.innerHTML = `
        <h2 class="card-title">${escapeHtml(name)}</h2>
        <p class="card-text">${escapeHtml(desc)}</p>
        ${
          meta.length
            ? `<p class="card-text small muted">${meta.join(" · ")}</p>`
            : ""
        }
      `;
      root.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    root.innerHTML =
      '<p class="form-msg form-msg--error">Nem sikerült betölteni a szolgáltatásokat. Ellenőrizd az API-t.</p>';
  }
}

async function renderPrices() {
  const root = document.querySelector("[data-prices-root]");
  if (!root) return;
  root.innerHTML = '<p class="small muted">Árlista betöltése...</p>';
  try {
    const data = await fetchJSON("services");
    const items = Array.isArray(data) ? data : data.items || [];
    if (!items.length) {
      root.innerHTML = '<p class="small muted">Jelenleg nincs megjeleníthető ár.</p>';
      return;
    }
    const groups = new Map();
    items.forEach((s) => {
      const cat = (s.category_name || s.category || "Egyéb").trim() || "Egyéb";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push(s);
    });
    root.innerHTML = "";
    groups.forEach((arr, catName) => {
      const section = document.createElement("section");
      const h2 = document.createElement("h2");
      h2.textContent = catName;
      section.appendChild(h2);
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      thead.innerHTML = "<tr><th>Szolgáltatás</th><th>Leírás</th><th>Ár (tól)</th></tr>";
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      arr.forEach((s) => {
        const tr = document.createElement("tr");
        const name = s.display_name || s.name || "Szolgáltatás";
        const desc = s.short_description || s.description || "";
        const price = s.from_price_huf || s.price_huf || "";
        let priceText = "";
        if (price != null && price !== "") {
          try {
            const val = Number(price);
            if (!isNaN(val)) {
              priceText =
                new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(val) + " Ft-tól";
            } else {
              priceText = String(price);
            }
          } catch (e) {
            priceText = String(price);
          }
        }
        tr.innerHTML = `
          <td>${escapeHtml(name)}</td>
          <td>${escapeHtml(desc)}</td>
          <td>${escapeHtml(priceText)}</td>
        `;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      section.appendChild(table);
      root.appendChild(section);
    });
  } catch (err) {
    console.error(err);
    root.innerHTML =
      '<p class="form-msg form-msg--error">Nem sikerült betölteni az árlistát. Ellenőrizd az API-t.</p>';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const stack = document.querySelector(".hero-image-stack");
  if (stack) {
    const images = Array.from(stack.querySelectorAll("img"));
    if (images.length > 1) {
      let i = 0;
      setInterval(() => {
        images[i].classList.remove("is-active");
        i = (i + 1) % images.length;
        images[i].classList.add("is-active");
      }, 5000);
    }
  }

  const nav = document.getElementById("mainNav");
  const navToggle = document.getElementById("navToggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
      }
    });
  }
});
