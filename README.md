# Kleopátra — statikus weblap (TypeScript)

- Forrás TS: `src/*.ts` → kimenet JS: `dist/*.js`
- Oldal: `index.html` tölti a `./js/config.js` fájlt (API_BASE), majd a `./dist/main.js`-t.

## Parancsok
```bash
cd weblap
npm install
npm run build      # tsc -> dist
npm run watch      # folyamatos fordítás
npm run serve      # egyszerű statikus szerver (http-server, 5173)
```
Ezután nyisd meg: http://localhost:5173/index.html

## API végpontok (állítható az src-ben)
- GET `/api/services?limit=6`
- GET `/api/salons`
- POST `/api/appointments`
