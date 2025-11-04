// src/webserver.ts
import express from "express";
import path from "path";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

// --- ESM/TS kompatibilis __dirname ---
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Beállítások
const WEB_PORT = Number(process.env.WEB_PORT || 3002);
const API_TARGET = process.env.API_TARGET || "http://localhost:5000"; // ide megy a /api proxy

const app = express();

// Ha mégis közvetlenül az API-hoz mennél CORS-szal:
app.use(cors({
  origin: [/^http:\/\/localhost:(3000|3002|5173)$/],
  credentials: true
}));

// --- API proxy: a 3002-es szerver /api útvonalát átküldjük az 5000-es API-nak ---
app.use("/api", createProxyMiddleware({
  target: API_TARGET,
  changeOrigin: true,
  xfwd: true,
}));

// --- Statikus weboldal szolgáltatás ---
// Ide tegyük a front-end build kimenetet (pl. React/Vite build) -> public/
const staticDir = path.join(__dirname, "../public");
app.use(express.static(staticDir));

// Health-check
app.get("/healthz", (_req, res) => res.json({ ok: true, webPort: WEB_PORT }));

// SPA fallback: minden nem-API útvonal az index.html-t kapja
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(WEB_PORT, () => {
  console.log(`🌐 Web szerver fut:  http://localhost:${WEB_PORT}`);
  console.log(`↗️  /api -> proxizva ide: ${API_TARGET}`);
});
