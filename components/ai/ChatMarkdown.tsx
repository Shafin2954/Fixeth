"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ChatMarkdown({ text, color }: { text: string; color?: string }) {
  return (
    <div
      style={{
        fontSize: "inherit",
        lineHeight: 1.6,
        color: color || "inherit"
      }}
      className="chat-md"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <div style={{ margin: "0 0 8px", lineHeight: 1.6 }}>{children}</div>
          ),
          ul: ({ children }) => (
            <ul style={{ margin: "4px 0 8px", paddingLeft: 18 }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: "4px 0 8px", paddingLeft: 18 }}>{children}</ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: 4, lineHeight: 1.5 }}>{children}</li>
          ),
          code: ({ inline, children, ...props }: any) =>
            inline ? (
              <code
                style={{
                  fontFamily: "monospace",
                  background: "rgba(128,128,128,0.15)",
                  borderRadius: 4,
                  padding: "1px 5px",
                  fontSize: "0.9em"
                }}
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre
                style={{
                  background: "rgba(0,0,0,0.25)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  overflowX: "auto",
                  margin: "8px 0",
                  fontSize: "0.875em",
                  lineHeight: 1.5
                }}
              >
                <code style={{ fontFamily: "monospace" }} {...props}>
                  {children}
                </code>
              </pre>
            ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: 700 }}>{children}</strong>
          ),
          em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
          h1: ({ children }) => (
            <h1 style={{ fontSize: "1.2em", fontWeight: 800, margin: "10px 0 6px" }}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: "1.1em", fontWeight: 700, margin: "10px 0 6px" }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: "1em", fontWeight: 700, margin: "8px 0 4px" }}>{children}</h3>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: "3px solid rgba(128,128,128,0.4)",
                paddingLeft: 12,
                margin: "8px 0",
                opacity: 0.85
              }}
            >
              {children}
            </blockquote>
          ),
          hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(128,128,128,0.25)", margin: "12px 0" }} />
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
