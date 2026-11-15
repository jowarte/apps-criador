import type { Block, Theme } from "./types";

// ---------- Campos editáveis (geram o painel de propriedades automaticamente) ----------
export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "number"
  | "color"
  | "select"
  | "toggle"
  | "list" // string[]
  | "items" // objeto[] com subcampos
  | "icon"
  | "emoji"
  | "code";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  help?: string;
  fields?: Field[]; // para "items"
  itemLabel?: string;
  language?: "html" | "css" | "js";
}

export type Category =
  | "Básicos"
  | "Mídia"
  | "Layout"
  | "Vendas"
  | "Interativos"
  | "Contato"
  | "Avançado";

export const CATEGORIES: Category[] = [
  "Básicos",
  "Mídia",
  "Layout",
  "Vendas",
  "Interativos",
  "Contato",
  "Avançado",
];

export interface RenderProps<P = Record<string, unknown>> {
  block: Block;
  props: P;
  theme: Theme;
  editing: boolean;
}

export interface BlockDefinition {
  type: string;
  label: string;
  description: string;
  category: Category;
  icon: string; // nome do ícone lucide
  color: string; // cor do botão na gaveta
  keywords?: string;
  defaults: () => Record<string, unknown>;
  fields: Field[];
}
