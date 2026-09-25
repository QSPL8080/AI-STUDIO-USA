// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  nitro: {
    preset: "node-server",
    routeRules: {
      "/**": {
        headers: {
          "X-Robots-Tag": "index, follow",
        },
      },
    },
    externals: {
      inline: [],
      external: ["pg", "pg-pool", "pg-protocol", "pg-types", "pdfkit", "nodemailer"],
    },
    hooks: {
      "compiled"(nitro: any) {
        try {
          const pkgPath = path.resolve(nitro.options.output.serverDir, "package.json");
          if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
            pkg.imports = pkg.imports || {};
            pkg.imports["#standard-fonts/*"] = "pdfkit/standard-fonts/*";
            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
          }
        } catch (e) {
          console.warn("Nitro post-compile hook warning:", e);
        }
      },
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
