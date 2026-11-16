"use client";

import { Suspense, use, useState, useEffect } from "react";
import { BlockView, themeVars } from "@/components/blocks/BlockView";
import { DEFAULT_THEME, TEMPLATES } from "@/lib/builder/templates";
import { Icon } from "@/components/Icon";
import type { AppDocument, MenuConfig } from "@/lib/builder/types";

function PwaContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const template = TEMPLATES.find((t) => t.id === slug) || TEMPLATES[0];

  const [doc, setDoc] = useState<AppDocument | null>(null);
  const [activePageId, setActivePageId] = useState<string>("p1");

  useEffect(() => {
    let cancelled = false;

    async function loadApp() {
      // 1. Tenta carregar do servidor/banco via API
      try {
        const res = await fetch(`/api/apps/${encodeURIComponent(slug)}`, { cache: "no-store" });
        if (res.ok) {
          const remoteDoc: AppDocument = await res.json();
          if (!cancelled && remoteDoc && remoteDoc.pages?.length) {
            setDoc(remoteDoc);
            setActivePageId(remoteDoc.pages[0].id);
            return;
          }
        }
      } catch {}

      // 2. Se for o próprio criador no mesmo navegador, tenta o rascunho local
      try {
        const saved = localStorage.getItem("mineapps-builder-v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.state?.doc && (!parsed.state.doc.slug || parsed.state.doc.slug === slug)) {
            if (!cancelled) {
              setDoc(parsed.state.doc);
              setActivePageId(parsed.state.doc.pages[0]?.id || "p1");
              return;
            }
          }
        }
      } catch {}

      // 3. Fallback inteligente para o template correspondente
      if (!cancelled) {
        const initialPages = [
          { id: "p1", name: "Início", blocks: template.blocks() },
        ];
        setDoc({
          schemaVersion: 1,
          name: template.name,
          slug: slug,
          theme: { ...DEFAULT_THEME, brand: template.brand },
          pages: initialPages,
          menu: {
            enabled: true,
            style: "bottom_bar",
            items: [{ id: "m1", label: "Início", icon: "Home", pageId: "p1" }],
          },
          updatedAt: new Date().toISOString(),
        });
      }
    }

    loadApp();
    return () => {
      cancelled = true;
    };
  }, [slug, template]);

  if (!doc) {
    return <div className="p-8 text-center text-sm text-slate-400">Carregando Mini App...</div>;
  }

  const theme = doc.theme || { ...DEFAULT_THEME, brand: template.brand };
  const currentPage = doc.pages.find((p) => p.id === activePageId) || doc.pages[0];
  const menu: MenuConfig = doc.menu || { enabled: false, style: "bottom_bar", items: [] };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between items-center relative pb-20"
      style={themeVars(theme)}
    >
      <main className="w-full max-w-xl px-4 py-6 sm:py-8 space-y-4">
        {currentPage.blocks.map((block) => (
          <BlockView
            key={block.id}
            block={block}
            theme={theme}
            editing={false}
          />
        ))}
      </main>

      {/* Menu Inferior Fixo de Navegação do PWA */}
      {menu.enabled && menu.items.length > 1 && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-slate-950/95 backdrop-blur-md border-t border-white/10 px-3 py-2 flex items-center justify-around z-50 shadow-2xl">
          {menu.items.map((item) => {
            const isActive = item.pageId === currentPage.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePageId(item.pageId)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition text-[10px] font-bold ${
                  isActive ? "text-pink-400 bg-pink-500/10 font-extrabold" : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span className="truncate max-w-[70px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      <footer className="w-full py-6 text-center text-xs opacity-50">
        Feito com MineApps • PWA Interativo
      </footer>
    </div>
  );
}

export default function PwaAppPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Carregando Mini App...</div>}>
      <PwaContent params={params} />
    </Suspense>
  );
}
