import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPlatformHost, normalizeHost, type DomainConfig } from "./lib/domains";

export async function middleware(req: NextRequest) {
  const hostHeader = req.headers.get("host") || "";
  const host = normalizeHost(hostHeader);
  const pathname = req.nextUrl.pathname;

  // Ignorar arquivos estáticos, assets, favicon e rotas de API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/covers") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Se for o domínio oficial da plataforma (IP, nip.io, localhost, etc.), segue fluxo normal
  if (isPlatformHost(host)) {
    return NextResponse.next();
  }

  // Domínio personalizado do produtor!
  try {
    const origin = req.nextUrl.origin;
    const res = await fetch(`${origin}/api/domains?resolve=${encodeURIComponent(host)}`, {
      headers: { "x-internal-resolve": "1" },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const config: DomainConfig | null = await res.json();
      if (config) {
        // MODO 1: Domínio exclusivo de um único App (ex: guialowcarb.com)
        if (config.mode === "app" && config.salesSlug) {
          if (pathname === "/" || pathname === "") {
            // Raiz do domínio abre a Página de Vendas do App
            const url = req.nextUrl.clone();
            url.pathname = `/p/${config.salesSlug}`;
            return NextResponse.rewrite(url);
          }
          if (pathname === "/app" || pathname === "/pwa") {
            // /app abre o PWA do App
            const url = req.nextUrl.clone();
            url.pathname = `/a/${config.salesSlug}`;
            return NextResponse.rewrite(url);
          }
        }

        // MODO 2: Domínio compartilhado (ex: meusite.com/guia-lowcarb)
        if (config.mode === "shared") {
          // Se a rota for /{slug}, reescreve para /p/{slug}
          const segments = pathname.split("/").filter(Boolean);
          if (segments.length === 1 && !["p", "a", "painel", "admapps"].includes(segments[0])) {
            const url = req.nextUrl.clone();
            url.pathname = `/p/${segments[0]}`;
            return NextResponse.rewrite(url);
          }
        }
      }
    }
  } catch {
    // Em caso de falha de rede/DNS interno, não travar a requisição
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
