import { App, TFile } from "obsidian";
import { IMAGE_FOLDER, noteDir, wikiPathForNoteImage, writeBinary } from "./vault-io";

export interface PluginNoteImage {
  id: string;
  src: string;
  name: string;
  vaultPath: string;
}

export interface PluginNote {
  path: string;
  frontmatter: string;
  content: string;
  images: PluginNoteImage[];
}

export interface PluginAttachment {
  fileName: string;
  blob: Blob;
  path?: string;
}

const WIKI_IMAGE = /!\[\[([^\]\n]+)\]\]/g;
const MARKDOWN_IMAGE = /!\[[^\]\n]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g;

export function splitFrontmatter(text: string): { frontmatter: string; body: string } {
  const match = String(text || "").match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  if (!match) return { frontmatter: "", body: String(text || "") };
  return { frontmatter: match[0], body: String(text || "").slice(match[0].length) };
}

export function extractImageRefs(markdown: string): string[] {
  const references = new Set<string>();
  const text = String(markdown || "");
  for (const match of text.matchAll(WIKI_IMAGE)) {
    references.add(match[1].split("|")[0].trim());
  }
  for (const match of text.matchAll(MARKDOWN_IMAGE)) {
    references.add((match[1] || match[2] || "").trim());
  }
  return Array.from(references).filter(Boolean);
}

function mimeFromExtension(extension: string): string {
  const type: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif",
    bmp: "image/bmp",
  };
  return type[extension.toLowerCase()] || "application/octet-stream";
}

export async function fileToDataUrl(app: App, file: TFile): Promise<string> {
  const data = await app.vault.readBinary(file);
  const blob = new Blob([data], { type: mimeFromExtension(file.extension) });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("图片读取失败"));
    reader.readAsDataURL(blob);
  });
}

export function resolveVaultFile(app: App, reference: string, sourcePath: string): TFile | null {
  let path = String(reference || "").trim().replace(/^<|>$/g, "");
  try {
    path = decodeURIComponent(path);
  } catch {
    // Keep the original wiki target when it is not URI-encoded.
  }
  path = path.replace(/\\/g, "/").replace(/^\.\//, "").split("|")[0].trim();
  if (!path || /^https?:/i.test(path) || /^data:/i.test(path)) return null;

  const dest = app.metadataCache.getFirstLinkpathDest(path, sourcePath);
  if (dest instanceof TFile) return dest;

  const exact = app.vault.getAbstractFileByPath(path);
  if (exact instanceof TFile) return exact;

  const fromNote = app.vault.getAbstractFileByPath(`${noteDir(sourcePath)}/${path}`.replace(/^\/+/, ""));
  if (fromNote instanceof TFile) return fromNote;

  const name = path.split("/").pop() || "";
  return app.vault.getFiles().find((file) => file.name.toLowerCase() === name.toLowerCase()) || null;
}

export async function loadNote(app: App, file: TFile, rawText?: string): Promise<PluginNote> {
  const raw = rawText == null ? await app.vault.read(file) : rawText;
  const { frontmatter, body } = splitFrontmatter(raw);
  const images: PluginNoteImage[] = [];
  const seen = new Set<string>();

  for (const [index, reference] of extractImageRefs(body).entries()) {
    const target = resolveVaultFile(app, reference, file.path);
    if (!target || seen.has(target.path)) continue;
    seen.add(target.path);
    images.push({
      id: `vault_${index}_${target.basename.replace(/[^a-z0-9_-]/gi, "").slice(0, 24) || "image"}`,
      src: await fileToDataUrl(app, target),
      name: target.name,
      vaultPath: app.metadataCache.fileToLinktext(target, file.path),
    });
  }

  return {
    path: file.path,
    frontmatter,
    content: body,
    images,
  };
}

export async function resolveImages(
  app: App,
  references: string[],
  sourcePath: string,
): Promise<PluginNoteImage[]> {
  const images: PluginNoteImage[] = [];
  for (const [index, reference] of references.entries()) {
    const target = resolveVaultFile(app, reference, sourcePath);
    if (!target) continue;
    images.push({
      id: `vault_paste_${index}_${target.basename.replace(/[^a-z0-9_-]/gi, "").slice(0, 24) || "image"}`,
      src: await fileToDataUrl(app, target),
      name: target.name,
      vaultPath: app.metadataCache.fileToLinktext(target, sourcePath),
    });
  }
  return images;
}

export async function writeNote(
  app: App,
  file: TFile,
  frontmatter: string,
  markdown: string,
  attachments: PluginAttachment[] = [],
): Promise<void> {
  let nextMarkdown = markdown;
  for (const attachment of attachments) {
    const fileName = attachment.fileName.replace(/[\\/]/g, "-");
    const vaultPath = `${noteDir(file.path) ? `${noteDir(file.path)}/` : ""}${IMAGE_FOLDER}/${fileName}`;
    await writeBinary(app, vaultPath, await attachment.blob.arrayBuffer());
    const wiki = wikiPathForNoteImage(fileName);
    if (attachment.path) {
      nextMarkdown = nextMarkdown.split(`![[${attachment.path}]]`).join(`![[${wiki}]]`);
    }
  }
  await app.vault.modify(file, `${frontmatter}${nextMarkdown}`.replace(/\s+$/, "\n"));
}
