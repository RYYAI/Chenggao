# 开发

英文版：[../develop.md](../develop.md)

```bash
npm install
npm run dev
```

`npm run build` 会把 `src/main.ts` 打成仓库根目录的 `main.js`。

界面文案在 `src/i18n.ts`。Obsidian 语言以 `zh` 开头时显示中文，否则显示英文。

本地可用 `npx eslint .` 跑和社区审核同一套规则。最低 Obsidian 版本是 1.8.7。
