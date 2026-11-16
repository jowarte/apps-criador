import { NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/server/kv";
import { defaultSalesPage, sanitizePixelId, slugify, type SalesPageData } from "@/lib/sales/types";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const saved = await kvGet<SalesPageData>(`sales:${slug}`);
  const data = saved ? { ...defaultSalesPage(slug), ...saved } : defaultSalesPage(slug);
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let body: Partial<SalesPageData>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const current = (await kvGet<SalesPageData>(`sales:${slug}`)) || defaultSalesPage(slug);
  const next: SalesPageData = {
    ...current,
    ...body,
    slug,
    appSlug: slugify(body.appSlug || current.appSlug || slug) || slug,
    pixelId: sanitizePixelId(body.pixelId ?? current.pixelId),
    plans: Array.isArray(body.plans) ? body.plans : current.plans,
    features: Array.isArray(body.features) ? body.features : current.features,
    testimonials: Array.isArray(body.testimonials) ? body.testimonials : current.testimonials,
    faq: Array.isArray(body.faq) ? body.faq : current.faq,
    updatedAt: new Date().toISOString(),
  };
  await kvSet(`sales:${slug}`, next);
  return NextResponse.json(next);
}
