"use client";

import { useState } from "react";
import type { Block, Theme } from "@/lib/builder/types";
import { BLOCK_MAP } from "@/lib/builder/definitions";
import { Icon } from "@/components/Icon";

export function BlockConfigModal({
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

  // Props locais para edição fluida
  const p = block.props || {};
  const s = block.style || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#120A24] border border-purple-500/40 w-full max-w-xl max-h-[90vh] rounded-3xl p-6 shadow-2xl shadow-purple-950/80 flex flex-col relative text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md">
              <Icon name={def?.icon || "Boxes"} size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>Configurar {def?.label || block.type}</span>
              </h3>
              <p className="text-xs text-purple-300/80">Edite textos, opções e visual deste bloco</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Abas: Conteúdo / Estilo */}
        <div className="flex border-b border-purple-900/30 pt-3 mb-4">
          <button
            onClick={() => setTab("conteudo")}
            className={`pb-2.5 px-4 font-bold text-xs border-b-2 transition ${
              tab === "conteudo" ? "border-pink-500 text-pink-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            📝 Conteúdo & Textos
          </button>
          <button
            onClick={() => setTab("estilo")}
            className={`pb-2.5 px-4 font-bold text-xs border-b-2 transition ${
              tab === "estilo" ? "border-pink-500 text-pink-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            🎨 Cores & Layout
          </button>
        </div>

        {/* Body com Scroll */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {tab === "conteudo" && (
            <div className="space-y-4">
              {/* CASO ESPECIAL: CHECKLIST */}
              {block.type === "checklist" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-purple-300 block mb-1">Título do Checklist:</label>
                    <input
                      type="text"
                      value={(p.title as string) || ""}
                      onChange={(e) => onUpdateProps({ title: e.target.value })}
                      placeholder="Ex: Seu primeiro passo"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#180E2F] border border-purple-500/40 text-sm text-white font-bold outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-300 block mb-2">
                      Itens do Checklist (Passos / Tarefas):
                    </label>
                    <div className="space-y-2">
                      {((p.items as string[]) || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-300 shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const next = [...((p.items as string[]) || [])];
                              next[idx] = e.target.value;
                              onUpdateProps({ items: next });
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none focus:border-pink-500"
                            placeholder={`Passo ${idx + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = ((p.items as string[]) || []).filter((_, i) => i !== idx);
                              onUpdateProps({ items: next });
                            }}
                            className="w-8 h-8 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 flex items-center justify-center shrink-0 transition"
                            title="Remover este item"
                          >
                            <Icon name="Trash2" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const cur = (p.items as string[]) || [];
                        onUpdateProps({ items: [...cur, `Nova tarefa ${cur.length + 1}`] });
                      }}
                      className="mt-3 w-full py-2.5 rounded-xl border border-dashed border-purple-500/40 hover:border-pink-400 text-purple-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition bg-purple-950/30"
                    >
                      <Icon name="Plus" size={14} />
                      <span>+ Adicionar Novo Item ao Checklist</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CASO GERAL: CAMPOS DINÂMICOS DO BLOCK_MAP */}
              {block.type !== "checklist" && def && (
                <div className="space-y-3.5">
                  {def.fields.map((field) => {
                    const val = p[field.key];
                    if (field.type === "text" || field.type === "url") {
                      return (
                        <div key={field.key}>
                          <label className="text-xs font-bold text-purple-300 block mb-1">{field.label}</label>
                          <input
                            type={field.type === "url" ? "url" : "text"}
                            value={(val as string) || ""}
                            onChange={(e) => onUpdateProps({ [field.key]: e.target.value })}
                            placeholder={field.placeholder || ""}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none focus:border-pink-500"
                          />
                        </div>
                      );
                    }
                    if (field.type === "textarea") {
                      return (
                        <div key={field.key}>
                          <label className="text-xs font-bold text-purple-300 block mb-1">{field.label}</label>
                          <textarea
                            rows={3}
                            value={(val as string) || ""}
                            onChange={(e) => onUpdateProps({ [field.key]: e.target.value })}
                            placeholder={field.placeholder || ""}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none focus:border-pink-500"
                          />
                        </div>
                      );
                    }
                    if (field.type === "list") {
                      const list = Array.isArray(val) ? (val as string[]) : [];
                      return (
                        <div key={field.key}>
                          <label className="text-xs font-bold text-purple-300 block mb-1.5">{field.label}</label>
                          <div className="space-y-1.5">
                            {list.map((it, idx) => (
                              <div key={idx} className="flex gap-2">
                                <input
                                  type="text"
                                  value={it}
                                  onChange={(e) => {
                                    const next = [...list];
                                    next[idx] = e.target.value;
                                    onUpdateProps({ [field.key]: next });
                                  }}
                                  className="flex-1 px-3 py-1.5 rounded-xl bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUpdateProps({ [field.key]: list.filter((_, i) => i !== idx) });
                                  }}
                                  className="px-2 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => onUpdateProps({ [field.key]: [...list, `Item ${list.length + 1}`] })}
                              className="w-full py-1.5 border border-dashed border-purple-500/30 rounded-xl text-xs text-purple-300 hover:text-white mt-1"
                            >
                              + Adicionar
                            </button>
                          </div>
                        </div>
                      );
                    }
                    if (field.type === "select") {
                      return (
                        <div key={field.key}>
                          <label className="text-xs font-bold text-purple-300 block mb-1">{field.label}</label>
                          <select
                            value={(val as string) || ""}
                            onChange={(e) => onUpdateProps({ [field.key]: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none"
                          >
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "estilo" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-purple-300 block mb-1.5">Alinhamento do Texto:</label>
                <div className="grid grid-cols-3 gap-2 bg-[#180E2F] p-1.5 rounded-xl border border-purple-500/30">
                  {(["left", "center", "right"] as const).map((al) => (
                    <button
                      key={al}
                      type="button"
                      onClick={() => onUpdateStyle({ align: al })}
                      className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                        (s.align || "left") === al ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon
                        name={al === "left" ? "AlignLeft" : al === "center" ? "AlignCenter" : "AlignRight"}
                        size={14}
                      />
                      <span>{al === "left" ? "Esquerda" : al === "center" ? "Centro" : "Direita"}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-purple-300 block mb-1">Cor de Fundo do Bloco:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={s.background || "#000000"}
                    onChange={(e) => onUpdateStyle({ background: e.target.value })}
                    className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={s.background || ""}
                    placeholder="Transparente (Padrão)"
                    onChange={(e) => onUpdateStyle({ background: e.target.value })}
                    className="flex-1 bg-[#180E2F] border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                  {s.background && (
                    <button
                      onClick={() => onUpdateStyle({ background: "" })}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-slate-300"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-purple-300 mb-1">
                  <span>Espaçamento Vertical (Padding):</span>
                  <span className="text-pink-400">{s.paddingY ?? 12}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={48}
                  value={s.paddingY ?? 12}
                  onChange={(e) => onUpdateStyle({ paddingY: Number(e.target.value) })}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="pt-4 mt-4 border-t border-purple-900/40 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white font-extrabold text-xs shadow-md transition"
          >
            ✓ Concluir Edição
          </button>
        </div>
      </div>
    </div>
  );
}
