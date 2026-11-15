"use client";

import { Icon } from "@/components/Icon";
import { BLOCK_MAP } from "@/lib/builder/definitions";
import type { Block } from "@/lib/builder/types";

export function BlockToolbar({
  block,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onToggleHidden,
  onDelete,
  onConfigure,
}: {
  block: Block;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
  onConfigure: () => void;
}) {
  const def = BLOCK_MAP[block.type];

  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 bg-[#140A28] border border-purple-500/40 text-white px-3 py-1.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(168,85,247,0.3)] select-none text-xs font-bold animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap">
      {/* Block Title + Icon */}
      <div className="flex items-center gap-1.5 text-purple-200">
        <span className="text-slate-400">⇅</span>
        <Icon name={def?.icon || "Boxes"} size={13} className="text-purple-400" />
        <span className="truncate max-w-[140px] sm:max-w-none">{def?.label || block.type}</span>
      </div>

      <div className="w-[1px] h-3.5 bg-purple-500/30 mx-0.5" />

      {/* ↑ Subir */}
      <button
        type="button"
        disabled={!canMoveUp}
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
        className="px-2 py-0.5 rounded-full bg-[#1F103D] hover:bg-purple-900/60 disabled:opacity-30 transition flex items-center gap-0.5 text-slate-300 hover:text-white"
        title="Subir bloco"
      >
        <span>↑ Subir</span>
      </button>

      {/* ↓ Descer */}
      <button
        type="button"
        disabled={!canMoveDown}
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown();
        }}
        className="px-2 py-0.5 rounded-full bg-[#1F103D] hover:bg-purple-900/60 disabled:opacity-30 transition flex items-center gap-0.5 text-slate-300 hover:text-white"
        title="Descer bloco"
      >
        <span>↓ Descer</span>
      </button>

      {/* ✨ CÓPIA IA */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          alert("✨ IA gerou uma cópia de alta conversão para este bloco!");
        }}
        className="hidden md:flex px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-extrabold hover:brightness-110 shadow-sm transition items-center gap-1"
        title="Gerar textos de alta conversão com Inteligência Artificial"
      >
        <span>✨ CÓPIA IA</span>
      </button>

      {/* ⚙️ Configurar (Purple Button) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onConfigure();
        }}
        className="px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold flex items-center gap-1 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition"
      >
        <Icon name="Settings" size={13} />
        <span>Configurar</span>
      </button>

      {/* 👁️ Toggle Hidden */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleHidden();
        }}
        className="p-1 hover:bg-purple-950/60 rounded-full transition text-slate-400 hover:text-white"
        title={block.hidden ? "Mostrar bloco" : "Ocultar bloco"}
      >
        <Icon name={block.hidden ? "EyeOff" : "Eye"} size={14} />
      </button>

      {/* 📋 Duplicate */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        className="p-1 hover:bg-purple-950/60 rounded-full transition text-slate-400 hover:text-white"
        title="Duplicar bloco"
      >
        <Icon name="Copy" size={14} />
      </button>

      {/* 🗑️ Delete */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1 hover:bg-red-950/50 rounded-full transition text-slate-400 hover:text-red-400"
        title="Excluir bloco"
      >
        <Icon name="Trash2" size={14} />
      </button>
    </div>
  );
}
