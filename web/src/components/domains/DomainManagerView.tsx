"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import type { DomainConfig } from "@/lib/domains";

interface Props {
  apps: Array<{ name: string; slug: string; salesUrl: string }>;
  onToast: (msg: string) => void;
}

export function DomainManagerView({ apps, onToast }: Props) {
  const [domains, setDomains] = useState<DomainConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [hostInput, setHostInput] = useState("");
  const [modeInput, setModeInput] = useState<"app" | "shared">("app");
  const [selectedAppSlug, setSelectedAppSlug] = useState(apps[0]?.slug || "guia-lowcarb");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // DNS check state per host
  const [dnsCheckMap, setDnsCheckMap] = useState<
    Record<string, { loading?: boolean; ok?: boolean; ips?: string[]; msg?: string }>
  >({});

  const loadDomains = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/domains");
      if (res.ok) {
        const data = await res.json();
        setDomains(data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDomains();
  }, []);

  const handleCheckDns = async (host: string) => {
    setDnsCheckMap((prev) => ({
      ...prev,
      [host]: { loading: true },
    }));

    try {
      const res = await fetch(`/api/domains?check=${encodeURIComponent(host)}`);
      const data = await res.json();
      setDnsCheckMap((prev) => ({
        ...prev,
        [host]: {
          loading: false,
          ok: data.ok,
          ips: data.ips,
          msg: data.ok
            ? "DNS apontado corretamente para o servidor!"
            : data.ips?.length
            ? `Detectado IP ${data.ips.join(", ")} (esperado: ${data.expectedIp})`
            : "Nenhum apontamento DNS encontrado ainda (em propagação).",
        },
      }));
    } catch {
      setDnsCheckMap((prev) => ({
        ...prev,
        [host]: { loading: false, ok: false, msg: "Erro ao consultar DNS." },
      }));
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: hostInput,
          mode: modeInput,
          salesSlug: modeInput === "app" ? selectedAppSlug : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Falha ao salvar domínio.");
      }

      onToast(`Domínio "${data.host}" conectado com sucesso!`);
      setShowAddModal(false);
      setHostInput("");
      loadDomains();
      // Checa DNS automaticamente
      handleCheckDns(data.host);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDomain = async (host: string) => {
    if (!confirm(`Remover a configuração do domínio "${host}"?`)) return;
    try {
      await fetch(`/api/domains?host=${encodeURIComponent(host)}`, {
        method: "DELETE",
      });
      onToast(`Domínio "${host}" removido.`);
      loadDomains();
    } catch {
      alert("Erro ao remover domínio.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#EC4899] font-bold">
            DOMÍNIOS PERSONALIZADOS (WHITELABEL)
          </p>
          <h2 className="text-2xl font-black text-white mt-1">
            Seus Domínios Próprios
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Conecte seus próprios domínios com SSL automático. Você pode ter um domínio por app (ex: <code className="text-pink-400">meuapp.com</code>) ou um domínio compartilhado para todos os apps (ex: <code className="text-pink-400">meusite.com/appx</code>).
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white text-xs font-bold transition shadow-md flex items-center gap-2 self-start"
        >
          <Icon name="Plus" size={14} />
          <span>Conectar Novo Domínio</span>
        </button>
      </div>

      {/* Tutorial de DNS */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#180E2F] to-[#120A22] border border-purple-500/40 space-y-3">
        <div className="flex items-center gap-2 text-white font-extrabold text-sm">
          <span className="text-xl">🌐</span>
          <span>Instruções de Apontamento DNS no seu Registro (Cloudflare, GoDaddy, Hostinger, Registro.br):</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#0F0824] border border-purple-800/40">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Tipo de Entrada</span>
            <span className="text-emerald-400 font-mono font-black text-sm">Tipo A</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0F0824] border border-purple-800/40">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Nome / Host</span>
            <span className="text-white font-mono font-bold text-sm">@ ou subdomínio (ex: app)</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0F0824] border border-purple-800/40">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Apontar para o IP do Servidor</span>
            <span className="text-pink-400 font-mono font-black text-sm">187.127.28.82</span>
          </div>
        </div>
        <p className="text-[11px] text-purple-200/80">
          💡 Após fazer o apontamento, clique em <strong>Verificar DNS</strong> abaixo. O certificado SSL HTTPS é gerado automaticamente!
        </p>
      </div>

      {/* Tabela de Domínios */}
      <div className="rounded-2xl border border-[#2D1E51] bg-[#140A28] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Carregando domínios...</div>
        ) : domains.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm font-bold text-white">Nenhum domínio próprio configurado ainda.</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Seus apps continuam funcionando normalmente nos links padrão da plataforma. Para usar sua marca exclusiva, conecte seu domínio acima!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2D1E51] bg-[#180E2F] text-[#A798C9] font-bold">
                  <th className="py-3.5 px-4">Domínio</th>
                  <th className="py-3.5 px-4">Tipo de Roteamento</th>
                  <th className="py-3.5 px-4">Destino / App</th>
                  <th className="py-3.5 px-4">Status DNS</th>
                  <th className="py-3.5 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D1E51]/60">
                {domains.map((dom) => {
                  const check = dnsCheckMap[dom.host];
                  return (
                    <tr key={dom.host} className="hover:bg-[#1E113B] transition">
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400">🔗</span>
                          <span>https://{dom.host}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            dom.mode === "app"
                              ? "bg-purple-900/60 text-purple-300 border border-purple-500/40"
                              : "bg-pink-900/60 text-pink-300 border border-pink-500/40"
                          }`}
                        >
                          {dom.mode === "app" ? "Exclusivo do App" : "Compartilhado (Multi-Apps)"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {dom.mode === "app" ? (
                          <span className="text-slate-300">
                            Abre: <strong className="text-white">{dom.salesSlug}</strong>
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            Abre qualquer app: <code className="text-pink-300">{dom.host}/[nome-do-app]</code>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        {check?.loading ? (
                          <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Checando DNS...
                          </span>
                        ) : check?.ok ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                            <span>✓</span> Conectado (187.127.28.82)
                          </span>
                        ) : check ? (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]"
                            title={check.msg}
                          >
                            <span>⚠️</span> {check.msg}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCheckDns(dom.host)}
                            className="px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-[11px] font-semibold border border-purple-700/40 transition"
                          >
                            Verificar Apontamento
                          </button>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleCheckDns(dom.host)}
                            className="w-7 h-7 rounded-lg bg-purple-900/50 hover:bg-purple-800 flex items-center justify-center text-purple-200"
                            title="Recarregar status de DNS"
                          >
                            <Icon name="RefreshCw" size={12} />
                          </button>
                          <a
                            href={`https://${dom.host}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-7 h-7 rounded-lg bg-purple-900/50 hover:bg-purple-800 flex items-center justify-center text-purple-200"
                            title="Abrir no navegador"
                          >
                            <Icon name="ExternalLink" size={12} />
                          </a>
                          <button
                            onClick={() => handleDeleteDomain(dom.host)}
                            className="w-7 h-7 rounded-lg bg-red-950/60 hover:bg-red-900 flex items-center justify-center text-red-300"
                            title="Remover domínio"
                          >
                            <Icon name="Trash2" size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL ADICIONAR DOMÍNIO */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowAddModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#120A22] border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>🌐</span> Conectar Domínio Próprio
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDomain} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-purple-300 block mb-1">
                  Endereço do Domínio ou Subdomínio:
                </label>
                <input
                  value={hostInput}
                  onChange={(e) => setHostInput(e.target.value)}
                  placeholder="ex: meusite.com ou app.meusite.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#180E2F] border border-purple-500/40 font-mono text-xs text-white outline-none focus:border-pink-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Não inclua https:// ou barras.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-purple-300 block mb-1">
                  Como você quer usar este domínio?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setModeInput("app")}
                    className={`p-3 rounded-xl border text-left transition ${
                      modeInput === "app"
                        ? "bg-purple-900/60 border-pink-500 text-white font-bold"
                        : "bg-[#180E2F] border-purple-800/40 text-slate-400"
                    }`}
                  >
                    <p className="text-xs font-extrabold text-white">Exclusivo de 1 App</p>
                    <p className="text-[10px] text-purple-200/70 mt-0.5">
                      meuapp.com abre direto a página de vendas deste app.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModeInput("shared")}
                    className={`p-3 rounded-xl border text-left transition ${
                      modeInput === "shared"
                        ? "bg-purple-900/60 border-pink-500 text-white font-bold"
                        : "bg-[#180E2F] border-purple-800/40 text-slate-400"
                    }`}
                  >
                    <p className="text-xs font-extrabold text-white">Compartilhado</p>
                    <p className="text-[10px] text-purple-200/70 mt-0.5">
                      meusite.com/[appx] permite acessar todos os seus apps.
                    </p>
                  </button>
                </div>
              </div>

              {modeInput === "app" && (
                <div>
                  <label className="text-xs font-bold text-purple-300 block mb-1">
                    Qual App abrir neste domínio:
                  </label>
                  <select
                    value={selectedAppSlug}
                    onChange={(e) => setSelectedAppSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#180E2F] border border-purple-500/40 text-xs text-white outline-none"
                  >
                    {apps.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.name} ({a.salesUrl})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formError && (
                <p className="text-xs text-red-400 bg-red-950/60 p-2.5 rounded-xl border border-red-800/40">
                  {formError}
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-purple-900/40">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1F103D] text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white font-bold text-xs"
                >
                  {submitting ? "Salvando..." : "Salvar Domínio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
