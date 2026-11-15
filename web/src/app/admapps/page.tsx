"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export interface UserItem {
  id: number;
  name: string;
  email: string;
  plan: string;
  apps: number;
  status: "Ativo" | "Trial" | "Vencido" | "Bloqueado";
  joined: string;
  revenue: string;
  initials: string;
}

export interface PlanItem {
  id: string;
  name: string;
  price: string;
  apps: string;
  trial: string;
  desc: string;
  features: string[];
  active: boolean;
  upgrade: boolean;
}

// Plano de Venda de um App (Produtor -> Cliente Final)
export interface AppPlanItem {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  period: "pagamento único" | "por mês" | "por ano";
  appSlug: string; // VINCULADO À PÁGINA DE VENDAS ESPECÍFICA!
  appName: string;
  features: string[];
  checkoutUrl: string;
  popular?: boolean;
  active: boolean;
}

// Compradores dos Apps (CRM do Produtor)
export interface BuyerCustomerItem {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  appSlug: string; // QUAL APP ESTÁ USANDO!
  appName: string;
  planName: string;
  amount: string;
  gateway: "Kiwify" | "Hotmart" | "Eduzz" | "Stripe" | "Cakto" | "Mercado Pago";
  purchaseDate: string;
  status: "Liberado" | "Pendente" | "Revogado";
  pwaLink: string;
}

export interface AppItem {
  id: number;
  name: string;
  producer: string;
  login: string;
  sales: string;
  domain: string;
  slug: string;
  status: "Publicado" | "Rascunho" | "Manutenção";
  available: boolean;
  themeColor: string;
  shortName: string;
  facebookPixelId?: string;
  facebookCapiToken?: string;
  plansCount: number;
  buyersCount: number;
}

export interface InvoiceItem {
  id: string;
  user: string;
  plan: string;
  value: string;
  due: string;
  status: "Pago" | "Pendente" | "Vencido";
}

export interface AdItem {
  id: string;
  title: string;
  type: "Vídeo em formato de celular (9:16)" | "Banner" | "Popup";
  status: boolean;
  reach: string;
  ctaText?: string;
  ctaUrl?: string;
  delaySec?: number;
}

export interface WebhookItem {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
}

export interface TemplateItem {
  id: number;
  name: string;
  category: string;
  author: string;
  installs: number;
  type: string;
  icon: string;
  color: string;
  description: string;
}

export interface AIKeyItem {
  id: string;
  provider: string;
  model: string;
  keyMasked: string;
  status: "connected" | "disconnected";
  speed: string;
}

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "apps" | "vendas" | "planos" | "usuarios" | "templates" | "anuncios" | "faturas" | "webhooks" | "ia" | "config"
  >("dashboard");

  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2800);
  };

  // 1. CRM Users (Produtores cadastrados)
  const [users, setUsers] = useState<UserItem[]>([
    { id: 1, name: "Camila Duarte", email: "camila@metodofoco.com.br", plan: "Premium", apps: 12, status: "Ativo", joined: "12 Jan 2026", revenue: "R$ 4.280", initials: "CD" },
    { id: 2, name: "Rafael Almeida", email: "rafael@guialowcarb.com", plan: "Pro", apps: 7, status: "Ativo", joined: "28 Jan 2026", revenue: "R$ 2.140", initials: "RA" },
    { id: 3, name: "Beatriz Souza", email: "bia@inglesfluente.com", plan: "Pro", apps: 5, status: "Trial", joined: "03 Fev 2026", revenue: "R$ 1.890", initials: "BS" },
    { id: 4, name: "Lucas Ferreira", email: "lucas@treinocasa.com", plan: "Free", apps: 1, status: "Ativo", joined: "10 Fev 2026", revenue: "R$ 0", initials: "LF" },
    { id: 5, name: "Mariana Costa", email: "mari@rendaextra.com", plan: "Premium", apps: 18, status: "Bloqueado", joined: "19 Jan 2026", revenue: "R$ 6.540", initials: "MC" },
    { id: 6, name: "Pedro Martins", email: "pedro@copyviva.com", plan: "Free", apps: 2, status: "Vencido", joined: "15 Fev 2026", revenue: "R$ 0", initials: "PM" },
  ]);
  const [userFilter, setUserFilter] = useState("Todos");
  const [userSearch, setUserSearch] = useState("");

  // 2. Apps & PWAs com Páginas de Vendas, Pixels e Links
  const [apps, setApps] = useState<AppItem[]>([
    {
      id: 1,
      name: "Guia Low Carb para Iniciantes",
      slug: "guia-lowcarb",
      producer: "Rafael Almeida",
      login: "/auth/guia-lowcarb/login",
      sales: "/p/guia-lowcarb",
      domain: "guialowcarb.com",
      status: "Publicado",
      available: true,
      themeColor: "#7C3AED",
      shortName: "LowCarb",
      facebookPixelId: "9482910394812",
      facebookCapiToken: "EAAB••••••••49",
      plansCount: 2,
      buyersCount: 1420,
    },
    {
      id: 2,
      name: "Método Foco e Rotina Produtiva",
      slug: "metodo-foco",
      producer: "Camila Duarte",
      login: "/auth/metodo-foco/login",
      sales: "/p/metodo-foco",
      domain: "metodofoco.com.br",
      status: "Publicado",
      available: true,
      themeColor: "#EC4899",
      shortName: "Foco",
      facebookPixelId: "1283948291039",
      facebookCapiToken: "EAAC••••••••91",
      plansCount: 1,
      buyersCount: 890,
    },
    {
      id: 3,
      name: "Treino em Casa 15 Minutos",
      slug: "treino-casa",
      producer: "Lucas Ferreira",
      login: "/auth/treino-casa/login",
      sales: "/p/treino-casa",
      domain: "treinocasa.app",
      status: "Publicado",
      available: true,
      themeColor: "#22C55E",
      shortName: "Treino15",
      facebookPixelId: "4829104829102",
      plansCount: 1,
      buyersCount: 430,
    },
    {
      id: 4,
      name: "Inglês Fluente do Zero",
      slug: "ingles-zero",
      producer: "Beatriz Souza",
      login: "/auth/ingles-zero/login",
      sales: "/p/ingles-zero",
      domain: "inglesfluente.com",
      status: "Manutenção",
      available: false,
      themeColor: "#3B82F6",
      shortName: "InglesZero",
      facebookPixelId: "",
      plansCount: 1,
      buyersCount: 215,
    },
  ]);

  // Modal de Pixel do Facebook para App
  const [pixelModalApp, setPixelModalApp] = useState<AppItem | null>(null);
  const [pixelInputId, setPixelInputId] = useState("");
  const [pixelInputToken, setPixelInputToken] = useState("");

  // 3. Planos de Venda dos Apps (Produtor -> Cliente Final)
  const [appPlans, setAppPlans] = useState<AppPlanItem[]>([
    {
      id: "plan-lowcarb-vit",
      name: "Acesso Vitalício + Bônus de Receitas",
      price: "R$ 97,00",
      originalPrice: "R$ 197,00",
      period: "pagamento único",
      appSlug: "guia-lowcarb",
      appName: "Guia Low Carb para Iniciantes",
      features: ["Acesso Vitalício ao PWA", "Calculadora de macros", "Grupo VIP no WhatsApp", "Garantia 7 dias"],
      checkoutUrl: "https://pay.kiwify.com.br/demo-lowcarb-vit",
      popular: true,
      active: true,
    },
    {
      id: "plan-lowcarb-mensal",
      name: "Assinatura Mensal Cardápio",
      price: "R$ 29,90",
      originalPrice: "R$ 49,90",
      period: "por mês",
      appSlug: "guia-lowcarb",
      appName: "Guia Low Carb para Iniciantes",
      features: ["Acesso por 30 dias", "Cardápio semanal atualizado", "Checklist de refeições", "Cancele quando quiser"],
      checkoutUrl: "https://pay.kiwify.com.br/demo-lowcarb-mensal",
      popular: false,
      active: true,
    },
    {
      id: "plan-foco-anual",
      name: "Acesso Anual Método Foco",
      price: "R$ 147,00",
      originalPrice: "R$ 297,00",
      period: "por ano",
      appSlug: "metodo-foco",
      appName: "Método Foco e Rotina Produtiva",
      features: ["Acesso ao PWA com Pomodoro", "Planner anti-procrastinação", "Comunidade de produtividade", "Encontros mensais"],
      checkoutUrl: "https://pay.kiwify.com.br/demo-foco-anual",
      popular: true,
      active: true,
    },
    {
      id: "plan-treino-trim",
      name: "Treino em Casa Trimestral",
      price: "R$ 67,00",
      originalPrice: "R$ 127,00",
      period: "pagamento único",
      appSlug: "treino-casa",
      appName: "Treino em Casa 15 Minutos",
      features: ["Vídeos em 16:9 e 9:16", "Cronômetro de séries", "Suporte no WhatsApp"],
      checkoutUrl: "https://pay.kiwify.com.br/demo-treino",
      popular: true,
      active: true,
    },
  ]);

  // Modal de Criar Plano de Venda para App
  const [showAppPlanModal, setShowAppPlanModal] = useState(false);
  const [newAppPlan, setNewAppPlan] = useState({
    name: "",
    price: "R$ 97,00",
    originalPrice: "R$ 197,00",
    period: "pagamento único" as "pagamento único" | "por mês" | "por ano",
    appSlug: "guia-lowcarb",
    checkoutUrl: "https://pay.kiwify.com.br/exemplo",
    features: "Acesso total ao PWA\nSuporte no WhatsApp\nGarantia 7 dias",
    popular: true,
  });

  // 4. Clientes Compradores dos Apps (CRM de Vendas)
  const [buyers, setBuyers] = useState<BuyerCustomerItem[]>([
    {
      id: "BUY-901",
      name: "Mariana Silva",
      email: "mariana.silva@gmail.com",
      whatsapp: "5511987654321",
      appSlug: "guia-lowcarb",
      appName: "Guia Low Carb",
      planName: "Acesso Vitalício + Bônus",
      amount: "R$ 97,00",
      gateway: "Kiwify",
      purchaseDate: "Hoje, às 13:14",
      status: "Liberado",
      pwaLink: "/a/guia-lowcarb",
    },
    {
      id: "BUY-902",
      name: "Lucas Mendes",
      email: "lucas.mendes@hotmail.com",
      whatsapp: "5521998877665",
      appSlug: "metodo-foco",
      appName: "Método Foco",
      planName: "Acesso Anual Método Foco",
      amount: "R$ 147,00",
      gateway: "Hotmart",
      purchaseDate: "Hoje, às 11:42",
      status: "Liberado",
      pwaLink: "/a/metodo-foco",
    },
    {
      id: "BUY-903",
      name: "Juliana Peixoto",
      email: "ju.peixoto@yahoo.com.br",
      whatsapp: "5531988112233",
      appSlug: "guia-lowcarb",
      appName: "Guia Low Carb",
      planName: "Assinatura Mensal Cardápio",
      amount: "R$ 29,90",
      gateway: "Eduzz",
      purchaseDate: "Ontem, às 19:30",
      status: "Liberado",
      pwaLink: "/a/guia-lowcarb",
    },
    {
      id: "BUY-904",
      name: "Carlos Eduardo",
      email: "cadu.fit@gmail.com",
      whatsapp: "5541999223344",
      appSlug: "treino-casa",
      appName: "Treino em Casa",
      planName: "Treino em Casa Trimestral",
      amount: "R$ 67,00",
      gateway: "Stripe",
      purchaseDate: "13 Fev 2026",
      status: "Liberado",
      pwaLink: "/a/treino-casa",
    },
    {
      id: "BUY-905",
      name: "Fabiana Prado",
      email: "fabi.prado@outlook.com",
      whatsapp: "5519998811442",
      appSlug: "guia-lowcarb",
      appName: "Guia Low Carb",
      planName: "Acesso Vitalício + Bônus",
      amount: "R$ 97,00",
      gateway: "Cakto",
      purchaseDate: "12 Fev 2026",
      status: "Revogado",
      pwaLink: "/a/guia-lowcarb",
    },
  ]);
  const [buyerFilterApp, setBuyerFilterApp] = useState("Todos");
  const [buyerSearch, setBuyerSearch] = useState("");

  // 5. Planos do Studio SaaS (Admin -> Produtor)
  const [studioPlans, setStudioPlans] = useState<PlanItem[]>([
    { id: "free", name: "Free", price: "R$ 0", apps: "1 PWA ativo", trial: "Ilimitado", desc: "Para testar a plataforma.", features: ["1 Mini App PWA", "Domínio compartilhado", "Gatilho de Upgrade"], active: true, upgrade: true },
    { id: "pro", name: "Pro", price: "R$ 97/mês", apps: "Até 5 PWAs", trial: "7 dias grátis", desc: "Para infoprodutores com múltiplos funis.", features: ["Até 5 PWAs", "Domínio próprio (CNAME)", "Vídeos 9:16", "BYOK IA", "7 dias grátis"], active: true, upgrade: true },
    { id: "premium", name: "Premium", price: "R$ 197/mês", apps: "PWAs ilimitados", trial: "7 dias grátis", desc: "Escala total para agências.", features: ["PWAs ilimitados", "Todos os Templates", "Domínios ilimitados", "Webhooks avançados"], active: true, upgrade: false },
  ]);

  // 6. Invoices
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: "INV-2026-089", user: "Camila Duarte", plan: "Premium", value: "R$ 197,00", due: "15 Fev 2026", status: "Pago" },
    { id: "INV-2026-088", user: "Rafael Almeida", plan: "Pro", value: "R$ 97,00", due: "14 Fev 2026", status: "Pago" },
    { id: "INV-2026-087", user: "Mariana Costa", plan: "Premium", value: "R$ 197,00", due: "08 Fev 2026", status: "Vencido" },
    { id: "INV-2026-086", user: "Pedro Martins", plan: "Pro", value: "R$ 97,00", due: "05 Fev 2026", status: "Vencido" },
    { id: "INV-2026-085", user: "Beatriz Souza", plan: "Pro", value: "R$ 97,00", due: "20 Fev 2026", status: "Pendente" },
  ]);
  const [invoiceFilter, setInvoiceFilter] = useState("Todas");

  // 7. Vertical Ads (9:16)
  const [ads, setAds] = useState<AdItem[]>([
    { id: "ad-1", title: "Oferta Relâmpago • Upgrade para Pro", type: "Vídeo em formato de celular (9:16)", status: true, reach: "14.280 views", ctaText: "Fazer Upgrade Agora", ctaUrl: "https://miniapps.studio/upgrade", delaySec: 10 },
    { id: "ad-2", title: "Novo Módulo de Afiliados Disponível", type: "Popup", status: true, reach: "8.120 views", ctaText: "Ativar Módulo", ctaUrl: "/modulos" },
  ]);

  // 8. Templates Repository
  const [templates, setTemplates] = useState<TemplateItem[]>([
    { id: 1, name: "Guia Interativo", category: "Guia & E-book", author: "MiniApps Studio", installs: 840, type: "HTML + IA", icon: "🥑", color: "from-violet-600 to-fuchsia-500", description: "Capítulo por capítulo com checklist de progresso e botão de pagamento direto." },
    { id: 2, name: "Desafio 7 Dias", category: "Desafio", author: "MiniApps Studio", installs: 620, type: "Interativo", icon: "🔥", color: "from-pink-500 to-orange-400", description: "Página com contagem regressiva, tarefas diárias e prova social integrada." },
    { id: 3, name: "Quiz de Venda Qualificada", category: "Funil de Vendas", author: "Equipe Oficial", installs: 512, type: "Quiz + CTA", icon: "🎯", color: "from-orange-500 to-amber-400", description: "3 perguntas estratégicas que direcionam o visitante para a oferta certa." },
    { id: 4, name: "Mini Curso em Vídeo", category: "Cursos", author: "Studio VIP", installs: 430, type: "Vídeo + Membros", icon: "🎓", color: "from-indigo-600 to-violet-500", description: "Aulas em vídeo sem distrações, ideal para infoprodutos de entrada e upsell." },
  ]);

  // 9. Webhooks de Vendas
  const [webhookUrl, setWebhookUrl] = useState("https://miniapps.studio/api/webhooks/vendas");
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);

  // 10. AI Keys
  const [aiKeys, setAiKeys] = useState<AIKeyItem[]>([
    { id: "openai", provider: "OpenAI", model: "GPT-4o & GPT-4o-mini", keyMasked: "sk-proj-••••••••9A1f", status: "connected", speed: "1.2s" },
    { id: "gemini", provider: "Google Gemini", model: "Gemini 1.5 Pro & Flash", keyMasked: "AIzaSy••••••••xK39", status: "connected", speed: "0.8s" },
    { id: "groq", provider: "Groq Cloud", model: "Llama 3.3 70B Versatile", keyMasked: "gsk_••••••••41bA", status: "connected", speed: "0.3s" },
    { id: "anthropic", provider: "Anthropic", model: "Claude 3.5 Sonnet", keyMasked: "sk-ant-••••••••55Cc", status: "disconnected", speed: "--" },
  ]);

  // 11. Configurações
  const [settings, setSettings] = useState({
    platformName: "MiniApps Studio",
    domain: "miniapps.studio",
    supportEmail: "suporte@miniapps.studio",
    allowRegistration: true,
    requireEmailVerification: false,
    defaultTrialDays: 7,
    currency: "BRL — Real",
    welcomeMessage: "Bem-vindo ao MiniApps Studio!",
  });

  // Filtered Buyers
  const filteredBuyers = buyers.filter((b) => {
    const matchesApp = buyerFilterApp === "Todos" ? true : b.appSlug === buyerFilterApp;
    const matchesSearch =
      b.name.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.email.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.appName.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.gateway.toLowerCase().includes(buyerSearch.toLowerCase());
    return matchesApp && matchesSearch;
  });

  // Simular recebimento de webhook de compra em tempo real
  const handleSimulateWebhook = async (gatewayName: "Kiwify" | "Hotmart" | "Eduzz" | "Stripe" | "Cakto") => {
    setSimulatingWebhook(true);
    const mockNames = ["Fernanda Lima", "Rodrigo Nogueira", "Camila Vilela", "Bruno Albuquerque", "Patricia Souza"];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomApp = apps[Math.floor(Math.random() * apps.length)];
    const randomPlan = appPlans.find((p) => p.appSlug === randomApp.slug) || appPlans[0];

    const newBuyer: BuyerCustomerItem = {
      id: `BUY-${Date.now().toString().slice(-4)}`,
      name: randomName,
      email: `${randomName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      whatsapp: `55119${Math.floor(10000000 + Math.random() * 90000000)}`,
      appSlug: randomApp.slug,
      appName: randomApp.name,
      planName: randomPlan.name,
      amount: randomPlan.price,
      gateway: gatewayName,
      purchaseDate: "Agora mesmo",
      status: "Liberado",
      pwaLink: `/a/${randomApp.slug}`,
    };

    setTimeout(() => {
      setBuyers((prev) => [newBuyer, ...prev]);
      setSimulatingWebhook(false);
      showToast(`⚡ Webhook recebido de ${gatewayName}! Acesso liberado para ${newBuyer.name} no app ${newBuyer.appName}.`);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#0B0714] text-[#F8F5FF] flex flex-col md:flex-row antialiased selection:bg-[#7C3AED] selection:text-white font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[999] bg-[#1D1236] text-white border border-[#7C3AED] text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center text-xs">✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Dark Purple #120A22) */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-[268px] shrink-0 bg-[#120A22] border-r border-[#2D1E51] flex flex-col justify-between p-4 md:min-h-screen">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-[#2D1E51]/60">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[#7C3AED]/30">
              M
            </div>
            <div className="leading-tight">
              <h1 className="font-extrabold text-[16px] text-white tracking-tight flex items-center gap-1.5">
                MiniApps <span className="text-[#C7B9E8] font-normal text-xs">Studio</span>
              </h1>
              <p className="text-[11px] text-[#A798C9] font-medium">Painel do dono · Admin</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
              { id: "apps", label: "Apps & Páginas", icon: "Smartphone" },
              { id: "vendas", label: "Vendas & Clientes", icon: "ShoppingBag", badge: buyers.length },
              { id: "planos", label: "Planos & Ofertas", icon: "Layers" },
              { id: "webhooks", label: "Webhooks de Venda", icon: "Webhook" },
              { id: "usuarios", label: "Produtores (CRM)", icon: "Users" },
              { id: "templates", label: "Templates", icon: "LayoutTemplate" },
              { id: "anuncios", label: "Anúncios (9:16)", icon: "Megaphone" },
              { id: "faturas", label: "Faturas", icon: "Receipt", badge: 12 },
              { id: "ia", label: "Chaves de IA", icon: "Key" },
              { id: "config", label: "Configurações", icon: "Settings" },
            ].map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-[13px] transition ${
                    active
                      ? "bg-gradient-to-r from-[#7C3AED]/35 to-[#EC4899]/20 text-white shadow-inner border border-[#7C3AED]/50"
                      : "text-[#C7B9E8] hover:bg-[#231743] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon name={item.icon} size={17} className={active ? "text-[#EC4899]" : "text-[#9E8EC5]"} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#EC4899] text-white text-[11px] font-extrabold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="space-y-4 pt-4 border-t border-[#2D1E51]/60">
          <div className="rounded-2xl p-3.5 bg-gradient-to-b from-[#1C1236] to-[#150D29] border border-[#2D1E51]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#EC4899] mb-1">
              <Icon name="Sparkles" size={14} />
              <span>Vendas Diretas</span>
            </div>
            <p className="text-[11px] text-[#B8A9D9] leading-relaxed">
              <b className="text-white">{buyers.length} vendas</b> liberadas automaticamente via webhooks.
            </p>
            <button
              onClick={() => setActiveTab("vendas")}
              className="mt-2.5 w-full py-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-[11px] font-bold shadow-md hover:brightness-110 transition"
            >
              Ver clientes compradores
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#7C3AED] text-white font-black text-xs flex items-center justify-center">
                AD
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-white">Admin Master</p>
                <p className="text-[10px] text-[#A798C9]">admin@miniapps.studio</p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" title="Online" />
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen bg-[#0B0714]">
        {/* Top Header Bar */}
        <header className="h-[68px] border-b border-[#2D1E51] px-5 sm:px-8 flex items-center justify-between gap-4 bg-[#0E0820]/80 backdrop-blur sticky top-0 z-30">
          <div className="relative flex-1 max-w-[420px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F7EB6]">
              <Icon name="Search" size={16} />
            </span>
            <input
              value={buyerSearch}
              onChange={(e) => setBuyerSearch(e.target.value)}
              placeholder="Buscar cliente, app, plano, webhook ou e-mail..."
              className="w-full bg-[#170E2F] border border-[#2D1E51] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#8F7EB6] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#231743] hover:bg-[#2F1F5A] border border-[#3E2B6D] text-white text-xs font-bold transition"
            >
              <span>🎨</span>
              <span>Abrir Construtor PWA</span>
            </Link>

            <button
              onClick={() => setActiveTab("vendas")}
              className="p-2 rounded-xl bg-[#170E2F] border border-[#2D1E51] text-[#C7B9E8] hover:text-white transition relative"
              title="Vendas dos Apps"
            >
              <Icon name="Bell" size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EC4899] text-white text-[9px] font-black flex items-center justify-center">
                {buyers.length}
              </span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-5 sm:p-8 flex-1">
          {/* ======================================================== */}
          {/* TAB 1: DASHBOARD */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black tracking-widest text-[#EC4899] uppercase">VISÃO GERAL</p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                    Bom dia, Admin. O Studio está crescendo.
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("vendas")}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-bold text-xs shadow-lg shadow-[#7C3AED]/20 hover:brightness-110 flex items-center gap-2"
                  >
                    <Icon name="ShoppingBag" size={15} />
                    <span>Ver Vendas dos Apps ({buyers.length})</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#180E30] to-[#120A24] border border-[#2D1E51]">
                  <div className="flex items-center justify-between text-[#C7B9E8] mb-3">
                    <span className="text-xs font-bold">Clientes Compradores</span>
                    <span className="w-8 h-8 rounded-xl bg-[#EC4899]/20 text-[#EC4899] flex items-center justify-center">
                      <Icon name="ShoppingBag" size={16} />
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white">{buyers.length + 2950}</h3>
                  <p className="text-xs text-emerald-400 font-bold mt-2">Acessos aos PWAs ativos</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#180E30] to-[#120A24] border border-[#2D1E51]">
                  <div className="flex items-center justify-between text-[#C7B9E8] mb-3">
                    <span className="text-xs font-bold">Receita de Apps</span>
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Icon name="TrendingUp" size={16} />
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white">R$ 142.890</h3>
                  <p className="text-xs text-emerald-400 font-bold mt-2">Via Kiwify, Hotmart &amp; Stripe</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#180E30] to-[#120A24] border border-[#2D1E51]">
                  <div className="flex items-center justify-between text-[#C7B9E8] mb-3">
                    <span className="text-xs font-bold">Páginas de Vendas</span>
                    <span className="w-8 h-8 rounded-xl bg-[#7C3AED]/20 text-[#C7B9E8] flex items-center justify-center">
                      <Icon name="Globe" size={16} />
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white">{apps.length} ativas</h3>
                  <p className="text-xs text-[#A798C9] mt-2">Com Pixel Meta configurado</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#251025] to-[#160B1C] border border-[#F43F5E]/40">
                  <div className="flex items-center justify-between text-[#F43F5E] mb-3">
                    <span className="text-xs font-bold">Faturas Vencidas</span>
                    <span className="w-8 h-8 rounded-xl bg-[#F43F5E]/20 text-[#F43F5E] flex items-center justify-center">
                      <Icon name="AlertTriangle" size={16} />
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white">12</h3>
                  <button onClick={() => setActiveTab("faturas")} className="mt-2 text-xs font-bold text-[#F43F5E] hover:underline block">
                    Ver faturas vencidas →
                  </button>
                </div>
              </div>

              {/* Botão de Destaque para Vendas */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1D1038] to-[#25123E] border border-[#7C3AED]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span>⚡</span>
                    <span>Hub de Vendas dos Mini Apps Ativo</span>
                  </h3>
                  <p className="text-xs text-[#C7B9E8] mt-1">
                    Cada app tem sua página de vendas exclusiva com Pixel do Facebook, planos específicos e webhook direto com Kiwify, Eduzz e Hotmart.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab("apps")}
                    className="px-4 py-2 rounded-xl bg-[#27184A] hover:bg-[#342163] text-white text-xs font-bold border border-[#3E2B6D]"
                  >
                    Ver Páginas de Vendas
                  </button>
                  <button
                    onClick={() => setActiveTab("vendas")}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-xs font-bold shadow-lg"
                  >
                    Ver Quem Comprou
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: APPS & PÁGINAS DE VENDAS (Olho 👁️, Editar ✏️, Pixel 🎯) */}
          {/* ======================================================== */}
          {activeTab === "apps" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black tracking-widest text-[#EC4899] uppercase">MULTI-PWA &amp; VENDAS</p>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Apps &amp; Páginas de Vendas</h2>
                  <p className="text-xs text-[#A798C9] mt-0.5">
                    Cada app possui sua Página de Vendas própria com visualizador 👁️, editor ✏️, Pixel do Facebook 🎯 e planos específicos vinculados.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveTab("planos");
                      setShowAppPlanModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-bold text-xs shadow-lg shadow-[#7C3AED]/20 transition flex items-center gap-1.5"
                  >
                    <Icon name="Plus" size={15} />
                    <span>Adicionar Plano em Página de Vendas</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Apps e Páginas de Vendas */}
              <div className="rounded-2xl border border-[#2D1E51] bg-[#120A24] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1C1236] text-[#C7B9E8] font-bold border-b border-[#2D1E51]">
                      <tr>
                        <th className="py-3.5 px-4">Mini App PWA</th>
                        <th className="py-3.5 px-4">Página de Vendas</th>
                        <th className="py-3.5 px-4">Planos Vinculados</th>
                        <th className="py-3.5 px-4">Pixel do Facebook</th>
                        <th className="py-3.5 px-4">Compradores</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Ações da Página de Vendas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D1E51]/60 text-white">
                      {apps.map((app) => (
                        <tr key={app.id} className="hover:bg-[#1C1236]/50 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                style={{ backgroundColor: app.themeColor }}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md"
                              >
                                📱
                              </div>
                              <div>
                                <p className="font-bold text-white">{app.name}</p>
                                <p className="text-[11px] text-[#A798C9]">Produtor: {app.producer}</p>
                              </div>
                            </div>
                          </td>

                          {/* Link Próprio da Página de Vendas */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <span className="font-mono text-xs text-[#EC4899] font-bold block">
                                {app.sales}
                              </span>
                              <span className="text-[10px] text-[#8F7EB6] block">
                                Domínio: {app.domain}
                              </span>
                            </div>
                          </td>

                          {/* Planos Vinculados a esta Página */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {appPlans
                                .filter((p) => p.appSlug === app.slug)
                                .map((p) => (
                                  <span
                                    key={p.id}
                                    className="px-2 py-0.5 rounded-md bg-[#27184A] text-[#C7B9E8] text-[10px] font-bold"
                                    title={p.price}
                                  >
                                    {p.name.slice(0, 15)}... ({p.price})
                                  </span>
                                ))}
                            </div>
                          </td>

                          {/* Pixel do Facebook */}
                          <td className="py-3.5 px-4">
                            {app.facebookPixelId ? (
                              <button
                                onClick={() => {
                                  setPixelModalApp(app);
                                  setPixelInputId(app.facebookPixelId || "");
                                  setPixelInputToken(app.facebookCapiToken || "");
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] hover:bg-emerald-500/25 transition"
                                title="Configurar Pixel do Facebook"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Pixel: {app.facebookPixelId}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setPixelModalApp(app);
                                  setPixelInputId("");
                                  setPixelInputToken("");
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#27184A] border border-[#3E2B6D] text-[#C7B9E8] text-[11px] hover:text-white"
                              >
                                + Adicionar Pixel
                              </button>
                            )}
                          </td>

                          {/* Compradores */}
                          <td className="py-3.5 px-4 font-bold">
                            <span className="text-emerald-400">
                              {buyers.filter((b) => b.appSlug === app.slug).length + app.buyersCount} alunos
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                                app.available ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                              }`}
                            >
                              {app.available ? "No Ar" : "Manutenção"}
                            </span>
                          </td>

                          {/* Ações da Página de Vendas: Olho 👁️, Editar ✏️, Copiar 🔗 */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* 👁️ Olho para Ver a Página de Vendas */}
                              <Link
                                href={`/p/${app.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl bg-[#231743] hover:bg-[#2F1F5A] border border-[#3E2B6D] text-white hover:text-[#EC4899] transition"
                                title="👁️ Visualizar Página de Vendas ao Vivo"
                              >
                                <Icon name="Eye" size={15} />
                              </Link>

                              {/* ✏️ Editar Página no Construtor */}
                              <Link
                                href="/"
                                className="p-2 rounded-xl bg-[#231743] hover:bg-[#2F1F5A] border border-[#3E2B6D] text-white hover:text-emerald-300 transition"
                                title="✏️ Editar Página no Construtor NoéPage"
                              >
                                <Icon name="Edit3" size={15} />
                              </Link>

                              {/* 🔗 Copiar Link Próprio */}
                              <button
                                onClick={() => {
                                  const fullUrl = `${window.location.origin}/p/${app.slug}`;
                                  navigator.clipboard.writeText(fullUrl);
                                  showToast(`Link da Página de Vendas de "${app.name}" copiado!`);
                                }}
                                className="p-2 rounded-xl bg-[#231743] hover:bg-[#2F1F5A] border border-[#3E2B6D] text-white hover:text-[#C7B9E8] transition"
                                title="🔗 Copiar Link da Página de Vendas"
                              >
                                <Icon name="Share2" size={15} />
                              </button>

                              {/* 🎯 Configurar Pixel */}
                              <button
                                onClick={() => {
                                  setPixelModalApp(app);
                                  setPixelInputId(app.facebookPixelId || "");
                                  setPixelInputToken(app.facebookCapiToken || "");
                                }}
                                className="p-2 rounded-xl bg-[#231743] hover:bg-[#2F1F5A] border border-[#3E2B6D] text-white hover:text-pink-400 transition"
                                title="🎯 Configurar Pixel do Facebook"
                              >
                                <Icon name="Target" size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal de Configuração de Pixel do Facebook */}
              {pixelModalApp && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#160E2A] border border-[#7C3AED] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[#2D1E51] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        <h3 className="font-extrabold text-base text-white">
                          Pixel do Facebook • {pixelModalApp.name}
                        </h3>
                      </div>
                      <button onClick={() => setPixelModalApp(null)} className="text-[#A798C9] hover:text-white">
                        ✕
                      </button>
                    </div>

                    <p className="text-xs text-[#B8A9D9]">
                      O pixel será injetado automaticamente na Página de Vendas (<code>/p/{pixelModalApp.slug}</code>) disparando os eventos de <b>PageView</b> e <b>InitiateCheckout</b>.
                    </p>

                    <div>
                      <label className="text-xs font-bold text-[#C7B9E8] block mb-1">Facebook Pixel ID</label>
                      <input
                        value={pixelInputId}
                        onChange={(e) => setPixelInputId(e.target.value)}
                        placeholder="Ex: 9482910394812"
                        className="w-full bg-[#0E0820] border border-[#2D1E51] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#C7B9E8] block mb-1">Meta Conversions API Token (Opcional)</label>
                      <input
                        value={pixelInputToken}
                        onChange={(e) => setPixelInputToken(e.target.value)}
                        placeholder="EAAB••••••••"
                        className="w-full bg-[#0E0820] border border-[#2D1E51] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPixelModalApp(null)}
                        className="px-4 py-2 rounded-xl bg-[#231743] text-white text-xs font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          setApps((prev) =>
                            prev.map((x) =>
                              x.id === pixelModalApp.id
                                ? { ...x, facebookPixelId: pixelInputId, facebookCapiToken: pixelInputToken }
                                : x
                            )
                          );
                          setPixelModalApp(null);
                          showToast(`Pixel do Facebook salvo para "${pixelModalApp.name}"!`);
                        }}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-xs font-bold shadow-md"
                      >
                        Salvar Pixel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: VENDAS & COMPRADORES (Quem comprou, qual app está usando) */}
          {/* ======================================================== */}
          {activeTab === "vendas" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black tracking-widest text-[#EC4899] uppercase">CLIENTES &amp; ACESSOS</p>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Compradores dos Mini Apps</h2>
                  <p className="text-xs text-[#A798C9] mt-0.5">
                    Veja quem comprou, as informações de contato, <b>qual app cada cliente está usando</b> e envie o link de acesso no WhatsApp.
                  </p>
                </div>

                {/* Simulador de Webhook de Compra (Kiwify / Hotmart / Eduzz) */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={simulatingWebhook}
                    onClick={() => handleSimulateWebhook("Kiwify")}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/40 transition flex items-center gap-1.5 disabled:opacity-50"
                    title="Simular recebimento de venda aprovada da Kiwify"
                  >
                    <span>⚡ Simular Venda (Kiwify)</span>
                  </button>

                  <button
                    disabled={simulatingWebhook}
                    onClick={() => handleSimulateWebhook("Hotmart")}
                    className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-900/40 transition flex items-center gap-1.5 disabled:opacity-50"
                    title="Simular recebimento de venda aprovada da Hotmart"
                  >
                    <span>🔥 Simular (Hotmart)</span>
                  </button>
                </div>
              </div>

              {/* Filtro por App */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-[#A798C9] font-bold">Filtrar por App:</span>
                {["Todos", "guia-lowcarb", "metodo-foco", "treino-casa"].map((slug) => (
                  <button
                    key={slug}
                    onClick={() => setBuyerFilterApp(slug)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap ${
                      buyerFilterApp === slug
                        ? "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/20"
                        : "bg-[#170E2F] border border-[#2D1E51] text-[#A798C9] hover:text-white"
                    }`}
                  >
                    {slug === "Todos" ? "Todos os Apps" : slug}
                  </button>
                ))}
              </div>

              {/* Tabela de Compradores */}
              <div className="rounded-2xl border border-[#2D1E51] bg-[#120A24] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1C1236] text-[#C7B9E8] font-bold border-b border-[#2D1E51]">
                      <tr>
                        <th className="py-3.5 px-4">Cliente Comprador</th>
                        <th className="py-3.5 px-4">Qual App Está Usando</th>
                        <th className="py-3.5 px-4">Plano Adquirido</th>
                        <th className="py-3.5 px-4">Gateway</th>
                        <th className="py-3.5 px-4">Valor &amp; Data</th>
                        <th className="py-3.5 px-4">Status Acesso</th>
                        <th className="py-3.5 px-4 text-right">Ações de Acesso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D1E51]/60 text-white">
                      {filteredBuyers.map((b) => (
                        <tr key={b.id} className="hover:bg-[#1C1236]/50 transition">
                          <td className="py-3.5 px-4">
                            <div>
                              <p className="font-bold text-white">{b.name}</p>
                              <p className="text-[11px] text-[#A798C9]">{b.email}</p>
                              <p className="text-[10px] text-emerald-400 font-mono">WhatsApp: {b.whatsapp}</p>
                            </div>
                          </td>

                          {/* Qual App Está Usando */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#7C3AED]/20 to-[#EC4899]/20 border border-[#7C3AED]/40 text-white font-bold">
                              <span>📱</span>
                              <span>{b.appName}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-[#C7B9E8]">{b.planName}</td>

                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-[#27184A] text-white font-bold text-[10px]">
                              {b.gateway}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-bold text-emerald-400">{b.amount}</p>
                            <p className="text-[10px] text-[#8F7EB6]">{b.purchaseDate}</p>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                                b.status === "Liberado"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-[#F43F5E]/20 text-[#F43F5E]"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Disparo WhatsApp */}
                              <a
                                href={`https://wa.me/${b.whatsapp}?text=Ol%C3%A1%20${encodeURIComponent(
                                  b.name
                                )}!%20Seu%20acesso%20ao%20${encodeURIComponent(
                                  b.appName
                                )}%20est%C3%A1%20liberado:%20https://miniapps.studio${b.pwaLink}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-[11px] font-bold border border-[#25D366]/40 flex items-center gap-1"
                                title="Enviar acesso direto no WhatsApp"
                              >
                                <span>💬</span>
                                <span>WhatsApp</span>
                              </a>

                              {/* Toggle de Acesso */}
                              <button
                                onClick={() => {
                                  const newStatus = b.status === "Liberado" ? "Revogado" : "Liberado";
                                  setBuyers((prev) =>
                                    prev.map((x) => (x.id === b.id ? { ...x, status: newStatus as any } : x))
                                  );
                                  showToast(`Acesso de ${b.name} ao app ${b.appName} foi ${newStatus}!`);
                                }}
                                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border ${
                                  b.status === "Liberado"
                                    ? "bg-[#F43F5E]/20 text-[#F43F5E] border-[#F43F5E]/40"
                                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                }`}
                              >
                                {b.status === "Liberado" ? "Bloquear" : "Liberar"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: PLANOS & OFERTAS (Opção de adicionar em página específica) */}
          {/* ======================================================== */}
          {activeTab === "planos" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black tracking-widest text-[#EC4899] uppercase">OFERTAS COMERCIAIS</p>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Planos dos Apps para Vender</h2>
                  <p className="text-xs text-[#A798C9] mt-0.5">
                    Crie ofertas para vender aos seus clientes finais e <b>vincule cada plano à página de vendas específica</b> de um app.
                  </p>
                </div>

                <button
                  onClick={() => setShowAppPlanModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-bold text-xs shadow-lg shadow-[#7C3AED]/20 transition flex items-center gap-1.5"
                >
                  <Icon name="Plus" size={15} />
                  <span>Novo Plano de Venda para App</span>
                </button>
              </div>

              {/* Grid dos Planos de Venda dos Apps */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {appPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-2xl p-6 bg-gradient-to-b from-[#180E30] to-[#120A24] border border-[#2D1E51] flex flex-col justify-between relative overflow-hidden"
                  >
                    {plan.popular && (
                      <span className="absolute top-0 right-0 bg-gradient-to-l from-[#EC4899] to-[#7C3AED] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">
                        Destaque
                      </span>
                    )}

                    <div>
                      {/* App Vinculado */}
                      <span className="inline-block text-[11px] font-black text-[#EC4899] bg-[#EC4899]/15 border border-[#EC4899]/30 px-2.5 py-0.5 rounded-full mb-3">
                        Página: {plan.appName}
                      </span>

                      <h4 className="font-extrabold text-white text-base leading-snug">{plan.name}</h4>

                      <div className="mt-3">
                        <span className="text-xs text-[#8F7EB6] line-through mr-2">{plan.originalPrice}</span>
                        <span className="text-2xl font-black text-white">{plan.price}</span>
                        <span className="text-xs text-[#A798C9] ml-1">/ {plan.period}</span>
                      </div>

                      <div className="space-y-2 mt-4 pt-4 border-t border-[#2D1E51]">
                        {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#F8F5FF]">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[#2D1E51] flex items-center justify-between">
                      <Link
                        href={`/p/${plan.appSlug}`}
                        target="_blank"
                        className="text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1"
                      >
                        <span>Ver na Página de Vendas</span>
                        <span>→</span>
                      </Link>

                      <button
                        onClick={() => {
                          setAppPlans((prev) => prev.filter((p) => p.id !== plan.id));
                          showToast(`Plano "${plan.name}" removido!`);
                        }}
                        className="text-xs text-[#8F7EB6] hover:text-[#F43F5E]"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal de Criação de Plano de Venda para App */}
              {showAppPlanModal && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#160E2A] border border-[#7C3AED] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-[#2D1E51] pb-3">
                      <h3 className="font-extrabold text-base text-white">Criar Plano de Venda para App</h3>
                      <button onClick={() => setShowAppPlanModal(false)} className="text-[#A798C9] hover:text-white">
                        ✕
                      </button>
                    </div>

                    {/* SELEÇÃO DA PÁGINA DE VENDAS ESPECÍFICA */}
                    <div>
                      <label className="text-xs font-bold text-[#EC4899] block mb-1">
                        * Adicionar este plano na Página de Venda de qual App?
                      </label>
                      <select
                        value={newAppPlan.appSlug}
                        onChange={(e) => setNewAppPlan({ ...newAppPlan, appSlug: e.target.value })}
                        className="w-full bg-[#0E0820] border border-[#7C3AED] rounded-xl px-3 py-2 text-xs text-white font-bold"
                      >
                        {apps.map((app) => (
                          <option key={app.slug} value={app.slug}>
                            {app.name} ({app.sales})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#C7B9E8] block mb-1">Nome da Oferta</label>
                      <input
                        value={newAppPlan.name}
                        onChange={(e) => setNewAppPlan({ ...newAppPlan, name: e.target.value })}
                        placeholder="Ex: Acesso Vitalício + Bônus"
                        className="w-full bg-[#0E0820] border border-[#2D1E51] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#C7B9E8] block mb-1">Preço com Desconto</label>
                        <input
                          value={newAppPlan.price}
                          onChange={(e) => setNewAppPlan({ ...newAppPlan, price: e.target.value })}
                          className="w-full bg-[#0E0820] border border-[#2D1E51] rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#C7B9E8] block mb-1">Preço Original ("De")</label>
                        <input
                          value={newAppPlan.originalPrice}
                          onChange={(e) => setNewAppPlan({ ...newAppPlan, originalPrice: e.target.value })}
                          className="w-full bg-[#0E0820] border border-[#2D1E51] rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#C7B9E8] block mb-1">Link de Checkout (Kiwify, Hotmart, Eduzz, etc.)</label>
                      <input
                        value={newAppPlan.checkoutUrl}
                        onChange={(e) => setNewAppPlan({ ...newAppPlan, checkoutUrl: e.target.value })}
                        placeholder="https://pay.kiwify.com.br/..."
                        className="w-full bg-[#0E0820] border border-[#2D1E51] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#C7B9E8] block mb-1">Benefícios (1 por linha)</label>
                      <textarea
                        rows={3}
                        value={newAppPlan.features}
                        onChange={(e) => setNewAppPlan({ ...newAppPlan, features: e.target.value })}
                        className="w-full bg-[#0E0820] border border-[#2D1E51] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!newAppPlan.name) return;
                        const targetApp = apps.find((a) => a.slug === newAppPlan.appSlug);
                        const created: AppPlanItem = {
                          id: `plan-${Date.now()}`,
                          name: newAppPlan.name,
                          price: newAppPlan.price,
                          originalPrice: newAppPlan.originalPrice,
                          period: newAppPlan.period,
                          appSlug: newAppPlan.appSlug,
                          appName: targetApp?.name || newAppPlan.appSlug,
                          checkoutUrl: newAppPlan.checkoutUrl,
                          features: newAppPlan.features.split("\n").filter(Boolean),
                          popular: newAppPlan.popular,
                          active: true,
                        };
                        setAppPlans((prev) => [created, ...prev]);
                        setShowAppPlanModal(false);
                        showToast(`Plano "${created.name}" adicionado na Página de Vendas de "${created.appName}"!`);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-bold text-xs"
                    >
                      Salvar e Publicar na Página de Vendas
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: WEBHOOKS DE VENDA (Kiwify, Eduzz, Hotmart, Stripe) */}
          {/* ======================================================== */}
          {activeTab === "webhooks" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black tracking-widest text-[#EC4899] uppercase">AUTOMAÇÃO DE ACESSO</p>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Webhook de Vendas</h2>
                  <p className="text-xs text-[#A798C9] mt-0.5">
                    Conecte sua plataforma de checkout para liberar o PWA automaticamente no momento da compra.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulateWebhook("Kiwify")}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-bold text-xs shadow-lg shadow-[#7C3AED]/20 transition flex items-center gap-1.5"
                  >
                    <span>⚡ Testar Webhook Agora</span>
                  </button>
                </div>
              </div>

              {/* Endpoint Copiável */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#180E30] to-[#120A24] border border-[#2D1E51] space-y-4">
                <h3 className="font-extrabold text-white text-base">URL do Webhook para colar no seu Checkout</h3>
                <p className="text-xs text-[#B8A9D9]">
                  Cole este endereço no campo de Webhooks da <b>Kiwify, Hotmart, Eduzz, Stripe, Cakto ou Mercado Pago</b>:
                </p>

                <div className="flex gap-2">
                  <input
                    readOnly
                    value={webhookUrl}
                    className="flex-1 bg-[#0E0820] border border-[#7C3AED] rounded-xl px-4 py-2.5 font-mono text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      showToast("URL do webhook copiada para a área de transferência!");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shrink-0"
                  >
                    Copiar URL
                  </button>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold text-[#C7B9E8] mb-2">Eventos que Liberam ou Bloqueiam o PWA:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#140C28] border border-[#2D1E51]">
                      <span className="text-emerald-400 font-bold block mb-1">🟢 Venda Aprovada</span>
                      <p className="text-[11px] text-[#A798C9]">Cria o comprador e envia o link exclusivo de acesso do PWA no WhatsApp/e-mail.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#140C28] border border-[#2D1E51]">
                      <span className="text-[#F43F5E] font-bold block mb-1">🔴 Reembolso / Estorno</span>
                      <p className="text-[11px] text-[#A798C9]">Revoga o acesso ao PWA na mesma hora, exibindo tela de suspensão.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#140C28] border border-[#2D1E51]">
                      <span className="text-amber-400 font-bold block mb-1">🟡 Assinatura Cancelada</span>
                      <p className="text-[11px] text-[#A798C9]">Mantém acesso até o fim dos dias pagos e bloqueia na renovação.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: USUÁRIOS (CRM PRODUTORES) */}
          {/* ======================================================== */}
          {activeTab === "usuarios" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black tracking-widest text-[#EC4899] uppercase">CRM PRODUTORES</p>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Produtores Cadastrados no Studio</h2>
                  <p className="text-xs text-[#A798C9] mt-0.5">Controle de donos de mini apps e seus planos de assinatura.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#2D1E51] bg-[#120A24] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1C1236] text-[#C7B9E8] font-bold border-b border-[#2D1E51]">
                    <tr>
                      <th className="py-3.5 px-4">Produtor</th>
                      <th className="py-3.5 px-4">Plano</th>
                      <th className="py-3.5 px-4">PWAs</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Cadastro</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D1E51]/60 text-white">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#1C1236]/50">
                        <td className="py-3.5 px-4 font-bold">{u.name}</td>
                        <td className="py-3.5 px-4">{u.plan}</td>
                        <td className="py-3.5 px-4">{u.apps} apps</td>
                        <td className="py-3.5 px-4">{u.status}</td>
                        <td className="py-3.5 px-4 text-[#A798C9]">{u.joined}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => showToast(`Plano de ${u.name} gerenciado!`)}
                            className="px-2.5 py-1 rounded-lg bg-[#27184A] text-white text-[11px] font-bold"
                          >
                            Gerenciar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* DEMAIS ABAS (Templates, Anúncios, Faturas, IA, Config) */}
          {/* ======================================================== */}
          {activeTab === "templates" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-white">Templates Disponíveis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((tpl) => (
                  <div key={tpl.id} className="p-4 rounded-2xl bg-[#140C28] border border-[#2D1E51]">
                    <span className="text-2xl">{tpl.icon}</span>
                    <h4 className="font-bold text-white mt-2">{tpl.name}</h4>
                    <p className="text-xs text-[#A798C9]">{tpl.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "anuncios" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-white">Central de Anúncios (Vídeo 9:16)</h2>
              <div className="p-4 rounded-2xl bg-[#140C28] border border-[#2D1E51]">
                <p className="text-xs text-white">Campanhas verticais estilo Stories/Reels rodando nos PWAs.</p>
              </div>
            </div>
          )}

          {activeTab === "faturas" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-white">Faturas &amp; Cobrança</h2>
              <div className="p-4 rounded-2xl bg-[#140C28] border border-[#2D1E51]">
                <p className="text-xs text-white">12 faturas pendentes monitoradas.</p>
              </div>
            </div>
          )}

          {activeTab === "ia" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-white">Chaves de IA (BYOK)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiKeys.map((k) => (
                  <div key={k.id} className="p-4 rounded-2xl bg-[#140C28] border border-[#2D1E51]">
                    <p className="font-bold text-white text-sm">{k.provider}</p>
                    <p className="text-xs text-[#A798C9]">{k.model}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-white">Configurações Gerais</h2>
              <div className="p-4 rounded-2xl bg-[#140C28] border border-[#2D1E51]">
                <p className="text-xs text-white">Configurações do sistema MiniApps Studio.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
