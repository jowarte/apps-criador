"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { EmojiGrid, IconGrid } from "@/components/builder/Pickers";

export interface DrawerBlockItem {
  id: string;
  type: string;
  label: string;
  iconName: string;
  bgGradient: string;
  defaultProps?: Record<string, any>;
}

// Exactly 23 blocks from the NoéPage reference screenshot
export const NOEPAGE_BLOCKS: DrawerBlockItem[] = [
  // Row 1
  {
    id: "video_phone",
    type: "video",
    label: "Vídeo Celular",
    iconName: "Smartphone",
    bgGradient: "from-fuchsia-500 to-pink-600",
    defaultProps: { format: "9/16", title: "Vídeo 9:16 Vertical", autoplay: true, muted: true, loop: true },
  },
  {
    id: "video_cinema",
    type: "video",
    label: "Vídeo Cinema",
    iconName: "Video",
    bgGradient: "from-violet-600 to-purple-700",
    defaultProps: { format: "16/9", title: "Apresentação Widescreen 16:9" },
  },
  {
    id: "html_embed",
    type: "html",
    label: "HTML / Embed",
    iconName: "Code",
    bgGradient: "from-amber-500 to-orange-600",
    defaultProps: { html: "<div class='p-6 text-center text-purple-300'>HTML Personalizado</div>" },
  },
  {
    id: "text_free",
    type: "texto",
    label: "Texto Livre",
    iconName: "Type",
    bgGradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "image_single",
    type: "imagem",
    label: "Imagem /...",
    iconName: "Image",
    bgGradient: "from-cyan-500 to-blue-600",
  },

  // Row 2
  {
    id: "gallery",
    type: "colunas",
    label: "Galeria de Fotos",
    iconName: "Images",
    bgGradient: "from-pink-500 to-rose-600",
  },
  {
    id: "hero",
    type: "capa",
    label: "Hero",
    iconName: "LayoutTemplate",
    bgGradient: "from-blue-600 to-indigo-600",
    defaultProps: { badge: "🔥 MÉTODO EXCLUSIVO", title: "Como Transformar Seu Link Na Bio Em Uma Máquina de Vendas" },
  },
  {
    id: "impact",
    type: "capa",
    label: "Impacto",
    iconName: "Sparkles",
    bgGradient: "from-rose-500 to-pink-600",
  },
  {
    id: "features",
    type: "colunas",
    label: "Recursos",
    iconName: "Layers",
    bgGradient: "from-sky-500 to-cyan-600",
  },
  {
    id: "pricing",
    type: "pagamento",
    label: "Planos",
    iconName: "ShoppingBag",
    bgGradient: "from-purple-600 to-indigo-600",
  },

  // Row 3
  {
    id: "faq",
    type: "faq",
    label: "FAQ",
    iconName: "HelpCircle",
    bgGradient: "from-indigo-500 to-violet-600",
  },
  {
    id: "cta_final",
    type: "botao",
    label: "CTA Final",
    iconName: "Zap",
    bgGradient: "from-amber-400 to-yellow-500",
    defaultProps: { label: "Quero Minha Vaga Agora", full: true },
  },
  {
    id: "testimonials",
    type: "depoimento",
    label: "Depoimentos",
    iconName: "Star",
    bgGradient: "from-amber-500 to-orange-500",
  },
  {
    id: "countdown",
    type: "contador",
    label: "Contador",
    iconName: "Clock",
    bgGradient: "from-red-500 to-rose-600",
  },
  {
    id: "form_lead",
    type: "formulario",
    label: "Formulário",
    iconName: "ClipboardList",
    bgGradient: "from-teal-400 to-cyan-500",
  },

  // Row 4
  {
    id: "whatsapp_float",
    type: "whatsapp",
    label: "WhatsApp Flutuante",
    iconName: "MessageCircle",
    bgGradient: "from-emerald-500 to-green-600",
  },
  {
    id: "columns_2",
    type: "colunas",
    label: "Colunas",
    iconName: "Columns3",
    bgGradient: "from-slate-600 to-slate-700",
  },
  {
    id: "before_after",
    type: "imagem",
    label: "Antes x Depois",
    iconName: "ArrowLeftRight",
    bgGradient: "from-rose-500 to-fuchsia-600",
  },
  {
    id: "logos",
    type: "colunas",
    label: "Logos Clientes",
    iconName: "Building2",
    bgGradient: "from-sky-400 to-blue-500",
  },
  {
    id: "numbers",
    type: "checklist",
    label: "Números",
    iconName: "TrendingUp",
    bgGradient: "from-violet-500 to-purple-600",
  },

  // Row 5
  {
    id: "steps",
    type: "checklist",
    label: "Passo a Passo",
    iconName: "ListOrdered",
    bgGradient: "from-fuchsia-500 to-pink-600",
  },
  {
    id: "comparison",
    type: "checklist",
    label: "Comparativo",
    iconName: "Table2",
    bgGradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "guarantee",
    type: "depoimento",
    label: "Garantia",
    iconName: "ShieldCheck",
    bgGradient: "from-emerald-500 to-teal-600",
  },
];

export function BlockDrawer({
  onSelectBlock,
  onClose,
}: {
  onSelectBlock: (type: string, props?: Record<string, any>) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"blocks" | "icons" | "emojis" | "gifs" | "html" | "custom">("blocks");
  const [htmlCode, setHtmlCode] = useState("");

  return (
    <div className="relative text-slate-100 select-none">
      {/* Header instructions */}
      <div className="text-center mb-4">
        <h3 className="text-sm font-extrabold text-white flex items-center justify-center gap-2">
          <span>✨</span> Clique em um bloco para adicionar à sua página
        </h3>
        <p className="text-xs text-purple-300/80 mt-1 flex items-center justify-center gap-1">
          <span>💡</span> O bloco será inserido no app. No celular, use <span className="text-purple-300 font-bold">Arrastar</span> ou as setas <span className="text-purple-300 font-bold">↑ Subir / ↓ Descer</span>
        </p>
      </div>

      {/* Categories / Tools Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-4 scrollbar-none border-b border-purple-900/30 text-xs font-bold text-slate-400">
        <button
          onClick={() => setTab("blocks")}
          className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
            tab === "blocks" ? "bg-purple-600 text-white shadow-md shadow-purple-600/40" : "bg-[#180E2F] hover:text-white"
          }`}
        >
          🌟 23 Blocos NoéPage
        </button>
        <button
          onClick={() => setTab("icons")}
          className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
            tab === "icons" ? "bg-purple-600 text-white shadow-md shadow-purple-600/40" : "bg-[#180E2F] hover:text-white"
          }`}
        >
          🎨 Ícones
        </button>
        <button
          onClick={() => setTab("emojis")}
          className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
            tab === "emojis" ? "bg-purple-600 text-white shadow-md shadow-purple-600/40" : "bg-[#180E2F] hover:text-white"
          }`}
        >
          😊 Emojis
        </button>
        <button
          onClick={() => setTab("gifs")}
          className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
            tab === "gifs" ? "bg-purple-600 text-white shadow-md shadow-purple-600/40" : "bg-[#180E2F] hover:text-white"
          }`}
        >
          🎬 GIFs
        </button>
        <button
          onClick={() => setTab("html")}
          className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
            tab === "html" ? "bg-purple-600 text-white shadow-md shadow-purple-600/40" : "bg-[#180E2F] hover:text-white"
          }`}
        >
          &lt;/&gt; Código HTML
        </button>
      </div>

      {/* TAB: 23 BLOCKS (Exact 5 columns from screenshot) */}
      {tab === "blocks" && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {NOEPAGE_BLOCKS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBlock(b.type, b.defaultProps)}
              className="flex flex-col items-center p-2.5 rounded-2xl bg-[#140A28] hover:bg-[#221042] border border-purple-900/30 hover:border-purple-400 transition-all duration-150 group text-center cursor-pointer active:scale-95 shadow-sm hover:shadow-purple-900/50"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.bgGradient} flex items-center justify-center text-white mb-2 shadow-md group-hover:scale-110 transition duration-150`}
              >
                <Icon name={b.iconName} size={22} />
              </div>
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight">
                {b.label}
              </span>
              <span className="text-[9px] text-purple-400 font-semibold opacity-0 group-hover:opacity-100 transition mt-1">
                + Adicionar
              </span>
            </button>
          ))}
        </div>
      )}

      {/* TAB: ICONS */}
      {tab === "icons" && (
        <div className="max-h-[50vh] overflow-y-auto pr-1">
          <IconGrid
            onPick={(icon) => {
              onSelectBlock("icone", { icon });
            }}
          />
        </div>
      )}

      {/* TAB: EMOJIS */}
      {tab === "emojis" && (
        <div className="max-h-[50vh] overflow-y-auto pr-1">
          <EmojiGrid
            onPick={(emoji) => {
              onSelectBlock("emoji", { emoji });
            }}
          />
        </div>
      )}

      {/* TAB: GIFS */}
      {tab === "gifs" && (
        <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-3">
          <p className="text-xs text-slate-400">Escolha um GIF animado para chamar atenção imediata:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "Sucesso", url: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif" },
              { label: "Fogo", url: "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif" },
              { label: "Uau", url: "https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif" },
            ].map((g, idx) => (
              <div
                key={idx}
                onClick={() =>
                  onSelectBlock("html", {
                    html: `<div class="text-center py-4"><img src="${g.url}" class="max-w-[280px] mx-auto rounded-2xl shadow-xl border border-purple-500/40"></div>`,
                  })
                }
                className="rounded-2xl overflow-hidden border border-purple-900/40 hover:border-pink-500 cursor-pointer group"
              >
                <img src={g.url} alt={g.label} className="w-full h-24 object-cover group-hover:scale-105 transition" />
                <p className="text-[10px] text-center py-1 bg-[#140A28] text-slate-300 font-bold">{g.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: HTML */}
      {tab === "html" && (
        <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-3">
          <p className="text-xs text-slate-400">Cole qualquer código HTML, CSS, iframe de vídeo ou Typeform:</p>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            rows={5}
            placeholder="<div style='background: #180D35; padding: 24px; border-radius: 20px; text-align: center;'><h3>Meu Bloco Personalizado</h3></div>"
            className="w-full bg-[#140A28] font-mono text-xs text-purple-200 border border-purple-900/50 rounded-xl p-3 outline-none"
          />
          <button
            onClick={() => {
              if (htmlCode.trim()) {
                onSelectBlock("html", { html: htmlCode });
              }
            }}
            className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl text-xs hover:brightness-110"
          >
            Inserir Bloco HTML
          </button>
        </div>
      )}

      {/* Floating circular close button below drawer (1:1 with Screenshot) */}
      <button
        onClick={onClose}
        className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#160D2E] border border-purple-500/60 text-white flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:scale-110 hover:border-purple-400 transition"
        title="Fechar"
      >
        <Icon name="X" size={20} />
      </button>
    </div>
  );
}
