"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useBuilder } from "@/lib/builder/store";

export function HtmlConverterModal({ onClose }: { onClose: () => void }) {
  const { applyTemplate, setName } = useBuilder();
  const [tab, setTab] = useState<"zip" | "paste">("paste");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [appName, setAppName] = useState("Meu App Convertido");
  const [status, setStatus] = useState<"idle" | "converting" | "done">("idle");
  const [extractedSummary, setExtractedSummary] = useState<{
    titles: number;
    buttons: number;
    images: number;
    sections: number;
  } | null>(null);

  const handleConvert = () => {
    setStatus("converting");
    setTimeout(() => {
      // Simulate intelligent block extraction
      const summary = {
        titles: 2,
        buttons: 3,
        images: 4,
        sections: 5,
      };
      setExtractedSummary(summary);
      setStatus("done");
    }, 1400);
  };

  const handleApplyToEditor = () => {
    setName(appName);
    applyTemplate({
      name: appName,
      brand: "#7C3AED",
      blocks: [
        {
          id: "conv-1",
          type: "capa",
          props: {
            badge: "PÁGINA CONVERTIDA",
            title: appName,
            subtitle: "Esta página de vendas foi convertida e otimizada automaticamente para celular e PWA.",
            ctaLabel: "Comprar Agora",
          },
        },
        {
          id: "conv-2",
          type: "video",
          props: {
            format: "9/16",
            title: "Vídeo Extraído da Página",
            autoplay: true,
          },
        },
        {
          id: "conv-3",
          type: "colunas",
          props: {
            title: "Benefícios Identificados",
          },
        },
        {
          id: "conv-4",
          type: "pagamento",
          props: {
            title: "Garantir Vaga com Desconto",
          },
        },
        {
          id: "conv-5",
          type: "depoimento",
          props: {
            quote: "Página convertida com sucesso para Progressive Web App!",
          },
        },
      ],
    });
    alert("✓ App convertido carregado no Construtor!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center text-sm font-black shadow-sm">
              &lt;/&gt;
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Conversor de Páginas (HTML / ZIP para PWA)
              </h2>
              <p className="text-xs text-slate-500">
                Transforme qualquer página de vendas existente em um Mini App PWA instalável com 1 clique.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center">
            ✕
          </button>
        </div>

        {/* Tab switch: Paste vs ZIP */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setTab("paste")}
            className={`px-3.5 py-1.5 rounded-full transition ${
              tab === "paste" ? "bg-violet-600 text-white shadow-xs" : "bg-slate-100 text-slate-600"
            }`}
          >
            Colar Código HTML / CSS
          </button>
          <button
            onClick={() => setTab("zip")}
            className={`px-3.5 py-1.5 rounded-full transition ${
              tab === "zip" ? "bg-violet-600 text-white shadow-xs" : "bg-slate-100 text-slate-600"
            }`}
          >
            Upload de Arquivo ZIP
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nome do Mini App Convertido</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 outline-none focus:border-violet-500"
            />
          </div>

          {tab === "paste" ? (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Código HTML da Página de Vendas</label>
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="<section class='hero'><h1>Transforme seu produto...</h1><button>Comprar</button></section>"
                  rows={5}
                  className="w-full bg-slate-50 font-mono text-[11px] border border-slate-200 rounded-xl p-3 outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Código CSS Opcional</label>
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  placeholder=".hero { background: #7C3AED; color: white; }"
                  rows={2}
                  className="w-full bg-slate-50 font-mono text-[11px] border border-slate-200 rounded-xl p-3 outline-none focus:border-violet-500"
                />
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2 bg-slate-50">
              <span className="text-3xl">📦</span>
              <p className="font-bold text-slate-800">Arraste seu arquivo ZIP aqui</p>
              <p className="text-slate-400 text-[11px]">Contendo index.html, imagens e css</p>
              <input type="file" accept=".zip,.html" className="mt-2 text-xs" />
            </div>
          )}

          {status === "converting" && (
            <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin shrink-0"></span>
              <div>
                <p className="font-bold text-violet-900">Analisando HTML e extraindo componentes PWA...</p>
                <p className="text-violet-600 text-[11px]">Detectando títulos, CTAs, vídeos e formulários.</p>
              </div>
            </div>
          )}

          {status === "done" && extractedSummary && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 animate-in fade-in">
              <p className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                <span>✓</span> Conversão concluída com sucesso!
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-slate-700 font-bold text-[11px]">
                <div className="bg-white p-2 rounded-xl shadow-2xs">
                  <span className="text-violet-600 font-black text-sm block">{extractedSummary.titles}</span>
                  <span>Títulos Hero</span>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-2xs">
                  <span className="text-violet-600 font-black text-sm block">{extractedSummary.buttons}</span>
                  <span>Botões CTA</span>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-2xs">
                  <span className="text-violet-600 font-black text-sm block">{extractedSummary.images}</span>
                  <span>Imagens</span>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-2xs">
                  <span className="text-violet-600 font-black text-sm block">{extractedSummary.sections}</span>
                  <span>Seções PWA</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">Gera manifesto PWA e Service Worker isolado.</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
              Cancelar
            </button>
            {status !== "done" ? (
              <button
                onClick={handleConvert}
                disabled={status === "converting"}
                className="px-6 py-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs shadow-md"
              >
                {status === "converting" ? "Convertendo..." : "Iniciar Conversão"}
              </button>
            ) : (
              <button
                onClick={handleApplyToEditor}
                className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md"
              >
                Abrir no Construtor PWA →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
