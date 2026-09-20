# Usage

The preview sits beside the current Markdown note. Edit the note in Obsidian. Chenggao does not add a second editor.

Chinese notes: [zh/usage.md](zh/usage.md)

The interface follows the Obsidian language: Chinese UI when the app language starts with `zh`, otherwise English.

## Open the preview

Use any of these:

- The stacked-page icon in the left ribbon
- **⌘P** / **Ctrl+P** → `Chenggao: Open layout preview`
- Right-click a note title → **Open with Chenggao**

When you switch notes, an already open preview follows the new note.

## Cards

Use the top bar to switch to **Cards**. Pages follow iPhone Notes screenshot size and export at 1206×2622.

- **Export images** writes `图片/<note>-01.png`, `-02.png`, …
- **Card layout → Keep headings off the last line** is on by default. If a heading would sit alone at the bottom of a page, it moves to the next page with the following body.

The sibling folder name is `图片` (Images). Existing Chinese vaults keep that path.

## Article

Switch to **Article** for a WeChat-style preview.

- **Theme / Font / Size / Accent**: icon menus in the preview top bar
- **Copy WeChat format**: copies styled HTML for the official WeChat editor
- **Export long image**: writes `图片/<note>-长文.png`
- Copying also saves `<note>.wechat.html` next to the note

## Images

Both `![[image.png]]` wiki links and standard Markdown images are resolved through the vault. The file must exist in the vault.

## Commands

| Command | What it does |
| --- | --- |
| Chenggao: Open layout preview | Open or focus the preview beside the note |
| Chenggao: Copy WeChat article format | Copy the current article as WeChat-ready rich text |
| Chenggao: Export images next to the note | Export PNG pages or a long image |

This plugin is desktop-only.
