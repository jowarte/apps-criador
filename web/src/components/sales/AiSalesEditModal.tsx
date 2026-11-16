"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { SalesPageData } from "@/lib/sales/types";

interface Props {
  appSlug: string;
  appName: string;
  salesSlug: string;
  onClose: () => void;
  onUpdated: (updated: SalesPageData) => void;
}

const SALES_PROMPTS = [
  "Criar oferta irresistível com 50% de desconto e garantia blindada de 30 dias",
  "Adaptar a copy, headline e depoimentos para mães que querem emagrecer rápido no pós-parto",
  "Adicionar 4 perguntas frequentes sobre como funciona o PWA e suporte no WhatsApp",
  "Enfatizar bônus exclusivos: Cardápios em PDF, Tabela de Alimentos e Grupo VIP",
];

export function AiSalesEditModal({
  appSlug,
  appName,
  salesSlug,
  onClose,
  onUpdated,
}: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Buscar a página de vendas atual
      const currentRes = await fetch(`/api/sales/${salesSlug}`);
      if (!currentRes.ok) {
        throw new Error("Não foi possível carregar a página de vendas atual.");
      }
      const currentData = await currentRes.json();

      // 2. Chaves de IA se houver
      let customKey = "";
      let customProvider = "";
      try {
        const stored = localStorage.getItem("mini_apps_ai_keys");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.openai) {
            customKey = parsed.openai;
            customProvider = "openai";
          } else if (parsed.gemini) {
            customKey = parsed.gemini;
            customProvider = "gemini";
          } else if (parsed.groq) {
            customKey = parsed.groq;
            customProvider = "groq";
          } else if (parsed.anthropic) {
            customKey = parsed.anthropic;
            customProvider = "anthropic";
          }
        }
      } catch {}

      // 3. Enviar prompt para API de IA
      const aiRes = await fetch("/api/ai/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: "sales",
          prompt,
          current: currentData,
          customKey: customKey || undefined,
          customProvider: customProvider || undefined,
        }),
      });

      const aiResult = await aiRes.json();
      if (!aiRes.ok || !aiResult.ok) {
        throw new Error(aiResult.error || "Falha ao gerar alterações com IA.");
      }

      const updatedPage: SalesPageData = aiResult.data;

      // 4. Salvar na API de vendas para persistir
      const saveRes = await fetch(`/api/sales/${salesSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPage),
      });

      if (!saveRes.ok) {
        throw new Error("Falha ao salvar a página modificada no banco.");
      }

      const savedData = await saveRes.json();
      onUpdated(savedData);
      setSuccess("Página de Vendas modificada e publicada com sucesso!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0F0824] border border-purple-500/40 rounded-3xl p-6 sm:p-7 max-w-2xl w-full text-white shadow-2xl shadow-purple-950/80 animate-in zoom-in-95 duration-150 flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-purple-900/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-600/30">
              <Icon name="Sparkles" size={20} className="text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-pink-400">
                Página de Vendas & Copywriting
              </span>
              <h2 className="text-lg font-black text-white">
                Modificar Página de Vendas com IA
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Info do App */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-950/50 border border-purple-800/40 text-xs">
          <div>
            <span className="text-purple-300">App vinculado: </span>
            <strong className="text-white font-bold">{appName}</strong>
          </div>
          <span className="font-mono text-pink-400 bg-black/40 px-2 py-0.5 rounded border border-pink-500/30">
            /p/{salesSlug}
          </span>
        </div>

        {/* Sugestões rápidas */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-purple-300">
            Sugestões Rápidas de Prompt (clique para aplicar):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SALES_PROMPTS.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(sp)}
                className="text-[11px] bg-purple-950/60 hover:bg-purple-900/70 border border-purple-800/40 hover:border-purple-600/60 text-purple-200 px-2.5 py-1.5 rounded-xl transition text-left"
              >
                💡 {sp}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea do Prompt */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white">
            O que você deseja alterar nesta página de vendas?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="Exemplo: Altere a headline para 'Perca até 6kg em 21 dias com comida de verdade', coloque o preço promocional para R$ 47,00 e adicione um FAQ explicando que o acesso é imediato no celular..."
            rows={4}
            className="w-full bg-[#170E2F] border border-purple-700/50 rounded-2xl p-3.5 text-xs text-white placeholder-purple-300/40 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition leading-relaxed resize-none"
          />
        </div>

        {/* Feedback visual */}
        {error && (
          <div className="p-3 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <Icon name="AlertCircle" size={16} className="shrink-0 text-red-400" />
            <span className="leading-tight">{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <Icon name="Check" size={16} className="shrink-0 text-emerald-400" />
            <span className="leading-tight">{success}</span>
          </div>
        )}

        {/* Botões */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-900/40">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-purple-200 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-pink-600/30 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Reescrevendo Página com IA...</span>
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={14} />
                <span>Aplicar Mudanças na Página</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
