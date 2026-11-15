"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppDocument, Block, BlockStyle, Device, Theme, MenuConfig } from "./types";
import { clone, uid } from "./utils";
import { makeBlock, newDocument, TEMPLATES, DEFAULT_THEME, type Template } from "./templates";

const HISTORY_LIMIT = 80;
const MERGE_MS = 900;

export type Panel = null | "blocks" | "emoji" | "icon" | "templates" | "design" | "pages";

interface BuilderState {
  doc: AppDocument;
  pageId: string;
  selectedId: string | null;
  device: Device;
  panel: Panel;
  preview: boolean;
  past: AppDocument[];
  future: AppDocument[];
  lastKey: string;
  lastAt: number;
  savedAt: number;
  barPos: { x: number; y: number } | null;

  // navegação/UI
  setPanel: (p: Panel) => void;
  togglePanel: (p: Exclude<Panel, null>) => void;
  setDevice: (d: Device) => void;
  setPreview: (v: boolean) => void;
  select: (id: string | null) => void;
  setPage: (id: string) => void;
  setBarPos: (p: { x: number; y: number } | null) => void;

  // documento
  mutate: (fn: (d: AppDocument) => void, key?: string) => void;
  addBlock: (type: string, index?: number, props?: Record<string, unknown>) => string;
  updateProps: (id: string, patch: Record<string, unknown>) => void;
  updateStyle: (id: string, patch: Partial<BlockStyle>) => void;
  moveBlock: (from: number, to: number) => void;
  moveBy: (id: string, delta: number) => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
  toggleHidden: (id: string) => void;
  setTheme: (patch: Partial<Theme>) => void;
  setName: (name: string) => void;
  setMenu: (menu: MenuConfig) => void;
  applyTemplate: (input: string | Template | { name?: string; brand?: string; blocks: Block[] | (() => Block[]) }) => void;
  addPage: () => void;
  renamePage: (id: string, name: string) => void;
  removePage: (id: string) => void;
  undo: () => void;
  redo: () => void;
}

const currentBlocks = (s: { doc: AppDocument; pageId: string }): Block[] =>
  (s.doc.pages.find((p) => p.id === s.pageId) || s.doc.pages[0]).blocks;

export const useBuilder = create<BuilderState>()(
  persist(
    (set, get) => {
      const initial = newDocument("guia");
      return {
        doc: initial,
        pageId: initial.pages[0].id,
        selectedId: null,
        device: "mobile",
        panel: null,
        preview: false,
        past: [],
        future: [],
        lastKey: "",
        lastAt: 0,
        savedAt: Date.now(),
        barPos: null,

        setPanel: (panel) => set({ panel }),
        togglePanel: (p) => set((s) => ({ panel: s.panel === p ? null : p })),
        setDevice: (device) => set({ device }),
        setPreview: (preview) => set({ preview, panel: null }),
        select: (selectedId) => set({ selectedId }),
        setPage: (pageId) => set({ pageId, selectedId: null }),
        setBarPos: (barPos) => set({ barPos }),

        mutate: (fn, key = "") => {
          const s = get();
          const now = Date.now();
          const merge = key !== "" && key === s.lastKey && now - s.lastAt < MERGE_MS;
          const next = clone(s.doc);
          fn(next);
          next.updatedAt = new Date().toISOString();
          set({
            doc: next,
            past: merge ? s.past : [...s.past, s.doc].slice(-HISTORY_LIMIT),
            future: [],
            lastKey: key,
            lastAt: now,
            savedAt: now,
          });
        },

        addBlock: (type, index, props) => {
          const b = makeBlock(type, props);
          const { pageId } = get();
          get().mutate((d) => {
            const page = d.pages.find((p) => p.id === pageId) || d.pages[0];
            const i = index === undefined ? page.blocks.length : Math.max(0, Math.min(index, page.blocks.length));
            page.blocks.splice(i, 0, b);
          });
          set({ selectedId: b.id });
          return b.id;
        },

        updateProps: (id, patch) =>
          get().mutate((d) => {
            for (const p of d.pages) {
              const b = p.blocks.find((x) => x.id === id);
              if (b) Object.assign(b.props, patch);
            }
          }, `props:${id}:${Object.keys(patch).join(",")}`),

        updateStyle: (id, patch) =>
          get().mutate((d) => {
            for (const p of d.pages) {
              const b = p.blocks.find((x) => x.id === id);
              if (b) b.style = { ...(b.style || {}), ...patch };
            }
          }, `style:${id}:${Object.keys(patch).join(",")}`),

        moveBlock: (from, to) => {
          const { pageId } = get();
          get().mutate((d) => {
            const page = d.pages.find((p) => p.id === pageId) || d.pages[0];
            const [b] = page.blocks.splice(from, 1);
            if (b) page.blocks.splice(to, 0, b);
          });
        },

        moveBy: (id, delta) => {
          const blocks = currentBlocks(get());
          const i = blocks.findIndex((b) => b.id === id);
          const j = i + delta;
          if (i < 0 || j < 0 || j >= blocks.length) return;
          get().moveBlock(i, j);
        },

        duplicate: (id) => {
          const blocks = currentBlocks(get());
          const i = blocks.findIndex((b) => b.id === id);
          if (i < 0) return;
          const copy = { ...clone(blocks[i]), id: uid() };
          const { pageId } = get();
          get().mutate((d) => {
            const page = d.pages.find((p) => p.id === pageId) || d.pages[0];
            page.blocks.splice(i + 1, 0, copy);
          });
          set({ selectedId: copy.id });
        },

        remove: (id) => {
          get().mutate((d) => {
            for (const p of d.pages) p.blocks = p.blocks.filter((b) => b.id !== id);
          });
          if (get().selectedId === id) set({ selectedId: null });
        },

        toggleHidden: (id) =>
          get().mutate((d) => {
            for (const p of d.pages) {
              const b = p.blocks.find((x) => x.id === id);
              if (b) b.hidden = !b.hidden;
            }
          }),

        setTheme: (patch) => get().mutate((d) => Object.assign(d.theme, patch), `theme:${Object.keys(patch).join(",")}`),
        setName: (name) => get().mutate((d) => void (d.name = name), "name"),
        setMenu: (menu) => get().mutate((d) => void (d.menu = menu), "menu"),

        applyTemplate: (input) => {
          let t: { name?: string; brand?: string; blocks: Block[] | (() => Block[]) } | undefined;
          if (typeof input === "string") {
            t = TEMPLATES.find((x) => x.id === input);
          } else {
            t = input;
          }
          if (!t) return;
          const { pageId } = get();
          get().mutate((d) => {
            const page = d.pages.find((p) => p.id === pageId) || d.pages[0];
            page.blocks = typeof t.blocks === "function" ? t.blocks() : t.blocks;
            if (t.brand) d.theme = { ...DEFAULT_THEME, ...d.theme, brand: t.brand };
            if (t.name && d.pages.length === 1) d.name = t.name;
          });
          set({ selectedId: null, panel: null });
        },

        addPage: () => {
          const id = uid("p");
          get().mutate((d) => {
            d.pages.push({ id, name: `Página ${d.pages.length + 1}`, blocks: [makeBlock("titulo", { text: "Nova página" })] });
          });
          set({ pageId: id, selectedId: null });
        },
        renamePage: (id, name) =>
          get().mutate((d) => {
            const p = d.pages.find((x) => x.id === id);
            if (p) p.name = name;
          }, `page:${id}`),
        removePage: (id) => {
          if (get().doc.pages.length <= 1) return;
          get().mutate((d) => void (d.pages = d.pages.filter((p) => p.id !== id)));
          set({ pageId: get().doc.pages[0].id, selectedId: null });
        },

        undo: () => {
          const s = get();
          if (!s.past.length) return;
          const prev = s.past[s.past.length - 1];
          set({
            doc: prev,
            past: s.past.slice(0, -1),
            future: [s.doc, ...s.future].slice(0, HISTORY_LIMIT),
            lastKey: "",
            pageId: prev.pages.some((p) => p.id === s.pageId) ? s.pageId : prev.pages[0].id,
          });
        },
        redo: () => {
          const s = get();
          if (!s.future.length) return;
          const next = s.future[0];
          set({
            doc: next,
            future: s.future.slice(1),
            past: [...s.past, s.doc].slice(-HISTORY_LIMIT),
            lastKey: "",
            pageId: next.pages.some((p) => p.id === s.pageId) ? s.pageId : next.pages[0].id,
          });
        },
      };
    },
    {
      name: "mineapps-builder-v1",
      partialize: (s) => ({ doc: s.doc, pageId: s.pageId, device: s.device, barPos: s.barPos }),
    },
  ),
);

export const useCurrentBlocks = () => useBuilder((s) => currentBlocks(s));
