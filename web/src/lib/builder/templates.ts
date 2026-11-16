import { BLOCK_MAP } from "./definitions";
import type { AppDocument, Block, Theme } from "./types";
import { uid } from "./utils";

export function makeBlock(type: string, props: Record<string, unknown> = {}, style?: Block["style"]): Block {
  const def = BLOCK_MAP[type];
  return { id: uid(), type, props: { ...(def ? def.defaults() : {}), ...props }, style };
}

export const DEFAULT_THEME: Theme = {
  brand: "#7C3AED",
  background: "#F8F7FF",
  text: "#0F172A",
  font: "var(--font-jakarta), system-ui, sans-serif",
  radius: 20,
  dark: false,
};

export interface Template {
  id: string;
  name: string;
  cat: string;
  emoji: string;
  grad: string;
  brand: string;
  cover?: string;
  blocks: () => Block[];
}

export const TEMPLATES: Template[] = [
  {
    id: "guia",
    name: "Guia Interativo",
    cat: "Guia",
    emoji: "🥑",
    grad: "linear-gradient(135deg,#7c3aed,#d946ef)",
    brand: "#7C3AED",
    cover: "/covers/guia-lowcarb.jpg",
    blocks: () => [
      makeBlock("capa", { badge: "GUIA • LOW CARB", title: "Guia Low Carb para Iniciantes", subtitle: "Um caminho simples, saboroso e possível para começar hoje.", emoji: "🥑", ctaLabel: "Começar o guia" }),
      makeBlock("colunas", {}),
      makeBlock("checklist", { title: "Seu primeiro passo", items: ["Montar o café da manhã", "Preparar a lista de compras", "Escolher 1 receita para testar"] }),
      makeBlock("depoimento", {}),
      makeBlock("pagamento", { title: "Quero meu guia agora", subtitle: "Acesso imediato + bônus de receitas." }),
    ],
  },
  {
    id: "desafio",
    name: "Desafio 7 Dias",
    cat: "Desafio",
    emoji: "🔥",
    grad: "linear-gradient(135deg,#ec4899,#fb923c)",
    brand: "#EC4899",
    cover: "/covers/desafio-fitness.jpg",
    blocks: () => [
      makeBlock("capa", { badge: "DESAFIO", title: "Desafio 7 Dias: crie sua rotina", subtitle: "Pequenos rituais, grandes mudanças.", emoji: "🔥", ctaLabel: "Entrar no desafio" }),
      makeBlock("contador", { title: "O desafio começa em", minutes: 1440 }),
      makeBlock("checklist", { title: "Dia 1 • Comece leve", items: ["Beber 2L de água", "Caminhar 20 minutos", "Dormir 30 minutos mais cedo"] }),
      makeBlock("passos", {}),
      makeBlock("whatsapp", { label: "Grupo do desafio", text: "Vaga + grupo de apoio incluso." }),
    ],
  },
  {
    id: "quiz",
    name: "Quiz de Venda",
    cat: "Vendas",
    emoji: "🎯",
    grad: "linear-gradient(135deg,#f97316,#fbbf24)",
    brand: "#F97316",
    cover: "/covers/quiz-vendas.jpg",
    blocks: () => [
      makeBlock("emoji", { emoji: "🎯", size: 72 }, { align: "center" }),
      makeBlock("titulo", { text: "Descubra o plano ideal para você", size: "lg" }, { align: "center" }),
      makeBlock("quiz", {}),
      makeBlock("quiz", { question: "Quantos dias por semana você treina?", options: ["Nenhum", "1 a 3", "4 ou mais"] }),
      makeBlock("botao", { label: "Ver minha recomendação", variant: "gradient" }),
    ],
  },
  {
    id: "curso",
    name: "Mini Curso",
    cat: "Curso",
    emoji: "🎓",
    grad: "linear-gradient(135deg,#4f46e5,#8b5cf6)",
    brand: "#6D28D9",
    cover: "/covers/mini-curso.jpg",
    blocks: () => [
      makeBlock("capa", { badge: "MINI APP • MINI CURSO", title: "Mini Curso", subtitle: "Aprenda o essencial em aulas curtas e diretas.", emoji: "🎓" }),
      makeBlock("video", { title: "Aula 1: O método em 12 minutos" }),
      makeBlock("texto", { title: "O que você vai dominar", text: "Fundamentos, prática guiada e um plano simples de aplicação." }),
      makeBlock("numeros", {}),
      makeBlock("pagamento", { title: "Liberar o curso", subtitle: "Acesso vitalício + certificado." }),
      makeBlock("faq", {}),
    ],
  },
  {
    id: "oferta",
    name: "Página de Oferta",
    cat: "Oferta",
    emoji: "✨",
    grad: "linear-gradient(135deg,#c026d3,#ec4899)",
    brand: "#C026D3",
    cover: "/covers/pagina-oferta.jpg",
    blocks: () => [
      makeBlock("capa", { badge: "OFERTA ESPECIAL", title: "Transforme seu link na bio em uma máquina de vendas", emoji: "🚀" }),
      makeBlock("video", { format: "9/16", title: "Veja em 30 segundos" }),
      makeBlock("colunas", {}),
      makeBlock("depoimento", {}),
      makeBlock("contador", {}),
      makeBlock("pagamento", {}),
      makeBlock("garantia", {}),
      makeBlock("whatsapp", { floating: true }),
    ],
  },
  {
    id: "links",
    name: "Hub de Links",
    cat: "Links",
    emoji: "🔗",
    grad: "linear-gradient(135deg,#ec4899,#8b5cf6)",
    brand: "#DB2777",
    cover: "/covers/hub-links.jpg",
    blocks: () => [
      makeBlock("emoji", { emoji: "👩‍💻", size: 72, label: "@seuperfil", animation: "none" }, { align: "center" }),
      makeBlock("texto", { title: "", text: "Todos os meus links em um lugar só." }, { align: "center" }),
      makeBlock("links", {}),
      makeBlock("botao", { label: "Falar comigo", icon: "MessageCircle", variant: "gradient" }),
    ],
  },
];

export function newDocument(templateId = "guia"): AppDocument {
  const t = TEMPLATES.find((x) => x.id === templateId) || TEMPLATES[0];
  const initialPageId = uid("p");
  return {
    schemaVersion: 1,
    name: t.name,
    slug: "",
    theme: { ...DEFAULT_THEME, brand: t.brand },
    pages: [{ id: initialPageId, name: "Início", blocks: t.blocks() }],
    menu: {
      enabled: true,
      style: "bottom_bar",
      items: [
        { id: "m-1", label: "Início", icon: "Home", pageId: initialPageId },
      ],
    },
    updatedAt: new Date().toISOString(),
  };
}
