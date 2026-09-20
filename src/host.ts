import { App, Notice, TFile } from "obsidian";
import { loadNote, resolveImages, writeNote, type PluginAttachment, type PluginNote } from "./note-bridge";
import {
  blobToArrayBuffer,
  exportImageName,
  imageFilePath,
  noteBasename,
  wechatHtmlPath,
  writeBinary,
  writeText,
} from "./vault-io";

export interface WriteThenPublishHost {
  isPlugin: true;
  root: HTMLElement;
  preferredMode: "article" | "cards";
  previewOnly: boolean;
  liveMarkdown: string | null;
  notePath: string;
  frontmatter: string;
  imageFolderName: string;
  noteBasename(): string;
  loadNote(): Promise<PluginNote>;
  writeNote(data: { markdown: string; attachments?: PluginAttachment[] }): Promise<void>;
  resolveImages(references: string[]): Promise<PluginNote["images"]>;
  saveImage(blob: Blob, filename: string): Promise<string>;
  saveWechatHtml(html: string): Promise<string>;
  saveExport(blob: Blob, filename: string): Promise<string>;
  notify(message: string): void;
}

export function createPluginHost(app: App, file: TFile, root: HTMLElement, frontmatter: string): WriteThenPublishHost {
  const host: WriteThenPublishHost = {
    isPlugin: true,
    root,
    preferredMode: "cards",
    previewOnly: true,
    liveMarkdown: null,
    notePath: file.path,
    frontmatter,
    imageFolderName: "图片",
    noteBasename() {
      return noteBasename(host.notePath);
    },
    async loadNote() {
      const current = app.vault.getAbstractFileByPath(host.notePath);
      if (!(current instanceof TFile)) throw new Error("当前笔记已不存在。");
      return loadNote(app, current, host.liveMarkdown ?? undefined);
    },
    async writeNote(data) {
      const current = app.vault.getAbstractFileByPath(host.notePath);
      if (!(current instanceof TFile)) throw new Error("当前笔记已不存在。");
      await writeNote(app, current, host.frontmatter, data.markdown, data.attachments || []);
    },
    async resolveImages(references) {
      return resolveImages(app, references, host.notePath);
    },
    async saveImage(blob, filename) {
      const name = exportImageName(host.notePath, filename);
      const path = imageFilePath(host.notePath, name);
      await writeBinary(app, path, await blobToArrayBuffer(blob));
      return path;
    },
    async saveWechatHtml(html) {
      const path = wechatHtmlPath(host.notePath);
      await writeText(app, path, html);
      return path;
    },
    async saveExport(blob, filename) {
      if (/\.html?$/i.test(filename) || blob.type.includes("html")) {
        return host.saveWechatHtml(await blob.text());
      }
      return host.saveImage(blob, filename);
    },
    notify(message) {
      new Notice(message);
    },
  };
  return host;
}
