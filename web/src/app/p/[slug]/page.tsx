"use client";

import { use, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";

interface SalesPageData {
  slug: string;
  name: string;
  headline: string;
  subheadline: string;
  themeColor: string;
  badge: string;
  emoji: string;
  producer: string;
  rating: string;
  reviewsCount: number;
  facebookPixelId?: string;
  plans: {
    id: string;
    name: string;
    price: string;
    originalPrice: string;
    period: string;
    popular?: boolean;
    features: string[];
    checkoutUrl: string;
  }[];
  features: { icon: string; title: string; desc: string }[];
  testimonials: { name: string; text: string; role: string; avatar: string }[];
}

const APPS_SALES_DATA: Record<string, SalesPageData> = {
  "guia-lowcarb": {
    slug: "guia-lowcarb",
    name: "Guia Low Carb para Iniciantes",
    badge: "O PWA MAIS VENDIDO DE NUTRIÇÃO",
    emoji: "🥑",
    headline: "O Passo a Passo Prático no Seu Celular para Secar sem Passar Fome",
    subheadline:
      "Acesse cardápios semanais, listas de substituições inteligentes e checklists diários direto no aplicativo web leve que instala em 3 segundos.",
    themeColor: "#7C3AED",
    producer: "Rafael Almeida",
    rating: "4.9",
    reviewsCount: 1420,
    facebookPixelId: "9482910394812",
    plans: [
      {
        id: "plan-lowcarb-vit",
        name: "Acesso Vitalício + Todos os Bônus",
        price: "R$ 97,00",
        originalPrice: "R$ 197,00",
        period: "pagamento único",
        popular: true,
        features: [
          "Acesso vitalício ao aplicativo PWA",
          "Cardápios semanais atualizados",
          "Calculadora de macros integrada",
          "Grupo VIP de alunas no WhatsApp",
          "Garantia incondicional de 7 dias",
        ],
        checkoutUrl: "https://pay.kiwify.com.br/demo-lowcarb-vit",
      },
      {
        id: "plan-lowcarb-mensal",
        name: "Plano Mensal Básico",
        price: "R$ 29,90",
        originalPrice: "R$ 49,90",
        period: "por mês",
        features: [
          "Acesso ao PWA por 30 dias",
          "Cardápio básico da semana",
          "Checklist de refeições",
          "Cancele quando quiser",
        ],
        checkoutUrl: "https://pay.kiwify.com.br/demo-lowcarb-mensal",
      },
    ],
    features: [
      { icon: "📱", title: "Instalação em 1 Toque", desc: "Não ocupa espaço na memória e não precisa de App Store nem Play Store." },
      { icon: "🥗", title: "Cardápios Prontos", desc: "Refeições saborosas para café, almoço, lanche e jantar com receitas fáceis." },
      { icon: "⚡", title: "Carrega Instantâneo", desc: "Funciona mesmo com internet lenta ou sem sinal de celular." },
      { icon: "🎯", title: "Checklist de Progresso", desc: "Acompanhe seus dias sem deslizes e celebre suas vitórias diárias." },
    ],
    testimonials: [
      { name: "Camila Rodrigues", text: "Perdi 6kg no primeiro mês sem sentir aquela fraqueza horrível. O app é lindo e muito fácil de abrir na bio!", role: "Aluna há 2 meses", avatar: "CR" },
      { name: "Mariana Silva", text: "Adorei a lista de compras pronta! Só abro no supermercado e já sei o que comprar. Valeu cada centavo.", role: "Aluna Verificada", avatar: "MS" },
    ],
  },
  "metodo-foco": {
    slug: "metodo-foco",
    name: "Método Foco e Rotina Produtiva",
    badge: "MÉTODO DE ALTA PERFORMANCE",
    emoji: "🎯",
    headline: "Elimine a Procrastinação e Dobre Seu Rendimento Diário",
    subheadline:
      "O sistema prático que te ajuda a organizar o dia em blocos de tempo sem sobrecarga mental, disponível no seu celular.",
    themeColor: "#EC4899",
    producer: "Camila Duarte",
    rating: "5.0",
    reviewsCount: 890,
    facebookPixelId: "1283948291039",
    plans: [
      {
        id: "plan-foco-anual",
        name: "Acesso Anual Premium",
        price: "R$ 147,00",
        originalPrice: "R$ 297,00",
        period: "por ano",
        popular: true,
        features: [
          "Acesso completo ao Mini App de Foco",
          "Rotinas matinais e noturnas guiadas",
          "Planner de tarefas interativo com timer Pomodoro",
          "Sessões mensais de alinhamento ao vivo",
          "Suporte direto com a produtora",
        ],
        checkoutUrl: "https://pay.kiwify.com.br/demo-foco-anual",
      },
    ],
    features: [
      { icon: "⏱️", title: "Timer Pomodoro Integrado", desc: "Trabalhe em blocos focados de 25 minutos com sons binaurais." },
      { icon: "🧠", title: "Roteiros Anti-Distração", desc: "Técnicas validadas pela neurociência para manter a disciplina." },
      { icon: "🚀", title: "Acesso Imediato", desc: "Pagou pelo PIX ou Cartão, seu acesso é liberado no mesmo segundo." },
    ],
    testimonials: [
      { name: "Lucas Mendes", text: "Minha rotina de estudos mudou completamente. Consigo produzir em 4 horas o que antes levava o dia todo.", role: "Empresário", avatar: "LM" },
    ],
  },
};

function SalesContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const app = APPS_SALES_DATA[slug] || {
    slug,
    name: "Mini App Exclusivo",
    badge: "ACESSO EXCLUSIVO VIP",
    emoji: "🚀",
    headline: "Transforme Sua Rotina com o Aplicativo Mais Prático do Mercado",
    subheadline: "Acesse ferramentas interativas desenvolvidas para entregar resultados imediatos direto na palma da sua mão.",
    themeColor: "#7C3AED",
    producer: "Produtor Oficial",
    rating: "4.9",
    reviewsCount: 320,
    facebookPixelId: "000000000000",
    plans: [
      {
        id: "plan-default",
        name: "Acesso Completo ao Mini App",
        price: "R$ 67,00",
        originalPrice: "R$ 147,00",
        period: "pagamento único",
        popular: true,
        features: [
          "Acesso liberado imediatamente no seu celular",
          "Sem necessidade de instalar via App Store",
          "Atualizações e novos conteúdos inclusos",
          "Garantia total de satisfação por 7 dias",
        ],
        checkoutUrl: "https://pay.kiwify.com.br/demo",
      },
    ],
    features: [
      { icon: "⚡", title: "Acesso Instantâneo", desc: "Você recebe o link exclusivo logo após a confirmação do pagamento." },
      { icon: "📱", title: "PWA 100% Responsivo", desc: "Funciona perfeitamente em qualquer modelo de iPhone ou Android." },
    ],
    testimonials: [
      { name: "Cliente Satisfeito", text: "Experiência impecável e design super rápido!", role: "Membro VIP", avatar: "CS" },
    ],
  };

  const [pixelFired, setPixelFired] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Simulação de inicialização do Pixel do Facebook
  useEffect(() => {
    if (app.facebookPixelId) {
      console.log(`[Meta Pixel] fbq('init', '${app.facebookPixelId}'); fbq('track', 'PageView');`);
      setPixelFired(true);
    }
  }, [app.facebookPixelId]);

  const handleCheckoutClick = (planName: string, price: string, url: string) => {
    console.log(`[Meta Pixel] fbq('track', 'InitiateCheckout', { content_name: '${planName}', value: '${price}', currency: 'BRL' });`);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0B0714] text-[#F8F5FF] antialiased selection:bg-[#7C3AED] selection:text-white font-sans">
      {/* Top Banner de Urgência & Pixel Indicator */}
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] px-4 py-2 text-center text-xs font-bold text-white flex items-center justify-between shadow-lg">
        <div className="hidden sm:block text-[11px] opacity-80">
          🔒 Compra Segura • Garantia 7 Dias
        </div>
        <div className="mx-auto flex items-center gap-2">
          <span>🔥 OFERTA ESPECIAL COM DESCONTO DE LANÇAMENTO</span>
          <span className="bg-black/30 px-2 py-0.5 rounded-full text-[11px] font-mono">
            00:14:59
          </span>
        </div>
        {app.facebookPixelId && (
          <div className="hidden md:flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span>Pixel Meta: {app.facebookPixelId}</span>
          </div>
        )}
      </div>

      {/* Top Header da Página de Vendas */}
      <header className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between border-b border-[#2D1E51]/60">
        <div className="flex items-center gap-2.5">
          <div
            style={{ backgroundColor: app.themeColor }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-purple-900/50"
          >
            {app.emoji}
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base leading-tight">{app.name}</h1>
            <p className="text-[11px] text-[#A798C9]">Por {app.producer}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(window.location.href);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#180E30] hover:bg-[#241644] border border-[#2D1E51] text-[#C7B9E8] text-xs font-bold transition"
            title="Copiar link oficial da página de vendas"
          >
            <Icon name="Share2" size={13} />
            <span>{copiedLink ? "Link Copiado!" : "Copiar Link"}</span>
          </button>

          <Link
            href={`/a/${app.slug}`}
            className="px-3.5 py-1.5 rounded-full bg-[#231743] hover:bg-[#2F1F5A] border border-[#3E2B6D] text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>Já comprou?</span>
            <span className="text-[#EC4899]">Abrir App →</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 pt-10 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#EC4899] text-[11px] font-black uppercase tracking-wider mb-4 animate-in fade-in">
          <span>✨</span>
          <span>{app.badge}</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight max-w-3xl mx-auto">
          {app.headline}
        </h2>

        {/* Subheadline */}
        <p className="text-sm sm:text-base text-[#B8A9D9] mt-4 max-w-2xl mx-auto leading-relaxed">
          {app.subheadline}
        </p>

        {/* Avaliações */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#C7B9E8]">
          <span className="text-amber-400 font-bold">★★★★★</span>
          <span className="font-bold text-white">{app.rating}</span>
          <span className="text-[#8F7EB6]">({app.reviewsCount} pessoas usando)</span>
        </div>

        {/* Mockup 3D do Celular PWA */}
        <div className="mt-8 flex justify-center">
          <div className="w-[300px] bg-black rounded-[44px] p-3 border-4 border-[#3D2A6B] shadow-[0_20px_70px_rgba(124,58,237,0.35)] relative overflow-hidden">
            <div className="bg-[#120A24] rounded-[34px] p-4 text-left space-y-3">
              <div className="flex items-center justify-between text-[10px] text-[#A798C9]">
                <span>9:41</span>
                <span className="font-bold text-white">miniapps.studio</span>
                <span>100%</span>
              </div>

              <div
                style={{ backgroundColor: app.themeColor }}
                className="h-28 rounded-2xl p-3 flex flex-col justify-end text-white"
              >
                <span className="text-2xl">{app.emoji}</span>
                <p className="font-extrabold text-sm leading-tight mt-1">{app.name}</p>
                <p className="text-[10px] opacity-80">Instalação Direta no Celular</p>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-[#1C1236] border border-[#2D1E51] text-xs">
                  <span className="text-emerald-400 font-bold">✓</span> Conteúdo 100% Liberado
                </div>
                <div className="p-2.5 rounded-xl bg-[#1C1236] border border-[#2D1E51] text-xs">
                  <span className="text-emerald-400 font-bold">✓</span> Atualizações Semanais
                </div>
              </div>

              <a
                href="#planos"
                className="block text-center w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-xs font-bold shadow-lg"
              >
                Garantir Meu Acesso →
              </a>
            </div>
          </div>
        </div>

        {/* Recursos & Benefícios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 text-left">
          {app.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-gradient-to-b from-[#180E30] to-[#120A24] border border-[#2D1E51] hover:border-[#7C3AED]/50 transition"
            >
              <div className="text-2xl mb-2">{feat.icon}</div>
              <h3 className="font-extrabold text-white text-sm">{feat.title}</h3>
              <p className="text-xs text-[#A798C9] mt-1 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* SEÇÃO DE PLANOS VINCULADOS A ESTA PÁGINA ESPECÍFICA */}
        {/* ======================================================== */}
        <section id="planos" className="mt-16 pt-10 border-t border-[#2D1E51]">
          <p className="text-[11px] font-black tracking-widest text-[#EC4899] uppercase">
            ESCOLHA O SEU ACESSO
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Comece a Usar Hoje Mesmo
          </h3>
          <p className="text-xs text-[#B8A9D9] mt-1 max-w-md mx-auto">
            Acesso liberado no mesmo instante da compra. Sem contratos longos e com garantia total.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 max-w-3xl mx-auto text-left">
            {app.plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 flex flex-col justify-between border transition relative overflow-hidden ${
                  plan.popular
                    ? "bg-gradient-to-b from-[#221245] to-[#120A24] border-[#EC4899] shadow-2xl shadow-[#EC4899]/15 ring-2 ring-[#EC4899]/60"
                    : "bg-gradient-to-b from-[#180E30] to-[#120A24] border-[#2D1E51]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-0 bg-gradient-to-l from-[#EC4899] to-[#7C3AED] text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                    Mais Escolhido
                  </span>
                )}

                <div>
                  <h4 className="font-extrabold text-white text-base">{plan.name}</h4>
                  <div className="mt-3">
                    <span className="text-xs text-[#8F7EB6] line-through mr-2">
                      De {plan.originalPrice}
                    </span>
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-[#A798C9] ml-1">/ {plan.period}</span>
                  </div>

                  <div className="space-y-2.5 mt-6 pt-6 border-t border-[#2D1E51]">
                    {plan.features.map((item, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-[#F8F5FF]">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => handleCheckoutClick(plan.name, plan.price, plan.checkoutUrl)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:brightness-110 text-white font-black text-sm shadow-xl shadow-[#7C3AED]/25 transition flex items-center justify-center gap-2"
                  >
                    <span>Quero Este Acesso</span>
                    <span>→</span>
                  </button>
                  <p className="text-[10px] text-center text-[#8F7EB6] mt-2">
                    🔒 Pagamento 100% Criptografado &amp; Seguro
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Depoimentos */}
        <section className="mt-16 text-left">
          <h4 className="text-center font-extrabold text-white text-lg mb-6">
            O que quem já está usando diz:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {app.testimonials.map((test, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#140C28] border border-[#2D1E51] space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white font-bold text-xs flex items-center justify-center">
                    {test.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">{test.name}</p>
                    <p className="text-[10px] text-[#A798C9]">{test.role}</p>
                  </div>
                </div>
                <p className="text-xs text-[#C7B9E8] italic">"{test.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Garantia */}
        <section className="mt-16 p-6 rounded-3xl bg-[#140C28] border border-emerald-500/30 flex flex-col sm:flex-row items-center gap-4 text-left">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 text-3xl flex items-center justify-center shrink-0">
            🛡️
          </div>
          <div>
            <h4 className="font-extrabold text-white text-base">Garantia Incondicional de 7 Dias</h4>
            <p className="text-xs text-[#A798C9] mt-1 leading-relaxed">
              Experimente o aplicativo por 7 dias inteiros. Se você não amar a facilidade e os resultados, devolvemos 100% do seu dinheiro com apenas um e-mail. Sem letras miúdas.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2D1E51] py-8 text-center text-xs text-[#8F7EB6] space-y-2">
        <p>© 2026 {app.name} • Todos os direitos reservados.</p>
        <p className="text-[11px] opacity-70">
          Powered by MiniApps Studio • Progressive Web App Technology
        </p>
      </footer>
    </div>
  );
}

export default function AppSalesPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0714] text-white flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#C7B9E8]">Carregando Página de Vendas do Mini App...</p>
          </div>
        </div>
      }
    >
      <SalesContent params={params} />
    </Suspense>
  );
}
