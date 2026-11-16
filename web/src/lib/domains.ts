// Domínios personalizados
// mode "app":    meuapp.com        -> página de vendas do app | meuapp.com/app -> app
// mode "shared": meusite.com/appx  -> página de vendas "appx" | meusite.com/appx/app -> app

export interface DomainConfig {
  host: string;
  mode: "app" | "shared";
  salesSlug?: string; // usado no modo "app"
  createdAt?: string;
}

export function normalizeHost(v: string): string {
  return String(v || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/^www\./, "");
}

export function isPlatformHost(host: string): boolean {
  const h = normalizeHost(host);
  if (!h) return true;
  if (h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0") return true;
  if (h.endsWith(".nip.io") || h.endsWith(".sslip.io") || h.endsWith(".traefik.me")) return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return true;
  const extra = (process.env.PLATFORM_HOSTS || process.env.NEXT_PUBLIC_PLATFORM_HOSTS || "")
    .split(",")
    .map((x) => normalizeHost(x))
    .filter(Boolean);
  return extra.includes(h);
}
