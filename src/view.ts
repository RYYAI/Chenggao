import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import workspaceHtml from "./workspace.html";
import { createPluginHost, type WriteThenPublishHost } from "./host";
import { applyI18n, t } from "./i18n";
import { splitFrontmatter } from "./note-bridge";
import "./app-shims";
import "./live-photo-browser.js";
import "./app.js";

export const VIEW_TYPE_CHENGGAO = "chenggao";

export class ChenggaoView extends ItemView {
  static pendingFile: TFile | null = null;

  private host: WriteThenPublishHost | null = null;
  private boundFile: TFile | null = null;
  private frontmatter = "";
  private mounted = false;
  private previewTimer = 0;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE_CHENGGAO;
  }

  getDisplayText(): string {
    return this.boundFile ? t("tab.titleNote", { name: this.boundFile.basename }) : t("tab.title");
  }

  getIcon(): string {
    return "chenggao";
  }

  boundPath(): string | null {
    return this.boundFile?.path ?? null;
  }

  async setFile(file: TFile, liveMarkdown?: string): Promise<void> {
    this.boundFile = file;
    const raw = liveMarkdown == null ? await this.app.vault.read(file) : liveMarkdown;
    this.frontmatter = splitFrontmatter(raw).frontmatter;
    if (this.host) {
      this.host.notePath = file.path;
      this.host.frontmatter = this.frontmatter;
      this.host.liveMarkdown = liveMarkdown ?? null;
    }
  }

  async onOpen(): Promise<void> {
    if (!this.boundFile && ChenggaoView.pendingFile) {
      await this.setFile(ChenggaoView.pendingFile);
      ChenggaoView.pendingFile = null;
    }
    await this.mount();
  }

  async loadWorkspace(file: TFile, liveMarkdown?: string): Promise<void> {
    window.clearTimeout(this.previewTimer);
    await this.setFile(file, liveMarkdown);
    if (this.mounted && typeof window.reloadWriteThenPublishNote === "function") {
      await window.reloadWriteThenPublishNote();
      return;
    }
    await this.mount();
  }

  schedulePreview(file: TFile, liveMarkdown: string): void {
    window.clearTimeout(this.previewTimer);
    this.previewTimer = window.setTimeout(() => {
      void this.loadWorkspace(file, liveMarkdown);
    }, 280);
  }

  private async mount(): Promise<void> {
    this.contentEl.empty();
    this.contentEl.addClass("wtp-plugin-view");
    this.contentEl.style.padding = "0";
    this.contentEl.style.overflow = "hidden";
    this.mounted = false;

    if (!this.boundFile) {
      this.contentEl.createDiv({ cls: "wtp-empty-state" }, (el) => {
        el.createEl("strong", { text: t("empty.title") });
        el.createEl("p", { text: t("empty.body") });
      });
      return;
    }

    const root = this.contentEl.createDiv({ cls: "wtp-root local-deployment wtp-obsidian-plugin" });
    root.setAttribute("data-write-then-publish-local-mode", "true");
    root.setAttribute("data-ui-theme", "light");
    root.innerHTML = workspaceHtml;
    applyI18n(root);

    this.host = createPluginHost(this.app, this.boundFile, root, this.frontmatter);
    this.host.liveMarkdown = null;
    window.WRITE_THEN_PUBLISH_HOST = this.host;
    window.WRITE_THEN_PUBLISH_DEFER_BOOT = true;
    document.documentElement.dataset.writeThenPublishLocalMode = "true";

    if (typeof window.bootWriteThenPublish === "function") {
      await window.bootWriteThenPublish();
    }
    this.mounted = true;
  }

  async onClose(): Promise<void> {
    window.clearTimeout(this.previewTimer);
    if (window.WRITE_THEN_PUBLISH_HOST === this.host) {
      delete window.WRITE_THEN_PUBLISH_HOST;
    }
    this.host = null;
    this.mounted = false;
    this.contentEl.empty();
  }

  async copyWechat(): Promise<void> {
    this.rootButton("#copyWechatBtn")?.click();
  }

  async exportImages(): Promise<void> {
    const article = this.rootButton("#downloadArticleBtn");
    const cards = this.rootButton("#downloadZipBtn");
    if (article && !article.hidden) article.click();
    else cards?.click();
  }

  private rootButton(selector: string): HTMLButtonElement | null {
    return this.host?.root.querySelector(selector) || null;
  }
}
