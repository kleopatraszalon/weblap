// vite.config.cjs

module.exports = async () => {
  const { defineConfig } = await import("vite");
  const react = await import("@vitejs/plugin-react");

  return defineConfig({
    plugins: [react.default()],
    server: {
      port: 3000,
      proxy: {
        // minden /api hívást átirányít a backendre
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
  });
};
