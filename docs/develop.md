# Develop

```bash
npm install
npm run dev
```

`npm run build` bundles `src/main.ts` into `main.js` at the repository root and writes scoped `styles.css` from `src/styles.css` plus `src/plugin-chrome.css`.

Chinese notes: [zh/develop.md](zh/develop.md)

## Layout

| Path | Role |
| --- | --- |
| `manifest.json` | Plugin id, marketplace name, version |
| `src/main.ts` | Commands, ribbon, right split |
| `src/view.ts` | ItemView, mounts the workspace, live-syncs the note |
| `src/i18n.ts` | English / Chinese UI strings |
| `src/host.ts` | Vault I/O adapter |
| `src/note-bridge.ts` | Body, frontmatter, image refs |
| `src/vault-io.ts` | `图片/` and `.wechat.html` paths |
| `src/app.js` | Pagination, article preview, export |
| `src/workspace.html` | Preview chrome |
| `src/plugin-chrome.css` | Hide the old web editor; keep preview only |

UI copy lives in `src/i18n.ts`. If the Obsidian language starts with `zh`, the preview uses Chinese; otherwise it uses English.

`npx eslint .` runs the same community-scanner ruleset locally.

## Release

1. Set `version` in `manifest.json` and `versions.json` to `x.y.z`
2. Commit and push `main`
3. Tag the same version: `git tag 1.0.1 && git push origin 1.0.1`
4. GitHub Actions builds a Release with `main.js`, `manifest.json`, and `styles.css`

Submit the public repo `RYYAI/Chenggao` at [community.obsidian.md](https://community.obsidian.md).

## Local checks

1. Symlink the build into a test vault as `.obsidian/plugins/chenggao/`
2. Open a note that contains images
3. Open the preview and switch Cards / Article
4. Edit a few words and confirm the preview refreshes
5. Export one image and confirm it lands in the sibling `图片/` folder

A local vault can live in `test-vault/` (gitignored).
