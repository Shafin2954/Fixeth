"use client";

import type React from "react";

/** Minimal markdown-ish renderer for lesson notes (no extra deps) */
export function LessonNotes({ markdown, lang }: { markdown: string; lang: string }) {
  const lines = markdown.split("\n");
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      nodes.push(<br key={`br-${i}`} />);
      return;
    }
    if (trimmed.startsWith("## ")) {
      nodes.push(
        <h3 key={i} style={{ fontSize: 15, fontWeight: 800, margin: "12px 0 6px" }}>
          {trimmed.slice(3)}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith("- ")) {
      nodes.push(
        <li key={i} style={{ marginLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
          {formatInline(trimmed.slice(2))}
        </li>
      );
      return;
    }
    if (trimmed.startsWith("```")) return;
    nodes.push(
      <p key={i} style={{ fontSize: 13, lineHeight: 1.65, margin: "4px 0" }}>
        {formatInline(trimmed)}
      </p>
    );
  });

  return (
    <div style={{ color: "inherit" }} lang={lang}>
      {nodes}
    </div>
  );
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i}>{part.slice(2, -2)}</strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            background: "rgba(128,128,128,0.15)",
            padding: "1px 4px",
            borderRadius: 4
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
