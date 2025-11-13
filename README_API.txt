
Kleopátra marketing oldal – API-ból töltött szalonok, szolgáltatások, árlista
=============================================================================

1) Csomagold ki a ZIP-et a statikus marketing oldal gyökerébe.
   - index.html
   - salons.html
   - services.html
   - prices.html
   - stb.
   - css/styles.css
   - js/app.js

2) Állítsd be az API címet (Kleoszalon VIR / backend):
   - frontendből (pl. <script> window.KLEO_API_BASE = "https://vir.kleoszalon.hu/api/public"; </script>)
     VAGY
   - írd át az app.js tetején a
       const API_BASE = "https://your-api.example.com/public";

3) Elvárt (javasolt) API struktúrák:

   GET /locations
   ----------------
   Válasz: tömb, pl.:
   [
     {
       "id": "uuid",
       "name": "Kleopátra Szépségszalon – Visegrádi utca",
       "display_name": "Budapest, Visegrádi utca",
       "city": "Budapest",
       "address": "1132 Budapest, Visegrádi utca 3.",
       "services_summary": "Fodrászat · Kozmetika · Kéz- és lábápolás · Szolárium",
       "public_url": "https://kleoszalon.hu/Budapest-Visegradi-3"
     },
     ...
   ]

   GET /services
   ----------------
   Válasz: tömb, pl.:
   [
     {
       "id": "uuid",
       "name": "Női hajvágás, szárítás",
       "display_name": "Női hajvágás, szárítás",
       "category": "Fodrászat",
       "category_name": "Fodrászat",
       "short_description": "Tanácsadással, formára szárítva",
       "duration_minutes": 45,
       "from_price_huf": 5990
     },
     ...
   ]

   A services endpointot a services.html és a prices.html is használja,
   csak másképp jeleníti meg (kártyák vs. árlista táblázat).

4) Ha az API mezőnevei eltérnek, az app.js-ben módosítsd a mappinget
   (pl. category_name, from_price_huf, stb.).
