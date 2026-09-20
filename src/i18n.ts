export type Locale = "en" | "zh";

type Vars = Record<string, string | number>;

const EN = {
  "plugin.name": "Chenggao",
  "command.openPreview": "Open layout preview",
  "command.copyWechat": "Copy WeChat article format",
  "command.exportImages": "Export images next to the note",
  "menu.openWith": "Open with Chenggao",
  "notice.openNoteFirst": "Open a Markdown note first.",
  "notice.cannotSplit": "Could not open the preview pane.",
  "empty.title": "Open a Markdown note first",
  "empty.body": "Keep editing in Obsidian on the left. Cards or the article preview will appear here.",
  "tab.title": "Chenggao",
  "tab.titleNote": "Chenggao · {name}",
  "error.noteMissing": "The current note no longer exists.",
  "error.imageRead": "Could not read the image.",
  "error.pluginExport": "Chenggao is not ready to export.",
  "error.copyBlocked": "The browser blocked clipboard access.",
  "error.copyFailed": "Copy failed. Allow clipboard access and try again.",
  "error.exportImages": "Could not export images.",
  "error.exportArticle": "Could not export the article image.",
  "error.renderCards": "Could not render cards. Check the note and try again.",
  "error.renderArticle": "Could not render the article. Check the note first.",
  "error.html2canvas": "The image exporter is not loaded. Reload Obsidian and try again.",
  "error.writeNote": "Could not write back to the note.",
  "error.emptyArticle": "The article is empty.",
  "preview.aria": "Preview",
  "preview.heading": "Preview and export",
  "preview.statusReady": "Auto pagination is on",
  "preview.statusNote": "Laying out {path}",
  "preview.statusCurrent": "Laying out the current note",
  "mode.aria": "Preview mode",
  "mode.cards": "Cards",
  "mode.article": "Article",
  "layout.title": "Card layout",
  "layout.keepHeading": "Keep headings off the last line",
  "layout.keepHeadingOn": "Keep headings off the last line: on",
  "layout.keepHeadingOff": "Keep headings off the last line: off",
  "layout.keepHeadingEnabled": "On: a heading will move to the next page with its body when it would sit alone at the bottom.",
  "layout.keepHeadingDisabled": "Off: headings paginate where they land.",
  "theme.title": "Theme",
  "theme.classic": "Classic",
  "theme.elegant": "Elegant",
  "theme.clean": "Clean",
  "theme.wechat": "WeChat green",
  "theme.colorful": "Colorful WeChat",
  "font.title": "Font",
  "font.sans": "Sans",
  "font.serif": "Serif",
  "font.mono": "Mono",
  "size.title": "Size",
  "size.small": "Smaller",
  "size.normal": "Default",
  "size.large": "Larger",
  "color.title": "Accent",
  "color.teal": "Jade",
  "color.blue": "Blue",
  "color.orange": "Coral",
  "color.purple": "Violet",
  "color.black": "Ink",
  "action.exportImages": "Export images",
  "action.exportArticle": "Export long image",
  "action.copyWechat": "Copy WeChat format",
  "status.copiedWechatSaved": "Copied WeChat rich text and saved {path}",
  "status.copiedWechat": "Copied WeChat rich text. Paste it into the WeChat editor.",
  "status.exportedImages": "Exported {n} image(s) to {folder}",
  "status.savedPath": "Saved {path}",
  "status.renderingCards": "Rendering cards…",
  "status.empty": "Nothing to preview yet",
  "status.generated": "Generated {n} page(s), {width}×{height} px",
  "status.cancelled": "Export cancelled",
  "progress.exportImages": "Exporting images",
  "progress.exportImagesDetail": "Writing into the Images folder next to the note…",
  "progress.exportPage": "Exporting {current}/{total}",
  "progress.exportPng": "Creating high-resolution PNG…",
  "progress.exportDone": "Images exported",
  "progress.exportFail": "Image export failed",
  "progress.article": "Creating the article image",
  "progress.articlePrepare": "Preparing the full article…",
  "progress.articleRender": "Rendering theme, text, and images…",
  "progress.articlePng": "Converting to a high-resolution PNG…",
  "progress.articleSave": "Saving the long image…",
  "progress.articleDone": "Article image exported",
  "progress.articleFail": "Article image export failed",
  "unnamed": "Untitled",
  "folder.images": "Images",
} as const;

const ZH: Record<keyof typeof EN, string> = {
  "plugin.name": "成稿预览",
  "command.openPreview": "打开排版预览",
  "command.copyWechat": "复制公众号格式",
  "command.exportImages": "导出图片到同级图片文件夹",
  "menu.openWith": "用成稿预览打开",
  "notice.openNoteFirst": "请先打开一篇 Markdown 笔记。",
  "notice.cannotSplit": "无法打开预览分栏。",
  "empty.title": "先打开一篇 Markdown 笔记",
  "empty.body": "左侧继续用 Obsidian 编辑，这里会显示图文卡片或长文预览。",
  "tab.title": "成稿预览",
  "tab.titleNote": "成稿预览 · {name}",
  "error.noteMissing": "当前笔记已不存在。",
  "error.imageRead": "图片读取失败。",
  "error.pluginExport": "插件还没准备好导出。",
  "error.copyBlocked": "浏览器没有允许复制。",
  "error.copyFailed": "复制失败，请允许浏览器访问剪贴板。",
  "error.exportImages": "导出图片失败",
  "error.exportArticle": "长图下载失败，请稍后重试",
  "error.renderCards": "图文卡片生成失败，请检查正文后再试",
  "error.renderArticle": "长文生成失败，请先检查内容",
  "error.html2canvas": "长图下载组件未加载，请刷新页面后重试",
  "error.writeNote": "写回当前笔记失败",
  "error.emptyArticle": "长文内容为空，请先输入正文。",
  "preview.aria": "图片预览",
  "preview.heading": "预览与下载",
  "preview.statusReady": "自动分页已开启",
  "preview.statusNote": "正在排版 {path}",
  "preview.statusCurrent": "正在排版当前笔记",
  "mode.aria": "切换工作区",
  "mode.cards": "图文卡片",
  "mode.article": "长文",
  "layout.title": "图文排版",
  "layout.keepHeading": "标题不落在页底",
  "layout.keepHeadingOn": "标题不落在页底：已开启",
  "layout.keepHeadingOff": "标题不落在页底：已关闭",
  "layout.keepHeadingEnabled": "已开启：标题尽量不单独出现在页底",
  "layout.keepHeadingDisabled": "已关闭：标题按原位置分页",
  "theme.title": "主题",
  "theme.classic": "经典",
  "theme.elegant": "优雅",
  "theme.clean": "简洁",
  "theme.wechat": "微信绿",
  "theme.colorful": "多彩微信",
  "font.title": "字体",
  "font.sans": "无衬线",
  "font.serif": "衬线",
  "font.mono": "等宽",
  "size.title": "字号",
  "size.small": "更小",
  "size.normal": "推荐",
  "size.large": "稍大",
  "color.title": "主题色",
  "color.teal": "翡翠绿",
  "color.blue": "经典蓝",
  "color.orange": "活力橘",
  "color.purple": "薰衣紫",
  "color.black": "石墨黑",
  "action.exportImages": "导出图片",
  "action.exportArticle": "导出长图",
  "action.copyWechat": "复制公众号格式",
  "status.copiedWechatSaved": "已复制公众号富文本，并保存 {path}",
  "status.copiedWechat": "已复制公众号富文本，可直接粘贴到公众号编辑器",
  "status.exportedImages": "已导出 {n} 张图片到 {folder}",
  "status.savedPath": "已保存 {path}",
  "status.renderingCards": "正在生成图文卡片…",
  "status.empty": "暂无内容",
  "status.generated": "已生成 {n} 张，高清尺寸 {width}x{height}",
  "status.cancelled": "已取消下载",
  "progress.exportImages": "正在导出图片",
  "progress.exportImagesDetail": "正在写入笔记同级的图片文件夹…",
  "progress.exportPage": "正在导出 {current}/{total}",
  "progress.exportPng": "正在生成高清 PNG…",
  "progress.exportDone": "图片导出完成",
  "progress.exportFail": "图片导出失败",
  "progress.article": "正在生成长文图片",
  "progress.articlePrepare": "正在准备完整文章画面…",
  "progress.articleRender": "正在合成长文主题、文字和图片…",
  "progress.articlePng": "长文画面已渲染，正在转换为高清图片…",
  "progress.articleSave": "图片已经生成，正在写入下载位置…",
  "progress.articleDone": "长图下载完成",
  "progress.articleFail": "长图下载失败",
  "unnamed": "未命名",
  "folder.images": "图片",
};

export type MessageKey = keyof typeof EN;

function detectLocale(): Locale {
  const runtime = window.obsidianApiGetLanguage?.() || "";
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("language") || "" : "";
  const language = runtime || stored;
  return /^zh/i.test(language) ? "zh" : "en";
}

const TABLES: Record<Locale, Record<MessageKey, string>> = { en: EN, zh: ZH };

let locale: Locale = "en";

export function currentLocale(): Locale {
  return locale;
}

export function t(key: MessageKey, vars?: Vars): string {
  let value = TABLES[locale][key] || EN[key];
  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
  }
  return value;
}

export function applyI18n(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n as MessageKey | undefined;
    if (key) el.textContent = t(key);
  });
  root.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((el) => {
    const key = el.dataset.i18nTitle as MessageKey | undefined;
    if (key) el.setAttribute("title", t(key));
  });
  root.querySelectorAll<HTMLElement>("[data-i18n-aria]").forEach((el) => {
    const key = el.dataset.i18nAria as MessageKey | undefined;
    if (key) el.setAttribute("aria-label", t(key));
  });
}

export function installI18n(getLanguage?: () => string): void {
  window.obsidianApiGetLanguage = getLanguage;
  locale = detectLocale();
  window.__chenggaoT = (key: string, vars?: Vars) => t(key as MessageKey, vars);
  window.__chenggaoLocale = locale;
}

declare global {
  interface Window {
    __chenggaoT?: (key: string, vars?: Vars) => string;
    __chenggaoLocale?: Locale;
    obsidianApiGetLanguage?: () => string;
  }
}
