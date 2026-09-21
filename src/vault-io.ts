import { App, TFile, TFolder, normalizePath } from "obsidian";

export const IMAGE_FOLDER = "图片";

export function noteDir(path: string): string {
  const normalized = normalizePath(path);
  const index = normalized.lastIndexOf("/");
  return index === -1 ? "" : normalized.slice(0, index);
}

export function noteBasename(path: string): string {
  const name = normalizePath(path).split("/").pop() || "未命名";
  return name.replace(/\.md$/i, "");
}

export function imageFolderPath(notePath: string): string {
  const directory = noteDir(notePath);
  return normalizePath(directory ? `${directory}/${IMAGE_FOLDER}` : IMAGE_FOLDER);
}

export function imageFilePath(notePath: string, filename: string): string {
  return normalizePath(`${imageFolderPath(notePath)}/${filename}`);
}

export function wechatHtmlPath(notePath: string): string {
  const directory = noteDir(notePath);
  const base = noteBasename(notePath);
  return normalizePath(directory ? `${directory}/${base}.wechat.html` : `${base}.wechat.html`);
}

export function wikiPathForNoteImage(filename: string): string {
  return normalizePath(`${IMAGE_FOLDER}/${filename}`);
}

export function exportImageName(notePath: string, filename: string): string {
  const base = noteBasename(notePath);
  const article = /article|长文/i.test(filename);
  const pageMatch = String(filename).match(/(\d+)(?=\.png$)/i);
  if (article) return `${base}-长文.png`;
  if (pageMatch) return `${base}-${pageMatch[1]}.png`;
  if (/\.png$/i.test(filename)) return `${base}-${filename}`;
  return `${base}-${filename}`;
}

export async function ensureFolder(app: App, folderPath: string): Promise<TFolder | null> {
  if (!folderPath) return app.vault.getRoot();
  const existing = app.vault.getAbstractFileByPath(folderPath);
  if (existing instanceof TFolder) return existing;
  await app.vault.createFolder(folderPath);
  const created = app.vault.getAbstractFileByPath(folderPath);
  return created instanceof TFolder ? created : null;
}

export async function writeBinary(app: App, path: string, data: ArrayBuffer): Promise<TFile> {
  const existing = app.vault.getAbstractFileByPath(path);
  if (existing instanceof TFile) {
    await app.vault.modifyBinary(existing, data);
    return existing;
  }
  const directory = noteDir(path);
  if (directory) await ensureFolder(app, directory);
  return app.vault.createBinary(path, data);
}

export async function writeText(app: App, path: string, content: string): Promise<TFile> {
  const existing = app.vault.getAbstractFileByPath(path);
  if (existing instanceof TFile) {
    await app.vault.modify(existing, content);
    return existing;
  }
  const directory = noteDir(path);
  if (directory) await ensureFolder(app, directory);
  return app.vault.create(path, content);
}

export async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return blob.arrayBuffer();
}
