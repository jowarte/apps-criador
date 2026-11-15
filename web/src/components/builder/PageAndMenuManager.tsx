"use client";

import { useState } from "react";
import type { AppDocument, MenuItem, MenuConfig } from "@/lib/builder/types";
import { Icon } from "@/components/Icon";

export function PageAndMenuManager({
  doc,
  currentPageId,
  onSelectPage,
  onAddPage,
  onRenamePage,
  onRemovePage,
  onUpdateMenu,
  onClose,
}: {
  doc: AppDocument;
  currentPageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: (name?: string) => void;
  onRenamePage: (id: string, name: string) => void;
  onRemovePage: (id: string) => void;
  onUpdateMenu: (menu: MenuConfig) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"pages" | "menu">("pages");

  // Estado local para adicionar nova página
  const [newPageName, setNewPageName] = useState("");

  // Estado local para menu
  const currentMenu: MenuConfig = doc.menu || {
    enabled: true,
    style: "bottom_bar",
    items: doc.pages.map((p, idx) => ({
      id: "m-" + p.id,
      label: p.name,
      icon: idx === 0 ? "Home" : idx === 1 ? "BookOpen" : "Sparkles",
      pageId: p.id,
    })),
  };

  const [menuConfig, setMenuConfig] = useState<MenuConfig>(currentMenu);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingPageName, setEditingPageName] = useState("");

  const handleCreatePage = () => {
    const name = newPageName.trim() || `Página ${doc.pages.length + 1}`;
    onAddPage(name);
    setNewPageName("");
  };

  const handleSaveMenu = () => {
    onUpdateMenu(menuConfig);
  };

  const AVAILABLE_ICONS = [
    "Home",
    "BookOpen",
    "CheckSquare",
    "Sparkles",
    "User",
    "ShoppingBag",
    "Heart",
    "Star",
    "List",
    "MessageCircle",
    "Calendar",
    "Trophy",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#120A24] border border-purple-500/40 w-full max-w-2xl max-h-[90vh] rounded-3xl p-6 shadow-2xl shadow-purple-950/80 flex flex-col relative text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md">
              <Icon name="Layers" size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>Páginas & Menu de Navegação do App</span>
              </h3>
              <p className="text-xs text-purple-300/80">
                Crie múltiplas páginas e configure o menu inferior (Bottom Bar) do seu Mini App
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Abas: Páginas / Menu */}
        <div className="flex border-b border-purple-900/30 pt-3 mb-4">
          <button
            onClick={() => setTab("pages")}
            className={`pb-2.5 px-4 font-bold text-xs border-b-2 transition flex items-center gap-2 ${
              tab === "pages" ? "border-pink-500 text-pink-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span>📑 Páginas do App</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold">
              {doc.pages.length}
            </span>
          </button>
          <button
            onClick={() => setTab("menu")}
            className={`pb-2.5 px-4 font-bold text-xs border-b-2 transition flex items-center gap-2 ${
              tab === "menu" ? "border-pink-500 text-pink-400" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <span>🧭 Menu de Navegação (Abas)</span>
            {menuConfig.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: PÁGINAS DO APP */}
          {tab === "pages" && (
            <div className="space-y-4">
              {/* Criar Nova Página */}
              <div className="p-4 rounded-2xl bg-[#180E2F] border border-purple-500/30 flex flex-col sm:flex-row gap-2 items-center">
                <input
                  type="text"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  placeholder="Nome da nova página (ex: Módulos de Aula, Receitas, Perfil)..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#120A24] border border-purple-500/40 text-xs text-white outline-none focus:border-pink-500 w-full"
                />
                <button
                  type="button"
                  onClick={handleCreatePage}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Icon name="Plus" size={14} />
                  <span>+ Criar Página</span>
                </button>
              </div>

              {/* Lista de Páginas Existentes */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-purple-300">Páginas que compõem este app:</p>
                {doc.pages.map((p, idx) => {
                  const isCurrent = p.id === currentPageId;
                  const isEditing = editingPageId === p.id;

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        isCurrent
                          ? "bg-purple-950/60 border-purple-500 shadow-md shadow-purple-900/30"
                          : "bg-[#140A28] border-purple-900/30 hover:border-purple-500/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-300 shrink-0">
                          {idx + 1}
                        </span>

                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingPageName}
                              onChange={(e) => setEditingPageName(e.target.value)}
                              className="px-2.5 py-1 rounded-lg bg-[#180E2F] border border-pink-500 text-xs text-white outline-none font-bold"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (editingPageName.trim()) {
                                  onRenamePage(p.id, editingPageName.trim());
                                }
                                setEditingPageId(null);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                            >
                              Salvar
                            </button>
                          </div>
                        ) : (
                          <div className="leading-tight truncate">
                            <p className="font-extrabold text-sm text-white flex items-center gap-2">
                              <span>{p.name}</span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40">
                                  EDITANDO AGORA
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{p.blocks.length} blocos inseridos</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectPage(p.id);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
                          >
                            Editar Esta
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setEditingPageId(p.id);
                            setEditingPageName(p.name);
                          }}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
                          title="Renomear página"
                        >
                          <Icon name="Edit3" size={13} />
                        </button>

                        {doc.pages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Excluir a página "${p.name}"?`)) {
                                onRemovePage(p.id);
                              }
                            }}
                            className="w-8 h-8 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 flex items-center justify-center transition"
                            title="Excluir página"
                          >
                            <Icon name="Trash2" size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MENU DE NAVEGAÇÃO EDITÁVEL */}
          {tab === "menu" && (
            <div className="space-y-4">
              {/* Toggle de ativação do menu */}
              <div className="p-4 rounded-2xl bg-[#180E2F] border border-purple-500/30 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>📱 Barra de Navegação Inferior (Bottom Bar)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Exibe um menu de abas fixo no rodapé do celular, permitindo ao usuário navegar entre as páginas do app.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={menuConfig.enabled}
                    onChange={(e) => {
                      const updated = { ...menuConfig, enabled: e.target.checked };
                      setMenuConfig(updated);
                      onUpdateMenu(updated);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {menuConfig.enabled && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-purple-300">Botões do Menu (Abas):</p>

                  <div className="space-y-2">
                    {menuConfig.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-3 rounded-xl bg-[#140A28] border border-purple-500/30 flex flex-col sm:flex-row items-center gap-3"
                      >
                        {/* Seletor de Ícone */}
                        <div className="flex items-center gap-2">
                          <select
                            value={item.icon}
                            onChange={(e) => {
                              const updatedItems = [...menuConfig.items];
                              updatedItems[idx].icon = e.target.value;
                              const updated = { ...menuConfig, items: updatedItems };
                              setMenuConfig(updated);
                              onUpdateMenu(updated);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#180E2F] border border-purple-500/40 text-xs text-purple-200 outline-none"
                          >
                            {AVAILABLE_ICONS.map((ic) => (
                              <option key={ic} value={ic}>
                                {ic}
                              </option>
                            ))}
                          </select>
                          <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-pink-400">
                            <Icon name={item.icon} size={16} />
                          </div>
                        </div>

                        {/* Rótulo do Botão */}
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const updatedItems = [...menuConfig.items];
                            updatedItems[idx].label = e.target.value;
                            const updated = { ...menuConfig, items: updatedItems };
                            setMenuConfig(updated);
                            onUpdateMenu(updated);
                          }}
                          placeholder="Nome do botão"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none w-full sm:w-auto"
                        />

                        {/* Seletor de Página Vinculada */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <span className="text-[11px] text-slate-400 font-bold shrink-0">Abre:</span>
                          <select
                            value={item.pageId}
                            onChange={(e) => {
                              const updatedItems = [...menuConfig.items];
                              updatedItems[idx].pageId = e.target.value;
                              const updated = { ...menuConfig, items: updatedItems };
                              setMenuConfig(updated);
                              onUpdateMenu(updated);
                            }}
                            className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-lg bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
                          >
                            {doc.pages.map((p) => (
                              <option key={p.id} value={p.id}>
                                📄 {p.name}
                              </option>
                            ))}
                          </select>

                          {menuConfig.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updatedItems = menuConfig.items.filter((_, i) => i !== idx);
                                const updated = { ...menuConfig, items: updatedItems };
                                setMenuConfig(updated);
                                onUpdateMenu(updated);
                              }}
                              className="w-8 h-8 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 flex items-center justify-center shrink-0 transition"
                              title="Remover botão do menu"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newId = "m-" + Date.now();
                      const fallbackPage = doc.pages[0];
                      const updatedItems: MenuItem[] = [
                        ...menuConfig.items,
                        {
                          id: newId,
                          label: `Aba ${menuConfig.items.length + 1}`,
                          icon: "Sparkles",
                          pageId: fallbackPage.id,
                        },
                      ];
                      const updated = { ...menuConfig, items: updatedItems };
                      setMenuConfig(updated);
                      onUpdateMenu(updated);
                    }}
                    className="w-full py-2.5 rounded-xl border border-dashed border-purple-500/40 hover:border-pink-400 text-purple-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition bg-purple-950/30"
                  >
                    <Icon name="Plus" size={14} />
                    <span>+ Adicionar Botão ao Menu</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-purple-900/40 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white font-extrabold text-xs shadow-md transition"
          >
            ✓ Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
