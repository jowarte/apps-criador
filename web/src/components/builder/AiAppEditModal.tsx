"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useBuilder } from "@/lib/builder/store";
import { getActiveAiKey } from "@/lib/ai/keys";
import type { AppDocument } from "@/lib/builder/types";

interface Props {
  onClose: () => void;
  onOpenKeys: () => void;
}

const QUICK_PROMPTS = [
  "Adicionar uma nova página 'Receitas Práticas' com 3 receitas passo a passo e checklist de ingredientes",
  "Transformar o app num Desafio de 14 Dias com contadores, checklists diários e botões de avanço",
  "Trocar a paleta de cores para Dark Premium com botões degradê esmeralda e fontes modernas",
  "Adicionar seção completa de Prova Social com 4 depoimentos reais em estrelas e bloco de FAQ",
];

export function AiAppEditModal({ onClose, onOpenKeys }: Props) {
  const { doc, loadDoc } = useBuilder();
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
      const activeKey = getActiveAiKey();

      const res = await fetch("/api/ai/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: "app",
          prompt,
          current: doc,
          apiKey: activeKey?.apiKey,
          provider: activeKey?.provider,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Falha ao processar com IA.");
      }

      const updated = (data.data || data.result) as AppDocument;
      loadDoc(updated);
      setSuccess("Mini App atualizado com sucesso pela IA! Verifique as páginas e blocos.");
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Icon name="Sparkles" size={20} className="text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-pink-400">
                Inteligência Artificial Generativa
              </span>
              <h2 className="text-lg font-black text-white">
                Modificar Mini App com Prompt IA
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

        {/* Info */}
        <p className="text-xs text-purple-200/80 leading-relaxed">
          Digite qualquer alteração que desejar: criar ou remover páginas, adicionar receitas, aulas, quizzes, checklists, trocar cores e temas, ou reescrever textos do aplicativo.
        </p>

        {/* Sugestões rápidas */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-purple-300">
            Sugestões Rápidas (clique para preencher):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(qp)}
                className="text-[11px] bg-purple-950/60 hover:bg-purple-900/70 border border-purple-800/40 hover:border-purple-600/60 text-purple-200 px-2.5 py-1.5 rounded-xl transition text-left"
              >
                💡 {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea do Prompt */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white flex items-center justify-between">
            <span>O que a IA deve modificar no App?</span>
            <button
              type="button"
              onClick={onOpenKeys}
              className="text-[11px] text-pink-400 hover:text-pink-300 font-normal underline"
            >
              🔑 Configurar Chaves de IA (BYOK)
            </button>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="Exemplo: Crie uma página chamada 'Guia de Shots Matinais' com 4 receitas de sucos desintoxicantes, tabela com benefícios e checklist de compras..."
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
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-pink-500 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-pink-600/30 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Modificando App com IA...</span>
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={14} />
                <span>Aplicar Modificação com IA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
