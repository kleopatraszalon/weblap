Kleopátra Szépségszalonok – Public SPA frontend (Vite + React + TS)

1) npm install
2) .env-ben: VITE_API_URL=http://localhost:5000/api (vagy Render API URL)
3) npm run dev

A public/images mappába másold be:
- kleo_logo@2x.png
- images_1.webp, images_2.webp, images_3.webp, images_4.webp

A backend oldalon legyen bekötve:
- GET /api/public/salons
- GET /api/public/services
