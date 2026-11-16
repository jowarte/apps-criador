import { NextResponse } from "next/server";
import { kvList } from "@/lib/server/kv";
import { DEFAULT_SALES_PAGES, type SalesPageData } from "@/lib/sales/types";

export async function GET(req: Request) {
  void req;
  const saved = await kvList<SalesPageData>("sales:");
  const map = new Map<string, SalesPageData>();
  for (const [slug, page] of Object.entries(DEFAULT_SALES_PAGES)) map.set(slug, page);
  for (const { value } of saved) map.set(value.slug, { ...(map.get(value.slug) || {}), ...value });
  return NextResponse.json(Array.from(map.values()), { headers: { "Cache-Control": "no-store" } });
}
