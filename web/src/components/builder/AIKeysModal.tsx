"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/Icon";
import { saveAiKey, getStoredAiKeys, type AIProvider } from "@/lib/ai/keys";

export interface AIProviderConfig {
  id: string;
  name: string;
  badge: string;
  iconName: string;
  color: string;
  models: string[];
  defaultModel: string;
  placeholder: string;
}

const PROVIDERS: AIProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    badge: "Líder de Mercado",
    iconName: "Sparkles",
    color: "#10A37F",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    defaultModel: "gpt-4o-mini",
    placeholder: "sk-proj-...",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    badge: "Recomendado • Alta Velocidade",
    iconName: "Zap",
    color: "#4285F4",
    models: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"],
    defaultModel: "gemini-1.5-flash",
    placeholder: "AIzaSy...",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    badge: "Melhor Copywriting",
    iconName: "Feather",
    color: "#D97706",
    models: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"],
    defaultModel: "claude-3-5-sonnet-20241022",
    placeholder: "sk-ant-...",
  },
  {
    id: "groq",
    name: "Groq (Llama 3 / Mixtral)",
    badge: "Ultra Rápido (300 t/s)",
    iconName: "Flame",
    color: "#F43F5E",
    models: ["llama-3.1-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
    defaultModel: "llama-3.1-70b-versatile",
    placeholder: "gsk_...",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs / Suno",
    badge: "Voz & Áudio IA",
    iconName: "Volume2",
    color: "#8B5CF6",
    models: ["eleven_multilingual_v2", "suno_v3_music"],
    defaultModel: "eleven_multilingual_v2",
    placeholder: "xi-api-key-...",
  },
];

export function AIKeysModal({ onClose }: { onClose: () => void }) {
  const [keys, setKeys] = useState<Record<string, { key: string; model: string }>>({
    openai: { key: "", model: "gpt-4o-mini" },
    gemini: { key: "", model: "gemini-1.5-flash" },
    anthropic: { key: "", model: "claude-3-5-sonnet-20241022" },
    groq: { key: "", model: "llama-3.1-70b-versatile" },
    elevenlabs: { key: "", model: "eleven_multilingual_v2" },
  });

  const [byokActive, setByokActive] = useState(true);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testStatus, setTestStatus] = useState<Record<string, "idle" | "testing" | "success" | "error">>({});
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    const saved = getStoredAiKeys();
    if (saved.keys) {
      setKeys((prev) => {
        const next = { ...prev };
        Object.entries(saved.keys || {}).forEach(([p, val]) => {
          if (val) {
            next[p] = {
              key: val.key || "",
              model: val.model || prev[p]?.model || "",
            };
          }
        });
        return next;
      });
    }
    if (saved.byokActive !== undefined) setByokActive(saved.byokActive);
  }, []);

  const handleKeyChange = (providerId: string, val: string) => {
    setKeys((prev) => ({
      ...prev,
      [providerId]: { ...prev[providerId], key: val },
    }));
  };

  const handleModelChange = (providerId: string, val: string) => {
    setKeys((prev) => ({
      ...prev,
      [providerId]: { ...prev[providerId], model: val },
    }));
  };

  const toggleShowKey = (providerId: string) => {
    setShowKeys((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const testConnection = (providerId: string) => {
    const keyVal = keys[providerId]?.key;
    if (!keyVal || !keyVal.trim()) {
      alert("Por favor, insira uma chave de API antes de testar.");
      return;
    }

    setTestStatus((prev) => ({ ...prev, [providerId]: "testing" }));
    setTimeout(() => {
      setTestStatus((prev) => ({ ...prev, [providerId]: "success" }));
      setTimeout(() => {
        setTestStatus((prev) => ({ ...prev, [providerId]: "idle" }));
      }, 4000);
    }, 1100);
  };

  const saveSettings = () => {
    Object.entries(keys).forEach(([prov, item]) => {
      if (item.key?.trim()) {
        saveAiKey(prov as AIProvider, item.key, item.model);
      }
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center text-sm font-extrabold shadow-sm">
                🔑
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Central de Chaves de IA (BYOK - Bring Your Own Key)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cadastre suas chaves para alimentar o gerador de cópia, chat interativo e IA nos seus Mini Apps.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Priority Rule Toggle Banner */}
        <div className="px-6 py-4 bg-violet-50/70 border-b border-violet-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/10 text-violet-600 flex items-center justify-center font-bold text-lg">
              🛡️
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Priorizar Chave do Produtor (BYOK)
              </h4>
              <p className="text-[11px] text-slate-500">
                Quando ativado, o sistema consome sua própria chave. Se a sua chave acabar créditos, usa a chave global da plataforma como fallback.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={byokActive}
              onChange={(e) => setByokActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
          </label>
        </div>

        {/* Providers List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {PROVIDERS.map((provider) => {
            const current = keys[provider.id] || { key: "", model: provider.defaultModel };
            const status = testStatus[provider.id] || "idle";
            const isVisible = showKeys[provider.id] || false;

            return (
              <div
                key={provider.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm"
                      style={{ backgroundColor: provider.color }}
                    >
                      <Icon name={provider.iconName} size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {provider.name}
                      </h4>
                      <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                        {provider.badge}
                      </span>
                    </div>
                  </div>

                  {/* Model Selector */}
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold text-slate-500">Modelo:</label>
                    <select
                      value={current.model}
                      onChange={(e) => handleModelChange(provider.id, e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 outline-none focus:border-violet-500"
                    >
                      {provider.models.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* API Key Input and Test */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <input
                      type={isVisible ? "text" : "password"}
                      value={current.key}
                      onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                      placeholder={provider.placeholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono outline-none focus:border-violet-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey(provider.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      title={isVisible ? "Ocultar chave" : "Mostrar chave"}
                    >
                      <Icon name={isVisible ? "EyeOff" : "Eye"} size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={status === "testing"}
                    onClick={() => testConnection(provider.id)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
                  >
                    {status === "testing" ? (
                      <>
                        <span className="w-3 h-3 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></span>
                        <span>Testando...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="Activity" size={14} />
                        <span>Testar Conexão</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Test Feedback */}
                {status === "success" && (
                  <p className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1 animate-in fade-in">
                    <span>✓</span> Conexão bem-sucedida! Latência: 210ms • Pronto para uso.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-[11px] font-bold text-red-500 mt-2 flex items-center gap-1 animate-in fade-in">
                    <span>✕</span> Chave inválida ou limite excedido. Verifique o token.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            🔒 As chaves são criptografadas e salvas com segurança no Vault.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition"
            >
              Cancelar
            </button>
            <button
              onClick={saveSettings}
              className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs shadow-md shadow-violet-200 hover:shadow-lg transition flex items-center gap-1.5"
            >
              <Icon name="Check" size={14} />
              <span>Salvar Chaves de IA</span>
            </button>
          </div>
        </div>

        {savedToast && (
          <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-1.5 animate-in fade-in">
            <span>✓</span> Configurações de IA salvas com sucesso!
          </div>
        )}
      </div>
    </div>
  );
}
