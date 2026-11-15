"use client";

import { useRef, useState, useEffect } from "react";
import { Icon } from "@/components/Icon";
import { useBuilder } from "@/lib/builder/store";
import { cn } from "@/lib/builder/utils";

export function FloatingBar() {
  const {
    panel,
    togglePanel,
    undo,
    redo,
    past,
    future,
    setPreview,
    barPos,
    setBarPos,
  } = useBuilder();

  // Movimentação da barra flutuante
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const [savedToast, setSavedToast] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest("[data-drag-handle]")) return;

    e.preventDefault();
    setDragging(true);
    const rect = barRef.current?.getBoundingClientRect();
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: rect?.left ?? window.innerWidth / 2,
      posY: rect?.top ?? window.innerHeight - 80,
    };
  };

  useEffect(() => {
    if (!dragging) return;

    const onPointerMove = (e: PointerEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setBarPos({
        x: Math.max(10, Math.min(window.innerWidth - 320, dragStart.current.posX + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 80, dragStart.current.posY + dy)),
      });
    };

    const onPointerUp = () => {
      setDragging(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging, setBarPos]);

  const stylePos = barPos
    ? { left: `${barPos.x}px`, top: `${barPos.y}px`, transform: "none" }
    : undefined;

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <>
      <div
        ref={barRef}
        onPointerDown={onPointerDown}
        style={stylePos}
        className={cn(
          "fixed z-40 select-none flex items-center gap-2 bg-[#120B24]/95 backdrop-blur-md border border-purple-500/40 px-3 py-2 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8),0_0_20px_0_rgba(168,85,247,0.25)] text-xs font-bold text-white transition-shadow",
          !barPos && "bottom-6 left-1/2 -translate-x-1/2",
          dragging && "cursor-grabbing shadow-[0_0_35px_rgba(168,85,247,0.5)]"
        )}
      >
        {/* Alça de Arraste ⋮⋮ */}
        <div
          data-drag-handle
          className="px-1 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing flex items-center justify-center transition"
          title="Arraste para mover a barra de ferramentas"
        >
          <Icon name="GripVertical" size={16} />
        </div>

        {/* ✏️ Modo Edição Ativo (Pink Button) */}
        <button
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-extrabold flex items-center gap-1.5 shadow-[0_0_20px_-3px_rgba(236,72,153,0.5)]"
          title="Modo Edição Ativo"
        >
          <Icon name="Edit3" size={14} />
          <span>Modo Edição Ativo</span>
        </button>

        {/* 💾 Salvar (Green Button) */}
        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center gap-1.5 shadow-[0_0_20px_-3px_rgba(16,185,129,0.5)] transition"
          title="Salvar Alterações"
        >
          <Icon name="Check" size={14} />
          <span>{savedToast ? "Salvo!" : "Salvar"}</span>
        </button>

        {/* 📋 Menu */}
        <button
          onClick={() => togglePanel("templates")}
          className={cn(
            "px-3 py-1.5 rounded-full bg-[#1C1236] hover:bg-[#281A4C] border border-purple-500/30 text-slate-200 transition flex items-center gap-1",
            panel === "templates" && "border-purple-400 text-white"
          )}
        >
          <Icon name="Menu" size={14} className="text-purple-400" />
          <span>Menu</span>
        </button>

        {/* 👁️ Visualizar Prévia em Tela Cheia */}
        <button
          onClick={() => setPreview(true)}
          className="w-8 h-8 rounded-full bg-[#1C1236] hover:bg-[#281A4C] text-slate-300 hover:text-white flex items-center justify-center transition"
          title="Prévia Tamanho Total da Página"
        >
          <Icon name="Eye" size={16} />
        </button>

        {/* ↶ Desfazer */}
        <button
          onClick={undo}
          disabled={past.length === 0}
          className="w-8 h-8 rounded-full bg-[#1C1236] hover:bg-[#281A4C] text-slate-300 hover:text-white disabled:opacity-40 flex items-center justify-center transition"
          title="Desfazer"
        >
          <Icon name="Undo2" size={14} />
        </button>

        {/* ↷ Refazer */}
        <button
          onClick={redo}
          disabled={future.length === 0}
          className="w-8 h-8 rounded-full bg-[#1C1236] hover:bg-[#281A4C] text-slate-300 hover:text-white disabled:opacity-40 flex items-center justify-center transition"
          title="Refazer"
        >
          <Icon name="Redo2" size={14} />
        </button>

        {/* ＋ Bloco (Deep Purple / Indigo Button) */}
        <button
          onClick={() => togglePanel("blocks")}
          className={cn(
            "px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white font-extrabold flex items-center gap-1.5 shadow-[0_0_25px_-3px_rgba(168,85,247,0.6)] hover:scale-105 transition",
            panel === "blocks" && "ring-2 ring-purple-300"
          )}
        >
          <Icon name="Plus" size={15} />
          <span>＋ Bloco</span>
        </button>
      </div>

      {savedToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#160D2E] border border-emerald-500/50 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in duration-200">
          <span className="text-emerald-400">✓</span>
          <span>Alterações salvas com sucesso!</span>
        </div>
      )}
    </>
  );
}
