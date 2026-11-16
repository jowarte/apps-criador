import { NextResponse } from "next/server";
import { promises as dns } from "dns";
import { kvDelete, kvGet, kvList, kvSet } from "@/lib/server/kv";
import { normalizeHost, type DomainConfig } from "@/lib/domains";

const SERVER_IP = process.env.SERVER_IP || "187.127.28.82";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const resolve = url.searchParams.get("resolve");
  const check = url.searchParams.get("check");

  // Resolve um host -> configuração (usado pelas páginas de domínio próprio)
  if (resolve) {
    const cfg = await kvGet<DomainConfig>(`domain:${normalizeHost(resolve)}`);
    return NextResponse.json(cfg || null, { headers: { "Cache-Control": "no-store" } });
  }

  // Verifica DNS do domínio
  if (check) {
    const host = normalizeHost(check);
    let ips: string[] = [];
    let cname: string[] = [];
    try { ips = await dns.resolve4(host); } catch {}
    try { cname = await dns.resolveCname(host); } catch {}
    const ok = ips.includes(SERVER_IP);
    return NextResponse.json({ host, ok, ips, cname, expectedIp: SERVER_IP });
  }

  const list = await kvList<DomainConfig>("domain:");
  return NextResponse.json(list.map((x) => x.value), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  let body: Partial<DomainConfig>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const host = normalizeHost(body.host || "");
  if (!host || !host.includes(".")) {
    return NextResponse.json({ error: "Informe um domínio válido, ex: meuapp.com" }, { status: 400 });
  }
  const mode = body.mode === "app" ? "app" : "shared";
  if (mode === "app" && !body.salesSlug) {
    return NextResponse.json({ error: "Escolha qual app/página este domínio abre" }, { status: 400 });
  }
  const cfg: DomainConfig = {
    host,
    mode,
    salesSlug: mode === "app" ? body.salesSlug : undefined,
    createdAt: new Date().toISOString(),
  };
  await kvSet(`domain:${host}`, cfg);
  return NextResponse.json(cfg);
}

export async function DELETE(req: Request) {
  const host = normalizeHost(new URL(req.url).searchParams.get("host") || "");
  if (!host) return NextResponse.json({ error: "host obrigatório" }, { status: 400 });
  await kvDelete(`domain:${host}`);
  return NextResponse.json({ ok: true });
}
