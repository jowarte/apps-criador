// Lista curada de emojis (Fase A). Na Fase B será substituída por emoji-mart (Unicode completo).
// Formato: "emoji palavras-chave"

const raw: Record<string, string[]> = {
  "Rostos": [
    "😀 feliz sorriso", "😃 alegre", "😄 rindo", "😁 sorrisao", "😆 gargalhada", "😅 suor alivio", "🤣 rolando rir", "😂 chorando rir",
    "🙂 leve sorriso", "😉 piscada", "😊 fofo timido", "😇 anjo", "🥰 apaixonado amor", "😍 olhos coracao", "🤩 estrela uau", "😘 beijo",
    "😋 delicia gostoso", "😎 oculos legal", "🤓 nerd estudo", "🧐 analisando", "🤔 pensando duvida", "🤗 abraco", "🤫 segredo", "🤭 ops",
    "😐 neutro", "😴 sono dormir", "😌 aliviado calma", "😮 surpreso", "😱 susto medo", "😭 chorando triste", "😢 triste", "😤 bravo",
    "😡 raiva", "🥳 festa comemorar", "🥺 por favor", "😬 tenso", "🤯 mente explodindo", "🤑 dinheiro rico", "🤠 cowboy", "👻 fantasma",
  ],
  "Gestos": [
    "👍 joinha ok positivo", "👎 negativo", "👏 palmas aplausos", "🙌 celebrar maos", "🙏 obrigado orar gratidao", "🤝 acordo parceria", "👋 tchau ola", "✌️ paz",
    "🤞 sorte dedos", "👌 perfeito ok", "🤙 me liga", "💪 forca musculo treino", "👉 apontar direita", "👈 apontar esquerda", "👆 cima", "👇 baixo",
    "☝️ atencao um", "✋ pare mao", "🫶 coracao maos amor", "🤌 italiano", "✍️ escrever", "👀 olhos ver", "🧠 cerebro inteligencia", "❤️ coracao amor vermelho",
    "🧡 coracao laranja", "💛 coracao amarelo", "💚 coracao verde", "💙 coracao azul", "💜 coracao roxo", "🖤 coracao preto", "🤍 coracao branco", "💖 coracao brilho",
  ],
  "Pessoas": [
    "👩 mulher", "👨 homem", "👧 menina", "👦 menino", "👶 bebe", "👵 vovo", "👴 vovo", "👩‍💻 programadora", "👨‍💻 programador", "👩‍🏫 professora",
    "👨‍🏫 professor", "👩‍⚕️ medica saude", "👨‍🍳 chef cozinha", "👩‍🍳 cozinheira", "🧘 yoga meditacao", "🏃 correr corrida", "🏋️ academia peso", "🚴 bicicleta",
    "💃 danca", "🕺 dancar", "👑 coroa rei rainha vip", "🎓 formatura curso", "👪 familia", "💑 casal",
  ],
  "Comida": [
    "🍎 maca", "🍌 banana", "🍓 morango", "🍇 uva", "🍉 melancia", "🍍 abacaxi", "🥑 abacate low carb", "🥦 brocolis saudavel",
    "🥕 cenoura", "🌽 milho", "🍞 pao", "🥐 croissant", "🧀 queijo", "🥚 ovo", "🍳 ovo frito cafe", "🥓 bacon",
    "🍔 hamburguer", "🍕 pizza", "🌮 taco", "🥗 salada dieta", "🍝 macarrao", "🍣 sushi", "🍰 bolo", "🎂 aniversario",
    "🍫 chocolate", "🍩 rosquinha", "🍪 biscoito", "☕ cafe", "🍵 cha", "🥤 refrigerante", "🍷 vinho", "💧 agua gota",
  ],
  "Natureza": [
    "🌞 sol", "🌙 lua noite", "⭐ estrela", "🌟 estrela brilho", "✨ brilhos magia", "⚡ raio energia", "🔥 fogo quente", "🌈 arco iris",
    "☁️ nuvem", "❄️ neve frio", "🌊 onda mar", "🌸 flor cerejeira", "🌹 rosa", "🌻 girassol", "🌿 erva natural", "🍀 trevo sorte",
    "🌳 arvore", "🌵 cacto", "🐶 cachorro", "🐱 gato", "🦋 borboleta", "🐝 abelha", "🦁 leao", "🦄 unicornio",
  ],
  "Objetos": [
    "📱 celular app", "💻 notebook", "🖥️ computador", "⌚ relogio", "📷 camera foto", "🎥 filmadora video", "🎬 claquete filme", "🎧 fone audio",
    "🎤 microfone", "📚 livros estudo", "📖 livro", "📝 anotacao", "✏️ lapis", "📌 alfinete", "📎 clipe", "📅 calendario agenda",
    "⏰ despertador tempo", "⏳ ampulheta", "💡 ideia lampada", "🔑 chave", "🔒 cadeado seguro", "🔓 aberto", "🎁 presente bonus", "🛍️ compras sacola",
    "🛒 carrinho", "💳 cartao pagamento", "💰 dinheiro saco", "💵 nota dolar", "💎 diamante premium", "🏆 trofeu vitoria", "🥇 medalha ouro", "🎯 alvo meta",
    "🚀 foguete lancamento", "📈 grafico crescimento", "📊 grafico dados", "📣 megafone anuncio", "🔔 sino notificacao", "📩 email", "📞 telefone", "🧩 quebra cabeca",
  ],
  "Símbolos": [
    "✅ check feito", "☑️ marcado", "✔️ certo", "❌ errado x", "⚠️ atencao aviso", "❓ pergunta", "❗ exclamacao", "💯 cem",
    "🆕 novo", "🆓 gratis", "🔝 topo", "🔥 tendencia", "➡️ seta direita", "⬅️ seta esquerda", "⬆️ seta cima", "⬇️ seta baixo",
    "🔄 atualizar", "▶️ play", "⏸️ pausa", "⏹️ parar", "🔴 vermelho", "🟢 verde", "🟡 amarelo", "🔵 azul",
    "🟣 roxo", "⚫ preto", "⚪ branco", "♻️ reciclar", "🏳️ bandeira", "🇧🇷 brasil bandeira", "©️ copyright", "™️ marca",
  ],
};

export interface EmojiItem {
  e: string;
  k: string;
}

export const EMOJI_CATEGORIES: { name: string; items: EmojiItem[] }[] = Object.entries(raw).map(
  ([name, list]) => ({
    name,
    items: list.map((s) => {
      const i = s.indexOf(" ");
      return { e: s.slice(0, i), k: s.slice(i + 1) };
    }),
  }),
);
