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
