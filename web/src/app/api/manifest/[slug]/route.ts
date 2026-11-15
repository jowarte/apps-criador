import { NextResponse } from "next/server";

import { TEMPLATES } from "@/lib/builder/templates";

export async function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.id }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const manifest = {
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    short_name: slug.slice(0, 12),
    description: "Mini App interativo de alta conversão.",
    start_url: `/a/${slug}?source=pwa`,
    scope: `/a/${slug}`,
    display: "standalone",
    background_color: "#F8F7FF",
    theme_color: "#7C3AED",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "192x192 512x512",
        type: "image/x-icon",
        purpose: "any maskable",
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=300",
    },
  });
}
