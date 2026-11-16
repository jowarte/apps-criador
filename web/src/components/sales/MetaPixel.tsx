"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    __mineappsPixels?: Record<string, boolean>;
    __mineappsPixelLog?: string[];
  }
}

function log(msg: string) {
  if (typeof window === "undefined") return;
  window.__mineappsPixelLog = window.__mineappsPixelLog || [];
  window.__mineappsPixelLog.push(`${new Date().toLocaleTimeString()} • ${msg}`);
  window.dispatchEvent(new Event("mineapps-pixel"));
}

/** Injeta o código base oficial da Meta uma única vez e inicializa o Pixel. */
export function ensurePixel(pixelId: string) {
  if (typeof window === "undefined" || !pixelId) return;
  const w = window as any;
  if (!w.fbq) {
    /* Código base oficial do Meta Pixel */
    const n: any = function (...args: any[]) {
      if (n.callMethod) n.callMethod.apply(n, args);
      else n.queue.push(args);
    };
    w.fbq = n;
    if (!w._fbq) w._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    s.onload = () => log("Script fbevents.js carregado ✅");
    s.onerror = () => log("⚠️ fbevents.js bloqueado (AdBlock/navegador). Use também a API de Conversões.");
    document.head.appendChild(s);
  }
  w.__mineappsPixels = w.__mineappsPixels || {};
  if (!w.__mineappsPixels[pixelId]) {
    w.fbq("init", pixelId);
    w.__mineappsPixels[pixelId] = true;
    log(`init ${pixelId}`);
  }
}

export function trackPixel(event: string, params?: Record<string, unknown>, eventId?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (eventId) window.fbq("track", event, params || {}, { eventID: eventId });
  else window.fbq("track", event, params || {});
  log(`track ${event} ${params ? JSON.stringify(params) : ""}`);
}

/** Coloque este componente na página: inicializa o Pixel e dispara PageView + ViewContent. */
export function MetaPixel({ pixelId, contentName, value }: { pixelId: string; contentName?: string; value?: number }) {
  const fired = useRef<string | null>(null);

  useEffect(() => {
    if (!pixelId) return;
    ensurePixel(pixelId);
    const key = `${pixelId}:${typeof window !== "undefined" ? window.location.pathname : ""}`;
    if (fired.current === key) return; // evita disparo duplo (React StrictMode)
    fired.current = key;
    trackPixel("PageView");
    trackPixel("ViewContent", { content_name: contentName, value: value || 0, currency: "BRL" });
  }, [pixelId, contentName, value]);

  if (!pixelId) return null;
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} />
    </noscript>
  );
}

/** Repassa UTMs, fbclid etc. da página de vendas para o link de checkout (melhora a atribuição). */
export function withTrackingParams(checkoutUrl: string): string {
  if (typeof window === "undefined") return checkoutUrl;
  try {
    const target = new URL(checkoutUrl);
    const current = new URLSearchParams(window.location.search);
    current.forEach((v, k) => {
      if (/^(utm_|fbclid|gclid|src|sck|ttclid)/i.test(k) && !target.searchParams.has(k)) target.searchParams.set(k, v);
    });
    return target.toString();
  } catch {
    return checkoutUrl;
  }
}
