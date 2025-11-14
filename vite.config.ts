import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import nodeCrypto from "crypto";

// Polyfill `globalThis.crypto.getRandomValues` during Vite config/build
// so dependencies that expect the Web Crypto API don't crash when
// bundling in a Node environment.
if (!(globalThis as any).crypto) {
  if ((nodeCrypto as any).webcrypto) {
    (globalThis as any).crypto = (nodeCrypto as any).webcrypto;
  } else if ((nodeCrypto as any).randomFillSync) {
    (globalThis as any).crypto = {
      getRandomValues: (buf: Uint8Array) => nodeCrypto.randomFillSync(buf),
    } as unknown as Crypto;
  }
}

export default defineConfig({
  // When deploying to GitHub Pages using `https://<user>.github.io/<repo>/`
  // set `VITE_BASE` in the environment or default to the repository name path.
  base: process.env.VITE_BASE ?? "/pokedex/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    // Output to the repository `docs/` folder so GitHub Pages can serve
    // the site from the `main` branch -> `docs` folder option.
    outDir: path.resolve(import.meta.dirname, "docs"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
