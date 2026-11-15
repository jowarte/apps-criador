"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block, Theme, Device } from "@/lib/builder/types";
import { BlockView, themeVars } from "@/components/blocks/BlockView";
import { BlockToolbar } from "./BlockToolbar";
import { cn } from "@/lib/builder/utils";
import { Icon } from "@/components/Icon";

export function Canvas({
  blocks,
  theme,
  device,
  selectedId,
  onSelectBlock,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onToggleHidden,
  onDelete,
  onOpenProperties,
  onOpenDrawer,
}: {
  blocks: Block[];
  theme: Theme;
  device: Device;
  selectedId: string | null;
  onSelectBlock: (id: string | null) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenProperties: () => void;
  onOpenDrawer: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-droppable",
    data: { kind: "canvas" },
  });

  return (
    <div
      ref={setNodeRef}
      onClick={() => onSelectBlock(null)}
      className={cn(
        "relative transition-all duration-300 mx-auto",
        device === "mobile"
          ? "w-[375px] max-w-full"
          : "w-full max-w-3xl"
      )}
    >
      {/* Moldura de Celular (se device === 'mobile') */}
      {device === "mobile" ? (
        <div className="w-full bg-slate-950 rounded-[50px] p-3 shadow-[0_30px_90px_rgba(76,29,149,0.35)] border-4 border-slate-900 ring-1 ring-white/10">
          <div
            className="w-full rounded-[40px] overflow-hidden min-h-[640px] max-h-[82vh] overflow-y-auto flex flex-col relative"
            style={themeVars(theme)}
          >
            {/* Notch e Status Bar */}
            <div className="h-8 shrink-0 flex items-center justify-between px-6 pt-1 text-[11px] font-bold opacity-70 select-none">
              <span>9:41</span>
              <div className="w-24 h-4 bg-black rounded-full" />
              <div className="flex items-center gap-1">
                <Icon name="Wifi" size={12} />
                <Icon name="Battery" size={13} />
              </div>
            </div>

            {/* Canvas Blocks */}
            <div className="p-3.5 space-y-3 flex-1 pb-24">
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                {blocks.map((block, index) => (
                  <SortableBlockItem
                    key={block.id}
                    block={block}
                    theme={theme}
                    isSelected={selectedId === block.id}
                    canMoveUp={index > 0}
                    canMoveDown={index < blocks.length - 1}
                    onSelect={() => onSelectBlock(block.id)}
                    onMoveUp={() => onMoveUp(block.id)}
                    onMoveDown={() => onMoveDown(block.id)}
                    onDuplicate={() => onDuplicate(block.id)}
                    onToggleHidden={() => onToggleHidden(block.id)}
                    onDelete={() => onDelete(block.id)}
                    onConfigure={onOpenProperties}
                  />
                ))}
              </SortableContext>

              {blocks.length === 0 && (
                <EmptyCanvasState onOpenDrawer={onOpenDrawer} />
              )}
            </div>

            {/* Home Indicator */}
            <div className="h-4 shrink-0 flex items-center justify-center pb-1">
              <div className="w-32 h-1 bg-slate-400/50 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Modo Desktop / Tablet */
        <div
          className="w-full rounded-3xl p-6 shadow-2xl border border-[#2D1E51] min-h-[640px]"
          style={themeVars(theme)}
        >
          <div className="space-y-4 pb-24">
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {blocks.map((block, index) => (
                <SortableBlockItem
                  key={block.id}
                  block={block}
                  theme={theme}
                  isSelected={selectedId === block.id}
                  canMoveUp={index > 0}
                  canMoveDown={index < blocks.length - 1}
                  onSelect={() => onSelectBlock(block.id)}
                  onMoveUp={() => onMoveUp(block.id)}
                  onMoveDown={() => onMoveDown(block.id)}
                  onDuplicate={() => onDuplicate(block.id)}
                  onToggleHidden={() => onToggleHidden(block.id)}
                  onDelete={() => onDelete(block.id)}
                  onConfigure={onOpenProperties}
                />
              ))}
            </SortableContext>

            {blocks.length === 0 && (
              <EmptyCanvasState onOpenDrawer={onOpenDrawer} />
            )}
          </div>
        </div>
      )}

      {/* Drop feedback indicator */}
      {isOver && (
        <div className="absolute inset-0 border-2 border-dashed border-violet-500 bg-violet-500/10 rounded-[44px] pointer-events-none flex items-center justify-center">
          <div className="bg-violet-600 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-lg">
            Solte aqui para posicionar
          </div>
        </div>
      )}
    </div>
  );
}

function SortableBlockItem({
  block,
  theme,
  isSelected,
  canMoveUp,
  canMoveDown,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onToggleHidden,
  onDelete,
  onConfigure,
}: {
  block: Block;
  theme: Theme;
  isSelected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
  onConfigure: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { kind: "existing", block },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "relative group rounded-2xl transition-all cursor-pointer",
        isSelected
          ? "ring-[3px] ring-violet-500 ring-offset-2 z-20"
          : "hover:ring-2 hover:ring-violet-300/80",
        block.hidden && "opacity-40 grayscale",
        isDragging && "opacity-20 z-50"
      )}
    >
      {/* Block Toolbar quando selecionado */}
      {isSelected && (
        <BlockToolbar
          block={block}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onToggleHidden={onToggleHidden}
          onDelete={onDelete}
          onConfigure={onConfigure}
        />
      )}

      {/* Render do Bloco */}
      <div className="relative">
        <BlockView block={block} theme={theme} editing={true} />
      </div>
    </div>
  );
}

function EmptyCanvasState({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  return (
    <div className="py-20 text-center flex flex-col items-center justify-center p-6 border-2 border-dashed border-violet-200 rounded-3xl bg-violet-50/50">
      <div className="w-14 h-14 rounded-2xl bg-violet-600/10 text-violet-600 flex items-center justify-center text-2xl mb-3">
        🧱
      </div>
      <h3 className="font-extrabold text-base text-slate-800">Seu app está vazio</h3>
      <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">
        Comece arrastando blocos da barra flutuante ou escolha um modelo pronto.
      </p>
      <button
        type="button"
        onClick={onOpenDrawer}
        className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-bold text-xs shadow-md shadow-violet-600/30 transition flex items-center gap-2"
      >
        <Icon name="Plus" size={15} />
        <span>Adicionar Primeiro Bloco</span>
      </button>
    </div>
  );
}
