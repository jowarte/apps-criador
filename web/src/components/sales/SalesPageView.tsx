"use client";

import { useEffect, useState } from "react";
import type { SalesPageData } from "@/lib/sales/types";
import { priceToNumber } from "@/lib/sales/types";
import { MetaPixel, trackPixel, withTrackingParams } from "./MetaPixel";

export function SalesPageView({ data, appHref }: { data: SalesPageData; appHref: string }) {
  const color = data.themeColor || "#7C3AED";
  const mainPlan = data.plans.find((p) => p.popular) || data.plans[0];
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [debug, setDebug] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const isDebug = new URLSearchParams(window.location.search).get("debug") === "pixel";
    setDebug(isDebug);
    if (!isDebug) return;
    const update = () => setLogs([...(window.__mineappsPixelLog || [])]);
    update();
    window.addEventListener("mineapps-pixel", update);
    return () => window.removeEventListener("mineapps-pixel", update);
  }, []);

  const goCheckout = (planIdx: number) => {
    const plan = data.plans[planIdx];
    if (!plan) return;
    const value = priceToNumber(plan.price);
    trackPixel(
      "InitiateCheckout",
      { content_name: `${data.name} - ${plan.name}`, value, currency: "BRL", num_items: 1 },
      `ic-${Date.now()}`
    );
    const url = withTrackingParams(plan.checkoutUrl);
    // pequeno atraso para o evento do Pixel ser enviado antes de sair da página
    setTimeout(() => {
      window.location.href = url;
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#0B0714] text-[#F8F5FF] antialiased font-sans">
      <MetaPixel pixelId={data.pixelId} contentName={data.name} value={mainPlan ? priceToNumber(mainPlan.price) : 0} />

      {data.urgencyText && (
        <div className="px-4 py-2 text-center text-xs font-bold text-white" style={{ background: `linear-gradient(90deg, ${color}, #EC4899)` }}>
          {data.urgencyText}
        </div>
      )}

      {/* HERO com imagem de capa */}
      <header className="relative overflow-hidden">
        {data.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.coverImage} alt={data.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 70% 30%, ${color}55, transparent 60%)` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0714] via-[#0B0714]/85 to-[#0B0714]/20" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0714] to-transparent" />

        <div className="relative max-w-5xl mx-auto px-5 pt-8 pb-16 sm:pt-12 sm:pb-24">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg" style={{ background: color }}>
              {data.emoji}
            </div>
            <div>
              <p className="font-extrabold text-sm">{data.name}</p>
              <p className="text-[11px] text-white/60">por {data.producer}</p>
            </div>
            <a href={appHref} className="ml-auto text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15">
              Já comprou? Abrir app →
            </a>
          </div>

          <div className="max-w-xl">
            {data.badge && (
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black tracking-wider mb-4" style={{ background: `${color}33`, color: "#F9A8D4", border: `1px solid ${color}66` }}>
                ✨ {data.badge}
              </span>
            )}
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">{data.headline}</h1>
            <p className="text-sm sm:text-base text-white/75 mt-4 leading-relaxed">{data.subheadline}</p>
            <div className="flex items-center gap-2 mt-4 text-xs text-white/70">
              <span className="text-amber-400">★★★★★</span>
              <span className="font-bold text-white">{data.rating}</span>
              <span>({data.reviewsCount.toLocaleString("pt-BR")} pessoas usando)</span>
            </div>
            <a
              href="#planos"
              onClick={() => trackPixel("Lead", { content_name: data.name })}
              className="inline-flex mt-7 px-7 py-4 rounded-2xl font-black text-sm text-white shadow-2xl hover:brightness-110 transition"
              style={{ background: `linear-gradient(90deg, ${color}, #EC4899)` }}
            >
              {data.ctaText || "Quero meu acesso"} →
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 pb-16">
        {/* Benefícios */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.features.map((f, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#140C28] border border-[#2D1E51]">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-extrabold text-sm">{f.title}</h3>
              <p className="text-xs text-[#A798C9] mt-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Planos */}
        <section id="planos" className="mt-16 pt-10 border-t border-[#2D1E51] text-center scroll-mt-6">
          <p className="text-[11px] font-black tracking-widest text-[#EC4899]">ESCOLHA SEU ACESSO</p>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Comece a usar hoje mesmo</h2>
          <div className={`grid grid-cols-1 ${data.plans.length > 1 ? "sm:grid-cols-2" : ""} gap-6 mt-8 max-w-3xl mx-auto text-left`}>
            {data.plans.map((plan, idx) => (
              <div
                key={plan.id || idx}
                className="relative rounded-3xl p-6 flex flex-col justify-between border bg-[#140C28]"
                style={plan.popular ? { borderColor: "#EC4899", boxShadow: "0 0 0 2px #EC489955" } : { borderColor: "#2D1E51" }}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-0 text-white text-[10px] font-black px-4 py-1 rounded-bl-xl rounded-tr-3xl" style={{ background: "#EC4899" }}>
                    MAIS ESCOLHIDO
                  </span>
                )}
                <div>
                  <h3 className="font-extrabold text-base">{plan.name}</h3>
                  <div className="mt-3">
                    {plan.originalPrice && <span className="text-xs text-[#8F7EB6] line-through mr-2">De R$ {plan.originalPrice}</span>}
                    <div>
                      <span className="text-3xl font-black">R$ {plan.price}</span>
                      <span className="text-xs text-[#A798C9] ml-1">/ {plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mt-5 pt-5 border-t border-[#2D1E51]">
                    {plan.features.map((it, i) => (
                      <li key={i} className="flex gap-2 text-xs">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => goCheckout(idx)}
                  className="mt-6 w-full py-3.5 rounded-2xl text-white font-black text-sm hover:brightness-110 transition"
                  style={{ background: `linear-gradient(90deg, ${color}, #EC4899)` }}
                >
                  {data.ctaText || "Quero este acesso"} →
                </button>
                <p className="text-[10px] text-center text-[#8F7EB6] mt-2">🔒 Pagamento seguro • Acesso imediato</p>
              </div>
            ))}
          </div>
        </section>

        {/* Depoimentos */}
        {data.testimonials.length > 0 && (
          <section className="mt-16">
            <h2 className="text-center font-extrabold text-lg mb-6">Quem já usa aprova</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.testimonials.map((t, i) => (
                <div key={i} className="p-5 rounded-2xl bg-[#140C28] border border-[#2D1E51]">
                  <p className="text-amber-400 text-xs">★★★★★</p>
                  <p className="text-xs text-[#C7B9E8] italic mt-2">“{t.text}”</p>
                  <p className="font-bold text-xs mt-3">{t.name}</p>
                  <p className="text-[10px] text-[#8F7EB6]">{t.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Garantia */}
        <section className="mt-16 p-6 rounded-3xl bg-[#140C28] border border-emerald-500/30 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-3xl flex items-center justify-center shrink-0">🛡️</div>
          <div>
            <h3 className="font-extrabold">Garantia incondicional de {data.guaranteeDays} dias</h3>
            <p className="text-xs text-[#A798C9] mt-1">Se não gostar, devolvemos 100% do seu dinheiro. Sem perguntas.</p>
          </div>
        </section>

        {/* FAQ */}
        {data.faq.length > 0 && (
          <section className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-center font-extrabold text-lg mb-5">Perguntas frequentes</h2>
            <div className="space-y-2">
              {data.faq.map((f, i) => (
                <div key={i} className="rounded-2xl bg-[#140C28] border border-[#2D1E51]">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-5 py-4 font-bold text-sm flex justify-between">
                    <span>{f.q}</span>
                    <span>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && <p className="px-5 pb-4 text-xs text-[#A798C9]">{f.a}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[#2D1E51] py-8 text-center text-xs text-[#8F7EB6]">
        © {new Date().getFullYear()} {data.name} • Todos os direitos reservados
      </footer>

      {/* Modo teste do Pixel: adicione ?debug=pixel ao link */}
      {debug && (
        <div className="fixed bottom-3 right-3 z-50 w-80 max-h-72 overflow-auto rounded-2xl bg-black/90 border border-emerald-500/40 p-3 text-[10px] font-mono text-emerald-300">
          <p className="font-bold text-white mb-1">🧪 Teste do Pixel ({data.pixelId || "SEM PIXEL"})</p>
          {!data.pixelId && <p className="text-rose-400">Nenhum Pixel configurado nesta página.</p>}
          {logs.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
      )}
    </div>
  );
}
