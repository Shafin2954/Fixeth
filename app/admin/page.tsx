"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"docs" | "keys" | "logs">("docs");
  const [docs, setDocs] = useState<Array<{ slug: string; title: string; content_md: string; published: boolean }>>([]);
  const [apiKeys, setApiKeys] = useState<Array<{ slot: number; key: string; status: "active" | "limit_used" | "empty" }>>([]);
  const [auditLogs, setAuditLogs] = useState<Array<{ action: string; details: any; actor: string; created_at: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/overview");
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to load admin data");
      }

      setDocs(result.data.docs || []);
      setApiKeys(result.data.apiKeys || []);
      setAuditLogs(result.data.auditLogs || []);

      setLoading(false);
    } catch (err) {
      console.error("[AdminPage] Error loading data:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  };

  const handleSaveDocs = async (slug: string, content_md: string) => {
    try {
      const doc = docs.find((item) => item.slug === slug);
      if (!doc) throw new Error("Document not found");

      const response = await fetch(`/api/admin/docs/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: doc.title,
          content_md,
          published: doc.published
        })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to save document");
      }

      await loadData();
    } catch (err) {
      console.error("[AdminPage] Error saving docs:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleUpdateKey = async (slot: number, key: string, status: "active" | "limit_used" | "empty") => {
    try {
      const response = await fetch("/api/admin/keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, key, status })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to update key");
      }

      await loadData();
    } catch (err) {
      console.error("[AdminPage] Error updating key:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>
        <button
          onClick={() => setActiveTab("docs")}
          style={{ padding: "0.5rem 1rem", background: activeTab === "docs" ? "#007bff" : "#f8f9fa", border: "none", cursor: "pointer" }}
        >
          Docs
        </button>
        <button
          onClick={() => setActiveTab("keys")}
          style={{ padding: "0.5rem 1rem", background: activeTab === "keys" ? "#007bff" : "#f8f9fa", border: "none", cursor: "pointer" }}
        >
          API Keys
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          style={{ padding: "0.5rem 1rem", background: activeTab === "logs" ? "#007bff" : "#f8f9fa", border: "none", cursor: "pointer" }}
        >
          Logs
        </button>
      </div>

      {activeTab === "docs" && (
        <div>
          <h2>Docs Management</h2>
          {docs.map((doc) => (
            <div key={doc.slug} style={{ border: "1px solid #ddd", marginBottom: "1rem", padding: "1rem" }}>
              <h3>{doc.title}</h3>
              <div>
                <label htmlFor={`content-${doc.slug}`}>Content:</label>
                <br />
                <textarea
                  id={`content-${doc.slug}`}
                  value={doc.content_md}
                  onChange={(e) => {
                    const newContent = e.target.value;
                    setDocs(prev => prev.map(d => (d.slug === doc.slug ? { ...d, content_md: newContent } : d)));
                  }}
                  style={{ width: "100%", height: "200px" }}
                />
                <button
                  onClick={() => handleSaveDocs(doc.slug, doc.content_md)}
                  style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", background: "#28a745", color: "white", border: "none", cursor: "pointer" }}
                >
                  Save
                </button>
              </div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#6c757d" }}>
                Published: {doc.published ? "Yes" : "No"}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "keys" && (
        <div>
          <h2>API Keys Management</h2>
          {apiKeys.map((key) => (
            <div key={key.slot} style={{ border: "1px solid #ddd", marginBottom: "0.5rem", padding: "1rem" }}>
              <div>
                <strong>Slot {key.slot}</strong>
              </div>
              <div>
                <label>Key:</label>
                <span style={{ fontFamily: "monospace" }}>{key.key || ""}</span>
              </div>
              <div>
                <label>Status:</label> <span style={{ textTransform: "capitalize" }}>{key.status}</span>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Paste new key, or leave blank to keep current"
                  onChange={(e) => {
                    const newKey = e.target.value;
                    setApiKeys(prev => prev.map(k => (k.slot === key.slot ? { ...k, key: newKey } : k)));
                  }}
                  style={{ width: "100%", padding: "0.5rem" }}
                />
                <select
                  onChange={(e) => {
                    const newStatus = e.target.value as "active" | "limit_used" | "empty";
                    setApiKeys(prev => prev.map(k => (k.slot === key.slot ? { ...k, status: newStatus } : k)));
                  }}
                  value={key.status}
                  style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                >
                  <option value="active">Active</option>
                  <option value="limit_used">Limit Used</option>
                  <option value="empty">Empty</option>
                </select>
                <button
                  onClick={() => handleUpdateKey(key.slot, key.key, key.status)}
                  style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "logs" && (
        <div>
          <h2>Admin Audit Logs</h2>
          {auditLogs.length === 0 ? (
            <p>No audit logs found.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "2px solid #000" }}>Time</th>
                  <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "2px solid #000" }}>Action</th>
                  <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "2px solid #000" }}>Actor</th>
                  <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "2px solid #000" }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                    <td>{log.created_at}</td>
                    <td>{log.action}</td>
                    <td>{log.actor}</td>
                    <td>{JSON.stringify(log.details)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
