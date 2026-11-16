"use client";

import { use, useEffect, useState, Suspense } from "react";
import { SalesPageView } from "@/components/sales/SalesPageView";
import type { SalesPageData } from "@/lib/sales/types";

function Loader() {
  return (
    <div className="min-h-screen bg-[#0B0714] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function SalesContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [data, setData] = useState<SalesPageData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/sales/${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, [slug]);

  if (error) return <div className="min-h-screen bg-[#0B0714] text-white flex items-center justify-center">Página não encontrada.</div>;
  if (!data) return <Loader />;
  return <SalesPageView data={data} appHref={`/a/${data.appSlug || slug}`} />;
}

export default function AppSalesPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<Loader />}>
      <SalesContent params={params} />
    </Suspense>
  );
}
