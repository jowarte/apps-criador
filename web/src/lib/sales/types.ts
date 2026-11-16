// Modelo de dados das Páginas de Vendas (1 página por app/template)

export interface SalesPlan {
  id: string;
  name: string;
  price: string; // "97,00"
  originalPrice: string;
  period: string;
  popular?: boolean;
  features: string[];
  checkoutUrl: string;
}

export interface SalesPageData {
  slug: string; // link de divulgação: /p/{slug}
  templateId?: string; // template de origem (guia, desafio...)
  appSlug: string; // app entregue após a compra: /a/{appSlug}
  name: string;
  producer: string;
  emoji: string;
  coverImage: string;
  badge: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  urgencyText: string;
  themeColor: string;
  rating: string;
  reviewsCount: number;
  pixelId: string;
  guaranteeDays: number;
  plans: SalesPlan[];
  features: { icon: string; title: string; desc: string }[];
  testimonials: { name: string; text: string; role: string }[];
  faq: { q: string; a: string }[];
  updatedAt?: string;
}

/** Qual página de vendas pertence a qual template */
export const TEMPLATE_SALES_SLUG: Record<string, string> = {
  guia: "guia-lowcarb",
  desafio: "desafio-fitness",
  quiz: "metodo-foco",
  curso: "mini-curso",
  oferta: "pagina-oferta",
  links: "hub-links",
};

export const DEFAULT_SALES_PAGES: Record<string, SalesPageData> = {
  "guia-lowcarb": {
    slug: "guia-lowcarb",
    templateId: "guia",
    appSlug: "guia-lowcarb",
    name: "Guia Low Carb para Iniciantes",
    producer: "Rafael Almeida",
    emoji: "🥑",
    coverImage: "/covers/guia-lowcarb.jpg",
    badge: "O APP DE NUTRIÇÃO MAIS VENDIDO",
    headline: "Seque sem passar fome com o passo a passo Low Carb no seu celular",
    subheadline:
      "Cardápios semanais, lista de compras pronta e checklist diário em um app leve que instala em 3 segundos — sem App Store.",
    ctaText: "Quero meu acesso agora",
    urgencyText: "🔥 Oferta de lançamento com 50% OFF por tempo limitado",
    themeColor: "#7C3AED",
    rating: "4.9",
    reviewsCount: 1420,
    pixelId: "",
    guaranteeDays: 7,
    plans: [
      {
        id: "plan-vit",
        name: "Acesso Vitalício + Bônus",
        price: "97,00",
        originalPrice: "197,00",
        period: "pagamento único",
        popular: true,
        features: [
          "Acesso vitalício ao app",
          "Cardápios semanais atualizados",
          "Lista de compras inteligente",
          "Grupo VIP no WhatsApp",
          "Garantia de 7 dias",
        ],
        checkoutUrl: "https://pay.kiwify.com.br/seu-checkout",
      },
      {
        id: "plan-mensal",
        name: "Plano Mensal",
        price: "29,90",
        originalPrice: "49,90",
        period: "por mês",
        features: ["Acesso por 30 dias", "Cardápio da semana", "Checklist de refeições", "Cancele quando quiser"],
        checkoutUrl: "https://pay.kiwify.com.br/seu-checkout-mensal",
      },
    ],
    features: [
      { icon: "📱", title: "Instala em 1 toque", desc: "Funciona como app, sem ocupar memória e sem loja de apps." },
      { icon: "🥗", title: "Cardápios prontos", desc: "Café, almoço, lanche e jantar com receitas fáceis e baratas." },
      { icon: "🛒", title: "Lista de compras", desc: "Abra no mercado e saiba exatamente o que comprar." },
      { icon: "✅", title: "Checklist diário", desc: "Acompanhe seu progresso e mantenha a constância." },
    ],
    testimonials: [
      { name: "Camila R.", text: "Perdi 6kg no primeiro mês sem passar fome. O app é lindo e muito fácil!", role: "Aluna há 2 meses" },
      { name: "Mariana S.", text: "A lista de compras pronta salvou minha vida. Valeu cada centavo.", role: "Aluna verificada" },
      { name: "Juliana P.", text: "Finalmente consegui manter a dieta. O checklist me motiva todo dia.", role: "Aluna há 3 semanas" },
    ],
    faq: [
      { q: "Como recebo o acesso?", a: "Logo após o pagamento você recebe o link do app no e-mail e no WhatsApp." },
      { q: "Funciona no iPhone e Android?", a: "Sim! O app abre no navegador e pode ser instalado na tela inicial." },
      { q: "E se eu não gostar?", a: "Você tem 7 dias de garantia. Devolvemos 100% do valor sem perguntas." },
    ],
  },

  "desafio-fitness": {
    slug: "desafio-fitness",
    templateId: "desafio",
    appSlug: "treino-casa",
    name: "Desafio 7 Dias: Treino & Queima Extrema",
    producer: "Lucas Ferreira",
    emoji: "🔥",
    coverImage: "/covers/desafio-fitness.jpg",
    badge: "DESAFIO VIP DE 7 DIAS",
    headline: "Transforme seu corpo em 15 minutos por dia direto na sala de casa",
    subheadline:
      "Aulas curtas, cronômetro de séries integrado e checklist de treinos para ativar seu metabolismo.",
    ctaText: "Entrar no Desafio Agora",
    urgencyText: "⚡ As vagas com desconto encerram hoje à meia-noite",
    themeColor: "#EC4899",
    rating: "4.95",
    reviewsCount: 890,
    pixelId: "",
    guaranteeDays: 7,
    plans: [
      {
        id: "plan-desafio-completo",
        name: "Acesso Completo ao Desafio",
        price: "47,00",
        originalPrice: "97,00",
        period: "pagamento único",
        popular: true,
        features: ["Acesso ao app com timer", "Vídeos em vertical 9:16", "Planilha de medidas", "Comunidade VIP de alunos"],
        checkoutUrl: "https://pay.kiwify.com.br/checkout-desafio",
      },
    ],
    features: [
      { icon: "⏱️", title: "Treinos de 15 Minutos", desc: "Exercícios dinâmicos sem aparelhos para fazer em casa." },
      { icon: "📱", title: "App com Cronômetro", desc: "Cronômetro automático de séries e descanso." },
      { icon: "🔥", title: "Queima Pós-Treino", desc: "Metodologia HIIT para continuar queimando calorias." },
    ],
    testimonials: [
      { name: "Rodrigo M.", text: "Sem desculpas de falta de tempo. Em 15 minutos fico suando!", role: "Aluno do Desafio" },
      { name: "Patrícia V.", text: "O app é direto ao ponto, não precisa de equipamento.", role: "Aluna verificada" },
    ],
    faq: [
      { q: "Preciso de equipamentos?", a: "Não! Todos os treinos utilizam apenas o peso do próprio corpo." },
      { q: "Serve para iniciantes?", a: "Sim, todos os movimentos possuem versão adaptada para iniciantes." },
    ],
  },

  "metodo-foco": {
    slug: "metodo-foco",
    templateId: "quiz",
    appSlug: "metodo-foco",
    name: "Método Foco & Produtividade Sem Caos",
    producer: "Camila Duarte",
    emoji: "🎯",
    coverImage: "/covers/quiz-vendas.jpg",
    badge: "SISTEMA ANTI-PROCRASTINAÇÃO",
    headline: "Dobre sua produtividade eliminando a procrastinação no celular",
    subheadline:
      "Diagnóstico guiado, Pomodoro inteligente e planner de rotina blindada para você focar no que importa.",
    ctaText: "Quero Dominar Meu Tempo",
    urgencyText: "🎯 Últimas 14 licenças com preço promocional",
    themeColor: "#F97316",
    rating: "4.88",
    reviewsCount: 654,
    pixelId: "",
    guaranteeDays: 7,
    plans: [
      {
        id: "plan-foco-anual",
        name: "Licença Anual Método Foco",
        price: "147,00",
        originalPrice: "297,00",
        period: "por ano",
        popular: true,
        features: ["PWA com Pomodoro e tarefas", "Matriz de prioridades", "Encontros mensais de alinhamento"],
        checkoutUrl: "https://pay.kiwify.com.br/checkout-foco",
      },
    ],
    features: [
      { icon: "🧠", title: "Diagnóstico de Foco", desc: "Descubra qual gatilho faz você procrastinar e como corrigir." },
      { icon: "⚡", title: "Blocos de Tempo", desc: "Sessões cronometradas para render 4 horas em apenas 1." },
    ],
    testimonials: [
      { name: "Felipe G.", text: "Consegui finalmente entregar meus projetos sem virar a noite.", role: "Empreendedor" },
    ],
    faq: [
      { q: "Como uso o app?", a: "Você instala no celular ou usa no computador pelo navegador." },
    ],
  },

  "mini-curso": {
    slug: "mini-curso",
    templateId: "curso",
    appSlug: "ingles-zero",
    name: "Mini Curso: Domine uma Nova Habilidade",
    producer: "Beatriz Souza",
    emoji: "🎓",
    coverImage: "/covers/mini-curso.jpg",
    badge: "FORMAÇÃO RÁPIDA E PRÁTICA",
    headline: "Aulas direto ao ponto para dominar o método em poucos dias",
    subheadline:
      "Sem enrolação: videoaulas gravadas, exercícios de fixação e certificado digital liberado no app.",
    ctaText: "Garantir Minha Vaga",
    urgencyText: "🎓 Turma aberta com vagas limitadas",
    themeColor: "#6D28D9",
    rating: "4.92",
    reviewsCount: 742,
    pixelId: "",
    guaranteeDays: 7,
    plans: [
      {
        id: "plan-curso-vit",
        name: "Acesso Vitalício + Certificado",
        price: "67,00",
        originalPrice: "197,00",
        period: "pagamento único",
        popular: true,
        features: ["Todas as videoaulas em HD", "Material complementar em PDF", "Certificado de conclusão"],
        checkoutUrl: "https://pay.kiwify.com.br/checkout-curso",
      },
    ],
    features: [
      { icon: "🎬", title: "Aulas de 10 minutos", desc: "Conteúdo sintetizado para você assistir onde estiver." },
      { icon: "📜", title: "Certificado Incluso", desc: "Emitido automaticamente ao concluir as etapas." },
    ],
    testimonials: [
      { name: "Larissa T.", text: "Melhor investimento que fiz. Didática impecável e objetiva.", role: "Aluna formada" },
    ],
    faq: [
      { q: "Por quanto tempo tenho acesso?", a: "O acesso é vitalício, incluindo todas as atualizações futuras." },
    ],
  },

  "pagina-oferta": {
    slug: "pagina-oferta",
    templateId: "oferta",
    appSlug: "pagina-oferta",
    name: "Oferta Exclusiva VIP: Kit Completo",
    producer: "Studio MiniApps",
    emoji: "✨",
    coverImage: "/covers/pagina-oferta.jpg",
    badge: "LOTE ESPECIAL PROMOCIONAL",
    headline: "O pacote completo para acelerar seus resultados com 60% OFF",
    subheadline:
      "Tudo o que você precisa em uma única solução, pronta para usar imediatamente no seu smartphone.",
    ctaText: "Aproveitar Desconto VIP",
    urgencyText: "⏳ Restam apenas 7 unidades com bônus liberados",
    themeColor: "#C026D3",
    rating: "5.0",
    reviewsCount: 512,
    pixelId: "",
    guaranteeDays: 15,
    plans: [
      {
        id: "plan-kit-vip",
        name: "Kit VIP Completo",
        price: "197,00",
        originalPrice: "497,00",
        period: "pagamento único",
        popular: true,
        features: ["Acesso completo a todas as ferramentas", "Bônus secretos inclusos", "Suporte VIP prioritário no WhatsApp"],
        checkoutUrl: "https://pay.kiwify.com.br/checkout-oferta",
      },
    ],
    features: [
      { icon: "🎁", title: "Super Bônus", desc: "Conteúdos extras avaliados em mais de R$ 300 inclusos grátis." },
    ],
    testimonials: [
      { name: "Gabriel A.", text: "Superou todas as expectativas. Vale cada real!", role: "Cliente VIP" },
    ],
    faq: [
      { q: "Qual a garantia?", a: "Garantia incondicional de 15 dias. Satisfação total ou seu dinheiro de volta." },
    ],
  },

  "hub-links": {
    slug: "hub-links",
    templateId: "links",
    appSlug: "hub-links",
    name: "Hub de Links Profissional",
    producer: "Studio MiniApps",
    emoji: "🔗",
    coverImage: "/covers/hub-links.jpg",
    badge: "LINK NA BIO DE ALTA CONVERSÃO",
    headline: "Centralize seus links, redes sociais e produtos em uma página linda e rápida",
    subheadline:
      "Carrega instantaneamente, customizável com sua marca e com botões diretos para WhatsApp e vendas.",
    ctaText: "Criar Meu Hub de Links",
    urgencyText: "🚀 Otimizado para Instagram, TikTok e WhatsApp",
    themeColor: "#DB2777",
    rating: "4.89",
    reviewsCount: 310,
    pixelId: "",
    guaranteeDays: 7,
    plans: [
      {
        id: "plan-links-vit",
        name: "Plano Vitalício",
        price: "37,00",
        originalPrice: "77,00",
        period: "pagamento único",
        popular: true,
        features: ["Links ilimitados", "Pixel integrado", "Estatísticas de cliques"],
        checkoutUrl: "https://pay.kiwify.com.br/checkout-links",
      },
    ],
    features: [
      { icon: "⚡", title: "Ultra Rápido", desc: "Carrega 5x mais rápido que sites tradicionais." },
    ],
    testimonials: [
      { name: "Ana Clara", text: "Minhas conversões no Instagram dobraram depois que passei a usar esse link!", role: "Influencer" },
    ],
    faq: [
      { q: "Posso usar meu próprio domínio?", a: "Sim, você pode conectar seu próprio domínio em 1 clique." },
    ],
  },
};

export function defaultSalesPage(slug: string): SalesPageData {
  if (DEFAULT_SALES_PAGES[slug]) return structuredClone(DEFAULT_SALES_PAGES[slug]);
  const base = structuredClone(DEFAULT_SALES_PAGES["guia-lowcarb"]);
  return {
    ...base,
    slug,
    appSlug: slug,
    templateId: undefined,
    name: "Meu Mini App",
    emoji: "🚀",
    coverImage: "",
    headline: "Transforme sua rotina com o app mais prático do mercado",
    subheadline: "Ferramentas interativas para resultados imediatos, direto no seu celular.",
  };
}

/** Normaliza o ID do Pixel (somente dígitos, 10 a 20 caracteres) */
export function sanitizePixelId(v: string | undefined | null): string {
  const digits = String(v || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 20 ? digits : "";
}

/** "97,00" | "R$ 97,00" | "97.00" -> 97 */
export function priceToNumber(v: string): number {
  const s = String(v || "").replace(/[^\d,.]/g, "");
  if (!s) return 0;
  const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

export function slugify(v: string): string {
  return String(v || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
