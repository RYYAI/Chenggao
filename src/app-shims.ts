import html2canvas from "html2canvas";
import JSZip from "jszip";
import { createIcons, icons } from "lucide";

declare global {
  interface Window {
    JSZip?: typeof JSZip;
    html2canvas?: typeof html2canvas;
    lucide?: {
      createIcons: (options?: Record<string, unknown>) => void;
    };
    WRITE_THEN_PUBLISH_DEFER_BOOT?: boolean;
    WRITE_THEN_PUBLISH_HOST?: unknown;
    bootWriteThenPublish?: () => void | Promise<void>;
    reloadWriteThenPublishNote?: () => void | Promise<void>;
    flushWriteThenPublishProfile?: () => void | Promise<void>;
    WriteThenPublishBrowserLivePhoto?: { supported: () => boolean };
    __chenggaoT?: (key: string, vars?: Record<string, string | number>) => string;
    __chenggaoLocale?: "en" | "zh";
    obsidianApiGetLanguage?: () => string;
  }
}

window.JSZip = JSZip;
window.html2canvas = html2canvas;
window.lucide = {
  createIcons(options = {}) {
    const host = window.WRITE_THEN_PUBLISH_HOST as { root?: HTMLElement } | undefined;
    createIcons({
      icons,
      root: host?.root || document.body,
      ...options,
    });
  },
};
