import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import prefixSelector from "postcss-prefix-selector";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const watch = process.argv.includes("--watch");

async function writeScopedStyles() {
  const source = fs.readFileSync(path.join(__dirname, "src/styles.css"), "utf8");
  const chrome = fs.readFileSync(path.join(__dirname, "src/plugin-chrome.css"), "utf8");
  const result = await postcss([
    prefixSelector({
      prefix: ".wtp-root",
      transform(prefix, selector, prefixed) {
        if (selector.startsWith(":root")) return selector.replace(":root", prefix);
        if (selector === "html" || selector.startsWith("html ") || selector.startsWith("html[") || selector.startsWith("html.")) {
          return selector.replace(/^html/, prefix);
        }
        if (selector === "body" || selector.startsWith("body.") || selector.startsWith("body[") || selector.startsWith("body ")) {
          return selector.replace(/^body/, prefix);
        }
        return prefixed;
      },
    }),
  ]).process(source, { from: undefined });
  fs.writeFileSync(path.join(__dirname, "styles.css"), `${chrome}\n${result.css}`);
}

async function prepareAssets() {
  await writeScopedStyles();
}

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "cjs",
  target: "es2018",
  outfile: "main.js",
  banner: {
    js: `window.WRITE_THEN_PUBLISH_DEFER_BOOT = true;
if (typeof globalThis.setImmediate !== "function") {
  globalThis.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
  globalThis.clearImmediate = (id) => clearTimeout(id);
}`,
  },
  footer: {
    js: "module.exports = ChenggaoPlugin;",
  },
  external: ["obsidian", "electron"],
  loader: {
    ".html": "text",
    ".js": "js",
  },
  sourcemap: false,
  logLevel: "info",
});

await prepareAssets();

if (watch) {
  await context.watch();
} else {
  await context.rebuild();
  await context.dispose();
}
