"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./api");
// Rövid DOM-segédfüggvények
var $ = function (sel, parent) {
    if (parent === void 0) { parent = document; }
    return parent.querySelector(sel);
};
var $$ = function (sel, parent) {
    if (parent === void 0) { parent = document; }
    return Array.from(parent.querySelectorAll(sel));
};
// Mintadatok (ha nincs backend)
var sample = {
    services: [
        { id: 'svc1', name: 'Női hajvágás', description: 'Szárítással, tanácsadással.', price: 6900 },
        { id: 'svc2', name: 'Férfi hajvágás', description: 'Klasszikus vagy modern fazon.', price: 4900 },
        { id: 'svc3', name: 'Gél lakkozás', description: 'Tartós, fényes körmök.', price: 5500 },
        { id: 'svc4', name: 'Arckezelés', description: 'Bőrdiagnosztikával.', price: 12900 },
        { id: 'svc5', name: 'Szempilla lifting', description: 'Hosszan tartó ív.', price: 11900 },
        { id: 'svc6', name: 'Szemöldök styling', description: 'Formázás, festés.', price: 5900 },
    ],
    salons: [
        { id: 'sal1', name: 'Kleopátra – Astoria', address: 'Budapest, Károly krt. 1.', phone: '+36 1 234 5678' },
        { id: 'sal2', name: 'Kleopátra – Nyugati', address: 'Budapest, Teréz krt. 55.', phone: '+36 1 876 5432' },
        { id: 'sal3', name: 'Kleopátra – Gyöngyös', address: 'Gyöngyös, Fő tér 3.', phone: '+36 37 555 555' },
        { id: 'sal4', name: 'Kleopátra – Debrecen', address: 'Debrecen, Piac u. 2.', phone: '+36 52 123 456' },
    ],
};
function isServicesArray(v) {
    return Array.isArray(v);
}
function isServicesObj(v) {
    return typeof v === 'object' && v !== null && 'services' in v;
}
function isSalonsArray(v) {
    return Array.isArray(v);
}
function isSalonsObj(v) {
    return typeof v === 'object' && v !== null && 'salons' in v;
}
// Szolgáltatások megjelenítése
function renderServices(list) {
    var grid = $('#servicesGrid');
    if (!grid)
        return;
    grid.innerHTML = '';
    list.forEach(function (svc) {
        var _a;
        var el = document.createElement('article');
        el.className = 'card';
        el.innerHTML = "\n      <h3>".concat(svc.name, "</h3>\n      <p class=\"desc\">").concat((_a = svc.description) !== null && _a !== void 0 ? _a : '', "</p>\n      <div class=\"price\">").concat(Intl.NumberFormat('hu-HU').format(svc.price), " Ft</div>\n      <button class=\"btn btn-primary\" data-sid=\"").concat(svc.id, "\">Foglalok</button>\n    ");
        grid.appendChild(el);
    });
    $$('.card button').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var _a;
            var sid = (_a = btn.getAttribute('data-sid')) !== null && _a !== void 0 ? _a : '';
            var select = $('#serviceSelect');
            if (select && sid) {
                select.value = sid;
                var booking = $('#booking');
                if (booking)
                    window.scrollTo({ top: booking.offsetTop - 60, behavior: 'smooth' });
            }
        });
    });
}
// Szalonok megjelenítése
function renderSalons(list) {
    var box = $('#salonList');
    if (!box)
        return;
    box.innerHTML = '';
    list.forEach(function (s) {
        var _a;
        var el = document.createElement('div');
        el.className = 'salon-item';
        el.innerHTML = "\n      <h4>".concat(s.name, "</h4>\n      <div class=\"meta\">").concat((_a = s.address) !== null && _a !== void 0 ? _a : '', "</div>\n      <div class=\"meta\">").concat(s.phone ? 'Tel: ' + s.phone : '', "</div>\n    ");
        box.appendChild(el);
    });
    var salSel = $('#salonSelect');
    if (salSel) {
        salSel.innerHTML =
            '<option value="">– Válassz –</option>' +
                list.map(function (s) { return "<option value=\"".concat(s.id, "\">").concat(s.name, "</option>"); }).join('');
    }
}
// Szolgáltatások betöltése (API → fallback sample-re)
function loadServices() {
    return __awaiter(this, void 0, void 0, function () {
        var select, data, arr, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    select = $('#serviceSelect');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, api_1.fetchJSON)('/api/services?limit=6')];
                case 2:
                    data = _b.sent();
                    arr = isServicesArray(data)
                        ? data
                        : isServicesObj(data)
                            ? data.services
                            : [];
                    renderServices(arr);
                    if (select) {
                        select.innerHTML =
                            '<option value="">– Válassz –</option>' +
                                arr.map(function (s) { return "<option value=\"".concat(s.id, "\">").concat(s.name, "</option>"); }).join('');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    renderServices(sample.services);
                    if (select) {
                        select.innerHTML =
                            '<option value="">– Válassz –</option>' +
                                sample.services.map(function (s) { return "<option value=\"".concat(s.id, "\">").concat(s.name, "</option>"); }).join('');
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Szalonok betöltése (API → fallback sample-re)
function loadSalons() {
    return __awaiter(this, void 0, void 0, function () {
        var data, arr, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, api_1.fetchJSON)('/api/salons')];
                case 1:
                    data = _b.sent();
                    arr = isSalonsArray(data)
                        ? data
                        : isSalonsObj(data)
                            ? data.salons
                            : [];
                    renderSalons(arr);
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    renderSalons(sample.salons);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Fejléc hamburger menü
function initHeader() {
    var btn = $('#navToggle');
    var nav = $('#mainNav');
    if (!btn || !nav)
        return;
    btn.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        var spans = btn.querySelectorAll('span');
        if (open) {
            spans[0].style.transform = 'translateY(7px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        }
        else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
}
// Cookie értesítő
function initCookiebar() {
    var bar = $('#cookiebar');
    var btn = $('#cookieAccept');
    if (!bar || !btn)
        return;
    var ok = localStorage.getItem('kleo_cookie_ok');
    if (ok) {
        bar.style.display = 'none';
        return;
    }
    btn.addEventListener('click', function () {
        localStorage.setItem('kleo_cookie_ok', '1');
        bar.remove();
    });
}
// Aktuális év beállítása
function setYear() {
    var y = new Date().getFullYear();
    var el = $('#year');
    if (el)
        el.textContent = String(y);
}
// Foglalási űrlap kezelése
function handleBooking() {
    var _this = this;
    var form = $('#bookingForm');
    var msg = $('#bookingMsg');
    if (!form || !msg)
        return;
    form.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
        var fd, payload, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    msg.textContent = 'Foglalás küldése...';
                    fd = new FormData(form);
                    payload = Object.fromEntries(fd.entries());
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, api_1.fetchJSON)('/api/appointments', { method: 'POST', body: JSON.stringify(payload) })];
                case 2:
                    _b.sent();
                    msg.textContent = 'Köszönjük! Hamarosan visszaigazoljuk.';
                    form.reset();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    msg.textContent = 'Hiba történt. Próbáld újra később.';
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
// Alkalmazás inicializálása
document.addEventListener('DOMContentLoaded', function () {
    setYear();
    initHeader();
    initCookiebar();
    loadServices();
    loadSalons();
    handleBooking();
});
function rotateHero() {
    var srcs = [
        '/images/images_1.webp',
        '/images/images_2.webp',
        '/images/images_3.webp',
        '/images/images_4.webp'
    ];
    var i = 0;
    var el = document.getElementById('heroImage');
    if (!el)
        return;
    setInterval(function () {
        i = (i + 1) % srcs.length;
        el.src = srcs[i];
    }, 4500);
}
document.addEventListener('DOMContentLoaded', function () {
    // ... a meglévő init-ek mellé:
    rotateHero();
});
function rotateHeroStable() {
    var imgs = Array.from(document.querySelectorAll('.hero-frame .hero-img'));
    if (!imgs.length)
        return;
    var i = 0;
    setInterval(function () {
        imgs[i].classList.remove('is-active');
        i = (i + 1) % imgs.length;
        imgs[i].classList.add('is-active');
    }, 4500);
}
document.addEventListener('DOMContentLoaded', function () {
    // ... a meglévő inicializálások mellé:
    rotateHeroStable();
});
