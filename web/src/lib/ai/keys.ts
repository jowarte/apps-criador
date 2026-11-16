"use client";

export type AIProvider = "gemini" | "openai" | "groq" | "anthropic";

export interface StoredKeysPayload {
  keys?: Record<string, { key: string; model?: string }>;
  byokActive?: boolean;
  updatedAt?: string;
  // Fallbacks planos caso salvo em formato simples
  gemini?: string;
  openai?: string;
  groq?: string;
  anthropic?: string;
}

const STORAGE_KEYS = ["mineapps_ai_keys", "mini_apps_ai_keys"];

export function getStoredAiKeys(): StoredKeysPayload {
  if (typeof window === "undefined") return {};
  for (const k of STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(k);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
  }
  return {};
}

/**
 * Retorna a melhor chave de IA ativa configurada pelo produtor (BYOK)
 */
export function getActiveAiKey(): {
  provider: AIProvider;
  apiKey: string;
  model?: string;
} | null {
  const data = getStoredAiKeys();
  const order: AIProvider[] = ["gemini", "openai", "groq", "anthropic"];

  for (const prov of order) {
    // Formato aninhado: { keys: { gemini: { key: "..." } } }
    const nested = data.keys?.[prov]?.key?.trim();
    if (nested) {
      return {
        provider: prov,
        apiKey: nested,
        model: data.keys?.[prov]?.model,
      };
    }

    // Formato plano: { gemini: "..." }
    const flat = (data as Record<string, string | undefined>)[prov]?.trim();
    if (flat) {
      return {
        provider: prov,
        apiKey: flat,
      };
    }
  }

  return null;
}

/**
 * Salva a chave em todos os locais do localStorage para compatibilidade universal
 */
export function saveAiKey(provider: AIProvider, key: string, model?: string) {
  if (typeof window === "undefined") return;
  const current = getStoredAiKeys();
  const keys = current.keys || {};
  keys[provider] = { key: key.trim(), model: model || "" };

  const payload = {
    ...current,
    keys,
    [provider]: key.trim(),
    byokActive: true,
    updatedAt: new Date().toISOString(),
  };

  for (const k of STORAGE_KEYS) {
    try {
      localStorage.setItem(k, JSON.stringify(payload));
    } catch {}
  }
}
