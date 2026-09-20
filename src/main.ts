import { MarkdownView, Notice, Plugin, TFile } from "obsidian";
import { CHENGGAO_ICON_ID, CHENGGAO_ICON_SVG } from "./icon";
import { installI18n, t } from "./i18n";
import { ChenggaoView, VIEW_TYPE_CHENGGAO } from "./view";

export default class ChenggaoPlugin extends Plugin {
  async onload(): Promise<void> {
    installI18n(() => {
      try {
        return window.localStorage.getItem("language") || "";
      } catch {
        return "";
      }
    });
    this.addIcon(CHENGGAO_ICON_ID, CHENGGAO_ICON_SVG);
    this.registerView(VIEW_TYPE_CHENGGAO, (leaf) => new ChenggaoView(leaf));

    this.addRibbonIcon(CHENGGAO_ICON_ID, t("plugin.name"), () => {
      void this.openPreview();
    });

    this.addCommand({
      id: "open-workspace",
      name: t("command.openPreview"),
      callback: () => void this.openPreview(),
    });

    this.addCommand({
      id: "copy-wechat-html",
      name: t("command.copyWechat"),
      callback: () => void this.runOnOpenView((view) => view.copyWechat()),
    });

    this.addCommand({
      id: "export-images",
      name: t("command.exportImages"),
      callback: () => void this.runOnOpenView((view) => view.exportImages()),
    });

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (!(file instanceof TFile) || file.extension !== "md") return;
        menu.addItem((item) => {
          item
            .setTitle(t("menu.openWith"))
            .setIcon(CHENGGAO_ICON_ID)
            .onClick(() => void this.openPreview(file));
        });
      }),
    );

    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        const view = this.previewView();
        if (!view || !(file instanceof TFile) || file.extension !== "md") return;
        void view.loadWorkspace(file, this.liveMarkdownFor(file));
      }),
    );

    this.registerEvent(
      this.app.workspace.on("editor-change", (editor, info) => {
        const view = this.previewView();
        const file = info.file;
        if (!view || !(file instanceof TFile) || file.extension !== "md") return;
        view.schedulePreview(file, editor.getValue());
      }),
    );
  }

  async onunload(): Promise<void> {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_CHENGGAO);
  }

  private previewView(): ChenggaoView | null {
    const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_CHENGGAO)[0];
    return leaf?.view instanceof ChenggaoView ? leaf.view : null;
  }

  private markdownFile(file?: TFile): TFile | null {
    const target = file || this.app.workspace.getActiveFile();
    if (target instanceof TFile && target.extension === "md") return target;
    return null;
  }

  private markdownLeafFor(file: TFile) {
    return (
      this.app.workspace.getLeavesOfType("markdown").find((leaf) => {
        const view = leaf.view;
        return view instanceof MarkdownView && view.file?.path === file.path;
      }) || this.app.workspace.getMostRecentLeaf()
    );
  }

  private liveMarkdownFor(file: TFile): string | undefined {
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (view instanceof MarkdownView && view.file?.path === file.path) {
        return view.editor.getValue();
      }
    }
    return undefined;
  }

  private async openPreview(file?: TFile): Promise<void> {
    const note = this.markdownFile(file);
    if (!note) {
      new Notice(t("notice.openNoteFirst"));
      return;
    }

    const markdownLeaf = this.markdownLeafFor(note);
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_CHENGGAO)[0];
    if (!leaf) {
      leaf = markdownLeaf
        ? this.app.workspace.createLeafBySplit(markdownLeaf, "vertical")
        : this.app.workspace.getRightLeaf(false);
    }
    if (!leaf) {
      new Notice(t("notice.cannotSplit"));
      return;
    }

    ChenggaoView.pendingFile = note;
    await leaf.setViewState({ type: VIEW_TYPE_CHENGGAO, active: true });
    const view = leaf.view;
    if (view instanceof ChenggaoView) {
      await view.loadWorkspace(note, this.liveMarkdownFor(note));
    }
    if (markdownLeaf) this.app.workspace.setActiveLeaf(markdownLeaf, { focus: true });
  }

  private async runOnOpenView(action: (view: ChenggaoView) => Promise<void> | void): Promise<void> {
    const view = this.previewView();
    if (view) {
      await action(view);
      return;
    }
    await this.openPreview();
    const opened = this.previewView();
    if (opened) await action(opened);
  }
}
