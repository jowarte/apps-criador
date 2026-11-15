"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { Block, Theme } from "@/lib/builder/types";
import { alpha, cn, youtubeEmbed } from "@/lib/builder/utils";
import { Icon } from "@/components/Icon";

type P = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
interface RP {
  block: Block;
  p: P;
  theme: Theme;
  editing: boolean;
}

const card = (t: Theme): CSSProperties => ({
  background: t.dark ? "rgba(255,255,255,0.06)" : "#ffffff",
  borderRadius: t.radius,
  border: `1px solid ${t.dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)"}`,
});

const muted = (t: Theme) => (t.dark ? "rgba(255,255,255,0.65)" : "#64748b");

function Btn({
  theme,
  label,
  url,
  variant = "solid",
  icon,
  full = true,
  editing,
}: {
  theme: Theme;
  label: string;
  url?: string;
  variant?: string;
  icon?: string;
  full?: boolean;
  editing: boolean;
}) {
  const b = theme.brand;
  const style: CSSProperties =
    variant === "outline"
      ? { border: `2px solid ${b}`, color: b, background: "transparent" }
      : variant === "gradient"
        ? { background: `linear-gradient(90deg, ${b}, #ec4899, #f97316)`, color: "#fff" }
        : { background: b, color: "#fff" };
  return (
    <a
      href={editing ? undefined : url || "#"}
      onClick={(e) => editing && e.preventDefault()}
      target={url?.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 px-5 py-3 font-bold text-[15px] transition active:scale-[0.98] hover:brightness-110",
        full && "w-full",
      )}
      style={{ ...style, borderRadius: 999, boxShadow: variant === "outline" ? undefined : `0 10px 24px ${alpha(b, 0.3)}` }}
    >
      {label}
      {icon ? <Icon name={icon} size={18} /> : null}
    </a>
  );
}

// ----------------------------------------------------------------------------
const R: Record<string, (x: RP) => ReactNode> = {
  titulo: ({ p }) => {
    const size = { sm: "text-lg", md: "text-2xl", lg: "text-3xl", xl: "text-4xl" }[p.size as string] || "text-3xl";
    return (
      <h2 className={cn("font-extrabold leading-tight tracking-tight", size)}>
        {p.emoji ? <span className="mr-2">{p.emoji}</span> : null}
        {p.text}
      </h2>
    );
  },

  texto: ({ p, theme }) => (
    <div>
      {p.title ? <h3 className="font-extrabold text-lg mb-1">{p.title}</h3> : null}
      <p className="text-[15px] leading-relaxed whitespace-pre-line" style={{ color: muted(theme) }}>
        {p.text}
      </p>
    </div>
  ),

  botao: ({ p, theme, editing }) => (
    <Btn theme={theme} label={p.label} url={p.url} variant={p.variant} icon={p.icon} full={p.full} editing={editing} />
  ),

  icone: ({ p, theme }) => (
    <div className="flex flex-col items-center gap-2" style={{ alignItems: "inherit" }}>
      <span
        className="inline-flex items-center justify-center"
        style={
          p.boxed
            ? { background: alpha(theme.brand, 0.12), color: theme.brand, borderRadius: 999, padding: (p.size || 48) * 0.35 }
            : { color: theme.brand }
        }
      >
        <Icon name={p.icon} size={p.size || 48} />
      </span>
      {p.label ? <span className="font-bold text-sm">{p.label}</span> : null}
    </div>
  ),

  emoji: ({ p }) => (
    <div className="flex flex-col gap-1" style={{ alignItems: "inherit" }}>
      <span
        className={cn(
          "inline-block leading-none",
          p.animation === "bounce" && "animate-bounce",
          p.animation === "pulse" && "animate-pulse",
          p.animation === "spin" && "animate-[spin_4s_linear_infinite]",
        )}
        style={{ fontSize: p.size || 64 }}
      >
        {p.emoji}
      </span>
      {p.label ? <span className="font-bold text-sm">{p.label}</span> : null}
    </div>
  ),

  espacador: ({ p, editing }) => (
    <div
      style={{ height: p.height || 32 }}
      className={editing ? "rounded-lg border border-dashed border-violet-300/60 bg-violet-50/40" : ""}
    />
  ),

  divisor: ({ p, theme }) =>
    p.style === "gradient" ? (
      <div className="h-[3px] rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${theme.brand}, transparent)` }} />
    ) : p.style === "dots" ? (
      <div className="text-center tracking-[0.6em] font-black" style={{ color: theme.brand }}>• • •</div>
    ) : (
      <hr style={{ borderTop: `2px ${p.style === "dashed" ? "dashed" : "solid"} ${alpha(theme.brand, 0.25)}` }} />
    ),

  imagem: ({ p, theme, editing }) => {
    const img = p.url ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={p.url}
        alt={p.caption || ""}
        className="w-full h-full object-cover"
        style={{ borderRadius: theme.radius, aspectRatio: p.aspect === "auto" ? undefined : p.aspect }}
      />
    ) : (
      <div
        className="w-full flex flex-col items-center justify-center gap-2 text-white"
        style={{
          aspectRatio: p.aspect === "auto" ? "16/9" : p.aspect,
          borderRadius: theme.radius,
          background: `linear-gradient(135deg, ${theme.brand}, #ec4899)`,
        }}
      >
        <Icon name="ImagePlus" size={36} />
        <span className="text-sm font-bold opacity-90">Cole a URL da imagem</span>
      </div>
    );
    return (
      <figure>
        {p.link && !editing ? (
          <a href={p.link} target="_blank" rel="noopener noreferrer">
            {img}
          </a>
        ) : (
          img
        )}
        {p.caption ? (
          <figcaption className="text-xs mt-2 text-center" style={{ color: muted(theme) }}>
            {p.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  },

  video: ({ p, theme, editing }) => {
    const vertical = p.format === "9/16";
    const yt = p.url ? youtubeEmbed(p.url) : null;
    const frameStyle: CSSProperties = {
      aspectRatio: vertical ? "9/16" : "16/9",
      borderRadius: theme.radius,
      maxWidth: vertical ? 340 : undefined,
      margin: vertical ? "0 auto" : undefined,
    };
    let media: ReactNode;
    if (yt) {
      const q = new URLSearchParams({
        autoplay: p.autoplay && !editing ? "1" : "0",
        mute: p.muted ? "1" : "0",
        loop: p.loop ? "1" : "0",
        playsinline: "1",
      });
      media = (
        <iframe
          src={`${yt}?${q}`}
          className="w-full h-full"
          style={{ pointerEvents: editing ? "none" : "auto" }}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      );
    } else if (p.url) {
      media = (
        <video
          src={p.url}
          className="w-full h-full object-cover"
          autoPlay={p.autoplay && !editing}
          muted={p.muted}
          loop={p.loop}
          playsInline
          controls={!editing}
        />
      );
    } else {
      media = (
        <div className="w-full h-full flex items-center justify-center">
          <span className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl">
            <Icon name="Play" size={26} className="text-slate-900 ml-1" fill="currentColor" />
          </span>
        </div>
      );
    }
    return (
      <div>
        <div className="relative overflow-hidden bg-slate-900 w-full" style={frameStyle}>
          {media}
          {p.title && !p.url ? (
            <div className="absolute bottom-0 inset-x-0 p-4 text-white bg-gradient-to-t from-black/70">
              <p className="font-extrabold">{p.title}</p>
            </div>
          ) : null}
        </div>
        {p.title && p.url ? <p className="font-bold mt-2">{p.title}</p> : null}
      </div>
    );
  },

  capa: ({ p, theme, editing }) => (
    <div
      className="relative overflow-hidden text-white p-6 pt-7"
      style={{
        borderRadius: theme.radius + 4,
        background: p.imageUrl
          ? `linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.7)), url(${p.imageUrl}) center/cover`
          : `linear-gradient(135deg, ${theme.brand}, #ec4899)`,
      }}
    >
      {p.emoji ? <span className="absolute right-5 top-4 text-5xl drop-shadow">{p.emoji}</span> : null}
      {p.badge ? (
        <span className="inline-block text-[10px] font-bold tracking-widest bg-white/25 px-2.5 py-1 rounded-full">
          {p.badge}
        </span>
      ) : null}
      <h1 className="text-[28px] font-extrabold leading-tight mt-3 pr-10">{p.title}</h1>
      {p.subtitle ? <p className="mt-2 text-[15px] opacity-90">{p.subtitle}</p> : null}
      {p.ctaLabel ? (
        <a
          href={editing ? undefined : p.ctaUrl || "#"}
          className="mt-5 inline-flex w-full justify-center bg-white font-bold py-3 rounded-full"
          style={{ color: theme.brand }}
        >
          {p.ctaLabel} →
        </a>
      ) : null}
    </div>
  ),

  colunas: ({ p, theme }) => (
    <div className={cn("grid gap-3", p.cols === "3" ? "grid-cols-3" : p.cols === "1" ? "grid-cols-1" : "grid-cols-2")}>
      {(p.items || []).map((it: P, i: number) => (
        <div key={i} className="p-4" style={card(theme)}>
          <span
            className="inline-flex w-10 h-10 items-center justify-center rounded-xl"
            style={{ background: alpha(theme.brand, 0.12), color: theme.brand }}
          >
            <Icon name={it.icon} size={20} />
          </span>
          <p className="font-extrabold mt-2 text-[15px]">{it.title}</p>
          <p className="text-[13px] mt-0.5" style={{ color: muted(theme) }}>{it.text}</p>
        </div>
      ))}
    </div>
  ),

  passos: ({ p, theme }) => (
    <div>
      {p.title ? <h3 className="font-extrabold text-xl mb-3">{p.title}</h3> : null}
      <ol className="space-y-3">
        {(p.items || []).map((it: P, i: number) => (
          <li key={i} className="flex gap-3 text-left">
            <span
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-white"
              style={{ background: theme.brand }}
            >
              {i + 1}
            </span>
            <div>
              <p className="font-extrabold">{it.title}</p>
              <p className="text-sm" style={{ color: muted(theme) }}>{it.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  ),

  pagamento: ({ p, theme, editing }) => (
    <div
      className="p-5 text-white relative overflow-hidden"
      style={{ borderRadius: theme.radius + 4, background: `linear-gradient(135deg, ${theme.brand}, #db2777)` }}
    >
      <div className="flex items-center gap-2 font-extrabold text-lg">
        <Icon name="CreditCard" size={20} /> {p.title}
      </div>
      {p.subtitle ? <p className="text-sm opacity-90 mt-1">{p.subtitle}</p> : null}
      <div className="mt-3 flex items-end gap-2">
        {p.oldPrice ? <span className="line-through opacity-70">{p.oldPrice}</span> : null}
        <span className="text-4xl font-black">{p.price}</span>
      </div>
      <a
        href={editing ? undefined : p.url || "#"}
        className="mt-4 flex justify-center bg-white font-extrabold py-3 rounded-full"
        style={{ color: theme.brand }}
      >
        {p.label}
      </a>
      <p className="text-[11px] mt-2 text-center opacity-80">🔒 Pagamento seguro • Acesso imediato</p>
    </div>
  ),

  depoimento: ({ p, theme }) => (
    <div>
      {p.title ? <h3 className="font-extrabold text-xl mb-3">{p.title}</h3> : null}
      <div className="space-y-3">
        {(p.items || []).map((it: P, i: number) => (
          <div key={i} className="p-4 text-left" style={card(theme)}>
            <div className="text-amber-400 text-sm">{"★".repeat(Math.max(1, Math.min(5, Number(it.rating) || 5)))}</div>
            <p className="text-[15px] mt-1">“{it.text}”</p>
            <p className="text-sm font-bold mt-2" style={{ color: theme.brand }}>— {it.name}</p>
          </div>
        ))}
      </div>
    </div>
  ),

  contador: function Contador({ block, p, theme }) {
    const total = Math.max(1, Number(p.minutes) || 15) * 60;
    const [left, setLeft] = useState(total);
    useEffect(() => {
      const key = `cd_${block.id}_${total}`;
      let end = Number(localStorage.getItem(key));
      if (!end || end < Date.now()) {
        end = Date.now() + total * 1000;
        localStorage.setItem(key, String(end));
      }
      const tick = () => setLeft(Math.max(0, Math.round((end - Date.now()) / 1000)));
      tick();
      const t = setInterval(tick, 1000);
      return () => clearInterval(t);
    }, [block.id, total]);
    const h = Math.floor(left / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = left % 60;
    const cell = (v: number, l: string) => (
      <div className="flex flex-col items-center">
        <span className="text-3xl font-black tabular-nums px-3 py-2 rounded-xl bg-white/15 min-w-[64px] text-center">
          {String(v).padStart(2, "0")}
        </span>
        <span className="text-[10px] mt-1 uppercase tracking-widest opacity-80">{l}</span>
      </div>
    );
    return (
      <div className="p-5 text-white text-center" style={{ borderRadius: theme.radius + 4, background: "linear-gradient(135deg,#dc2626,#f97316)" }}>
        <p className="font-extrabold">⏰ {p.title}</p>
        <div className="flex justify-center gap-2 mt-3">
          {h > 0 && cell(h, "horas")}
          {cell(m, "min")}
          {cell(s, "seg")}
        </div>
        {p.subtitle ? <p className="text-sm mt-3 opacity-90">{p.subtitle}</p> : null}
      </div>
    );
  },

  garantia: ({ p, theme }) => (
    <div className="p-5 flex gap-4 items-center text-left" style={card(theme)}>
      <div
        className="shrink-0 w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-black"
        style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)" }}
      >
        <span className="text-2xl leading-none">{p.days}</span>
        <span className="text-[10px] uppercase">dias</span>
      </div>
      <div>
        <p className="font-extrabold text-lg">{p.title}</p>
        <p className="text-sm" style={{ color: muted(theme) }}>{p.text}</p>
      </div>
    </div>
  ),

  numeros: ({ p, theme }) => (
    <div className="grid grid-cols-3 gap-2">
      {(p.items || []).map((it: P, i: number) => (
        <div key={i} className="p-3 text-center" style={card(theme)}>
          <p className="text-2xl font-black" style={{ color: theme.brand }}>{it.value}</p>
          <p className="text-xs" style={{ color: muted(theme) }}>{it.label}</p>
        </div>
      ))}
    </div>
  ),

  quiz: function Quiz({ p, theme, editing }) {
    const [sel, setSel] = useState<number | null>(null);
    return (
      <div className="p-5 text-left" style={card(theme)}>
        <p className="font-extrabold text-lg">❓ {p.question}</p>
        <div className="mt-3 space-y-2">
          {(p.options || []).map((o: string, i: number) => (
            <button
              key={i}
              onClick={() => !editing && setSel(i)}
              className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm border-2 transition"
              style={
                sel === i
                  ? { background: theme.brand, color: "#fff", borderColor: theme.brand }
                  : { borderColor: alpha(theme.brand, 0.2), background: alpha(theme.brand, 0.04) }
              }
            >
              {o}
            </button>
          ))}
        </div>
        {sel !== null ? (
          <p className="mt-3 p-3 rounded-xl text-sm font-bold" style={{ background: alpha(theme.brand, 0.1), color: theme.brand }}>
            {p.result}
          </p>
        ) : null}
      </div>
    );
  },

  checklist: function Checklist({ block, p, theme, editing }) {
    const [done, setDone] = useState<Record<number, boolean>>({});
    useEffect(() => {
      try {
        setDone(JSON.parse(localStorage.getItem(`ck_${block.id}`) || "{}"));
      } catch {}
    }, [block.id]);
    const toggle = (i: number) => {
      if (editing) return;
      const n = { ...done, [i]: !done[i] };
      setDone(n);
      localStorage.setItem(`ck_${block.id}`, JSON.stringify(n));
    };
    const items: string[] = p.items || [];
    const pct = items.length ? Math.round((Object.values(done).filter(Boolean).length / items.length) * 100) : 0;
    return (
      <div className="p-5 text-left" style={card(theme)}>
        <div className="flex justify-between items-center">
          <p className="font-extrabold text-lg">✅ {p.title}</p>
          <span className="text-xs font-bold" style={{ color: theme.brand }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full mt-2" style={{ background: alpha(theme.brand, 0.12) }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: theme.brand }} />
        </div>
        <ul className="mt-3 space-y-2">
          {items.map((it, i) => (
            <li key={i}>
              <button onClick={() => toggle(i)} className="flex items-center gap-3 w-full text-left text-[15px]">
                <span
                  className="w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0"
                  style={done[i] ? { background: theme.brand, borderColor: theme.brand, color: "#fff" } : { borderColor: alpha(theme.brand, 0.35) }}
                >
                  {done[i] ? <Icon name="Check" size={14} strokeWidth={3} /> : null}
                </span>
                <span className={done[i] ? "line-through opacity-60" : ""}>{it}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  },

  faq: function Faq({ p, theme }) {
    const [open, setOpen] = useState<number | null>(0);
    return (
      <div className="text-left">
        {p.title ? <h3 className="font-extrabold text-xl mb-3">💡 {p.title}</h3> : null}
        <div className="space-y-2">
          {(p.items || []).map((it: P, i: number) => (
            <div key={i} style={card(theme)} className="overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center p-4 font-bold text-left">
                {it.q}
                <Icon name="ChevronDown" size={18} className={cn("transition shrink-0", open === i && "rotate-180")} />
              </button>
              {open === i ? <p className="px-4 pb-4 text-sm" style={{ color: muted(theme) }}>{it.a}</p> : null}
            </div>
          ))}
        </div>
      </div>
    );
  },

  whatsapp: ({ p, theme, editing }) => {
    const href = `https://wa.me/${String(p.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(p.message || "")}`;
    if (p.floating) {
      return (
        <>
          {editing ? (
            <div className="text-xs text-center p-3 rounded-xl border border-dashed border-green-400 text-green-700 bg-green-50">
              💬 Botão flutuante do WhatsApp (aparece no canto da tela)
            </div>
          ) : null}
          <a
            href={editing ? undefined : href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl",
              editing ? "absolute right-3 bottom-3" : "fixed right-4 bottom-4",
            )}
          >
            <Icon name="MessageCircle" size={28} />
          </a>
        </>
      );
    }
    return (
      <div className="p-4 flex items-center gap-3 text-left" style={card(theme)}>
        <span className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
          <Icon name="MessageCircle" size={24} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold">{p.label}</p>
          <p className="text-xs" style={{ color: muted(theme) }}>{p.text}</p>
        </div>
        <a
          href={editing ? undefined : href}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full bg-[#25D366] text-white text-sm font-bold"
        >
          Abrir
        </a>
      </div>
    );
  },

  links: ({ p, theme, editing }) => (
    <div className="space-y-2.5">
      {(p.items || []).map((it: P, i: number) => (
        <a
          key={i}
          href={editing ? undefined : it.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3.5 font-bold transition hover:scale-[1.01]"
          style={{ ...card(theme), borderRadius: 999 }}
        >
          <span className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: theme.brand }}>
            <Icon name={it.icon} size={18} />
          </span>
          <span className="flex-1">{it.label}</span>
          <Icon name="ChevronRight" size={18} />
        </a>
      ))}
    </div>
  ),

  html: ({ p, editing }) => {
    // Renderiza em iframe sandbox SEM allow-same-origin: o código não acessa cookies/sessão do app.
    const doc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0}${p.css || ""}</style></head><body>${p.html || ""}${
      p.js ? `<script>${String(p.js).replace(/<\/script>/gi, "<\\/script>")}<\/script>` : ""
    }</body></html>`;
    return (
      <iframe
        title="html"
        sandbox="allow-scripts allow-popups allow-forms"
        srcDoc={doc}
        className="w-full border-0 block"
        style={{ height: Number(p.height) || 160, pointerEvents: editing ? "none" : "auto", background: "transparent" }}
      />
    );
  },
};

// ----------------------------------------------------------------------------
export function BlockView({ block, theme, editing }: { block: Block; theme: Theme; editing: boolean }) {
  const Cmp = R[block.type];
  const s = block.style || {};
  const style: CSSProperties = {
    textAlign: s.align,
    alignItems: s.align === "center" ? "center" : s.align === "right" ? "flex-end" : "flex-start",
    background: s.background || undefined,
    color: s.textColor || undefined,
    paddingTop: s.paddingY ?? 8,
    paddingBottom: s.paddingY ?? 8,
    paddingLeft: s.background ? 16 : undefined,
    paddingRight: s.background ? 16 : undefined,
    borderRadius: s.background ? (s.radius ?? theme.radius) : undefined,
  };
  return (
    <div
      style={style}
      className={cn(
        "flex flex-col [&>*]:w-full",
        s.align === "center" && "[&_.inline-flex]:mx-auto",
        !editing && s.hideOn === "mobile" && "max-sm:hidden",
        !editing && s.hideOn === "desktop" && "sm:hidden",
      )}
    >
      {Cmp ? (
        <Cmp block={block} p={block.props as P} theme={theme} editing={editing} />
      ) : (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">Bloco desconhecido: {block.type}</div>
      )}
    </div>
  );
}

export function themeVars(theme: Theme): CSSProperties {
  return {
    background: theme.background,
    color: theme.text,
    fontFamily: theme.font,
    ["--brand" as string]: theme.brand,
  };
}
