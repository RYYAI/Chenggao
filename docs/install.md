# Install

This repository is the Chenggao Obsidian plugin. Until it is listed in the community directory, install it manually or with a symlink.

Chinese notes: [zh/install.md](zh/install.md)

## Requirements

- Obsidian desktop 1.6.0 or later
- Node.js 20 or later when building from source

## Manual install

1. Build the plugin:

```bash
git clone https://github.com/RYYAI/Chenggao.git
cd Chenggao
npm install
npm run build
```

2. Create this folder in your vault:

```
<vault>/.obsidian/plugins/chenggao/
```

The folder name must match the plugin `id` in `manifest.json`.

3. Copy these files into that folder:

- `manifest.json`
- `main.js`
- `styles.css`

4. In Obsidian open **Settings → Community plugins**, turn off Restricted mode if needed, and enable **Chenggao**.
5. The version shown in settings should match `manifest.json`.

## Development install (symlink)

```bash
PLUGIN="$HOME/Documents/Obsidian Vault/.obsidian/plugins/chenggao"
mkdir -p "$PLUGIN"
ln -sf "$(pwd)/main.js" "$PLUGIN/main.js"
ln -sf "$(pwd)/manifest.json" "$PLUGIN/manifest.json"
ln -sf "$(pwd)/styles.css" "$PLUGIN/styles.css"
```

Reload after a rebuild:

- Quit Obsidian fully (**⌘Q** on macOS) and open it again, or
- Disable and enable Chenggao, or
- Run **Reload app without saving**

## After enabling

Open a `.md` note and run **Chenggao: Open layout preview**. The note stays on the left; the preview opens on the right.
