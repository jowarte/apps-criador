"use client";

import { Suspense, use } from "react";
import { BlockView, themeVars } from "@/components/blocks/BlockView";
import { DEFAULT_THEME, TEMPLATES } from "@/lib/builder/templates";

function PwaContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const template = TEMPLATES.find((t) => t.id === slug) || TEMPLATES[0];
  const blocks = template.blocks();
  const theme = { ...DEFAULT_THEME, brand: template.brand };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-start items-center"
      style={themeVars(theme)}
    >
      <main className="w-full max-w-xl px-4 py-6 sm:py-10 space-y-4">
        {blocks.map((block) => (
          <BlockView
            key={block.id}
            block={block}
            theme={theme}
            editing={false}
          />
        ))}
      </main>

      <footer className="w-full py-6 text-center text-xs opacity-50">
        Feito com MineApps • PWA Interativo
      </footer>
    </div>
  );
}

export default function PwaAppPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Carregando Mini App...</div>}>
      <PwaContent params={params} />
    </Suspense>
  );
}
