"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { TEMPLATES, type Template } from "@/lib/builder/templates";
import { useBuilder } from "@/lib/builder/store";

export function TemplatesGallery({
  onSelectTemplate,
  onClose,
}: {
  onSelectTemplate: (template: Template) => void;
  onClose?: () => void;
}) {
  const { doc, applyTemplate } = useBuilder();
  const [selectedCat, setSelectedCat] = useState("Todos");
  const [search, setSearch] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const categories = ["Todos", "Guia", "Desafio", "Vendas", "Curso", "Oferta"];

  const filtered = TEMPLATES.filter((t) => {
    const matchesCat = selectedCat === "Todos" || t.cat === selectedCat;
    const matchesSearch =
      !search.trim() ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.cat.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUploadJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.blocks && Array.isArray(json.blocks)) {
          applyTemplate({
            id: "imported-" + Date.now(),
            name: json.name || "Template Importado",
            cat: "Importado",
            emoji: "📦",
            grad: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            brand: "#6366F1",
            blocks: () => json.blocks,
          });
          alert("✓ Template importado com sucesso!");
          if (onClose) onClose();
        } else {
          alert("O arquivo JSON não contém uma estrutura de blocos válida.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo JSON: " + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadCurrent = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(doc, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${doc.slug || "meu-mini-app"}-template.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 text-[#F8F5FF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2D1E51]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#7C3AED]/20 text-[#EC4899] text-xs font-bold tracking-wide">
              VITRINE DE MODELOS
            </span>
            <span className="text-xs text-[#A798C9]">• Multi-PWA White-Label</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Escolha um Modelo de Alta Conversão
          </h1>
          <p className="text-sm text-[#B8A9D9] mt-1">
            Comece com uma estrutura validada para WhatsApp, Guias, Cursos e Ofertas, ou importe seus próprios templates.
          </p>
        </div>

        {/* Upload & Export Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#231743] hover:bg-[#2F1F5A] border border-[#3E2B6D] text-white text-xs font-bold shadow-sm transition">
            <Icon name="Upload" size={15} />
            <span>Fazer Upload (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleUploadJson}
              className="hidden"
            />
          </label>

          <button
            onClick={handleDownloadCurrent}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#231743] hover:bg-[#2F1F5A] border border-[#3E2B6D] text-white text-xs font-bold shadow-sm transition"
            title="Exportar template da página atual"
          >
            <Icon name="Download" size={15} />
            <span>Baixar Atual</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition whitespace-nowrap ${
                selectedCat === cat
                  ? "bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white shadow-md shadow-[#7C3AED]/20"
                  : "bg-[#180E30] border border-[#2D1E51] text-[#C7B9E8] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Icon
            name="Search"
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F7EB6]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar modelos..."
            className="w-full bg-[#140C28] border border-[#2D1E51] rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-[#8F7EB6] outline-none focus:border-[#7C3AED] shadow-sm"
          />
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.map((t) => {
          const sampleBlocks = t.blocks();
          return (
            <div
              key={t.id}
              className="group bg-[#180E30] rounded-3xl border border-[#2D1E51] hover:border-[#7C3AED]/60 shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Template Card Banner com Capa Ilustrativa por Nicho */}
              <div
                className="h-48 relative overflow-hidden flex flex-col justify-between p-5"
                style={{ background: t.grad }}
              >
                {t.cover && (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${t.cover})` }}
                  />
                )}
                {/* Overlay degradê para máxima legibilidade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#180E30] via-black/45 to-black/35 z-1" />

                <div className="flex items-center justify-between z-10 relative">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-extrabold uppercase tracking-wider border border-white/10">
                    {t.cat}
                  </span>
                  <span className="text-2xl filter drop-shadow bg-black/40 p-1.5 rounded-xl backdrop-blur-sm border border-white/10">{t.emoji}</span>
                </div>

                <div className="z-10 relative">
                  <h3 className="text-xl font-black text-white leading-tight drop-shadow-md">
                    {t.name}
                  </h3>
                  <p className="text-xs text-white/90 font-medium mt-1 drop-shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{sampleBlocks.length} blocos prontos integrados</span>
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#180E30] to-[#120A24]">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {sampleBlocks.slice(0, 4).map((b, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#27184A] text-[#C7B9E8] text-[10px] font-bold"
                      >
                        {b.type}
                      </span>
                    ))}
                    {sampleBlocks.length > 4 && (
                      <span className="px-2.5 py-1 rounded-lg bg-[#27184A] text-[#8F7EB6] text-[10px] font-bold">
                        +{sampleBlocks.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-[#2D1E51]">
                  <button
                    onClick={() => setPreviewTemplate(t)}
                    className="flex-1 py-2 rounded-xl bg-[#231743] hover:bg-[#2F1F5A] border border-[#3E2B6D] text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Icon name="Eye" size={13} />
                    <span>Ver Prévia</span>
                  </button>

                  <button
                    onClick={() => {
                      applyTemplate(t);
                      onSelectTemplate(t);
                    }}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:brightness-110 text-white text-xs font-extrabold transition shadow-md shadow-[#7C3AED]/20 flex items-center justify-center gap-1.5"
                  >
                    <Icon name="Sparkles" size={13} />
                    <span>Usar Este</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Prévia Rápida do Modelo */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#160E2A] border border-[#7C3AED] rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#2D1E51]">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{previewTemplate.emoji}</span>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Prévia: {previewTemplate.name}
                  </h3>
                  <p className="text-xs text-[#A798C9]">
                    {previewTemplate.cat} • {previewTemplate.blocks().length} blocos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {previewTemplate.cover && (
              <div className="mt-4 rounded-2xl overflow-hidden h-36 relative border border-white/10 shrink-0">
                <img
                  src={previewTemplate.cover}
                  alt={previewTemplate.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-white drop-shadow">
                    Capa Ilustrativa Oficial • Nicho {previewTemplate.cat}
                  </span>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {previewTemplate.blocks().map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#120A24] border border-[#2D1E51] text-xs"
                >
                  <span className="font-extrabold text-[#EC4899] uppercase tracking-wider text-[10px]">
                    Bloco #{idx + 1}: {b.type}
                  </span>
                  <p className="font-bold text-white mt-1">
                    {(b.props as any)?.title || (b.props as any)?.text || "Bloco sem título"}
                  </p>
                  <p className="text-[#A798C9] mt-0.5 truncate">
                    {(b.props as any)?.subtitle || (b.props as any)?.desc || ""}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#2D1E51] flex gap-2">
              <button
                onClick={() => {
                  applyTemplate(previewTemplate);
                  onSelectTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-extrabold text-xs shadow-md hover:brightness-110 transition"
              >
                Carregar no Editor Agora
              </button>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-3 rounded-full bg-[#231743] hover:bg-[#2F1F5A] text-white font-bold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
