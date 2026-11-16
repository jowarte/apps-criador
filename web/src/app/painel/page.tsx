"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";

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

// Anúncios em Vídeo 9:16 para quem já comprou o App
export interface AdItem {
  id: string;
  title: string;
  type: string;
  status: boolean;
  reach: string;
  ctaText: string;
  ctaUrl: string;
  delaySec: number;
  appTarget?: string;
}

// Fatura de Aluno
export interface StudentInvoice {
  id: string;
  customerName: string;
  appName: string;
  planName: string;
  value: string;
  date: string;
  status: "Pago" | "Pendente" | "Reembolsado";
}

export default function ProducerDashboard() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "apps" | "clientes" | "planos" | "webhooks" | "anuncios" | "faturas" | "ia" | "config"
  >("dashboard");

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. MEUS APPS E PÁGINAS DE VENDAS (Exclusivo do Produtor)
  const [producerApps, setProducerApps] = useState([
    {
      id: "app-1",
      name: "Guia Low Carb para Iniciantes",
      slug: "guia-lowcarb",
      salesSlug: "guia-lowcarb",
      salesUrl: "/p/guia-lowcarb",
      pwaUrl: "/a/guia-lowcarb",
      domain: "guialowcarb.com",
      status: "NO AR",
      pixelId: "9482910394812",
      buyersCount: 1423,
      plansCount: 2,
      views: 28400,
      conversion: "5.01%",
    },
    {
      id: "app-2",
      name: "Método Foco e Rotina Produtiva",
      slug: "metodo-foco",
      salesSlug: "metodo-foco",
      salesUrl: "/p/metodo-foco",
      pwaUrl: "/a/metodo-foco",
      domain: "metodofoco.com.br",
      status: "NO AR",
      pixelId: "1283948291039",
      buyersCount: 891,
      plansCount: 1,
      views: 14500,
      conversion: "6.14%",
    },
    {
      id: "app-3",
      name: "Treino em Casa 15 Minutos",
      slug: "treino-casa",
      salesSlug: "treino-casa",
      salesUrl: "/p/treino-casa",
      pwaUrl: "/a/treino-casa",
      domain: "treinocasa.app",
      status: "NO AR",
      pixelId: "4829104829102",
      buyersCount: 431,
      plansCount: 1,
      views: 7800,
      conversion: "5.52%",
    },
    {
      id: "app-4",
      name: "Inglês Fluente do Zero",
      slug: "ingles-zero",
      salesSlug: "ingles-zero",
      salesUrl: "/p/ingles-zero",
      pwaUrl: "/a/ingles-zero",
      domain: "inglesfluente.com",
      status: "RASCUNHO",
      pixelId: "",
      buyersCount: 0,
      plansCount: 0,
      views: 210,
      conversion: "0.00%",
    },
  ]);

  // Modal para Editar Página de Vendas / Pixel
  const [selectedAppForEdit, setSelectedAppForEdit] = useState<any | null>(null);
  const [editPixelId, setEditPixelId] = useState("");
  const [editCustomDomain, setEditCustomDomain] = useState("");

  const handleOpenEditPage = (app: any) => {
    setSelectedAppForEdit(app);
    setEditPixelId(app.pixelId);
    setEditCustomDomain(app.domain);
  };

  const handleSavePageSettings = () => {
    if (!selectedAppForEdit) return;
    setProducerApps(
      producerApps.map((a) =>
        a.id === selectedAppForEdit.id
          ? { ...a, pixelId: editPixelId, domain: editCustomDomain }
          : a
      )
    );
    showToast(`Configurações da Página de Vendas de "${selectedAppForEdit.name}" salvas!`);
    setSelectedAppForEdit(null);
  };

  // 2. PLANOS DE VENDA CRIADOS PELO PRODUTOR (Venda -> Compradores)
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

  // Modal para Criar Plano de Venda para App
  const [showAppPlanModal, setShowAppPlanModal] = useState(false);
  const [newAppPlan, setNewAppPlan] = useState({
    name: "",
    price: "R$ 97,00",
    originalPrice: "R$ 197,00",
    period: "pagamento único" as "pagamento único" | "por mês" | "por ano",
    appSlug: "guia-lowcarb",
    checkoutUrl: "",
    featuresStr: "Acesso total ao PWA\nSuporte no WhatsApp\nAtualizações inclusas",
  });

  const handleCreateAppPlan = () => {
    if (!newAppPlan.name.trim()) {
      alert("Por favor, digite o nome do plano.");
      return;
    }
    const targetApp = producerApps.find((a) => a.slug === newAppPlan.appSlug);
    const plan: AppPlanItem = {
      id: "plan-" + Date.now(),
      name: newAppPlan.name,
      price: newAppPlan.price,
      originalPrice: newAppPlan.originalPrice,
      period: newAppPlan.period,
      appSlug: newAppPlan.appSlug,
      appName: targetApp?.name || "App PWA",
      features: newAppPlan.featuresStr.split("\n").filter((f) => f.trim().length > 0),
      checkoutUrl: newAppPlan.checkoutUrl || "https://pay.kiwify.com.br/checkout-demo",
      popular: true,
      active: true,
    };
    setAppPlans([plan, ...appPlans]);
    setShowAppPlanModal(false);
    showToast(`Plano "${plan.name}" adicionado à página de vendas de ${plan.appName}!`);
  };

  // 3. CRM DE COMPRADORES / ALUNOS (Mostra qual app cada um está usando!)
  const [buyers, setBuyers] = useState<BuyerCustomerItem[]>([
    {
      id: "BUY-001",
      name: "Mariana Costa",
      email: "mariana.costa@gmail.com",
      whatsapp: "(11) 98765-4321",
      appSlug: "guia-lowcarb",
      appName: "Guia Low Carb para Iniciantes",
      planName: "Acesso Vitalício + Bônus",
      amount: "R$ 97,00",
      gateway: "Kiwify",
      purchaseDate: "15/11/2026 14:32",
      status: "Liberado",
      pwaLink: "/a/guia-lowcarb",
    },
    {
      id: "BUY-002",
      name: "Carlos Eduardo Silva",
      email: "carlos.eduardo@hotmail.com",
      whatsapp: "(21) 99876-1234",
      appSlug: "metodo-foco",
      appName: "Método Foco e Rotina Produtiva",
      planName: "Acesso Anual Método Foco",
      amount: "R$ 147,00",
      gateway: "Hotmart",
      purchaseDate: "15/11/2026 12:15",
      status: "Liberado",
      pwaLink: "/a/metodo-foco",
    },
    {
      id: "BUY-003",
      name: "Fernanda Ribeiro",
      email: "fernanda.nutri@gmail.com",
      whatsapp: "(31) 97654-3210",
      appSlug: "guia-lowcarb",
      appName: "Guia Low Carb para Iniciantes",
      planName: "Assinatura Mensal Cardápio",
      amount: "R$ 29,90",
      gateway: "Kiwify",
      purchaseDate: "15/11/2026 09:40",
      status: "Liberado",
      pwaLink: "/a/guia-lowcarb",
    },
    {
      id: "BUY-004",
      name: "Bruno Albuquerque",
      email: "bruno.albuquerque@yahoo.com",
      whatsapp: "(41) 98123-4567",
      appSlug: "treino-casa",
      appName: "Treino em Casa 15 Minutos",
      planName: "Treino em Casa Trimestral",
      amount: "R$ 67,00",
      gateway: "Stripe",
      purchaseDate: "14/11/2026 18:20",
      status: "Liberado",
      pwaLink: "/a/treino-casa",
    },
    {
      id: "BUY-005",
      name: "Patrícia Mendes",
      email: "patricia.mendes@outlook.com",
      whatsapp: "(61) 99111-2233",
      appSlug: "metodo-foco",
      appName: "Método Foco e Rotina Produtiva",
      planName: "Acesso Anual Método Foco",
      amount: "R$ 147,00",
      gateway: "Cakto",
      purchaseDate: "14/11/2026 11:05",
      status: "Liberado",
      pwaLink: "/a/metodo-foco",
    },
  ]);
  const [buyerFilterApp, setBuyerFilterApp] = useState("Todos");
  const [buyerSearch, setBuyerSearch] = useState("");

  const filteredBuyers = buyers.filter((b) => {
    const matchesApp = buyerFilterApp === "Todos" ? true : b.appSlug === buyerFilterApp;
    const matchesSearch =
      b.name.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.email.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.appName.toLowerCase().includes(buyerSearch.toLowerCase());
    return matchesApp && matchesSearch;
  });

  // 4. ANÚNCIOS NO APP (9:16 E BANNERS PARA QUEM JÁ COMPROU)
  const [ads, setAds] = useState<AdItem[]>([
    {
      id: "ad-1",
      title: "Oferta Exclusiva Alunos: Guia de Receitas Doces Low Carb",
      type: "Vídeo 9:16 (Stories/Reels)",
      status: true,
      reach: "3.420 visualizações",
      ctaText: "Comprar com 50% OFF",
      ctaUrl: "https://pay.kiwify.com.br/demo-upsell",
      delaySec: 5,
      appTarget: "guia-lowcarb",
    },
    {
      id: "ad-2",
      title: "Banner Superior: Grupo VIP de Alunos no Telegram",
      type: "Banner Topo",
      status: true,
      reach: "4.150 cliques",
      ctaText: "Entrar no Grupo",
      ctaUrl: "https://t.me/grupovip",
      delaySec: 0,
      appTarget: "metodo-foco",
    },
  ]);
  const [showNewAdModal, setShowNewAdModal] = useState(false);
  const [newAd, setNewAd] = useState({
    title: "",
    type: "Vídeo 9:16 (Stories/Reels)",
    appTarget: "guia-lowcarb",
    ctaText: "Comprar Agora",
    ctaUrl: "",
    delaySec: 5,
  });

  const handleCreateAd = () => {
    if (!newAd.title.trim()) return;
    const ad: AdItem = {
      id: "ad-" + Date.now(),
      title: newAd.title,
      type: newAd.type,
      status: true,
      reach: "0 visualizações",
      ctaText: newAd.ctaText,
      ctaUrl: newAd.ctaUrl,
      delaySec: newAd.delaySec,
      appTarget: newAd.appTarget,
    };
    setAds([ad, ...ads]);
    setShowNewAdModal(false);
    showToast(`Anúncio "${ad.title}" criado e ativo no app!`);
  };

  // 5. FATURAS DOS ALUNOS
  const [studentInvoices, setStudentInvoices] = useState<StudentInvoice[]>([
    { id: "FAT-001", customerName: "Mariana Costa", appName: "Guia Low Carb", planName: "Vitalício", value: "R$ 97,00", date: "15/11/2026", status: "Pago" },
    { id: "FAT-002", customerName: "Carlos Eduardo", appName: "Método Foco", planName: "Anual", value: "R$ 147,00", date: "15/11/2026", status: "Pago" },
    { id: "FAT-003", customerName: "Fernanda Ribeiro", appName: "Guia Low Carb", planName: "Mensal", value: "R$ 29,90", date: "15/11/2026", status: "Pago" },
    { id: "FAT-004", customerName: "Bruno Albuquerque", appName: "Treino em Casa", planName: "Trimestral", value: "R$ 67,00", date: "14/11/2026", status: "Pago" },
  ]);

  // 6. CHAVES DE IA DO PRODUTOR (BYOK)
  const [producerAiKeys, setProducerAiKeys] = useState([
    { provider: "OpenAI", key: "sk-••••••••99Aa", status: "Conectado" },
    { provider: "Google Gemini", key: "", status: "Não configurado" },
    { provider: "Groq Cloud", key: "", status: "Não configurado" },
  ]);

  // 7. WEBHOOKS DE VENDA
  const webhookUrl = `${typeof window !== "undefined" ? window.location.origin : "https://mineapps.187.127.28.82.nip.io"}/api/webhooks/vendas`;
  const [simulatingWebhook, setSimulatingWebhook] = useState(false);

  const simulateSale = (platform: BuyerCustomerItem["gateway"]) => {
    setSimulatingWebhook(true);
    setTimeout(() => {
      const names = ["Larissa Ferreira", "Thiago Camargo", "Juliana Rocha", "Felipe Vasconcelos", "Renata Meireles"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomApp = producerApps[Math.floor(Math.random() * producerApps.length)];
      const newBuyer: BuyerCustomerItem = {
        id: "BUY-" + Math.floor(100 + Math.random() * 900),
        name: randomName,
        email: randomName.toLowerCase().replace(" ", ".") + "@gmail.com",
        whatsapp: "(11) 9" + Math.floor(1000 + Math.random() * 9000) + "-" + Math.floor(1000 + Math.random() * 9000),
        appSlug: randomApp.slug,
        appName: randomApp.name,
        planName: "Acesso Imediato",
        amount: "R$ 97,00",
        gateway: platform,
        purchaseDate: "Agora mesmo",
        status: "Liberado",
        pwaLink: `/a/${randomApp.slug}`,
      };
      setBuyers([newBuyer, ...buyers]);
      setStudentInvoices([
        {
          id: "FAT-" + Math.floor(100 + Math.random() * 900),
          customerName: randomName,
          appName: randomApp.name,
          planName: "Acesso Imediato",
          value: "R$ 97,00",
          date: "Hoje",
          status: "Pago",
        },
        ...studentInvoices,
      ]);
      setSimulatingWebhook(false);
      showToast(`🎉 Nova venda aprovada via ${platform}! Acesso ao app ${randomApp.name} liberado para ${randomName}.`);
    }, 1200);
  };

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
      {/* SIDEBAR DO PRODUTOR / VENDEDOR */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-[268px] shrink-0 bg-[#120A22] border-r border-[#2D1E51] flex flex-col justify-between p-4 md:min-h-screen">
        <div>
          {/* Header do Produtor */}
          <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-[#2D1E51]/60">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#7C3AED] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[#EC4899]/30">
              P
            </div>
            <div className="leading-tight">
              <h1 className="font-extrabold text-[15px] text-white tracking-tight flex items-center gap-1.5">
                Painel do Produtor
              </h1>
              <p className="text-[11px] text-[#A798C9] font-medium">Gestão de Apps & Vendas</p>
            </div>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="space-y-1.5 mb-4">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-md hover:brightness-110 transition"
            >
              <Icon name="Sparkles" size={14} />
              <span>+ Criar / Editar no Construtor</span>
            </Link>
          </div>

          {/* Menu Lateral do Vendedor */}
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard de Vendas", icon: "LayoutDashboard" },
              { id: "apps", label: "Meus Apps & Páginas", icon: "Smartphone", badge: producerApps.length },
              { id: "clientes", label: "Meus Clientes & Alunos", icon: "Users", badge: buyers.length },
              { id: "planos", label: "Planos & Ofertas dos Apps", icon: "Layers", badge: appPlans.length },
              { id: "webhooks", label: "Webhooks de Venda", icon: "Webhook" },
              { id: "anuncios", label: "Anúncios no App (9:16)", icon: "Megaphone", badge: ads.length },
              { id: "faturas", label: "Faturas dos Alunos", icon: "Receipt" },
              { id: "ia", label: "Minhas Chaves de IA", icon: "Key" },
              { id: "config", label: "Minha Conta", icon: "Settings" },
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
          <div className="flex items-center gap-2.5 px-2 text-xs text-slate-400">
            <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-white font-bold text-xs">
              PV
            </div>
            <div className="truncate">
              <p className="font-bold text-white truncate">Produtor Vendedor</p>
              <p className="text-[10px] text-emerald-400 font-semibold">Conta Ativa</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* ÁREA PRINCIPAL DO PRODUTOR */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 px-6 border-b border-[#2D1E51] bg-[#120A22]/80 backdrop-blur flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs text-[#A798C9]">
            <span>Área do Produtor</span>
            <span>•</span>
            <span className="text-white font-bold uppercase">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-sm"
            >
              <Icon name="Smartphone" size={13} />
              <span>Abrir Construtor PWA</span>
            </Link>
          </div>
        </header>

        {/* CONTEÚDO DAS ABAS */}
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">

          {/* TAB 1: DASHBOARD DE VENDAS */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">MEU NEGÓCIO DE APPS</p>
                <h2 className="text-2xl font-black text-white mt-1">Visão Geral de Vendas e Alunos</h2>
              </div>

              {/* Cards Métricas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#140A28] border border-[#2D1E51]">
                  <p className="text-xs text-[#A798C9] font-medium">Total de Alunos / Compradores</p>
                  <p className="text-2xl font-black text-white mt-2">2.745</p>
                  <p className="text-[11px] text-emerald-400 font-bold mt-1">+148 esta semana</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#140A28] border border-[#2D1E51]">
                  <p className="text-xs text-[#A798C9] font-medium">Faturamento Total com Apps</p>
                  <p className="text-2xl font-black text-white mt-2">R$ 184.250</p>
                  <p className="text-[11px] text-emerald-400 font-bold mt-1">+18,4% no último mês</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#140A28] border border-[#2D1E51]">
                  <p className="text-xs text-[#A798C9] font-medium">Apps Publicados no Ar</p>
                  <p className="text-2xl font-black text-white mt-2">{producerApps.filter(a => a.status === "NO AR").length}</p>
                  <p className="text-[11px] text-purple-400 font-bold mt-1">Prontos para venda com link e pixel</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#140A28] border border-[#2D1E51]">
                  <p className="text-xs text-[#A798C9] font-medium">Taxa Média de Conversão</p>
                  <p className="text-2xl font-black text-white mt-2">5,56%</p>
                  <p className="text-[11px] text-emerald-400 font-bold mt-1">Páginas com Pixel e VSL vertical</p>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/20 to-purple-950/40 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-white">Quer começar a vender um novo Mini App?</h3>
                  <p className="text-xs text-purple-200/80 mt-1">
                    Crie seu app no Construtor NoéPage, configure o Pixel do Facebook e conecte seu webhook da Kiwify ou Hotmart!
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("apps")}
                    className="px-4 py-2 rounded-xl bg-white text-purple-950 font-black text-xs hover:bg-slate-100 transition"
                  >
                    Ver Minhas Páginas de Venda
                  </button>
                  <Link
                    href="/"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition"
                  >
                    Abrir Construtor
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEUS APPS & PÁGINAS DE VENDA */}
          {activeTab === "apps" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">MEUS APPS E PÁGINAS DE VENDA</p>
                  <h2 className="text-2xl font-black text-white mt-1">Apps & Páginas de Venda</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Cada app possui seu link próprio de vendas, botão de visualização com olho 👁️, editor da oferta e Pixel do Facebook.
                  </p>
                </div>
                <button
                  onClick={() => setShowAppPlanModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white text-xs font-bold transition shadow-md flex items-center gap-2 self-start"
                >
                  <Icon name="Plus" size={14} />
                  <span>Adicionar Oferta/Plano para App</span>
                </button>
              </div>

              {/* Tabela de Apps e Páginas */}
              <div className="rounded-2xl border border-[#2D1E51] bg-[#140A28] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#2D1E51] bg-[#180E2F] text-[#A798C9] font-bold">
                        <th className="py-3.5 px-4">Mini App</th>
                        <th className="py-3.5 px-4">Página de Vendas</th>
                        <th className="py-3.5 px-4">Pixel do Facebook</th>
                        <th className="py-3.5 px-4">Compradores</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D1E51]/60">
                      {producerApps.map((app) => (
                        <tr key={app.id} className="hover:bg-[#1E113B] transition">
                          <td className="py-4 px-4 font-bold text-white">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
                                <Icon name="Smartphone" size={16} />
                              </div>
                              <div>
                                <p className="font-extrabold text-sm">{app.name}</p>
                                <p className="text-[10px] text-purple-300 font-normal">Domínio: {app.domain}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-mono text-pink-400 font-bold bg-pink-950/40 px-2.5 py-1 rounded-md border border-pink-500/30">
                              {app.salesUrl}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            {app.pixelId ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Pixel: {app.pixelId}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleOpenEditPage(app)}
                                className="text-xs text-purple-400 underline hover:text-white"
                              >
                                + Inserir Pixel
                              </button>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <span className="font-extrabold text-white">{app.buyersCount}</span> alunos
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                app.status === "NO AR"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {/* 👁️ Ver Página de Vendas */}
                              <Link
                                href={app.salesUrl}
                                target="_blank"
                                className="w-8 h-8 rounded-lg bg-purple-900/50 hover:bg-purple-800 flex items-center justify-center text-purple-200 hover:text-white transition"
                                title="Visualizar Página de Vendas com Olho 👁️"
                              >
                                <Icon name="Eye" size={14} />
                              </Link>

                              {/* ✏️ Editar Página de Vendas e Pixel */}
                              <button
                                onClick={() => handleOpenEditPage(app)}
                                className="w-8 h-8 rounded-lg bg-pink-900/50 hover:bg-pink-800 flex items-center justify-center text-pink-200 hover:text-white transition"
                                title="Editar Página de Vendas e Pixel do Facebook"
                              >
                                <Icon name="Edit3" size={14} />
                              </button>

                              {/* 🎨 Abrir no Construtor */}
                              <Link
                                href="/"
                                className="w-8 h-8 rounded-lg bg-indigo-900/50 hover:bg-indigo-800 flex items-center justify-center text-indigo-200 hover:text-white transition"
                                title="Editar Blocos do App no Construtor PWA"
                              >
                                <Icon name="Wrench" size={14} />
                              </Link>
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

          {/* TAB 3: MEUS CLIENTES & ALUNOS (CRM DO PRODUTOR) */}
          {activeTab === "clientes" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">MEUS ALUNOS E COMPRADORES</p>
                  <h2 className="text-2xl font-black text-white mt-1">Quem Comprou Meus Apps</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Cada cliente mostra exatamente <strong>qual app ele está usando</strong>, data da compra e status de liberação.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    value={buyerSearch}
                    onChange={(e) => setBuyerSearch(e.target.value)}
                    placeholder="Buscar aluno por nome, e-mail ou app..."
                    className="px-3.5 py-2 rounded-xl bg-[#180E2F] border border-[#2D1E51] text-xs text-white outline-none focus:border-[#7C3AED] w-64"
                  />
                  <select
                    value={buyerFilterApp}
                    onChange={(e) => setBuyerFilterApp(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#180E2F] border border-[#2D1E51] text-xs text-white outline-none focus:border-[#7C3AED]"
                  >
                    <option value="Todos">Todos os Apps</option>
                    {producerApps.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tabela de Compradores */}
              <div className="rounded-2xl border border-[#2D1E51] bg-[#140A28] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#2D1E51] bg-[#180E2F] text-[#A798C9] font-bold">
                        <th className="py-3.5 px-4">Aluno / Comprador</th>
                        <th className="py-3.5 px-4">Qual App Está Usando?</th>
                        <th className="py-3.5 px-4">Plano Comprado</th>
                        <th className="py-3.5 px-4">Valor</th>
                        <th className="py-3.5 px-4">Plataforma</th>
                        <th className="py-3.5 px-4">Data</th>
                        <th className="py-3.5 px-4">Acesso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D1E51]/60">
                      {filteredBuyers.map((b) => (
                        <tr key={b.id} className="hover:bg-[#1E113B] transition">
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div>
                              <p className="font-extrabold">{b.name}</p>
                              <p className="text-[11px] text-slate-400 font-normal">{b.email}</p>
                              <p className="text-[10px] text-emerald-400 font-mono">{b.whatsapp}</p>
                            </div>
                          </td>

                          {/* QUAL APP ESTÁ USANDO */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-900/40 border border-purple-500/40 text-purple-200 font-bold text-xs">
                              <Icon name="Smartphone" size={12} className="text-pink-400" />
                              {b.appName}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-300 font-medium">
                            {b.planName}
                          </td>

                          <td className="py-3.5 px-4 font-extrabold text-emerald-400">
                            {b.amount}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-bold text-[10px]">
                              {b.gateway}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {b.purchaseDate}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLANOS & OFERTAS DOS APPS */}
          {activeTab === "planos" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">OFERTAS PARA OS APPS</p>
                  <h2 className="text-2xl font-black text-white mt-1">Planos & Preços dos Mini Apps</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Crie planos (vitalício, mensal, anual) e vincule à página de vendas específica de cada app.
                  </p>
                </div>
                <button
                  onClick={() => setShowAppPlanModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md flex items-center gap-2 self-start"
                >
                  <Icon name="Plus" size={14} />
                  <span>Criar Novo Plano de App</span>
                </button>
              </div>

              {/* Grid de Planos dos Apps */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {appPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-5 rounded-2xl bg-[#140A28] border border-purple-500/30 flex flex-col justify-between relative hover:border-purple-400 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-900/50 text-purple-300 font-bold text-[10px]">
                          📱 {plan.appName}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{plan.period}</span>
                      </div>
                      <h3 className="font-extrabold text-base text-white">{plan.name}</h3>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-pink-400">{plan.price}</span>
                        <span className="text-xs text-slate-500 line-through">{plan.originalPrice}</span>
                      </div>

                      <ul className="mt-4 space-y-2 text-xs text-slate-300">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-purple-900/40">
                      <Link
                        href={`/p/${plan.appSlug}`}
                        target="_blank"
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-xs font-bold transition"
                      >
                        <Icon name="Eye" size={13} />
                        <span>Ver na Página de Vendas</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WEBHOOKS DE VENDA */}
          {activeTab === "webhooks" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">INTEGRAÇÕES DE PAGAMENTO</p>
                <h2 className="text-2xl font-black text-white mt-1">Conectar Plataformas de Venda</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Cole este webhook na Kiwify, Hotmart, Eduzz, Stripe ou Cakto para liberar o acesso ao comprador instantaneamente.
                </p>
              </div>

              {/* Box URL Webhook */}
              <div className="p-6 rounded-2xl bg-[#140A28] border border-purple-500/30 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Sua URL de Webhook Oficial (Cole na sua plataforma de checkout):
                  </label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={webhookUrl}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#180E2F] border border-purple-500/40 font-mono text-xs text-pink-300 outline-none select-all"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(webhookUrl);
                        showToast("URL do Webhook copiada com sucesso!");
                      }}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition"
                    >
                      Copiar URL
                    </button>
                  </div>
                </div>

                {/* Simulador de Venda Real */}
                <div className="pt-4 border-t border-purple-900/40">
                  <p className="text-xs font-bold text-white mb-2">Simular Recebimento de Venda em Tempo Real:</p>
                  <div className="flex flex-wrap gap-2">
                    {(["Kiwify", "Hotmart", "Eduzz", "Stripe", "Cakto", "Mercado Pago"] as const).map((plat) => (
                      <button
                        key={plat}
                        disabled={simulatingWebhook}
                        onClick={() => simulateSale(plat)}
                        className="px-3 py-1.5 rounded-lg bg-[#221042] hover:bg-purple-800 border border-purple-500/40 text-purple-200 text-xs font-bold transition disabled:opacity-50"
                      >
                        ⚡ Simular {plat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ANÚNCIOS NO APP (9:16 REELS/STORIES) */}
          {activeTab === "anuncios" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">MARKETING DENTRO DO APP</p>
                  <h2 className="text-2xl font-black text-white mt-1">Anúncios para quem Já Comprou</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Apresente vídeos verticais 9:16 ou banners para alunos que já estão usando seu app (Up-sells e novos produtos).
                  </p>
                </div>
                <button
                  onClick={() => setShowNewAdModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md flex items-center gap-2 self-start"
                >
                  <Icon name="Plus" size={14} />
                  <span>Criar Novo Anúncio 9:16</span>
                </button>
              </div>

              {/* Lista de Anúncios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ads.map((ad) => (
                  <div key={ad.id} className="p-5 rounded-2xl bg-[#140A28] border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-pink-900/40 text-pink-300 font-bold text-[10px]">
                        📱 {ad.type}
                      </span>
                      <span className="text-xs text-emerald-400 font-bold">Ativo no PWA</span>
                    </div>
                    <h3 className="font-extrabold text-white text-base">{ad.title}</h3>
                    <p className="text-xs text-purple-300">Alcance: {ad.reach}</p>
                    <div className="pt-2 flex items-center justify-between border-t border-purple-900/30 text-xs">
                      <span className="text-slate-400">Delay: {ad.delaySec}s</span>
                      <span className="font-bold text-white bg-purple-900/60 px-2 py-1 rounded-md">CTA: {ad.ctaText}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FATURAS DOS ALUNOS */}
          {activeTab === "faturas" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">FINANCEIRO DE VENDAS</p>
                <h2 className="text-2xl font-black text-white mt-1">Faturas dos Alunos</h2>
              </div>

              <div className="rounded-2xl border border-[#2D1E51] bg-[#140A28] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#2D1E51] bg-[#180E2F] text-[#A798C9] font-bold">
                      <th className="py-3 px-4">Fatura</th>
                      <th className="py-3 px-4">Aluno</th>
                      <th className="py-3 px-4">App</th>
                      <th className="py-3 px-4">Plano</th>
                      <th className="py-3 px-4">Valor</th>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D1E51]/60">
                    {studentInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[#1E113B]">
                        <td className="py-3 px-4 font-mono text-purple-300">{inv.id}</td>
                        <td className="py-3 px-4 font-bold text-white">{inv.customerName}</td>
                        <td className="py-3 px-4 text-slate-300">{inv.appName}</td>
                        <td className="py-3 px-4 text-slate-300">{inv.planName}</td>
                        <td className="py-3 px-4 font-extrabold text-emerald-400">{inv.value}</td>
                        <td className="py-3 px-4 text-slate-400">{inv.date}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
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

          {/* TAB 8: CHAVES DE IA DO PRODUTOR (BYOK) */}
          {activeTab === "ia" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">IA PARA SEUS APPS</p>
                <h2 className="text-2xl font-black text-white mt-1">Minhas Chaves de IA (BYOK)</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Cadastre suas chaves de API caso queira utilizar modelos avançados de IA dentro dos seus próprios Mini Apps.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {producerAiKeys.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#140A28] border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-white text-base">{item.provider}</h3>
                      <span className="text-[10px] font-bold text-emerald-400">{item.status}</span>
                    </div>
                    <input
                      type="password"
                      placeholder={`Insira sua API Key da ${item.provider}...`}
                      defaultValue={item.key}
                      className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none"
                    />
                    <button
                      onClick={() => showToast(`Chave da ${item.provider} salva para os seus apps!`)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      Salvar Chave
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: MINHA CONTA */}
          {activeTab === "config" && (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">DADOS DA CONTA</p>
                <h2 className="text-2xl font-black text-white mt-1">Minha Conta de Produtor</h2>
              </div>
              <div className="p-6 rounded-2xl bg-[#140A28] border border-purple-500/30 space-y-4 max-w-xl">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Nome do Produtor / Marca</label>
                  <input defaultValue="Produtor Vendedor" className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">E-mail</label>
                  <input defaultValue="vendedor@mineapps.com" className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/30 text-xs text-white outline-none" />
                </div>
                <button
                  onClick={() => showToast("Dados atualizados com sucesso!")}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL 1: EDITAR PÁGINA DE VENDAS & PIXEL DO FACEBOOK */}
      {selectedAppForEdit && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#120A22] border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>🎯</span> Configurar Página de Vendas & Pixel
              </h3>
              <button
                onClick={() => setSelectedAppForEdit(null)}
                className="w-7 h-7 rounded-full bg-white/10 text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              App: <strong className="text-white">{selectedAppForEdit.name}</strong>
            </p>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">ID do Pixel do Facebook (Meta Pixel):</label>
              <input
                value={editPixelId}
                onChange={(e) => setEditPixelId(e.target.value)}
                placeholder="Ex: 9482910394812"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#180E2F] border border-purple-500/40 font-mono text-xs text-emerald-300 outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Dispara PageView, ViewContent e InitiateCheckout automaticamente na página de vendas desse app!
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">Domínio Personalizado (Opcional):</label>
              <input
                value={editCustomDomain}
                onChange={(e) => setEditCustomDomain(e.target.value)}
                placeholder="Ex: guialowcarb.com.br"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAppForEdit(null)}
                className="px-4 py-2 rounded-xl bg-[#1F103D] text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePageSettings}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CRIAR PLANO PARA APP ESPECÍFICO */}
      {showAppPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#120A22] border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>💳</span> Criar Plano para Página de Vendas
              </h3>
              <button
                onClick={() => setShowAppPlanModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">Vincular a Qual App / Página:</label>
              <select
                value={newAppPlan.appSlug}
                onChange={(e) => setNewAppPlan({ ...newAppPlan, appSlug: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
              >
                {producerApps.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name} ({a.salesUrl})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">Nome do Plano / Oferta:</label>
              <input
                value={newAppPlan.name}
                onChange={(e) => setNewAppPlan({ ...newAppPlan, name: e.target.value })}
                placeholder="Ex: Acesso Vitalício + Bônus VIP"
                className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Preço Atual</label>
                <input
                  value={newAppPlan.price}
                  onChange={(e) => setNewAppPlan({ ...newAppPlan, price: e.target.value })}
                  placeholder="R$ 97,00"
                  className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-emerald-400 font-bold outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Preço De (Riscado)</label>
                <input
                  value={newAppPlan.originalPrice}
                  onChange={(e) => setNewAppPlan({ ...newAppPlan, originalPrice: e.target.value })}
                  placeholder="R$ 197,00"
                  className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-slate-400 line-through outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Cobrança</label>
                <select
                  value={newAppPlan.period}
                  onChange={(e: any) => setNewAppPlan({ ...newAppPlan, period: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
                >
                  <option value="pagamento único">Único</option>
                  <option value="por mês">Por Mês</option>
                  <option value="por ano">Por Ano</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">Link de Checkout da Kiwify / Hotmart / Stripe:</label>
              <input
                value={newAppPlan.checkoutUrl}
                onChange={(e) => setNewAppPlan({ ...newAppPlan, checkoutUrl: e.target.value })}
                placeholder="https://pay.kiwify.com.br/seu-checkout"
                className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 font-mono text-xs text-pink-300 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">Benefícios Inclusos (1 por linha):</label>
              <textarea
                rows={3}
                value={newAppPlan.featuresStr}
                onChange={(e) => setNewAppPlan({ ...newAppPlan, featuresStr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowAppPlanModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1F103D] text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateAppPlan}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Salvar e Vincular à Página
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CRIAR ANÚNCIO 9:16 */}
      {showNewAdModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#120A22] border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>📢</span> Novo Anúncio para quem Já Comprou
              </h3>
              <button
                onClick={() => setShowNewAdModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">Título do Anúncio / Oferta:</label>
              <input
                value={newAd.title}
                onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                placeholder="Ex: Oferta Especial Alunos: Mentoria com 50% OFF"
                className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">Aparecer em qual App:</label>
              <select
                value={newAd.appTarget}
                onChange={(e) => setNewAd({ ...newAd, appTarget: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
              >
                {producerApps.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Texto do Botão CTA</label>
                <input
                  value={newAd.ctaText}
                  onChange={(e) => setNewAd({ ...newAd, ctaText: e.target.value })}
                  placeholder="Comprar Agora"
                  className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Delay de Exibição (segundos)</label>
                <input
                  type="number"
                  value={newAd.delaySec}
                  onChange={(e) => setNewAd({ ...newAd, delaySec: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-purple-300 block mb-1">Link de Destino / Checkout:</label>
              <input
                value={newAd.ctaUrl}
                onChange={(e) => setNewAd({ ...newAd, ctaUrl: e.target.value })}
                placeholder="https://pay.kiwify.com.br/upsell"
                className="w-full px-3 py-2 rounded-xl bg-[#180E2F] border border-purple-500/40 font-mono text-xs text-pink-300 outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowNewAdModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1F103D] text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateAd}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Criar Anúncio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
