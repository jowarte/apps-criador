"use client";

import { useState } from "react";
import type { Block, Theme } from "@/lib/builder/types";
import { BLOCK_MAP } from "@/lib/builder/definitions";
import type { Field } from "@/lib/builder/registry-types";
import { Icon } from "@/components/Icon";
import { EmojiGrid, IconGrid } from "./Pickers";
import { cn } from "@/lib/builder/utils";

export function PropertiesPanel({
  block,
  theme,
  onUpdateProps,
  onUpdateStyle,
  onClose,
}: {
  block: Block;
  theme: Theme;
  onUpdateProps: (patch: Record<string, unknown>) => void;
  onUpdateStyle: (patch: Partial<Block["style"]>) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"conteudo" | "estilo">("conteudo");
  const def = BLOCK_MAP[block.type];

  if (!def) return null;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
            style={{ background: def.color || theme.brand }}
          >
            <Icon name={def.icon} size={16} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">{def.label}</h3>
            <p className="text-[11px] text-slate-400">{def.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition"
        >
          <Icon name="X" size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 px-4 pt-2">
        <button
          onClick={() => setTab("conteudo")}
          className={cn(
            "flex-1 pb-2 font-bold text-xs border-b-2 transition",
            tab === "conteudo"
              ? "border-violet-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          Conteúdo
        </button>
        <button
          onClick={() => setTab("estilo")}
          className={cn(
            "flex-1 pb-2 font-bold text-xs border-b-2 transition",
            tab === "estilo"
              ? "border-violet-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          Estilo & Layout
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pr-3">
        {tab === "conteudo" ? (
          <div className="space-y-3.5">
            {def.fields.map((field) => (
              <FieldEditor
                key={field.key}
                field={field}
                value={block.props[field.key]}
                onChange={(val) => onUpdateProps({ [field.key]: val })}
                theme={theme}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Alinhamento */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Alinhamento</label>
              <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl">
                {(["left", "center", "right"] as const).map((al) => (
                  <button
                    key={al}
                    type="button"
                    onClick={() => onUpdateStyle({ align: al })}
                    className={cn(
                      "py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition",
                      (block.style?.align || "left") === al
                        ? "bg-violet-600 text-white"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    <Icon
                      name={
                        al === "left"
                          ? "AlignLeft"
                          : al === "center"
                          ? "AlignCenter"
                          : "AlignRight"
                      }
                      size={14}
                    />
                    <span className="capitalize">{al === "left" ? "Esq" : al === "center" ? "Centro" : "Dir"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fundo do Bloco */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Cor de Fundo</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={block.style?.background || "#ffffff"}
                  onChange={(e) => onUpdateStyle({ background: e.target.value })}
                  className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={block.style?.background || ""}
                  placeholder="Transparente"
                  onChange={(e) => onUpdateStyle({ background: e.target.value })}
                  className="flex-1 bg-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                />
                {block.style?.background && (
                  <button
                    onClick={() => onUpdateStyle({ background: "" })}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-white/10 rounded-lg"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Espaçamento vertical */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Espaçamento Vertical</span>
                <span className="text-violet-400">{block.style?.paddingY ?? 8}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={48}
                value={block.style?.paddingY ?? 8}
                onChange={(e) => onUpdateStyle({ paddingY: Number(e.target.value) })}
                className="w-full accent-violet-500 cursor-pointer"
              />
            </div>

            {/* Ocultar em Dispositivo */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Visibilidade</label>
              <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl">
                {([
                  { id: "none", label: "Ambos" },
                  { id: "mobile", label: "Só Desk" },
                  { id: "desktop", label: "Só Cel" },
                ] as const).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onUpdateStyle({ hideOn: item.id })}
                    className={cn(
                      "py-1.5 rounded-lg text-xs font-bold transition text-center",
                      (block.style?.hideOn || "none") === item.id
                        ? "bg-violet-600 text-white"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
  theme,
}: {
  field: Field;
  value: unknown;
  onChange: (val: unknown) => void;
  theme: Theme;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  switch (field.type) {
    case "text":
    case "url":
      return (
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{field.label}</label>
          <input
            type={field.type === "url" ? "url" : "text"}
            value={(value as string) || ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-violet-500 transition"
          />
        </div>
      );

    case "textarea":
      return (
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{field.label}</label>
          <textarea
            rows={3}
            value={(value as string) || ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-violet-500 transition"
          />
        </div>
      );

    case "number":
      return (
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{field.label}</label>
          <input
            type="number"
            min={field.min}
            max={field.max}
            value={Number(value ?? 0)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-violet-500 transition"
          />
        </div>
      );

    case "toggle":
      return (
        <label className="flex items-center justify-between py-2 cursor-pointer">
          <span className="text-xs font-bold text-slate-300">{field.label}</span>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
          />
        </label>
      );

    case "select":
      return (
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{field.label}</label>
          <select
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-violet-500 transition"
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "icon":
      return (
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{field.label}</label>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 shrink-0">
              <Icon name={(value as string) || "Sparkles"} size={20} />
            </div>
            <button
              type="button"
              onClick={() => setPickerOpen(!pickerOpen)}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-left text-white transition flex items-center justify-between"
            >
              <span>{pickerOpen ? "Fechar Seletor" : (value as string) || "Escolher Ícone"}</span>
              <Icon name="ChevronDown" size={14} />
            </button>
          </div>
          {pickerOpen && (
            <div className="mt-2 p-3 bg-slate-800 rounded-2xl border border-white/10 shadow-2xl">
              <IconGrid
                compact
                selected={value as string}
                onPick={(n) => {
                  onChange(n);
                  setPickerOpen(false);
                }}
              />
            </div>
          )}
        </div>
      );

    case "emoji":
      return (
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{field.label}</label>
          <div className="flex items-center gap-2">
            <span className="text-3xl w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl shrink-0">
              {(value as string) || "✨"}
            </span>
            <button
              type="button"
              onClick={() => setPickerOpen(!pickerOpen)}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-left text-white transition flex items-center justify-between"
            >
              <span>{pickerOpen ? "Fechar Emojis" : "Escolher Emoji"}</span>
              <Icon name="Smile" size={15} />
            </button>
          </div>
          {pickerOpen && (
            <div className="mt-2 p-3 bg-slate-800 rounded-2xl border border-white/10 shadow-2xl">
              <EmojiGrid
                compact
                onPick={(e) => {
                  onChange(e);
                  setPickerOpen(false);
                }}
              />
            </div>
          )}
        </div>
      );

    case "list": {
      const items = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">{field.label}</label>
          <div className="space-y-1.5">
            {items.map((it, idx) => (
              <div key={idx} className="flex gap-1.5 items-center">
                <input
                  type="text"
                  value={it}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = e.target.value;
                    onChange(next);
                  }}
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = items.filter((_, i) => i !== idx);
                    onChange(next);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/10"
                >
                  <Icon name="Trash2" size={13} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange([...items, `Novo item ${items.length + 1}`])}
              className="w-full py-1.5 border border-dashed border-white/20 hover:border-violet-500 rounded-xl text-xs font-bold text-violet-300 hover:text-white transition mt-1"
            >
              + Adicionar Item
            </button>
          </div>
        </div>
      );
    }

    case "code":
      return (
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{field.label}</label>
          <textarea
            rows={5}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs font-mono text-emerald-400 outline-none focus:border-violet-500"
            spellCheck={false}
          />
        </div>
      );

    default:
      return null;
  }
}
