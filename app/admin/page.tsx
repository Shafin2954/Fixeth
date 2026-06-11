"use client";

import { useState, useEffect, useCallback } from "react";
import type { DocRecord, DocContent, DocVisibilityMode } from "@/types";
import VisibilityScheduler from "@/components/admin/VisibilityScheduler";
import { SlidesEditor, SectionsEditor } from "@/components/admin/SectionEditor";
import TeamManager from "@/components/admin/TeamManager";

type Tab = "docs" | "keys" | "logs";

type ApiKeySlot = {
  slot: number;
  key: string;
  status: "active" | "limit_used" | "empty";
};

type AuditLog = {
  action: string;
  details: unknown;
  actor: string;
  created_at: string;
};

type AdminData = {
  doc: DocRecord | null;
  apiKeys: ApiKeySlot[];
  auditLogs: AuditLog[];
};

function maskKey(key: string) {
  if (!key) return "";
  return key.length <= 8 ? `${key.slice(0, 4)}...` : `${key.slice(0, 4)}...${key.slice(-4)}`;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("docs");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editable doc content state
  const [content, setContent] = useState<DocContent | null>(null);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentStatus, setContentStatus] = useState<string | null>(null);

  // Docs sub-tab
  const [docsTab, setDocsTab] = useState<"visibility" | "slides" | "sections" | "team">("visibility");

  // API Keys state
  const [keyInputs, setKeyInputs] = useState<Record<number, { key: string; status: string }>>({});
  const [keyStatuses, setKeyStatuses] = useState<Record<number, string | null>>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/overview");
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Failed to load");
      setData(json.data as AdminData);
      if (json.data.doc?.content) {
        setContent(json.data.doc.content as DocContent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function saveContent() {
    if (!content || !data?.doc) return;
    setContentSaving(true);
    setContentStatus(null);
    try {
      const res = await fetch(`/api/admin/docs/${data.doc.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Save failed");
      setContentStatus("Saved");
    } catch (err) {
      setContentStatus(err instanceof Error ? err.message : "Error");
    } finally {
      setContentSaving(false);
    }
  }

  async function handleUpdateKey(slot: number) {
    const input = keyInputs[slot];
    if (!input) return;
    setKeyStatuses(s => ({ ...s, [slot]: null }));
    try {
      const res = await fetch("/api/admin/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, key: input.key, status: input.status })
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed");
      setKeyStatuses(s => ({ ...s, [slot]: "Saved" }));
      await loadData();
    } catch (err) {
      setKeyStatuses(s => ({ ...s, [slot]: err instanceof Error ? err.message : "Error" }));
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-gray-400 text-sm">Loading admin data…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900 bg-red-950/20 p-4 text-red-400 text-sm">
        Error: {error}
      </div>
    );
  }

  const doc = data?.doc;
  const visibilityMode = doc
    ? (doc.visible_override ? "always-on" : !doc.is_published ? "off" : "scheduled") as DocVisibilityMode
    : "scheduled";

  const TABS: { id: Tab; label: string }[] = [
    { id: "docs", label: "Docs" },
    { id: "keys", label: "API Keys" },
    { id: "logs", label: "Audit Logs" }
  ];

  const DOCS_SUBTABS = [
    { id: "visibility" as const, label: "Visibility" },
    { id: "slides" as const, label: "Pitch Deck" },
    { id: "sections" as const, label: "Tech Sections" },
    { id: "team" as const, label: "Team" }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Admin Panel</h1>
        <p className="text-sm text-gray-400">Manage documentation, API keys, and system settings</p>
      </div>

      {/* Main tabs */}
      <div className="flex gap-1 border-b border-gray-800 mb-6">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
              activeTab === t.id
                ? "bg-gray-800 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Docs Tab */}
      {activeTab === "docs" && (
        <div>
          <div className="flex gap-1 mb-5">
            {DOCS_SUBTABS.map(t => (
              <button
                key={t.id}
                onClick={() => setDocsTab(t.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  docsTab === t.id
                    ? "bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/30"
                    : "text-gray-500 hover:text-gray-300 border border-transparent"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {docsTab === "visibility" && doc && (
            <VisibilityScheduler
              slug={doc.slug}
              initialMode={visibilityMode}
              initialStartTs={doc.start_ts}
              initialEndTs={doc.end_ts}
              onSaved={loadData}
            />
          )}

          {docsTab === "slides" && content && (
            <div>
              <SlidesEditor
                slides={content.slides ?? []}
                onChange={slides => setContent(c => c ? { ...c, slides } : c)}
              />
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={saveContent}
                  disabled={contentSaving}
                  className="rounded-lg bg-[#00C896] px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
                >
                  {contentSaving ? "Saving…" : "Save Pitch Deck"}
                </button>
                {contentStatus && (
                  <span className={`text-xs ${contentStatus === "Saved" ? "text-green-400" : "text-red-400"}`}>
                    {contentStatus}
                  </span>
                )}
              </div>
            </div>
          )}

          {docsTab === "sections" && content && (
            <div>
              <SectionsEditor
                sections={content.sections ?? []}
                onChange={sections => setContent(c => c ? { ...c, sections } : c)}
              />
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={saveContent}
                  disabled={contentSaving}
                  className="rounded-lg bg-[#00C896] px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
                >
                  {contentSaving ? "Saving…" : "Save Sections"}
                </button>
                {contentStatus && (
                  <span className={`text-xs ${contentStatus === "Saved" ? "text-green-400" : "text-red-400"}`}>
                    {contentStatus}
                  </span>
                )}
              </div>
            </div>
          )}

          {docsTab === "team" && content && (
            <div>
              <TeamManager
                team={content.team ?? { members: [] }}
                onChange={team => setContent(c => c ? { ...c, team } : c)}
              />
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={saveContent}
                  disabled={contentSaving}
                  className="rounded-lg bg-[#00C896] px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
                >
                  {contentSaving ? "Saving…" : "Save Team"}
                </button>
                {contentStatus && (
                  <span className={`text-xs ${contentStatus === "Saved" ? "text-green-400" : "text-red-400"}`}>
                    {contentStatus}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-5 text-right">
            <a
              href="/docs"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gray-400 hover:text-white"
            >
              Preview /docs →
            </a>
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === "keys" && (
        <div>
          <h2 className="text-base font-bold text-white mb-4">API Key Slots</h2>
          <div className="space-y-3">
            {(data?.apiKeys ?? []).map(k => (
              <div key={k.slot} className="rounded-xl border border-gray-800 bg-[#0d1117] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">Slot {k.slot}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    k.status === "active" ? "bg-green-900/40 text-green-400" :
                    k.status === "limit_used" ? "bg-yellow-900/40 text-yellow-400" :
                    "bg-gray-800 text-gray-500"
                  }`}>
                    {k.status}
                  </span>
                </div>
                <div className="font-mono text-xs text-gray-400 mb-3">{maskKey(k.key) || "—"}</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste new key…"
                    onChange={e => setKeyInputs(prev => ({ ...prev, [k.slot]: { ...prev[k.slot], key: e.target.value, status: prev[k.slot]?.status ?? k.status } }))}
                    className="flex-1 rounded border border-gray-700 bg-[#010409] px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-600"
                  />
                  <select
                    value={keyInputs[k.slot]?.status ?? k.status}
                    onChange={e => setKeyInputs(prev => ({ ...prev, [k.slot]: { ...prev[k.slot], key: prev[k.slot]?.key ?? "", status: e.target.value } }))}
                    className="rounded border border-gray-700 bg-[#010409] px-2 text-xs text-gray-300"
                  >
                    <option value="active">Active</option>
                    <option value="limit_used">Limit Used</option>
                    <option value="empty">Empty</option>
                  </select>
                  <button
                    onClick={() => handleUpdateKey(k.slot)}
                    className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-600"
                  >
                    Update
                  </button>
                </div>
                {keyStatuses[k.slot] && (
                  <p className={`mt-2 text-xs ${keyStatuses[k.slot] === "Saved" ? "text-green-400" : "text-red-400"}`}>
                    {keyStatuses[k.slot]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "logs" && (
        <div>
          <h2 className="text-base font-bold text-white mb-4">Audit Logs</h2>
          {(data?.auditLogs ?? []).length === 0 ? (
            <p className="text-gray-500 text-sm">No audit logs found.</p>
          ) : (
            <div className="rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-[#010409]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Actor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.auditLogs ?? []).map((log, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-900/30">
                      <td className="px-4 py-2.5 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs font-mono text-gray-300">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-400">{log.actor}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500 font-mono max-w-[200px] truncate">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
