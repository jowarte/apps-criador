"use client";

import { useState } from "react";
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

export interface AppItem {
  id: number;
  name: string;
  producer: string;
  login: string;
  sales: string;
  domain: string;
  status: "Publicado" | "Rascunho" | "Manutenção";
  available: boolean;
  themeColor: string;
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
  type: "Vídeo 9:16" | "Banner" | "Popup";
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
  events: string;
  active: boolean;
}

export function BackofficeView({
  onOpenAppInEditor,
  onOpenConverter,
}: {
  onOpenAppInEditor?: (appName: string) => void;
  onOpenConverter?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "usuarios" | "planos" | "apps" | "templates" | "anuncios" | "faturas" | "webhooks" | "config"
  >("dashboard");

  // CRM Users state
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
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Plans state
  const [plans, setPlans] = useState<PlanItem[]>([
    {
      id: "free",
      name: "Free",
      price: "R$ 0",
      apps: "1 app",
      trial: "7 dias grátis",
      desc: "Para testar o MiniApps e publicar o primeiro app.",
      features: ["Editor Arrastar e Soltar", "Templates Básicos", "Analytics"],
      active: true,
      upgrade: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "R$ 97",
      apps: "10 apps",
      trial: "7 dias grátis",
      desc: "Para produtores que vendem todos os dias no WhatsApp.",
      features: ["Editor Arrastar e Soltar", "IA Gerar App", "Domínio Próprio", "Webhook", "Templates Premium", "Analytics", "Vídeo 9:16"],
      active: true,
      upgrade: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: "R$ 197",
      apps: "Apps Ilimitados",
      trial: "7 dias grátis",
      desc: "Para agências, infoprodutores e grandes operações.",
      features: ["Editor Arrastar e Soltar", "IA Gerar App", "Domínio Próprio", "Webhook", "Templates Premium", "Analytics", "Loja / Upsell", "Vídeo 9:16", "Suporte Prioritário"],
      active: true,
      upgrade: false,
    },
  ]);

  // Apps / PWAs state
  const [apps, setApps] = useState<AppItem[]>([
    {
      id: 1,
      name: "Guia Low Carb para Iniciantes",
      producer: "Rafael Almeida",
      login: "miniapp.studio/auth/guia-low-carb/login",
      sales: "miniapp.studio/p/guia-low-carb",
      domain: "guialowcarb.com.br",
      status: "Publicado",
      available: true,
      themeColor: "#7C3AED",
    },
    {
      id: 2,
      name: "Método Foco Total",
      producer: "Camila Duarte",
      login: "miniapp.studio/auth/metodo-foco/login",
      sales: "miniapp.studio/p/metodo-foco",
      domain: "metodofoco.com.br",
      status: "Publicado",
      available: true,
      themeColor: "#10B981",
    },
    {
      id: 3,
      name: "Inglês Fluente em 90 Dias",
      producer: "Beatriz Souza",
      login: "miniapp.studio/auth/ingles-90/login",
      sales: "miniapp.studio/p/ingles-90",
      domain: "inglesfluente.app",
      status: "Manutenção",
      available: false,
      themeColor: "#3B82F6",
    },
  ]);

  // Ads state (with 9:16 Vertical Video)
  const [ads, setAds] = useState<AdItem[]>([
    {
      id: "ad-1",
      title: "Vídeo 9:16 - Oferta Relâmpago (Stories/Reels)",
      type: "Vídeo 9:16",
      status: true,
      reach: "14.2 mil visualizações",
      ctaText: "Aproveitar Desconto de 50%",
      ctaUrl: "https://miniapp.studio/oferta",
      delaySec: 8,
    },
    {
      id: "ad-2",
      title: "Banner Superior: 30% OFF no Plano Anual",
      type: "Banner",
      status: true,
      reach: "12.4 mil visualizações",
      ctaText: "Fazer Upgrade Agora",
    },
    {
      id: "ad-3",
      title: "Popup Modal: Acesso ao Grupo VIP",
      type: "Popup",
      status: false,
      reach: "8.1 mil visualizações",
    },
  ]);

  // Invoices state
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: "FAT-1042", user: "Camila Duarte", plan: "Premium", value: "R$ 197,00", due: "10 Fev 2026", status: "Vencido" },
    { id: "FAT-1041", user: "Rafael Almeida", plan: "Pro", value: "R$ 97,00", due: "12 Fev 2026", status: "Pago" },
    { id: "FAT-1040", user: "Beatriz Souza", plan: "Pro", value: "R$ 97,00", due: "18 Fev 2026", status: "Pendente" },
    { id: "FAT-1039", user: "Mariana Costa", plan: "Premium", value: "R$ 197,00", due: "19 Jan 2026", status: "Vencido" },
  ]);

  // Webhooks state
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([
    { id: "w-1", name: "Kiwify Checkout", url: "https://miniapp.studio/api/webhooks/kiwify", events: "compra_aprovada · reembolso", active: true },
    { id: "w-2", name: "Stripe Internacional", url: "https://miniapp.studio/api/webhooks/stripe", events: "invoice.paid · subscription.canceled", active: true },
    { id: "w-3", name: "Cakto / Eduzz", url: "https://miniapp.studio/api/webhooks/eduzz", events: "fatura_paga · abandono", active: true },
    { id: "w-4", name: "Disparo Discord / n8n", url: "https://hooks.zapier.com/miniapp-events", events: "novo_usuario · plano_upgrade", active: true },
  ]);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2600);
  };

  // Toggle app availability (Maintenance toggle)
  const toggleAppAvailability = (id: number) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              available: !app.available,
              status: !app.available ? "Publicado" : "Manutenção",
            }
          : app
      )
    );
    showToast("Status de disponibilidade atualizado em tempo real!");
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesFilter = userFilter === "Todos" || u.status === userFilter;
    const matchesSearch =
      !userSearch.trim() ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 select-none">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <span className="text-emerald-400">✓</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header of Backoffice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-extrabold tracking-wide">
              SUPER ADMIN &amp; PRODUTOR
            </span>
            <span className="text-xs text-slate-400">• Painel de Gestão Multi-PWA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Gestão Central do SaaS MineApps
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitore usuários, planos, faturas vencidas, campanhas 9:16 e availability dos PWAs em tempo real.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("apps")}
            className="px-4 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs shadow-md shadow-violet-200 transition flex items-center gap-1.5"
          >
            <Icon name="Plus" size={14} />
            <span>Novo PWA</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 my-4 scrollbar-none border-b border-slate-200 text-xs font-bold text-slate-600">
        {[
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
          { id: "usuarios", label: "Usuários (CRM)", icon: "Users" },
          { id: "planos", label: "Planos & Trial", icon: "CreditCard" },
          { id: "apps", label: "PWAs & Domínios", icon: "Smartphone" },
          { id: "anuncios", label: "Anúncios (Vídeo 9:16)", icon: "Film" },
          { id: "faturas", label: "Faturas & Finanças", icon: "Receipt" },
          { id: "webhooks", label: "Hub de Webhooks", icon: "Webhook" },
          { id: "config", label: "Configurações", icon: "Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-full transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-violet-600 text-white shadow-md shadow-violet-200 font-extrabold"
                : "bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon name={tab.icon} size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/*  */}
      {/* ======================================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Usuários Ativos</span>
                <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                  👥
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">2.840</h3>
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <span>↑ +18,4%</span> <span className="text-slate-400 font-normal">nos últimos 30 dias</span>
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Receita Mensal (MRR)</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  💰
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">R$ 48.920</h3>
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <span>↑ +12,8%</span> <span className="text-slate-400 font-normal">vs. mês anterior</span>
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">PWAs no Ar</span>
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  📱
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">86 Apps</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">98,8% de disponibilidade</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-rose-200 bg-rose-50/20 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Faturas Pendentes</span>
                <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  ⚠️
                </span>
              </div>
              <h3 className="text-2xl font-black text-rose-600">12 Faturas</h3>
              <p className="text-xs text-rose-500 font-bold mt-1">Aguardando lembrete de cobrança</p>
            </div>
          </div>

          {/* Quick Shortcuts & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center justify-between">
                <span>Últimos Produtores Cadastrados</span>
                <button
                  onClick={() => setActiveTab("usuarios")}
                  className="text-xs text-violet-600 hover:underline font-bold"
                >
                  Ver Todos →
                </button>
              </h3>
              <div className="divide-y divide-slate-100">
                {users.slice(0, 4).map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-violet-600 text-white font-extrabold text-xs flex items-center justify-center">
                        {u.initials}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">{u.name}</h4>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                        {u.plan}
                      </span>
                      <span className="font-extrabold text-slate-900">{u.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Status / Actions */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">Ações Automáticas</h3>
              <button
                onClick={() => showToast("Disparando lembrete para 12 faturas vencidas...")}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Icon name="Bell" size={14} className="text-rose-500" />
                <span>Disparar Lembretes de Vencimento</span>
              </button>

              <button
                onClick={() => setActiveTab("anuncios")}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Icon name="Film" size={14} className="text-violet-600" />
                <span>Criar Anúncio em Vídeo 9:16</span>
              </button>

              <button
                onClick={() => setActiveTab("planos")}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Icon name="Sparkles" size={14} className="text-amber-500" />
                <span>Configurar Upgrade do Plano Free</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/*  */}
      {/* ======================================================== */}
      {activeTab === "usuarios" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {["Todos", "Ativo", "Trial", "Vencido", "Bloqueado"].map((status) => (
                <button
                  key={status}
                  onClick={() => setUserFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    userFilter === status
                      ? "bg-violet-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs outline-none focus:border-violet-500"
            />
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Produtor / Usuário</th>
                  <th className="py-3 px-4">Plano</th>
                  <th className="py-3 px-4">PWAs</th>
                  <th className="py-3 px-4">Faturamento</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                          {u.initials}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full">
                        {u.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{u.apps} apps</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{u.revenue}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          u.status === "Ativo"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : u.status === "Trial"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : u.status === "Bloqueado"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
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
      {/*  */}
      {/* ======================================================== */}
      {activeTab === "planos" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-violet-700 bg-violet-50 px-3 py-1 rounded-full uppercase">
                      {p.name}
                    </span>
                    <span className="text-xs text-amber-600 font-bold">{p.trial}</span>
                  </div>

                  <div className="my-2">
                    <span className="text-3xl font-black text-slate-900">{p.price}</span>
                    <span className="text-xs text-slate-400"> / mês</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">{p.desc}</p>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-extrabold uppercase text-slate-400">
                      Ferramentas Liberadas ({p.features.length})
                    </p>
                    {p.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  {p.upgrade && (
                    <div className="mb-3 p-2.5 rounded-xl bg-violet-50 border border-violet-200 text-[11px] text-violet-800 font-bold">
                      💡 Gatilho de Upgrade ativo no PWA para converter em plano pago.
                    </div>
                  )}
                  <button
                    onClick={() => showToast(`Configurações do plano ${p.name} salvas!`)}
                    className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                  >
                    Editar Plano
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/*  */}
      {/* ======================================================== */}
      {activeTab === "apps" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <div
                key={app.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Status & Availability Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        app.available
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {app.available ? "● No Ar (Online)" : "● Manutenção"}
                    </span>

                    {/* Switch de Disponibilidade em tempo real */}
                    <button
                      onClick={() => toggleAppAvailability(app.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-full transition ${
                        app.available
                          ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      }`}
                    >
                      {app.available ? "Pausar App" : "Ativar App"}
                    </button>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{app.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Produtor: {app.producer}</p>

                  {/* Links do App */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Domínio CNAME:</span>
                      <p className="font-mono text-slate-800 font-semibold">{app.domain}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Página de Vendas:</span>
                      <p className="font-mono text-violet-600 truncate">{app.sales}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      if (onOpenAppInEditor) onOpenAppInEditor(app.name);
                    }}
                    className="flex-1 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs shadow-md shadow-violet-200 transition"
                  >
                    Abrir no Construtor
                  </button>
                  <button
                    onClick={() => showToast("Link do PWA copiado!")}
                    className="px-3.5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    title="Copiar Link de Instalação PWA"
                  >
                    <Icon name="Copy" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/*  */}
      {/* ======================================================== */}
      {activeTab === "anuncios" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Player Vertical Formato Celular (9:16 - Reels/Stories)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vídeos verticais que rodam nativamente dentro do PWA com autoplay, mute e delay de botão de CTA.
                </p>
              </div>
              <button
                onClick={() => showToast("Campanha de vídeo 9:16 criada!")}
                className="px-4 py-2 rounded-full bg-violet-600 text-white font-extrabold text-xs shadow-md"
              >
                + Criar Anúncio 9:16
              </button>
            </div>

            <div className="space-y-3">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-600 flex items-center justify-center text-lg">
                      {ad.type === "Vídeo 9:16" ? "📱" : "📢"}
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{ad.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        Tipo: <strong className="text-violet-700">{ad.type}</strong> • Alcance: {ad.reach}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                        ad.status ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {ad.status ? "Ativo no PWA" : "Pausado"}
                    </span>
                    <button
                      onClick={() => showToast("Status do anúncio atualizado!")}
                      className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                    >
                      {ad.status ? "Desativar" : "Ativar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/*  */}
      {/* ======================================================== */}
      {activeTab === "faturas" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden animate-in fade-in duration-200">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">Histórico Financeiro &amp; Faturas</h3>
            <button
              onClick={() => showToast("Cobranças automáticas sincronizadas!")}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Sincronizar com Gateways
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Plano</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((fat) => (
                <tr key={fat.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{fat.id}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">{fat.user}</td>
                  <td className="py-3.5 px-4">{fat.plan}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">{fat.value}</td>
                  <td className="py-3.5 px-4 text-slate-500">{fat.due}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        fat.status === "Pago"
                          ? "bg-emerald-50 text-emerald-700"
                          : fat.status === "Pendente"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {fat.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => showToast(`Lembrete enviado para ${fat.user}!`)}
                      className="text-violet-600 hover:underline font-bold text-xs"
                    >
                      Reenviar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/*  */}
      {/* ======================================================== */}
      {activeTab === "webhooks" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900">
              Endpoints de Gateways (Kiwify, Stripe, Cakto, Eduzz)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-5">
              Copie os endpoints abaixo e cole no checkout do seu gateway para liberação e cancelamento automático de assinaturas.
            </p>

            <div className="space-y-3">
              {webhooks.map((wh) => (
                <div key={wh.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                      <span className="text-emerald-500">●</span> {wh.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">{wh.events}</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={wh.url}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 outline-none"
                    />
                    <button
                      onClick={() => showToast("URL do webhook copiada!")}
                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/*  */}
      {/* ======================================================== */}
      {activeTab === "config" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 max-w-2xl animate-in fade-in duration-200">
          <h3 className="font-extrabold text-base text-slate-900">Configurações da Plataforma White-Label</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome da Plataforma</label>
              <input defaultValue="MineApps Studio" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">E-mail de Notificações e Suporte</label>
              <input defaultValue="suporte@mineapps.studio" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Dias de Tolerância para Inadimplência</label>
              <input type="number" defaultValue="3" className="w-32 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none" />
              <p className="text-[11px] text-slate-400 mt-1">Após X dias de atraso, o PWA do produtor entra em suspensão automática.</p>
            </div>
          </div>
          <button
            onClick={() => showToast("Configurações gerais salvas!")}
            className="mt-4 px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs shadow-md"
          >
            Salvar Alterações
          </button>
        </div>
      )}

      {/* Modal Gerenciar Usuário */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Gerenciar Produtor</h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <p className="text-slate-400 text-[11px]">Nome / E-mail</p>
                <p className="font-bold text-slate-900 text-sm">{selectedUser.name}</p>
                <p className="text-slate-500">{selectedUser.email}</p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Alterar Plano Atual</label>
                <select
                  defaultValue={selectedUser.plan}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                >
                  <option value="Free">Free (R$ 0)</option>
                  <option value="Pro">Pro (R$ 97)</option>
                  <option value="Premium">Premium (R$ 197)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Conceder Dias Bônus de Trial</label>
                <div className="flex gap-2">
                  <button onClick={() => showToast("+7 dias concedidos!")} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold">+7 Dias</button>
                  <button onClick={() => showToast("+15 dias concedidos!")} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold">+15 Dias</button>
                  <button onClick={() => showToast("+30 dias concedidos!")} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold">+30 Dias</button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === selectedUser.id
                          ? { ...u, status: u.status === "Bloqueado" ? "Ativo" : "Bloqueado" }
                          : u
                      )
                    );
                    showToast("Status de bloqueio do usuário alterado!");
                    setSelectedUser(null);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold transition ${
                    selectedUser.status === "Bloqueado"
                      ? "bg-emerald-600 text-white"
                      : "bg-rose-600 text-white"
                  }`}
                >
                  {selectedUser.status === "Bloqueado" ? "Desbloquear Produtor" : "Bloquear Produtor"}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setSelectedUser(null)} className="px-4 py-2 rounded-full bg-slate-100 font-bold text-slate-700">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
