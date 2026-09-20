import assert from "node:assert/strict";

function noteDir(path) {
  const index = path.lastIndexOf("/");
  return index === -1 ? "" : path.slice(0, index);
}

function noteBasename(path) {
  const name = path.split("/").pop() || "未命名";
  return name.replace(/\.md$/i, "");
}

function imageFolderPath(notePath) {
  const directory = noteDir(notePath);
  return directory ? `${directory}/图片` : "图片";
}

function imageFilePath(notePath, filename) {
  return `${imageFolderPath(notePath)}/${filename}`;
}

function wechatHtmlPath(notePath) {
  const directory = noteDir(notePath);
  const base = noteBasename(notePath);
  return directory ? `${directory}/${base}.wechat.html` : `${base}.wechat.html`;
}

function exportImageName(notePath, filename) {
  const base = noteBasename(notePath);
  const article = /article|长文/i.test(filename);
  const pageMatch = String(filename).match(/(\d+)(?=\.png$)/i);
  if (article) return `${base}-长文.png`;
  if (pageMatch) return `${base}-${pageMatch[1]}.png`;
  if (/\.png$/i.test(filename)) return `${base}-${filename}`;
  return `${base}-${filename}`;
}

function splitFrontmatter(text) {
  const match = String(text || "").match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  if (!match) return { frontmatter: "", body: String(text || "") };
  return { frontmatter: match[0], body: String(text || "").slice(match[0].length) };
}

function extractImageRefs(markdown) {
  const references = new Set();
  const text = String(markdown || "");
  for (const match of text.matchAll(/!\[\[([^\]\n]+)\]\]/g)) {
    references.add(match[1].split("|")[0].trim());
  }
  for (const match of text.matchAll(/!\[[^\]\n]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g)) {
    references.add((match[1] || match[2] || "").trim());
  }
  return Array.from(references).filter(Boolean);
}

assert.equal(noteDir("专栏/一篇文章.md"), "专栏");
assert.equal(noteDir("一篇文章.md"), "");
assert.equal(noteBasename("专栏/一篇文章.md"), "一篇文章");
assert.equal(imageFolderPath("专栏/一篇文章.md"), "专栏/图片");
assert.equal(imageFolderPath("一篇文章.md"), "图片");
assert.equal(imageFilePath("专栏/一篇文章.md", "一篇文章-01.png"), "专栏/图片/一篇文章-01.png");
assert.equal(wechatHtmlPath("专栏/一篇文章.md"), "专栏/一篇文章.wechat.html");
assert.equal(exportImageName("专栏/一篇文章.md", "layout-page-01.png"), "一篇文章-01.png");
assert.equal(exportImageName("专栏/一篇文章.md", "chenggao-article.png"), "一篇文章-长文.png");

const split = splitFrontmatter("---\ntitle: 测试\n---\n正文\n![[封面.png]]\n");
assert.equal(split.frontmatter, "---\ntitle: 测试\n---\n");
assert.equal(split.body, "正文\n![[封面.png]]\n");
assert.deepEqual(extractImageRefs("见 ![[附件/图.png|300]] 和 ![x](images/a.jpg)"), ["附件/图.png", "images/a.jpg"]);

function parseWechatPx(value, fontSizePx = 17) {
  const raw = String(value || "").trim();
  if (!raw || raw === "normal") return 0;
  const number = Number.parseFloat(raw);
  if (!Number.isFinite(number) || number <= 0) return 0;
  if (/em$/i.test(raw)) return number * fontSizePx;
  if (/%$/.test(raw)) return (number / 100) * fontSizePx;
  if (/px$/i.test(raw)) return number;
  if (!/[a-z]/i.test(raw) && number <= 4) return number * fontSizePx;
  return number;
}

function wechatLineHeightPx(fontSizePx, computedLineHeight) {
  const font = fontSizePx > 0 ? fontSizePx : 17;
  const minimum = Math.ceil(font * 1.8);
  const parsed = parseWechatPx(computedLineHeight, font);
  return Math.max(Math.round(parsed), minimum);
}

assert.ok(Math.abs(parseWechatPx("1.35", 17) - 22.95) < 0.01);
assert.ok(Math.abs(parseWechatPx("1.35em", 17) - 22.95) < 0.01);
assert.equal(wechatLineHeightPx(17, "1.35"), 31);
assert.equal(wechatLineHeightPx(17, "20px"), 31);
assert.equal(wechatLineHeightPx(24, "40px"), 44);
assert.ok(wechatLineHeightPx(17, "1.35") > 17);

console.log("plugin path helpers ok");
console.log("wechat line-height helpers ok");
