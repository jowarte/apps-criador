import { NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/server/kv";
import type { AppDocument } from "@/lib/builder/types";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await kvGet<AppDocument>(`app:${slug}`);
  if (!doc) return NextResponse.json({ error: "App não publicado" }, { status: 404 });
  return NextResponse.json(doc, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let doc: AppDocument;
  try {
    doc = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!doc || !Array.isArray(doc.pages) || doc.pages.length === 0) {
    return NextResponse.json({ error: "Documento do app inválido" }, { status: 400 });
  }
  const saved = { ...doc, slug, updatedAt: new Date().toISOString() };
  await kvSet(`app:${slug}`, saved);
  return NextResponse.json({ ok: true, slug, url: `/a/${slug}` });
}
