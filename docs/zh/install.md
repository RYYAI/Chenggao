# 安装

本仓库是 Chenggao（成稿预览）的 Obsidian 插件源码。尚未上架社区市场时，用手动安装或符号链接。

英文版：[../install.md](../install.md)

## 系统要求

- Obsidian 桌面端 1.8.7 或更高
- Node.js 20 或更高（从源码构建时）

## 手动安装

1. 构建插件：

```bash
git clone https://github.com/RYYAI/Chenggao.git
cd Chenggao
npm install
npm run build
```

2. 在库里创建插件目录：

```
<你的库>/.obsidian/plugins/chenggao/
```

3. 复制这三个文件：

- `manifest.json`
- `main.js`
- `styles.css`

4. 打开 Obsidian → **设置 → 第三方插件**，关闭安全模式（如已开启），启用 **Chenggao**。
5. 设置里的版本应与 `manifest.json` 一致。

## 开发安装（符号链接）

```bash
PLUGIN="$HOME/Documents/Obsidian Vault/.obsidian/plugins/chenggao"
mkdir -p "$PLUGIN"
ln -sf "$(pwd)/main.js" "$PLUGIN/main.js"
ln -sf "$(pwd)/manifest.json" "$PLUGIN/manifest.json"
ln -sf "$(pwd)/styles.css" "$PLUGIN/styles.css"
```

改代码后重载插件：⌘Q 退出再开，或关掉再打开 Chenggao。
