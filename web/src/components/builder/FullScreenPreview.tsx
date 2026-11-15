"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useBuilder } from "@/lib/builder/store";
import { BlockView, themeVars } from "@/components/blocks/BlockView";
import { cn } from "@/lib/builder/utils";

export function FullScreenPreview({ onClose }: { onClose: () => void }) {
  const { doc, pageId } = useBuilder();
  const [viewMode, setViewMode] = useState<"fullscreen" | "mobile">("fullscreen");

  const page = doc.pages.find((p) => p.id === pageId) || doc.pages[0];
  const blocks = page.blocks.filter((b) => !b.hidden);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0714] text-[#F8F5FF] flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Floating Control Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-14 bg-[#0E0820]/95 backdrop-blur-md text-white border-b border-[#2D1E51] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center font-extrabold text-sm shadow-md shadow-violet-500/40">
            📱
          </div>
          <div>
            <h2 className="font-extrabold text-sm leading-none flex items-center gap-2">
              <span>{doc.name || "Mini App"}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Prévia ao Vivo
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Página: {page.name}</p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/10 rounded-full p-0.5">
            <button
              onClick={() => setViewMode("fullscreen")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition",
                viewMode === "fullscreen"
                  ? "bg-violet-600 text-white shadow"
                  : "text-slate-300 hover:text-white"
              )}
            >
              <Icon name="Maximize2" size={13} />
              <span>Total da Página</span>
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition",
                viewMode === "mobile"
                  ? "bg-violet-600 text-white shadow"
                  : "text-slate-300 hover:text-white"
              )}
            >
              <Icon name="Smartphone" size={13} />
              <span>Moldura Celular</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition ml-2"
            title="Fechar prévia (Esc)"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <div
        className="flex-1 overflow-y-auto w-full"
        style={themeVars(doc.theme)}
      >
        {viewMode === "fullscreen" ? (
          /* Tamanho Total da Página */
          <main className="w-full min-h-full py-6 px-4 sm:px-8 max-w-4xl mx-auto space-y-4">
            {blocks.map((block) => (
              <BlockView
                key={block.id}
                block={block}
                theme={doc.theme}
                editing={false}
              />
            ))}
            {blocks.length === 0 && (
              <div className="py-20 text-center text-slate-400">
                Esta página não possui blocos adicionados ainda.
              </div>
            )}
          </main>
        ) : (
          /* Moldura de Celular Centralizada */
          <div className="min-h-full py-10 flex items-center justify-center bg-[#0B0714]">
            <div className="w-[375px] max-w-full bg-black rounded-[48px] p-3 shadow-[0_30px_90px_rgba(124,58,237,0.3)] border-4 border-[#2D1E51]">
              <div
                className="w-full h-[680px] rounded-[38px] overflow-y-auto flex flex-col"
                style={themeVars(doc.theme)}
              >
                {/* Status Bar */}
                <div className="h-7 shrink-0 flex items-center justify-between px-6 pt-1 text-[11px] font-bold opacity-60 select-none">
                  <span>9:41</span>
                  <div className="w-20 h-4 bg-black rounded-full" />
                  <span>100%</span>
                </div>

                {/* Blocks */}
                <div className="p-4 space-y-3 flex-1">
                  {blocks.map((block) => (
                    <BlockView
                      key={block.id}
                      block={block}
                      theme={doc.theme}
                      editing={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
