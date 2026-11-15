// Tipos centrais do documento de um Mini App (AppDocument)

export type Align = "left" | "center" | "right";

export interface BlockStyle {
  align?: Align;
  background?: string; // cor de fundo do bloco ("" = transparente)
  textColor?: string;
  paddingY?: number; // px
  radius?: number; // px
  hideOn?: "none" | "mobile" | "desktop";
}

export interface Block {
  id: string;
  type: string;
  props: Record<string, unknown>;
  style?: BlockStyle;
  hidden?: boolean;
}

export interface Page {
  id: string;
  name: string;
  blocks: Block[];
}

export interface Theme {
  brand: string; // cor principal
  background: string; // fundo do app
  text: string;
  font: string;
  radius: number;
  dark: boolean;
}

export interface AppDocument {
  schemaVersion: 1;
  name: string;
  slug: string;
  theme: Theme;
  pages: Page[];
  updatedAt: string;
}

export type Device = "mobile" | "desktop";
