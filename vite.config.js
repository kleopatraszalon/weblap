"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
exports.default = (0, vite_1.defineConfig)(function (_a) {
    var mode = _a.mode;
    var env = (0, vite_1.loadEnv)(mode, process.cwd(), '');
    var port = Number(process.env.PORT || env.PORT || 3002);
    return {
        server: {
            host: true,
            port: port,
            strictPort: false,
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE || 'http://localhost:5000',
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        preview: {
            host: true,
            port: port,
            strictPort: false,
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
        },
    };
});
