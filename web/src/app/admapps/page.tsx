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

export interface SaaSPlanItem {
  id: string;
  name: string;
  price: string;
  appsLimit: string;
  trialDays: string;
  desc: string;
  features: string[];
  active: boolean;
  upgrade: boolean;
}

export interface InvoiceItem {
  id: string;
  user: string;
  plan: string;
  value: string;
  due: string;
  status: "Pago" | "Pendente" | "Vencido";
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

export interface GlobalAIKey {
  id: string;
  provider: string;
  model: string;
  keyMasked: string;
  status: "connected" | "disconnected";
  speed: string;
}

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "usuarios" | "planos" | "templates" | "faturas" | "ia" | "config"
  >("dashboard");

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. USUÁRIOS / PRODUTORES DA PLATAFORMA (CRM DO DONO)
  const [users, setUsers] = useState<UserItem[]>([
    { id: 1, name: "Camila Duarte", email: "camila@metodofoco.com.br", plan: "Premium", apps: 8, status: "Ativo", joined: "12 Jan 2026", revenue: "R$ 197,00", initials: "CD" },
    { id: 2, name: "Rafael Almeida", email: "rafael@guialowcarb.com", plan: "Pro", apps: 4, status: "Ativo", joined: "18 Jan 2026", revenue: "R$ 97,00", initials: "RA" },
    { id: 3, name: "Beatriz Souza", email: "bia@inglesfluente.com", plan: "Pro", apps: 3, status: "Ativo", joined: "25 Jan 2026", revenue: "R$ 97,00", initials: "BS" },
    { id: 4, name: "Lucas Ferreira", email: "lucas@treinocasa.com", plan: "Free", apps: 1, status: "Trial", joined: "02 Fev 2026", revenue: "R$ 0,00", initials: "LF" },
    { id: 5, name: "Mariana Costa", email: "mariana@nutriapp.com.br", plan: "Premium", apps: 6, status: "Ativo", joined: "04 Fev 2026", revenue: "R$ 197,00", initials: "MC" },
    { id: 6, name: "Pedro Martins", email: "pedro@financasfacil.com", plan: "Pro", apps: 2, status: "Vencido", joined: "08 Fev 2026", revenue: "R$ 97,00", initials: "PM" },
  ]);
  const [userFilter, setUserFilter] = useState("Todos");
  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = users.filter((u) => {
    const matchesFilter = userFilter === "Todos" ? true : u.status === userFilter || u.plan === userFilter;
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 2. CRIADOR DE PLANOS DO DONO DO SAAS (Super Admin -> Produtores)
  const [saasPlans, setSaasPlans] = useState<SaaSPlanItem[]>([
    {
      id: "free",
      name: "Plano Free / Teste",
      price: "R$ 0",
      appsLimit: "1 Mini App",
      trialDays: "Ilimitado",
      desc: "Plano de entrada para produtores testarem o construtor.",
      features: ["1 Mini App PWA ativo", "Domínio compartilhado", "Gatilho de Upgrade", "Templates básicos"],
      active: true,
      upgrade: true,
    },
    {
      id: "pro",
      name: "Plano Pro Infoprodutor",
      price: "R$ 97/mês",
      appsLimit: "Até 5 Mini Apps",
      trialDays: "7 dias grátis",
      desc: "Para infoprodutores que vendem múltiplos produtos e funis.",
      features: ["Até 5 Mini Apps PWAs", "Domínio próprio (CNAME)", "Vídeos 9:16 verticais", "Pixel do Facebook ilimitado", "Webhooks de Venda"],
      active: true,
      upgrade: true,
    },
    {
      id: "premium",
      name: "Plano Agência / Escala",
      price: "R$ 197/mês",
      appsLimit: "Mini Apps Ilimitados",
      trialDays: "7 dias grátis",
      desc: "Escala máxima para grandes copys, agências e lançamentos.",
      features: ["Mini Apps Ilimitados", "Todos os 23 Blocos NoéPage", "Domínios próprios ilimitados", "Suporte prioritário via WhatsApp"],
      active: true,
      upgrade: false,
    },
  ]);

  // Modal Criador de Planos do Dono
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [newSaasPlan, setNewSaasPlan] = useState({
    name: "",
    price: "R$ 147/mês",
    appsLimit: "10 Mini Apps",
    trialDays: "7 dias grátis",
    desc: "Plano intermediário para produtores em crescimento.",
    featuresStr: "Até 10 Mini Apps\nDomínio próprio\nWebhooks de Venda\nSuporte VIP",
  });

  const handleCreateSaaSPlan = () => {
    if (!newSaasPlan.name.trim()) {
      alert("Por favor, digite o nome do plano.");
      return;
    }
    const created: SaaSPlanItem = {
      id: "plan-" + Date.now(),
      name: newSaasPlan.name,
      price: newSaasPlan.price,
      appsLimit: newSaasPlan.appsLimit,
      trialDays: newSaasPlan.trialDays,
      desc: newSaasPlan.desc,
      features: newSaasPlan.featuresStr.split("\n").filter((f) => f.trim().length > 0),
      active: true,
      upgrade: true,
    };
    setSaasPlans([...saasPlans, created]);
    setShowCreatePlanModal(false);
    showToast(`Plano "${created.name}" criado com sucesso no Studio!`);
  };

  // 3. FATURAS DO SAAS (Mensalidades dos Produtores)
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: "INV-2026-089", user: "Camila Duarte", plan: "Plano Agência", value: "R$ 197,00", due: "15 Fev 2026", status: "Pago" },
    { id: "INV-2026-088", user: "Rafael Almeida", plan: "Plano Pro", value: "R$ 97,00", due: "14 Fev 2026", status: "Pago" },
    { id: "INV-2026-087", user: "Mariana Costa", plan: "Plano Agência", value: "R$ 197,00", due: "08 Fev 2026", status: "Vencido" },
    { id: "INV-2026-086", user: "Pedro Martins", plan: "Plano Pro", value: "R$ 97,00", due: "05 Fev 2026", status: "Vencido" },
    { id: "INV-2026-085", user: "Beatriz Souza", plan: "Plano Pro", value: "R$ 97,00", due: "20 Fev 2026", status: "Pendente" },
  ]);

  // 4. TEMPLATES DO SISTEMA
  const [templates, setTemplates] = useState<TemplateItem[]>([
    { id: 1, name: "Guia Interativo", category: "Guia & E-book", author: "MiniApps Studio", installs: 840, type: "HTML + IA", icon: "🥑", color: "from-violet-600 to-fuchsia-500", description: "Capítulo por capítulo com checklist de progresso e botão de pagamento direto." },
    { id: 2, name: "Desafio 7 Dias", category: "Desafio", author: "MiniApps Studio", installs: 620, type: "Interativo", icon: "🔥", color: "from-pink-500 to-orange-400", description: "Página com contagem regressiva, tarefas diárias e prova social integrada." },
    { id: 3, name: "Quiz de Venda Qualificada", category: "Funil de Vendas", author: "Equipe Oficial", installs: 512, type: "Quiz + CTA", icon: "🎯", color: "from-orange-500 to-amber-400", description: "3 perguntas estratégicas que direcionam o visitante para a oferta certa." },
    { id: 4, name: "Mini Curso em Vídeo", category: "Cursos", author: "Studio VIP", installs: 430, type: "Vídeo + Membros", icon: "🎓", color: "from-indigo-600 to-violet-500", description: "Aulas em vídeo sem distrações, ideal para infoprodutos de entrada e upsell." },
  ]);

  // 5. CHAVES DE IA GLOBAIS DO SUPER ADMIN (DONO DA PLATAFORMA)
  const [globalAiKeys, setGlobalAiKeys] = useState<GlobalAIKey[]>([
    { id: "openai", provider: "OpenAI", model: "GPT-4o & GPT-4o-mini", keyMasked: "sk-proj-••••••••9A1f", status: "connected", speed: "1.2s" },
    { id: "gemini", provider: "Google Gemini", model: "Gemini 1.5 Pro & Flash", keyMasked: "AIzaSy••••••••xK39", status: "connected", speed: "0.8s" },
    { id: "groq", provider: "Groq Cloud", model: "Llama 3.3 70B Versatile", keyMasked: "gsk_••••••••41bA", status: "connected", speed: "0.3s" },
    { id: "anthropic", provider: "Anthropic", model: "Claude 3.5 Sonnet", keyMasked: "sk-ant-••••••••55Cc", status: "disconnected", speed: "--" },
  ]);

  // 6. CONFIGURAÇÕES DA PLATAFORMA
  const [saasSettings, setSaasSettings] = useState({
    platformName: "MiniApps Studio",
    domain: "miniapps.187.127.28.82.nip.io",
    supportEmail: "admin@miniapps.studio",
    allowRegistration: true,
    defaultTrialDays: 7,
    currency: "BRL — Real",
  });

  return (
    <div className="min-h-screen bg-[#0B0714] text-[#F8F5FF] flex flex-col md:flex-row font-sans selection:bg-[#7C3AED]/30">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[999] bg-[#1D1236] text-white border border-[#7C3AED] text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center text-xs">✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Dark Purple #120A22 - Super Admin Dono do SaaS) */}
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
              <p className="text-[11px] text-[#A798C9] font-medium">Painel do Dono · Super Admin</p>
            </div>
          </div>

          {/* Atalho Principal para o Painel do Produtor */}
          <div className="mb-4">
            <Link
              href="/painel"
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-extrabold text-xs shadow-md hover:brightness-110 transition"
              title="Acessar o Painel do Produtor (onde ficam os apps, vendas, webhooks e anúncios)"
            >
              <Icon name="ShoppingBag" size={14} />
              <span>Painel do Produtor (Vendedor) →</span>
            </Link>
          </div>

          {/* Navigation Menu do Super Admin */}
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard SaaS", icon: "LayoutDashboard" },
              { id: "usuarios", label: "Produtores / Usuários", icon: "Users", badge: users.length },
              { id: "planos", label: "Planos da Plataforma", icon: "Layers", badge: saasPlans.length },
              { id: "templates", label: "Templates Globais", icon: "LayoutTemplate" },
              { id: "faturas", label: "Faturas do SaaS", icon: "Receipt", badge: 12 },
              { id: "ia", label: "Chaves de IA Globais", icon: "Key" },
              { id: "config", label: "Configurações SaaS", icon: "Settings" },
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
                  <div className="flex items-center gap-2.5">
                    <Icon name={item.icon as any} size={16} className={active ? "text-[#EC4899]" : "text-[#9F8EC4]"} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EC4899] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="pt-4 border-t border-[#2D1E51]/60">
          <div className="p-3 rounded-2xl bg-gradient-to-b from-[#1C1236] to-[#140A28] border border-[#2D1E51]">
            <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
              <span className="text-pink-400">⚡</span>
              <span>Crescimento do SaaS</span>
            </div>
            <p className="text-[11px] text-[#A798C9]">+18,4% em novos produtores nos últimos 30 dias.</p>
          </div>

          <div className="flex items-center gap-2.5 mt-3 px-2 text-xs text-slate-400">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-xs">
              AD
            </div>
            <div className="truncate">
              <p className="font-bold text-white truncate">Admin Master</p>
              <p className="text-[10px] text-pink-400 font-semibold">Dono da Plataforma</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. ÁREA PRINCIPAL DO SUPER ADMIN */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 px-6 border-b border-[#2D1E51] bg-[#120A22]/80 backdrop-blur flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-[#A798C9]">
            <span>Painel do Dono</span>
            <span>•</span>
            <span className="text-white font-bold uppercase">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/painel"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs hover:brightness-110 transition shadow-sm"
            >
              <Icon name="ShoppingBag" size={13} />
              <span>Painel do Produtor (Vendas)</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200 hover:text-white font-bold text-xs transition"
            >
              <Icon name="Smartphone" size={13} />
              <span>Construtor PWA</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">

          {/* TAB 1: DASHBOARD SAAS */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black tracking-widest text-[#EC4899] uppercase">VISÃO GERAL DO SAAS</p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                    Bom dia, Admin. O Studio está crescendo.
                  </h2>
                </div>

                <button
                  onClick={() => setShowCreatePlanModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md hover:brightness-110 flex items-center gap-2 self-start"
                >
                  <Icon name="Plus" size={15} />
                  <span>Criar Novo Plano do SaaS</span>
                </button>
              </div>

              {/* 4 Métricas do SaaS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#140A28] border border-[#2D1E51]">
                  <p className="text-xs text-[#A798C9] font-medium">Usuários / Produtores Ativos</p>
                  <h3 className="text-3xl font-black text-white mt-2">1.284</h3>
                  <p className="text-xs text-emerald-400 font-bold mt-1">+128 esta semana</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#140A28] border border-[#2D1E51]">
                  <p className="text-xs text-[#A798C9] font-medium">Receita do Mês (Assinaturas)</p>
                  <h3 className="text-3xl font-black text-white mt-2">R$ 18.450</h3>
                  <p className="text-xs text-emerald-400 font-bold mt-1">+12,8% vs. mês anterior</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#140A28] border border-[#2D1E51]">
                  <p className="text-xs text-[#A798C9] font-medium">Apps Publicados no Studio</p>
                  <h3 className="text-3xl font-black text-white mt-2">3.920</h3>
                  <p className="text-xs text-purple-300 font-bold mt-1">312 apps em fevereiro</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#140A28] border border-[#F43F5E]/40">
                  <p className="text-xs text-[#F43F5E] font-medium">Faturas Vencidas da Plataforma</p>
                  <h3 className="text-3xl font-black text-white mt-2">12</h3>
                  <button onClick={() => setActiveTab("faturas")} className="text-xs text-[#F43F5E] hover:underline mt-1 block">
                    Ver faturas vencidas →
                  </button>
                </div>
              </div>

              {/* Gráficos e Novos Produtores */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#140A28] border border-[#2D1E51]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-base text-white">Novos Usuários Cadastrados</h3>
                    <span className="text-xs text-[#EC4899] font-bold">FEVEREIRO</span>
                  </div>
                  <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-[#2D1E51]">
                    {[
                      { day: "Seg", count: 42, height: "45%" },
                      { day: "Ter", count: 58, height: "60%" },
                      { day: "Qua", count: 48, height: "50%" },
                      { day: "Qui", count: 72, height: "75%" },
                      { day: "Sex", count: 64, height: "68%" },
                      { day: "Sáb", count: 89, height: "88%" },
                      { day: "Dom", count: 96, height: "98%" },
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition font-bold">{bar.count}</span>
                        <div style={{ height: bar.height }} className="w-full bg-gradient-to-t from-purple-800 to-pink-500 rounded-t-lg group-hover:brightness-125 transition"></div>
                        <span className="text-[11px] text-[#A798C9] font-semibold">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#140A28] border border-[#2D1E51] space-y-4">
                  <h3 className="font-extrabold text-base text-white">Últimos Produtores</h3>
                  <div className="space-y-3">
                    {users.slice(0, 4).map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#180E2F] border border-purple-900/30">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-800 text-white font-bold text-xs flex items-center justify-center">
                            {u.initials}
                          </div>
                          <div className="leading-tight">
                            <p className="font-bold text-xs text-white">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-950 text-pink-400 border border-pink-500/30">
                          {u.plan}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUTORES / USUÁRIOS (CRM DO SAAS) */}
          {activeTab === "usuarios" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">GESTÃO DE CLIENTES DO SAAS</p>
                  <h2 className="text-2xl font-black text-white mt-1">Produtores &amp; Usuários</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Gerencie quem utiliza sua plataforma para criar e hospedar Mini Apps.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Buscar produtor..."
                    className="px-3.5 py-2 rounded-xl bg-[#180E2F] border border-[#2D1E51] text-xs text-white outline-none focus:border-[#7C3AED] w-64"
                  />
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#180E2F] border border-[#2D1E51] text-xs text-white outline-none focus:border-[#7C3AED]"
                  >
                    <option value="Todos">Todos os Planos</option>
                    <option value="Premium">Premium</option>
                    <option value="Pro">Pro</option>
                    <option value="Free">Free</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-[#2D1E51] bg-[#140A28] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#2D1E51] bg-[#180E2F] text-[#A798C9] font-bold">
                      <th className="py-3.5 px-4">Produtor</th>
                      <th className="py-3.5 px-4">Plano do SaaS</th>
                      <th className="py-3.5 px-4">Apps Criados</th>
                      <th className="py-3.5 px-4">Mensalidade</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Desde</th>
                      <th className="py-3.5 px-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D1E51]/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#1E113B] transition">
                        <td className="py-3.5 px-4 font-bold text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-purple-900 text-purple-200 font-bold flex items-center justify-center text-xs">
                              {u.initials}
                            </div>
                            <div>
                              <p className="font-extrabold">{u.name}</p>
                              <p className="text-[11px] text-slate-400 font-normal">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-pink-400 bg-pink-950/40 px-2.5 py-0.5 rounded-full border border-pink-500/30">
                            {u.plan}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-white font-bold">{u.apps} apps</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-extrabold">{u.revenue}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              u.status === "Ativo"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : u.status === "Trial"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{u.joined}</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => showToast(`Usuário ${u.name} editado!`)}
                            className="text-xs text-purple-400 hover:text-white underline font-semibold"
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

          {/* TAB 3: PLANOS DA PLATAFORMA (CRIADOR DE PLANOS DO DONO) */}
          {activeTab === "planos" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">MONETIZAÇÃO DO SEU SAAS</p>
                  <h2 className="text-2xl font-black text-white mt-1">Planos da Plataforma (Criador do Dono)</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Crie e edite os planos de assinatura que VOCÊ vende para os produtores utilizarem a sua ferramenta de Mini Apps.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreatePlanModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md hover:brightness-110 flex items-center gap-2 self-start"
                >
                  <Icon name="Plus" size={14} />
                  <span>Criar Novo Plano do SaaS</span>
                </button>
              </div>

              {/* Grid de Planos do Dono */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {saasPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-6 rounded-3xl bg-[#140A28] border border-purple-500/30 flex flex-col justify-between hover:border-purple-400 transition relative"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">{plan.trialDays}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Ativo</span>
                      </div>
                      <h3 className="font-black text-xl text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">{plan.price}</span>
                      </div>
                      <p className="text-xs font-bold text-purple-300 mt-2">Limite: {plan.appsLimit}</p>

                      <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-purple-900/40">
                      <button
                        onClick={() => showToast(`Plano ${plan.name} configurado!`)}
                        className="w-full py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800 text-purple-200 text-xs font-bold transition"
                      >
                        Editar Este Plano
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEMPLATES GLOBAIS */}
          {activeTab === "templates" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">MODELOS PRONTOS DO SISTEMA</p>
                <h2 className="text-2xl font-black text-white mt-1">Templates Oficiais</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Templates que todos os produtores podem escolher no construtor para criar seus apps com 1 clique.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((tpl) => (
                  <div key={tpl.id} className="p-5 rounded-2xl bg-[#140A28] border border-purple-500/30 space-y-3">
                    <div className="text-3xl">{tpl.icon}</div>
                    <h3 className="font-extrabold text-white text-base">{tpl.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{tpl.description}</p>
                    <div className="pt-2 flex items-center justify-between border-t border-purple-900/30 text-xs text-purple-300">
                      <span>{tpl.category}</span>
                      <span className="font-bold">{tpl.installs} usos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FATURAS DO SAAS */}
          {activeTab === "faturas" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">COBRANÇA DE MENSALIDADES</p>
                <h2 className="text-2xl font-black text-white mt-1">Faturas dos Produtores</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Acompanhe quem pagou a assinatura da plataforma e faturas pendentes.
                </p>
              </div>

              <div className="rounded-2xl border border-[#2D1E51] bg-[#140A28] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#2D1E51] bg-[#180E2F] text-[#A798C9] font-bold">
                      <th className="py-3 px-4">Fatura</th>
                      <th className="py-3 px-4">Produtor</th>
                      <th className="py-3 px-4">Plano</th>
                      <th className="py-3 px-4">Valor</th>
                      <th className="py-3 px-4">Vencimento</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D1E51]/60">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#1E113B]">
                        <td className="py-3 px-4 font-mono text-purple-300">{inv.id}</td>
                        <td className="py-3 px-4 font-bold text-white">{inv.user}</td>
                        <td className="py-3 px-4 text-slate-300">{inv.plan}</td>
                        <td className="py-3 px-4 font-extrabold text-emerald-400">{inv.value}</td>
                        <td className="py-3 px-4 text-slate-400">{inv.due}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === "Pago"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CHAVES DE IA GLOBAIS (SUPER ADMIN) */}
          {activeTab === "ia" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">INTELIGÊNCIA ARTIFICIAL MESTRE</p>
                <h2 className="text-2xl font-black text-white mt-1">Chaves de IA Globais do Dono</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Essas são as suas chaves mestre da OpenAI, Google Gemini, Groq e Anthropic que alimentam os recursos do sistema.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {globalAiKeys.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-[#140A28] border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-extrabold text-white text-base">{item.provider}</h3>
                        <p className="text-xs text-purple-300">{item.model}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        {item.status === "connected" ? "CONECTADO" : "NÃO CONFIGURADO"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="password"
                        defaultValue={item.keyMasked}
                        className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/30 font-mono text-xs text-slate-300 outline-none"
                      />
                      <button
                        onClick={() => showToast(`Chave mestre da ${item.provider} atualizada!`)}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CONFIGURAÇÕES GERAIS DO SAAS */}
          {activeTab === "config" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">GERAL DO SISTEMA</p>
                <h2 className="text-2xl font-black text-white mt-1">Configurações Gerais do SaaS</h2>
              </div>

              <div className="p-6 rounded-2xl bg-[#140A28] border border-purple-500/30 space-y-4 max-w-xl">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Nome do SaaS</label>
                  <input
                    defaultValue={saasSettings.platformName}
                    className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Domínio Principal</label>
                  <input
                    defaultValue={saasSettings.domain}
                    className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">E-mail de Suporte do Dono</label>
                  <input
                    defaultValue={saasSettings.supportEmail}
                    className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none"
                  />
                </div>
                <button
                  onClick={() => showToast("Configurações do SaaS salvas!")}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL: CRIADOR DE PLANOS DO DONO DO SAAS */}
      {showCreatePlanModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#120A22] border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>👑</span> Criar Novo Plano da Plataforma (Super Admin)
              </h3>
              <button
                onClick={() => setShowCreatePlanModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">Nome do Plano do SaaS:</label>
              <input
                value={newSaasPlan.name}
                onChange={(e) => setNewSaasPlan({ ...newSaasPlan, name: e.target.value })}
                placeholder="Ex: Plano Master Infoprodutor"
                className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Valor da Mensalidade</label>
                <input
                  value={newSaasPlan.price}
                  onChange={(e) => setNewSaasPlan({ ...newSaasPlan, price: e.target.value })}
                  placeholder="R$ 147/mês"
                  className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-emerald-400 font-bold outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Limite de Apps</label>
                <input
                  value={newSaasPlan.appsLimit}
                  onChange={(e) => setNewSaasPlan({ ...newSaasPlan, appsLimit: e.target.value })}
                  placeholder="Ex: Até 10 Mini Apps"
                  className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">Descrição Breve:</label>
              <input
                value={newSaasPlan.desc}
                onChange={(e) => setNewSaasPlan({ ...newSaasPlan, desc: e.target.value })}
                placeholder="Para quem é esse plano?"
                className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">Recursos Inclusos (1 por linha):</label>
              <textarea
                rows={3}
                value={newSaasPlan.featuresStr}
                onChange={(e) => setNewSaasPlan({ ...newSaasPlan, featuresStr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowCreatePlanModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1F103D] text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSaaSPlan}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Criar Plano no SaaS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
