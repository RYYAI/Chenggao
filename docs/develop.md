# 开发

```bash
npm install
npm run dev
```

`npm run build` 会把 `src/main.ts` 打成仓库根目录的 `main.js`，并把 `src/styles.css`、`src/plugin-chrome.css` 写成带 `.wtp-root` 作用域的 `styles.css`。

## 主要文件

| 路径 | 作用 |
| --- | --- |
| `manifest.json` | 插件 id、市场名称、版本 |
| `src/main.ts` | 命令、功能区、右侧分栏 |
| `src/view.ts` | ItemView，挂载工作区并同步笔记 |
| `src/host.ts` | 库读写适配 |
| `src/note-bridge.ts` | 正文、frontmatter、图片引用 |
| `src/vault-io.ts` | `图片/` 与 `.wechat.html` 路径 |
| `src/app.js` | 分页、长文预览、导出 |
| `src/workspace.html` | 预览界面 |
| `src/plugin-chrome.css` | 插件里隐藏网页版编辑器，只留预览 |

## 发布

1. 把 `manifest.json` 和 `versions.json` 的 version 改成 `x.y.z`
2. 提交并推送 `main`
3. 打同名 tag：`git tag 1.0.1 && git push origin 1.0.1`
4. GitHub Actions 会构建并创建 Release，附件为 `main.js`、`manifest.json`、`styles.css`

上架后在 [community.obsidian.md](https://community.obsidian.md) 提交仓库 `RYYAI/Chenggao`。

## 本地验证

1. 按 [安装说明](install.md) 把构建结果链到测试库，目录名必须是 `chenggao`
2. 打开一篇带图片的笔记
3. 打开预览，确认图文卡片和长文都能切换
4. 改几个字，确认预览刷新
5. 导出一张图，确认写在笔记同级 `图片/`

测试库也可放在 `test-vault/`（该目录不提交）。
