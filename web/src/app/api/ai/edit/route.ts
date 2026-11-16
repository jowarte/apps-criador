import { NextResponse } from "next/server";

type Provider = "gemini" | "openai" | "groq" | "anthropic";

const ENV_KEYS: Record<Provider, string | undefined> = {
  gemini: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  openai: process.env.OPENAI_API_KEY,
  groq: process.env.GROQ_API_KEY,
  anthropic: process.env.ANTHROPIC_API_KEY,
};

const MODELS: Record<Provider, string> = {
  gemini: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  openai: process.env.OPENAI_MODEL || "gpt-4o-mini",
  groq: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  anthropic: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
};

function extractJson(text: string): unknown {
  const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(clean.slice(start, end + 1));
    throw new Error("A IA não retornou um JSON válido. Tente reformular o pedido.");
  }
}

async function callAI(provider: Provider, apiKey: string, system: string, user: string): Promise<string> {
  if (provider === "gemini") {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
        }),
      }
    );
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error?.message || `Gemini erro ${r.status}`);
    return j?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";
  }

  if (provider === "anthropic") {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODELS.anthropic, max_tokens: 8000, system, messages: [{ role: "user", content: user }] }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error?.message || `Anthropic erro ${r.status}`);
    return j?.content?.map((c: { text?: string }) => c.text || "").join("") || "";
  }

  // OpenAI e Groq (API compatível)
  const base = provider === "groq" ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1";
  const r = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODELS[provider],
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error?.message || `${provider} erro ${r.status}`);
  return j?.choices?.[0]?.message?.content || "";
}

const SALES_SYSTEM = `Você é um copywriter especialista em páginas de vendas de alta conversão para infoprodutos no Brasil.
Você recebe o JSON de uma página de vendas e uma instrução do usuário.
Aplique a instrução e devolva SOMENTE o JSON completo e válido, com exatamente a mesma estrutura de campos.
Regras:
- Escreva em português do Brasil, persuasivo e claro.
- NÃO altere os campos "slug", "appSlug", "pixelId", "coverImage" nem os "checkoutUrl" dos planos, a menos que o usuário peça explicitamente.
- "price" e "originalPrice" são textos como "97,00".
- "themeColor" é uma cor hexadecimal (#RRGGBB).
- "features[].icon" é um emoji.`;

function appSystem(blockCatalog: string) {
  return `Você é um designer de Mini Apps (PWA) para infoprodutores.
Você recebe o JSON de um app com "name", "theme" e "pages" (cada página tem "id", "name" e "blocks").
Aplique a instrução do usuário e devolva SOMENTE um JSON válido no formato:
{"name": string, "theme": {"brand": "#hex"}, "pages": [{"id": string, "name": string, "blocks": [{"type": string, "props": object}]}]}
Use APENAS os tipos de bloco e campos deste catálogo:
${blockCatalog}
Regras:
- Português do Brasil.
- Mantenha os ids das páginas existentes quando continuarem existindo.
- Campos "list" são arrays de strings. Campos de FAQ/itens complexos seguem o formato do exemplo atual.
- Não invente URLs de imagens; mantenha as existentes ou deixe vazio.`;
}

export async function GET(req: Request) {
  void req;
  const configured = (Object.keys(ENV_KEYS) as Provider[]).filter((p) => !!ENV_KEYS[p]);
  return NextResponse.json({ configured });
}

export async function POST(req: Request) {
  let body: {
    target: "sales" | "app";
    prompt: string;
    current: unknown;
    provider?: Provider;
    apiKey?: string;
    customKey?: string;
    customProvider?: Provider;
    blockCatalog?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  if (!body.prompt?.trim()) {
    return NextResponse.json({ ok: false, error: "Escreva o que a IA deve modificar." }, { status: 400 });
  }

  const rawKey = (body.apiKey || body.customKey)?.trim();
  const rawProvider = body.provider || body.customProvider;

  // Escolhe provedor: chave enviada pelo usuário (BYOK) > chave do servidor
  const order: Provider[] = ["gemini", "openai", "groq", "anthropic"];
  let provider: Provider | undefined = rawKey ? rawProvider || "gemini" : undefined;
  let apiKey = rawKey;
  if (!apiKey) {
    provider = (rawProvider && ENV_KEYS[rawProvider] ? rawProvider : order.find((p) => ENV_KEYS[p])) as Provider | undefined;
    apiKey = provider ? ENV_KEYS[provider] : undefined;
  }
  if (!provider || !apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Nenhuma chave de IA configurada. Cole sua chave (Gemini, OpenAI, Groq ou Anthropic) no menu de Chaves de IA ou passe como variável de ambiente no Dokploy.",
      },
      { status: 400 }
    );
  }

  const system = body.target === "app" ? appSystem(body.blockCatalog || "") : SALES_SYSTEM;
  const user = `JSON ATUAL:\n${JSON.stringify(body.current)}\n\nINSTRUÇÃO DO USUÁRIO:\n${body.prompt}`;

  try {
    const text = await callAI(provider, apiKey, system, user);
    const result = extractJson(text);
    return NextResponse.json({ ok: true, result, data: result, provider });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Falha ao chamar a IA" },
      { status: 502 }
    );
  }
}
