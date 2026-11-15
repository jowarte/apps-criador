"use client";

import { useMemo, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { EMOJI_CATEGORIES } from "@/lib/builder/emojis";
import { ALL_ICON_NAMES, Icon } from "@/components/Icon";
import { cn } from "@/lib/builder/utils";

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// ------------------------------------------------------------- EMOJI
export function EmojiGrid({
  onPick,
  draggable = false,
  compact = false,
}: {
  onPick: (e: string) => void;
  draggable?: boolean;
  compact?: boolean;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(EMOJI_CATEGORIES[0].name);
  const [recent, setRecent] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("ma_recent_emoji") || "[]");
    } catch {
      return [];
    }
  });

  const pick = (e: string) => {
    const r = [e, ...recent.filter((x) => x !== e)].slice(0, 16);
    setRecent(r);
    localStorage.setItem("ma_recent_emoji", JSON.stringify(r));
    onPick(e);
  };

  const list = useMemo(() => {
    if (q.trim()) {
      const n = norm(q);
      return EMOJI_CATEGORIES.flatMap((c) => c.items).filter((i) => i.k.includes(n) || i.e === q);
    }
    return EMOJI_CATEGORIES.find((c) => c.name === cat)?.items || [];
  }, [q, cat]);

  return (
    <div>
      <SearchInput value={q} onChange={setQ} placeholder="Buscar emoji (ex.: fogo, coração)" />
      {!q && (
        <div className="flex gap-1 overflow-x-auto pb-1 mt-2 no-scrollbar">
          {EMOJI_CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setCat(c.name)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap",
                cat === c.name ? "bg-violet-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
      {!q && recent.length > 0 && (
        <>
          <p className="text-[10px] font-bold tracking-widest text-slate-400 mt-2">RECENTES</p>
          <div className="grid grid-cols-8 gap-0.5 mt-1">
            {recent.map((e) => (
              <EmojiCell key={`r${e}`} e={e} onPick={pick} draggable={draggable} compact={compact} />
            ))}
          </div>
        </>
      )}
      <div className={cn("grid grid-cols-8 gap-0.5 mt-2 overflow-y-auto pr-1", compact ? "max-h-52" : "max-h-[38vh]")}>
        {list.map((i) => (
          <EmojiCell key={i.e} e={i.e} title={i.k} onPick={pick} draggable={draggable} compact={compact} />
        ))}
        {list.length === 0 && <p className="col-span-8 text-sm text-slate-400 py-6 text-center">Nada encontrado.</p>}
      </div>
    </div>
  );
}

function EmojiCell({
  e,
  title,
  onPick,
  draggable,
  compact,
}: {
  e: string;
  title?: string;
  onPick: (e: string) => void;
  draggable: boolean;
  compact: boolean;
}) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: `new-emoji:${e}`,
    data: { kind: "new", type: "emoji", props: { emoji: e }, label: e },
    disabled: !draggable,
  });
  return (
    <button
      ref={setNodeRef}
      {...(draggable ? listeners : {})}
      {...(draggable ? attributes : {})}
      title={title}
      onClick={() => onPick(e)}
      className={cn("rounded-lg hover:bg-white/15 transition flex items-center justify-center", compact ? "text-xl h-9" : "text-2xl h-10")}
    >
      {e}
    </button>
  );
}

// ------------------------------------------------------------- ICONS
const POPULAR = [
  "Rocket", "Star", "Heart", "Zap", "Sparkles", "Check", "CircleCheck", "ShieldCheck", "Gift", "Crown", "Trophy", "Target",
  "Flame", "Smartphone", "MessageCircle", "Mail", "Phone", "MapPin", "Calendar", "Clock", "Timer", "Play", "Video", "Camera",
  "Image", "Music", "Headphones", "BookOpen", "GraduationCap", "Lightbulb", "Brain", "Dumbbell", "Apple", "Coffee", "Utensils",
  "ShoppingBag", "ShoppingCart", "CreditCard", "Wallet", "DollarSign", "TrendingUp", "ChartBar", "Users", "User", "Smile",
  "ThumbsUp", "Instagram", "Youtube", "Facebook", "Linkedin", "Twitter", "Globe", "Link", "Download", "Lock", "Key", "Bell",
  "Megaphone", "Home", "Settings", "Search", "ArrowRight", "ChevronRight", "Plus", "Info", "CircleHelp", "Award", "BadgeCheck",
];

export function IconGrid({
  onPick,
  draggable = false,
  compact = false,
  selected,
}: {
  onPick: (name: string) => void;
  draggable?: boolean;
  compact?: boolean;
  selected?: string;
}) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    if (!q.trim()) return POPULAR.filter((n) => ALL_ICON_NAMES.includes(n as never));
    const n = norm(q).replace(/\s+/g, "");
    return ALL_ICON_NAMES.filter((x) => x.toLowerCase().includes(n)).slice(0, 160);
  }, [q]);

  return (
    <div>
      <SearchInput value={q} onChange={setQ} placeholder={`Buscar entre ${ALL_ICON_NAMES.length} ícones (em inglês: heart, star…)`} />
      <p className="text-[10px] font-bold tracking-widest text-slate-400 mt-2">{q ? `${list.length} RESULTADOS` : "POPULARES"}</p>
      <div className={cn("grid grid-cols-7 gap-1 mt-1 overflow-y-auto pr-1", compact ? "max-h-52" : "max-h-[38vh]")}>
        {list.map((n) => (
          <IconCell key={n} name={n} onPick={onPick} draggable={draggable} active={selected === n} />
        ))}
      </div>
    </div>
  );
}

function IconCell({ name, onPick, draggable, active }: { name: string; onPick: (n: string) => void; draggable: boolean; active: boolean }) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: `new-icon:${name}`,
    data: { kind: "new", type: "icone", props: { icon: name }, label: name },
    disabled: !draggable,
  });
  return (
    <button
      ref={setNodeRef}
      {...(draggable ? listeners : {})}
      {...(draggable ? attributes : {})}
      title={name}
      onClick={() => onPick(name)}
      className={cn(
        "h-10 rounded-lg flex items-center justify-center transition",
        active ? "bg-violet-600 text-white" : "hover:bg-white/15 text-slate-100",
      )}
    >
      <Icon name={name} size={20} />
    </button>
  );
}

// ------------------------------------------------------------- shared
export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 focus-within:ring-2 ring-violet-500">
      <Icon name="Search" size={15} className="text-slate-400" />
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm w-full text-white placeholder:text-slate-400"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-slate-400 hover:text-white">
          <Icon name="X" size={14} />
        </button>
      )}
    </label>
  );
}
